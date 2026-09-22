/**
 * Service to store and manage custom user-uploaded JPG images for Menu Book Pages
 * Synchronized with Firebase Firestore (cloud) and cached in IndexedDB (local).
 */
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const FIRESTORE_COLLECTION = 'menu_images';
const DB_NAME = 'ArkanzaMenuJpgDB';
const DB_VERSION = 1;
const STORE_NAME = 'menu_page_jpgs';

// Default initial image is empty (no fake mock cards)
export const DEFAULT_MENU_IMAGES: string[] = [];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'pageNumber' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save full list of menu images to Firebase Firestore and local IndexedDB.
 * Each page is stored as an individual document in Firestore (page_1, page_2, etc.)
 * to avoid Firestore's 1MB single-document payload limit.
 */
export async function saveAllMenuImages(
  images: string[],
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  // 1. Save to Firebase Firestore
  try {
    // Save manifest first
    const manifestRef = doc(db, FIRESTORE_COLLECTION, 'manifest');
    await setDoc(manifestRef, {
      totalPages: images.length,
      updatedAt: Date.now()
    }, { merge: true });

    // Save each page document sequentially for stable transmission and no socket overflow
    for (let idx = 0; idx < images.length; idx++) {
      if (onProgress) {
        onProgress(idx + 1, images.length);
      }
      const pageRef = doc(db, FIRESTORE_COLLECTION, `page_${idx + 1}`);
      await setDoc(pageRef, {
        pageNumber: idx + 1,
        dataUrl: images[idx],
        updatedAt: Date.now()
      });
    }

    // Clean up any old pages if image count decreased
    try {
      const snapshot = await getDocs(collection(db, FIRESTORE_COLLECTION));
      const deletePromises: Promise<void>[] = [];
      snapshot.forEach((d) => {
        if (d.id.startsWith('page_')) {
          const num = parseInt(d.id.replace('page_', ''), 10);
          if (isNaN(num) || num > images.length) {
            deletePromises.push(deleteDoc(d.ref));
          }
        } else if (d.id === 'gallery') {
          // Clean up old monolithic document to avoid stale cache
          deletePromises.push(deleteDoc(d.ref));
        }
      });
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }
    } catch (cleanErr) {
      console.warn('Failed to clean up deleted menu pages in Firestore:', cleanErr);
    }
  } catch (err: any) {
    console.error('Failed to save menu images to Firestore:', err);
    throw new Error(err?.message || 'Gagal menyimpan gambar ke Firebase Cloud');
  }

  // 2. Cache in IndexedDB
  await syncLocalIndexedDB(images);
}

/**
 * Cache current images in IndexedDB safely
 */
export async function syncLocalIndexedDB(images: string[]): Promise<void> {
  try {
    const idb = await openDB();
    const tx = idb.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    images.forEach((dataUrl, idx) => {
      store.put({ pageNumber: idx + 1, dataUrl, updatedAt: Date.now() });
    });
  } catch (err) {
    console.warn('Failed to cache in IndexedDB:', err);
  }
}

/**
 * Realtime subscription to menu images from Firebase Firestore
 */
export function subscribeToMenuImages(callback: (images: string[]) => void): () => void {
  try {
    const colRef = collection(db, FIRESTORE_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      let hasManifest = false;
      const pages: { pageNumber: number; dataUrl: string }[] = [];

      snapshot.forEach((d) => {
        if (d.id === 'manifest') {
          hasManifest = true;
        }
        const data = d.data();
        if (data && typeof data.pageNumber === 'number' && typeof data.dataUrl === 'string') {
          pages.push({
            pageNumber: data.pageNumber,
            dataUrl: data.dataUrl
          });
        }
      });

      // If cloud has explicit manifest or pages
      if (hasManifest || pages.length > 0) {
        pages.sort((a, b) => a.pageNumber - b.pageNumber);
        const cloudImages = pages.map((p) => p.dataUrl);
        syncLocalIndexedDB(cloudImages);
        callback(cloudImages);
        return;
      }

      // If no page documents found and no manifest, try local IndexedDB
      loadLocalImages().then((localImgs) => {
        callback(localImgs);
      });
    }, (error) => {
      console.warn('Firestore subscription error for menu images:', error);
      loadLocalImages().then((localImgs) => {
        callback(localImgs);
      });
    });
  } catch (e) {
    console.warn('Failed to setup Firestore listener, using local:', e);
    loadLocalImages().then((localImgs) => {
      callback(localImgs);
    });
    return () => {};
  }
}

/**
 * Load images from local IndexedDB
 */
export async function loadLocalImages(): Promise<string[]> {
  try {
    const idb = await openDB();
    return new Promise((resolve) => {
      const tx = idb.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = (req.result || []) as Array<{ pageNumber: number; dataUrl: string }>;
        items.sort((a, b) => a.pageNumber - b.pageNumber);
        resolve(items.map((i) => i.dataUrl));
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Helper to compress image and convert to Data URL string (JPEG)
 * Automatically resizes large camera photos to optimal dimensions (max 1280px)
 * to keep text crystal sharp while guaranteeing payload stays safely well under Firestore's 1MB limit.
 */
export function compressImage(file: File, maxWidth = 1280, quality = 0.80): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG, don't compress with canvas
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw with white background in case of transparent PNG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Safeguard: If output is > 650KB characters, reduce quality to guarantee it fits Firestore
        if (compressedDataUrl.length > 650000) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.68);
        }

        // Second safeguard: If still > 650KB, downscale canvas slightly
        if (compressedDataUrl.length > 650000) {
          const smallCanvas = document.createElement('canvas');
          smallCanvas.width = Math.round(width * 0.75);
          smallCanvas.height = Math.round(height * 0.75);
          const sCtx = smallCanvas.getContext('2d');
          if (sCtx) {
            sCtx.fillStyle = '#FFFFFF';
            sCtx.fillRect(0, 0, smallCanvas.width, smallCanvas.height);
            sCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
            compressedDataUrl = smallCanvas.toDataURL('image/jpeg', 0.68);
          }
        }

        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Gagal memuat file gambar'));
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Helper to convert a File object to Data URL string (automatically compresses for cloud storage)
 */
export function fileToDataUrl(file: File): Promise<string> {
  return compressImage(file, 1280, 0.80);
}
