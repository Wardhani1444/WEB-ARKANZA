import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CustomerClaimInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerSocialMedia?: string;
  customerDomicile?: string;
  promoId: string;
  promoCode: string;
  promoTitle: string;
  discountTag: string;
  promoType: 'promo' | 'voucher';
  validUntil?: string;
}

export interface StoredPromoClaim extends CustomerClaimInput {
  id: string;
  claimedAt: string;
  status: 'active' | 'redeemed';
  redeemedAt?: string;
}

const COLLECTION_NAME = 'promo_claims';

/**
 * Saves a customer's promo claim to Firebase Firestore
 */
export async function savePromoClaimToFirebase(data: CustomerClaimInput): Promise<{ id: string; success: boolean }> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      customerEmail: data.customerEmail?.trim() || '',
      customerSocialMedia: data.customerSocialMedia?.trim() || '',
      customerDomicile: data.customerDomicile?.trim() || '',
      promoId: data.promoId,
      promoCode: data.promoCode,
      promoTitle: data.promoTitle,
      discountTag: data.discountTag,
      promoType: data.promoType,
      validUntil: data.validUntil || '',
      status: 'active',
      claimedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });

    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error saving claim to Firebase:', error);
    throw error;
  }
}

/**
 * Fetches all promo claims for admin view or verification
 */
export async function getAllClaims(maxResults = 100): Promise<StoredPromoClaim[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('claimedAt', 'desc'),
      limit(maxResults)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<StoredPromoClaim, 'id'>)
    }));
  } catch (error) {
    console.error('Error fetching claims from Firebase:', error);
    return [];
  }
}

/**
 * Subscribes to real-time updates of promo claims
 */
export function subscribeToClaims(onUpdate: (claims: StoredPromoClaim[]) => void): () => void {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('claimedAt', 'desc'),
    limit(200)
  );

  return onSnapshot(q, (snapshot) => {
    const claims = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<StoredPromoClaim, 'id'>)
    }));
    onUpdate(claims);
  }, (err) => {
    console.error('Error in claims snapshot listener:', err);
  });
}

/**
 * Updates a claim status (e.g. 'redeemed' by cashier)
 */
export async function updateClaimStatus(claimId: string, status: 'active' | 'redeemed'): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, claimId);
    await updateDoc(docRef, {
      status,
      ...(status === 'redeemed' ? { redeemedAt: new Date().toISOString() } : {})
    });
    return true;
  } catch (error) {
    console.error('Error updating claim status in Firebase:', error);
    throw error;
  }
}
