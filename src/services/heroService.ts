import {
  doc,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { HeroSettings } from '../types';

const HERO_DOC_ID = 'default';
const HERO_COLLECTION = 'hero_settings';
const LOCAL_STORAGE_HERO_KEY = 'arkanza_hero_settings_cache';

export const DEFAULT_HERO_SETTINGS: HeroSettings = {
  backgroundImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=85',
  tagline: '☕ WORKING FEELS BETTER WITH COFFEE',
  headlineMain: 'Good Coffee,',
  headlineAccent: 'Better Moments.',
  subheadline: 'Nikmati kopi pilihan, signature drinks, dan suasana nyaman di Arkanza Coffee & Roastery.',
  overlayOpacity: 0.35,
  updatedAt: new Date().toISOString()
};

export interface HeroPreset {
  id: string;
  name: string;
  category: string;
  url: string;
  description: string;
}

export const HERO_PRESET_BACKGROUNDS: HeroPreset[] = [
  {
    id: 'preset-cafe-interior',
    name: 'Cinematic Cafe & Roastery',
    category: 'Interior',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=85',
    description: 'Suasana interior cafe modern bertekstur kayu hangat dengan lampu gantung vintage.'
  },
  {
    id: 'preset-espresso-machine',
    name: 'Espresso Bar & Steaming',
    category: 'Barista & Coffee',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=2000&q=85',
    description: 'Mesin espresso premium dengan cangkir kopi hitam hangat dan pantulan cahaya barista.'
  },
  {
    id: 'preset-roaster-drum',
    name: 'Industrial Roastery Drum',
    category: 'Roastery',
    url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=2000&q=85',
    description: 'Mesin roasting biji kopi Arkanza dengan warna tembaga dan aroma khas kopi sangrai.'
  },
  {
    id: 'preset-cozy-workspace',
    name: 'Cozy Co-Working Table',
    category: 'Ambiance',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=85',
    description: 'Meja kayu luas, pencahayaan alami, suasana kondusif untuk WFC (Work From Cafe).'
  },
  {
    id: 'preset-manual-pour',
    name: 'Artisan V60 Pour Over',
    category: 'Manual Brew',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2000&q=85',
    description: 'Proses seduh manual V60 dengan teko leher angsa dan tetesan kopi single origin.'
  },
  {
    id: 'preset-roastery-beans',
    name: 'Fresh Roasted Coffee Beans',
    category: 'Roastery',
    url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=2000&q=85',
    description: 'Hamparan biji kopi premium yang baru disangrai dengan tekstur aromatik.'
  },
  {
    id: 'preset-latte-art',
    name: 'Signature Latte Art Craft',
    category: 'Barista & Coffee',
    url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=2000&q=85',
    description: 'Karya seni latte art swan di cangkir keramik hitam khas kedai kopi specialty.'
  },
  {
    id: 'preset-night-cafe',
    name: 'Warm Evening Community Vibe',
    category: 'Ambiance',
    url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=2000&q=85',
    description: 'Suasana santai malam hari dengan gemerlap lampu cafe dan kebersamaan hangat.'
  }
];

// Helper to get local cached hero settings
export function getLocalHeroSettings(): HeroSettings {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_HERO_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.backgroundImage) {
        return {
          ...DEFAULT_HERO_SETTINGS,
          ...parsed
        };
      }
    }
  } catch (err) {
    console.warn('Failed to load hero settings cache:', err);
  }
  return DEFAULT_HERO_SETTINGS;
}

// Helper to save local cached hero settings
export function saveLocalHeroSettings(settings: HeroSettings) {
  try {
    localStorage.setItem(LOCAL_STORAGE_HERO_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save hero settings cache:', err);
  }
}

// Real-time listener for Hero settings from Firestore
export function subscribeToHeroSettings(callback: (settings: HeroSettings) => void): () => void {
  try {
    const docRef = doc(db, HERO_COLLECTION, HERO_DOC_ID);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<HeroSettings>;
          const merged: HeroSettings = {
            ...DEFAULT_HERO_SETTINGS,
            ...data
          };
          saveLocalHeroSettings(merged);
          callback(merged);
        } else {
          const local = getLocalHeroSettings();
          callback(local);
        }
      },
      (error) => {
        console.warn('Firestore hero settings subscription warning:', error);
        callback(getLocalHeroSettings());
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to hero settings:', err);
    callback(getLocalHeroSettings());
    return () => {};
  }
}

// Update Hero settings in Firestore and local storage
export async function updateHeroSettingsInFirestore(newSettings: Partial<HeroSettings>): Promise<HeroSettings> {
  const current = getLocalHeroSettings();
  const updated: HeroSettings = {
    ...current,
    ...newSettings,
    updatedAt: new Date().toISOString()
  };

  saveLocalHeroSettings(updated);

  try {
    const docRef = doc(db, HERO_COLLECTION, HERO_DOC_ID);
    await setDoc(docRef, updated, { merge: true });
  } catch (err) {
    console.warn('Could not sync hero settings to Firestore, local storage active:', err);
  }

  return updated;
}

// Reset Hero settings to factory defaults
export async function resetHeroSettings(): Promise<HeroSettings> {
  return await updateHeroSettingsInFirestore(DEFAULT_HERO_SETTINGS);
}

// Image compression helper for user file uploads
export async function compressUploadedHeroImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Convert to webp/jpeg data url
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
