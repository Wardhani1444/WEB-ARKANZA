import { collection, addDoc, doc, deleteDoc, updateDoc, setDoc, getDocs, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PromoItem } from '../types';

const PROMOS_COLLECTION = 'custom_promos';
const SETTINGS_COLLECTION = 'promo_settings';
const SETTINGS_DOC_ID = 'disabled_promos';
const LOCAL_STORAGE_KEY = 'arkanza_disabled_promos';

export interface NewPromoInput {
  code: string;
  title: string;
  discountTag: string;
  subtitle: string;
  description: string;
  validUntil: string;
  badge: string;
  image?: string;
  link?: string;
  discountAmountText: string;
  applicableCategory?: string;
  terms: string[];
  isActive?: boolean;
}

export const DEFAULT_PROMO_IMAGE = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80';

/**
 * Sanitizes promo image URL to ensure it is a valid renderable image.
 * If user entered an Instagram post URL, returns a high-quality coffee image.
 */
export function sanitizePromoImage(url?: string): string {
  if (!url || typeof url !== 'string') return DEFAULT_PROMO_IMAGE;
  const trimmed = url.trim();
  if (!trimmed) return DEFAULT_PROMO_IMAGE;
  
  // Instagram URLs are HTML pages, not direct image files
  if (
    trimmed.includes('instagram.com') ||
    trimmed.includes('ig.me') ||
    trimmed.includes('instagr.am') ||
    trimmed.includes('threads.net') ||
    trimmed.includes('facebook.com')
  ) {
    return DEFAULT_PROMO_IMAGE;
  }
  return trimmed;
}

/**
 * Gets cached disabled promo IDs from LocalStorage
 */
export function getLocalDisabledPromoIds(): string[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Saves disabled promo IDs to LocalStorage
 */
export function setLocalDisabledPromoIds(ids: string[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

/**
 * Subscribes to disabled promo IDs in real-time
 */
export function subscribeToDisabledPromoIds(onUpdate: (ids: string[]) => void): () => void {
  // Immediately provide local cache if available
  const initial = getLocalDisabledPromoIds();
  if (initial.length > 0) {
    onUpdate(initial);
  }

  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const ids = Array.isArray(data.disabledIds) ? data.disabledIds : [];
        setLocalDisabledPromoIds(ids);
        onUpdate(ids);
      } else {
        onUpdate(getLocalDisabledPromoIds());
      }
    },
    (err) => {
      console.warn('Snapshot error on disabled_promos (using local cache):', err);
      onUpdate(getLocalDisabledPromoIds());
    }
  );
}

/**
 * Toggles a promo's active/inactive status
 */
export async function togglePromoStatus(
  promoId: string,
  newIsActive: boolean,
  isCustom: boolean = false
): Promise<boolean> {
  try {
    // 1. If it's a custom promo, update doc in custom_promos collection
    if (isCustom) {
      try {
        const promoDoc = doc(db, PROMOS_COLLECTION, promoId);
        await updateDoc(promoDoc, { isActive: newIsActive });
      } catch (e) {
        console.warn('Could not update custom promo isActive in doc:', e);
      }
    }

    // 2. Also manage in disabled_promos settings list
    const currentDisabled = getLocalDisabledPromoIds();
    let updatedDisabled: string[];
    if (newIsActive) {
      // Activate: remove from disabled list
      updatedDisabled = currentDisabled.filter((id) => id !== promoId);
    } else {
      // Deactivate: add to disabled list
      if (!currentDisabled.includes(promoId)) {
        updatedDisabled = [...currentDisabled, promoId];
      } else {
        updatedDisabled = currentDisabled;
      }
    }

    setLocalDisabledPromoIds(updatedDisabled);

    // Sync to Firestore
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
      await setDoc(docRef, { disabledIds: updatedDisabled, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Could not sync disabledIds to Firestore, saved in local storage:', e);
    }

    return true;
  } catch (error) {
    console.error('Error toggling promo status:', error);
    throw error;
  }
}

/**
 * Adds a new promo to Firestore
 */
export async function addPromoToFirebase(data: NewPromoInput): Promise<string> {
  try {
    const rawImage = data.image?.trim();
    const isInsta = rawImage && (
      rawImage.includes('instagram.com') ||
      rawImage.includes('ig.me') ||
      rawImage.includes('instagr.am')
    );
    const sanitizedImage = sanitizePromoImage(rawImage);
    const promoLink = data.link?.trim() || (isInsta ? rawImage : undefined);

    const docRef = await addDoc(collection(db, PROMOS_COLLECTION), {
      code: data.code.toUpperCase().trim(),
      title: data.title.trim(),
      discountTag: data.discountTag.trim(),
      subtitle: data.subtitle.trim(),
      description: data.description.trim(),
      validUntil: data.validUntil.trim(),
      badge: data.badge.trim() || 'PROMO SPESIAL',
      image: sanitizedImage,
      link: promoLink || '',
      discountAmountText: data.discountAmountText.trim() || data.discountTag.trim(),
      applicableCategory: data.applicableCategory?.trim() || 'All Menu',
      isActive: data.isActive !== false,
      terms: data.terms && data.terms.length > 0 ? data.terms : [
        'Tunjukkan kode voucher kepada barista/kasir sebelum melakukan pembayaran.',
        'Berlaku untuk Dine-in & Takeaway di outlet Arkanza Coffee & Roastery.',
        'Tidak dapat digabungkan dengan promo lain kecuali disebutkan.'
      ],
      createdAt: serverTimestamp(),
      createdAtIso: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding promo to Firebase:', error);
    throw error;
  }
}

/**
 * Updates an existing promo in Firestore
 */
export async function updatePromoInFirebase(
  promoId: string,
  data: Partial<NewPromoInput>
): Promise<boolean> {
  try {
    const rawImage = data.image?.trim();
    const isInsta = rawImage && (
      rawImage.includes('instagram.com') ||
      rawImage.includes('ig.me') ||
      rawImage.includes('instagr.am')
    );
    const sanitizedImage = rawImage ? sanitizePromoImage(rawImage) : undefined;
    const promoLink = data.link?.trim() || (isInsta ? rawImage : undefined);

    const updatePayload: Record<string, any> = {
      updatedAt: serverTimestamp(),
      updatedAtIso: new Date().toISOString(),
    };

    if (data.code !== undefined) updatePayload.code = data.code.toUpperCase().trim();
    if (data.title !== undefined) updatePayload.title = data.title.trim();
    if (data.discountTag !== undefined) updatePayload.discountTag = data.discountTag.trim();
    if (data.subtitle !== undefined) updatePayload.subtitle = data.subtitle.trim();
    if (data.description !== undefined) updatePayload.description = data.description.trim();
    if (data.validUntil !== undefined) updatePayload.validUntil = data.validUntil.trim();
    if (data.badge !== undefined) updatePayload.badge = data.badge.trim() || 'PROMO SPESIAL';
    if (sanitizedImage !== undefined) updatePayload.image = sanitizedImage;
    if (promoLink !== undefined) updatePayload.link = promoLink;
    if (data.discountAmountText !== undefined) {
      updatePayload.discountAmountText = data.discountAmountText.trim() || (data.discountTag ? data.discountTag.trim() : '');
    }
    if (data.applicableCategory !== undefined) {
      updatePayload.applicableCategory = data.applicableCategory.trim() || 'All Menu';
    }
    if (data.terms !== undefined) updatePayload.terms = data.terms;
    if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

    const docRef = doc(db, PROMOS_COLLECTION, promoId);
    await updateDoc(docRef, updatePayload);
    return true;
  } catch (error) {
    console.error('Error updating promo in Firebase:', error);
    throw error;
  }
}

/**
 * Deletes a custom or system promo from Firebase and local settings
 */
export async function deletePromoFromFirebase(promoId: string, isCustom: boolean = true): Promise<boolean> {
  try {
    if (isCustom) {
      const docRef = doc(db, PROMOS_COLLECTION, promoId);
      await deleteDoc(docRef);
    }

    // Always ensure it is added to disabled/hidden list so system promos also disappear
    const currentDisabled = getLocalDisabledPromoIds();
    if (!currentDisabled.includes(promoId)) {
      const updated = [...currentDisabled, promoId];
      setLocalDisabledPromoIds(updated);
      try {
        const settingsDoc = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
        await setDoc(settingsDoc, { disabledIds: updated, updatedAt: new Date().toISOString() }, { merge: true });
      } catch {
        // ignore
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting promo from Firebase:', error);
    throw error;
  }
}

/**
 * Subscribes to custom promos from Firestore in real-time
 */
export function subscribeToCustomPromos(onUpdate: (promos: PromoItem[]) => void): () => void {
  const q = query(
    collection(db, PROMOS_COLLECTION),
    orderBy('createdAtIso', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const customPromos: PromoItem[] = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const rawImage = typeof data.image === 'string' ? data.image : '';
      const isInsta = rawImage.includes('instagram.com') || rawImage.includes('ig.me') || rawImage.includes('instagr.am');
      const sanitizedImage = sanitizePromoImage(rawImage);
      const promoLink = data.link || (isInsta ? rawImage : undefined);

      return {
        id: docSnap.id,
        code: data.code || 'PROMO',
        title: data.title || '',
        discountTag: data.discountTag || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        validUntil: data.validUntil || '',
        badge: data.badge || 'PROMO SPESIAL',
        image: sanitizedImage,
        link: promoLink,
        discountAmountText: data.discountAmountText || data.discountTag || '',
        applicableCategory: data.applicableCategory || 'All Menu',
        terms: Array.isArray(data.terms) ? data.terms : [],
        isCustom: true,
        isActive: data.isActive !== false,
      };
    });
    onUpdate(customPromos);
  }, (err) => {
    console.error('Error in custom promos snapshot listener:', err);
  });
}

/**
 * Fetches all custom promos
 */
export async function getAllCustomPromos(): Promise<PromoItem[]> {
  try {
    const q = query(
      collection(db, PROMOS_COLLECTION),
      orderBy('createdAtIso', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const rawImage = typeof data.image === 'string' ? data.image : '';
      const isInsta = rawImage.includes('instagram.com') || rawImage.includes('ig.me') || rawImage.includes('instagr.am');
      const sanitizedImage = sanitizePromoImage(rawImage);
      const promoLink = data.link || (isInsta ? rawImage : undefined);

      return {
        id: docSnap.id,
        code: data.code || 'PROMO',
        title: data.title || '',
        discountTag: data.discountTag || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        validUntil: data.validUntil || '',
        badge: data.badge || 'PROMO SPESIAL',
        image: sanitizedImage,
        link: promoLink,
        discountAmountText: data.discountAmountText || data.discountTag || '',
        applicableCategory: data.applicableCategory || 'All Menu',
        terms: Array.isArray(data.terms) ? data.terms : [],
        isCustom: true,
        isActive: data.isActive !== false,
      };
    });
  } catch (error) {
    console.error('Error getting custom promos from Firebase:', error);
    return [];
  }
}
