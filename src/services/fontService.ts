import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FontSettings, FontPreset } from '../types';

const FONT_DOC_ID = 'font_config';
const THEME_COLLECTION = 'theme_settings';
const LOCAL_STORAGE_FONT_KEY = 'arkanza_font_settings_cache';

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  headingFont: 'Playfair Display',
  bodyFont: 'Plus Jakarta Sans',
  headingCategory: 'serif',
  bodyCategory: 'sans-serif',
  presetId: 'preset-editorial-coffee',
  updatedAt: new Date().toISOString(),
};

export const AVAILABLE_HEADING_FONTS = [
  { name: 'Playfair Display', category: 'serif', style: 'Serif Elegan & Editorial' },
  { name: 'Cinzel', category: 'serif', style: 'Royal & Classic Luxury' },
  { name: 'Cormorant Garamond', category: 'serif', style: 'Artisan Heritage & Halus' },
  { name: 'Fraunces', category: 'serif', style: 'Warm Retro & Cozy' },
  { name: 'Prata', category: 'serif', style: 'Parisian Chic & High Contrast' },
  { name: 'DM Serif Display', category: 'serif', style: 'Roastery Journal & Bold' },
  { name: 'Bodoni Moda', category: 'serif', style: 'Haute Boutique & Glamour' },
  { name: 'Lora', category: 'serif', style: 'Warm Bookish & Contemporary' },
  { name: 'Merriweather', category: 'serif', style: 'Classic Readable Serif' },
  { name: 'Abril Fatface', category: 'display', style: 'Vintage Bold Headline' },
  { name: 'Syne', category: 'display', style: 'Avant-Garde & Trendy Urban' },
  { name: 'Oswald', category: 'sans-serif', style: 'Industrial Loft & Bold Tall' },
  { name: 'Montserrat', category: 'sans-serif', style: 'Nordic Clean & Geometric' },
  { name: 'Outfit', category: 'sans-serif', style: 'Modern Fresh & Tech' },
  { name: 'Poppins', category: 'sans-serif', style: 'Friendly Rounded Geometric' },
  { name: 'Plus Jakarta Sans', category: 'sans-serif', style: 'Clean Contemporary Standard' },
  { name: 'Bebas Neue', category: 'display', style: 'Condensed Impact & Poster' },
];

export const AVAILABLE_BODY_FONTS = [
  { name: 'Plus Jakarta Sans', category: 'sans-serif', style: 'Modern, Bersih & Nyaman Dibaca' },
  { name: 'Inter', category: 'sans-serif', style: 'Ultra Clean & Sangat Presisi' },
  { name: 'DM Sans', category: 'sans-serif', style: 'Geometris Lembut & Modern' },
  { name: 'Lora', category: 'serif', style: 'Serif Hangat untuk Nuansa Buku' },
  { name: 'Nunito', category: 'sans-serif', style: 'Ramah, Lembut & Hangat' },
  { name: 'Roboto', category: 'sans-serif', style: 'Standar Industri Netral' },
  { name: 'Open Sans', category: 'sans-serif', style: 'Netral, Luas & Mudah Dibaca' },
  { name: 'Source Sans 3', category: 'sans-serif', style: 'Tipografi Profesional Jelas' },
  { name: 'Poppins', category: 'sans-serif', style: 'Geometris Modis & Dinamis' },
  { name: 'Merriweather', category: 'serif', style: 'Klasik Hangat & Berwibawa' },
  { name: 'Raleway', category: 'sans-serif', style: 'Artistik, Ringan & Berkelas' },
  { name: 'Work Sans', category: 'sans-serif', style: 'Karakter Kuat & Kontemporer' },
];

export const FONT_PRESETS: FontPreset[] = [
  {
    id: 'preset-editorial-coffee',
    name: 'Classic Editorial Roastery',
    tagline: 'Kombinasi klasik kedai kopi specialty terpopuler',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    headingCategory: 'serif',
    bodyCategory: 'sans-serif',
    badge: 'Default Bawaan',
    previewText: 'Artisan Roastery with Heart',
  },
  {
    id: 'preset-luxury-heritage',
    name: 'Luxury Royal & Heritage',
    tagline: 'Nuansa berkelas, mewah, dan berwibawa tinggi',
    headingFont: 'Cinzel',
    bodyFont: 'Plus Jakarta Sans',
    headingCategory: 'serif',
    bodyCategory: 'sans-serif',
    badge: 'Mewah & Eksklusif',
    previewText: 'Exceptional Coffee Privilege',
  },
  {
    id: 'preset-vintage-craft',
    name: 'Literary & Artisan Poetry',
    tagline: 'Gaya kafe sastra klasik dengan keanggunan serif murni',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Lora',
    headingCategory: 'serif',
    bodyCategory: 'serif',
    badge: 'Vintage & Warm',
    previewText: 'Brewed with Warm Stories',
  },
  {
    id: 'preset-trendy-urban',
    name: 'Bold Urban & Avant-Garde',
    tagline: 'Desain ekspresif modern untuk kafe hits anak muda',
    headingFont: 'Syne',
    bodyFont: 'DM Sans',
    headingCategory: 'display',
    bodyCategory: 'sans-serif',
    badge: 'Kekinian & Trendy',
    previewText: 'Taste the Future of Coffee',
  },
  {
    id: 'preset-scandinavian-clean',
    name: 'Nordic Clean & Minimalist',
    tagline: 'Karakter minimalis Skandinavia yang rapi dan segar',
    headingFont: 'Montserrat',
    bodyFont: 'Plus Jakarta Sans',
    headingCategory: 'sans-serif',
    bodyCategory: 'sans-serif',
    badge: 'Minimalis Elegan',
    previewText: 'Pure Simplicity in Every Cup',
  },
  {
    id: 'preset-warm-cozy',
    name: 'Warm Retro & Cozy Specialty',
    tagline: 'Huruf retro organik dengan lekukan hangat yang bersahabat',
    headingFont: 'Fraunces',
    bodyFont: 'Nunito',
    headingCategory: 'serif',
    bodyCategory: 'sans-serif',
    badge: 'Cozy & Homey',
    previewText: 'Your Favorite Cozy Corner',
  },
  {
    id: 'preset-french-chic',
    name: 'Parisian Chic & High Fashion',
    tagline: 'Kontras tipografi dramatis ala cafe bistro Eropa',
    headingFont: 'Prata',
    bodyFont: 'Plus Jakarta Sans',
    headingCategory: 'serif',
    bodyCategory: 'sans-serif',
    badge: 'Eropa Estetik',
    previewText: 'Refined Taste of Perfection',
  },
  {
    id: 'preset-newspaper-roast',
    name: 'Roastery Gazette & Press',
    tagline: 'Tegas seperti headline koran edisi khusus roastery',
    headingFont: 'DM Serif Display',
    bodyFont: 'Inter',
    headingCategory: 'serif',
    bodyCategory: 'sans-serif',
    badge: 'Bold Roastery',
    previewText: 'Daily Roast Gazette',
  },
  {
    id: 'preset-industrial-loft',
    name: 'Industrial Loft & Bold Vibe',
    tagline: 'Gaya industrial maskulin dengan karakter huruf tinggi',
    headingFont: 'Oswald',
    bodyFont: 'Plus Jakarta Sans',
    headingCategory: 'sans-serif',
    bodyCategory: 'sans-serif',
    badge: 'Industrial Loft',
    previewText: 'Bold Energy Freshly Ground',
  },
];

// Helper to inject Google Fonts stylesheet dynamically into document head
export function loadGoogleFont(fontName: string) {
  if (!fontName) return;
  const fontId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(fontId)) return;

  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  const encodedName = fontName.replace(/\s+/g, '+');
  link.href = `https://fonts.googleapis.com/css2?family=${encodedName}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap`;
  document.head.appendChild(link);
}

// Helper to apply font settings globally across the application DOM
export function applyFontSettings(settings: FontSettings) {
  if (typeof document === 'undefined') return;

  const heading = settings.headingFont || DEFAULT_FONT_SETTINGS.headingFont;
  const body = settings.bodyFont || DEFAULT_FONT_SETTINGS.bodyFont;

  // Dynamically load the fonts from Google Fonts
  loadGoogleFont(heading);
  loadGoogleFont(body);

  // Set CSS Custom Variables on Document Root
  document.documentElement.style.setProperty('--font-serif', `'${heading}', Georgia, serif`);
  document.documentElement.style.setProperty('--font-sans', `'${body}', system-ui, -apple-system, sans-serif`);
  document.documentElement.style.setProperty('--font-heading', `'${heading}', Georgia, serif`);
  document.documentElement.style.setProperty('--font-body', `'${body}', system-ui, -apple-system, sans-serif`);

  // Inject or update a dedicated style element for guaranteed font cascade override
  let dynamicStyle = document.getElementById('arkanza-dynamic-font-rules') as HTMLStyleElement | null;
  if (!dynamicStyle) {
    dynamicStyle = document.createElement('style');
    dynamicStyle.id = 'arkanza-dynamic-font-rules';
    document.head.appendChild(dynamicStyle);
  }

  dynamicStyle.textContent = `
    :root {
      --font-serif: '${heading}', Georgia, serif !important;
      --font-sans: '${body}', system-ui, -apple-system, sans-serif !important;
    }
    html, body {
      font-family: '${body}', system-ui, -apple-system, sans-serif !important;
    }
    .font-serif, .font-editorial, [class*="font-serif"] {
      font-family: '${heading}', Georgia, serif !important;
    }
    .font-sans, [class*="font-sans"] {
      font-family: '${body}', system-ui, -apple-system, sans-serif !important;
    }
  `;
}

// Local Storage Cache Helpers
export function getLocalFontSettings(): FontSettings {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_FONT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.headingFont && parsed.bodyFont) {
        return {
          ...DEFAULT_FONT_SETTINGS,
          ...parsed,
        };
      }
    }
  } catch (err) {
    console.warn('Failed to load font settings cache:', err);
  }
  return DEFAULT_FONT_SETTINGS;
}

export function saveLocalFontSettings(settings: FontSettings) {
  try {
    localStorage.setItem(LOCAL_STORAGE_FONT_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save font settings cache:', err);
  }
}

// Realtime Firestore Listener
export function subscribeToFontSettings(callback: (settings: FontSettings) => void): () => void {
  try {
    const docRef = doc(db, THEME_COLLECTION, FONT_DOC_ID);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<FontSettings>;
          const merged: FontSettings = {
            ...DEFAULT_FONT_SETTINGS,
            ...data,
          };
          saveLocalFontSettings(merged);
          applyFontSettings(merged);
          callback(merged);
        } else {
          const local = getLocalFontSettings();
          applyFontSettings(local);
          callback(local);
        }
      },
      (error) => {
        console.warn('Firestore font settings subscription warning:', error);
        const local = getLocalFontSettings();
        applyFontSettings(local);
        callback(local);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to font settings:', err);
    const local = getLocalFontSettings();
    applyFontSettings(local);
    callback(local);
    return () => {};
  }
}

// Update Font Settings in Firestore & Local Storage
export async function updateFontSettingsInFirestore(newSettings: Partial<FontSettings>): Promise<FontSettings> {
  const current = getLocalFontSettings();
  const updated: FontSettings = {
    ...current,
    ...newSettings,
    updatedAt: new Date().toISOString(),
  };

  saveLocalFontSettings(updated);
  applyFontSettings(updated);

  try {
    const docRef = doc(db, THEME_COLLECTION, FONT_DOC_ID);
    await setDoc(docRef, updated, { merge: true });
  } catch (err) {
    console.warn('Could not sync font settings to Firestore, local storage active:', err);
  }

  return updated;
}

// Reset Font Settings to Default
export async function resetFontSettings(): Promise<FontSettings> {
  return await updateFontSettingsInFirestore(DEFAULT_FONT_SETTINGS);
}
