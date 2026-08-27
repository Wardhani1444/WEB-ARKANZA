import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { VibePhoto } from '../types';
import { VIBE_PHOTOS } from '../data/vibeData';

const VIBE_COLLECTION = 'vibe_photos';
const LOCAL_STORAGE_VIBE_KEY = 'arkanza_vibe_photos_cache';

export const PRESET_VIBE_SUGGESTIONS = [
  {
    name: 'Espresso Top View',
    category: 'Coffee',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Cozy Workspace Cafe',
    category: 'Interior',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Coffee Roastery Drum',
    category: 'Barista',
    url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Butter Croissants',
    category: 'Food',
    url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Manual V60 Pour',
    category: 'Coffee',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Cafe Night Ambience',
    category: 'Community',
    url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Latte Art Toasting',
    category: 'Coffee',
    url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Portafilter & Roasted Beans',
    category: 'Coffee',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Industrial Roastery Space',
    category: 'Interior',
    url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80'
  }
];

// Helper to get local cached photos
export function getLocalVibePhotos(): VibePhoto[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_VIBE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load vibe photos cache:', err);
  }
  return VIBE_PHOTOS;
}

// Save local cached photos
function saveLocalVibePhotos(photos: VibePhoto[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_VIBE_KEY, JSON.stringify(photos));
  } catch (err) {
    console.warn('Failed to save vibe photos cache:', err);
  }
}

// Real-time listener for vibe photos from Firestore
export function subscribeToVibePhotos(callback: (photos: VibePhoto[]) => void): () => void {
  try {
    const vibeQuery = query(collection(db, VIBE_COLLECTION));
    return onSnapshot(
      vibeQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedMap = new Map<string, VibePhoto>();
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as VibePhoto;
            fetchedMap.set(docSnap.id, {
              ...data,
              id: docSnap.id
            });
          });

          // Merge with default VIBE_PHOTOS ordering so slots 1 to 6 remain cleanly organized
          const merged: VibePhoto[] = VIBE_PHOTOS.map((defaultPhoto) => {
            if (fetchedMap.has(defaultPhoto.id)) {
              return fetchedMap.get(defaultPhoto.id)!;
            }
            return defaultPhoto;
          });

          // Add any extra photos created beyond the default 6
          fetchedMap.forEach((photo, id) => {
            if (!merged.some((p) => p.id === id)) {
              merged.push(photo);
            }
          });

          saveLocalVibePhotos(merged);
          callback(merged);
        } else {
          // If Firestore is empty, fallback to local or defaults
          const local = getLocalVibePhotos();
          callback(local);
        }
      },
      (error) => {
        console.warn('Firestore vibe subscription warning:', error);
        callback(getLocalVibePhotos());
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to vibe photos:', err);
    callback(getLocalVibePhotos());
    return () => {};
  }
}

// Update single photo in Firestore & LocalStorage
export async function updateVibePhotoInFirestore(photo: VibePhoto): Promise<void> {
  // Update local cache first
  const current = getLocalVibePhotos();
  const index = current.findIndex((p) => p.id === photo.id);
  let updatedList: VibePhoto[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = photo;
  } else {
    updatedList = [...current, photo];
  }
  saveLocalVibePhotos(updatedList);

  try {
    const docRef = doc(db, VIBE_COLLECTION, photo.id);
    await setDoc(docRef, {
      ...photo,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Could not sync vibe photo to Firestore, local cache updated:', err);
  }
}

// Reset a specific photo back to initial default
export async function resetSingleVibePhoto(photoId: string): Promise<void> {
  const original = VIBE_PHOTOS.find((p) => p.id === photoId);
  if (original) {
    await updateVibePhotoInFirestore(original);
  }
}
