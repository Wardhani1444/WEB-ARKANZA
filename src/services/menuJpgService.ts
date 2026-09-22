/**
 * Service to store and manage custom user-uploaded JPG images for Menu Book Pages
 * Synchronized with Firebase Firestore (cloud) and cached in IndexedDB (local).
 */
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const FIRESTORE_COLLECTION = 'menu_images';
const FIRESTORE_DOC = 'gallery';
const DB_NAME = 'ArkanzaMenuJpgDB';
const DB_VERSION = 1;
const STORE_NAME = 'menu_page_jpgs';

// Default initial image includes the Espresso Based page
export const DEFAULT_MENU_IMAGES: string[] = [
  '/halaman-4-espresso-based.svg'
];

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
 * Save full list of menu images to Firebase Firestore and local IndexedDB
 */
export async function saveAllMenuImages(images: string[]): Promise<void> {
  // 1. Save to Firebase Firestore
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC);
    await setDoc(docRef, {
      images,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Failed to save menu images to Firestore (falling back to local):', err);
  }

  // 2. Cache in IndexedDB
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
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC);
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data?.images)) {
          callback(data.images);
          return;
        }
      }
      // If no cloud data yet, try reading from IndexedDB or default
      loadLocalImages().then((localImgs) => {
        callback(localImgs.length > 0 ? localImgs : DEFAULT_MENU_IMAGES);
      });
    }, (error) => {
      console.warn('Firestore subscription error for menu images:', error);
      loadLocalImages().then((localImgs) => {
        callback(localImgs.length > 0 ? localImgs : DEFAULT_MENU_IMAGES);
      });
    });
  } catch (e) {
    console.warn('Failed to setup Firestore listener, using local:', e);
    loadLocalImages().then((localImgs) => {
      callback(localImgs.length > 0 ? localImgs : DEFAULT_MENU_IMAGES);
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
 * Helper to convert a File object to Data URL string (base64)
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
