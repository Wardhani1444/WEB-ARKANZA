import {
  doc,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BrandingSettings, LogoPreset } from '../types';
import defaultLogo from '../assets/arkanza-logo.jpg';

const BRANDING_DOC_ID = 'branding';
const BRANDING_COLLECTION = 'site_settings';
const LOCAL_STORAGE_BRANDING_KEY = 'arkanza_branding_settings_cache';

export const DEFAULT_BRANDING_SETTINGS: BrandingSettings = {
  logoUrl: defaultLogo,
  brandName: 'ARKANZA',
  brandSubtitle: 'COFFEE & ROASTERY',
  logoShape: 'rounded',
  updatedAt: new Date().toISOString()
};

export const LOGO_PRESETS: LogoPreset[] = [
  {
    id: 'preset-arkanza-official',
    name: 'Arkanza Official Roastery Badge',
    category: 'Official',
    url: defaultLogo,
    description: 'Logo resmi Arkanza Coffee & Roastery dengan emblem hijau botol & tipografi klasik.'
  },
  {
    id: 'preset-emerald-botanical',
    name: 'Emerald Botanical Roastery',
    category: 'Modern Dark',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    description: 'Aksen barista & espresso hangat dengan estetika cafe specialty.'
  },
  {
    id: 'preset-golden-coffee-bean',
    name: 'Artisan Golden Coffee Roast',
    category: 'Artisanal',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
    description: 'Emblem hangat bernuansa roastery drum dan biji kopi pilihan.'
  },
  {
    id: 'preset-minimal-latte-art',
    name: 'Minimalist Latte & Cup',
    category: 'Minimalist',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
    description: 'Foto latte art premium dan cangkir keramik kerajinan tangan.'
  }
];

/**
 * Compress user-uploaded logo image file into high-definition WebP/PNG data URL
 */
export async function compressUploadedLogoImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 512;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Draw with transparent support or smooth interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as webp or png if transparent, else high quality jpeg
        const isPng = file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/svg+xml';
        const dataUrl = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.9);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Get cached branding settings from localStorage with fallback to default
 */
export function getLocalBrandingSettings(): BrandingSettings {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_BRANDING_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.logoUrl) {
        return {
          ...DEFAULT_BRANDING_SETTINGS,
          ...parsed
        };
      }
    }
  } catch (err) {
    console.warn('[BrandingService] Error reading localStorage cache:', err);
  }
  return DEFAULT_BRANDING_SETTINGS;
}

/**
 * Save branding settings to localStorage cache
 */
export function saveLocalBrandingSettings(settings: BrandingSettings): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_BRANDING_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('[BrandingService] Error writing localStorage cache:', err);
  }
}

/**
 * Subscribe in real-time to branding settings in Firestore with localStorage fallback
 */
export function subscribeToBrandingSettings(
  callback: (settings: BrandingSettings) => void
): () => void {
  // Return local cached settings immediately for instant render
  const initial = getLocalBrandingSettings();
  callback(initial);

  try {
    const docRef = doc(db, BRANDING_COLLECTION, BRANDING_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<BrandingSettings>;
          const merged: BrandingSettings = {
            ...DEFAULT_BRANDING_SETTINGS,
            ...data,
            logoUrl: data.logoUrl || DEFAULT_BRANDING_SETTINGS.logoUrl,
            brandName: data.brandName !== undefined ? data.brandName : DEFAULT_BRANDING_SETTINGS.brandName,
            brandSubtitle: data.brandSubtitle !== undefined ? data.brandSubtitle : DEFAULT_BRANDING_SETTINGS.brandSubtitle,
            logoShape: data.logoShape || DEFAULT_BRANDING_SETTINGS.logoShape,
            updatedAt: data.updatedAt || new Date().toISOString()
          };
          saveLocalBrandingSettings(merged);
          callback(merged);
        } else {
          // If document doesn't exist yet, keep default
          saveLocalBrandingSettings(DEFAULT_BRANDING_SETTINGS);
          callback(DEFAULT_BRANDING_SETTINGS);
        }
      },
      (error) => {
        console.warn('[BrandingService] Firestore subscription notice (operating in offline/cached mode):', error.message);
        callback(getLocalBrandingSettings());
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('[BrandingService] Failed to establish snapshot listener:', err);
    return () => {};
  }
}

/**
 * Update branding settings in Firestore and local storage
 */
export async function updateBrandingSettingsInFirestore(
  settings: Partial<BrandingSettings>
): Promise<BrandingSettings> {
  const current = getLocalBrandingSettings();
  const updated: BrandingSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString()
  };

  // Immediate local cache update
  saveLocalBrandingSettings(updated);

  try {
    const docRef = doc(db, BRANDING_COLLECTION, BRANDING_DOC_ID);
    await setDoc(docRef, updated, { merge: true });
  } catch (err) {
    console.error('[BrandingService] Error persisting branding settings to Firestore:', err);
    // Don't throw, let local cache succeed
  }

  return updated;
}

/**
 * Reset branding settings back to default Arkanza logo and typography
 */
export async function resetBrandingSettings(): Promise<BrandingSettings> {
  const resetData: BrandingSettings = {
    ...DEFAULT_BRANDING_SETTINGS,
    updatedAt: new Date().toISOString()
  };

  saveLocalBrandingSettings(resetData);

  try {
    const docRef = doc(db, BRANDING_COLLECTION, BRANDING_DOC_ID);
    await setDoc(docRef, resetData);
  } catch (err) {
    console.error('[BrandingService] Error resetting branding settings in Firestore:', err);
  }

  return resetData;
}
