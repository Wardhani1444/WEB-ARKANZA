/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PromosSection } from './components/PromosSection';
import { PromoDetailModal } from './components/PromoDetailModal';
import { CountdownPromo } from './components/CountdownPromo';
import { VoucherSection } from './components/VoucherSection';
import { VoucherClaimModal } from './components/VoucherClaimModal';
import { ClaimedVouchersDrawer } from './components/ClaimedVouchersDrawer';
import { AdminClaimsModal } from './components/AdminClaimsModal';
import { OpeningHoursSection } from './components/OpeningHoursSection';
import { CatchOurVibe } from './components/CatchOurVibe';
import { LocationContact } from './components/LocationContact';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';

import { PROMO_ITEMS } from './data/promosData';
import { VOUCHER_ITEMS } from './data/vouchersData';
import { VIBE_PHOTOS } from './data/vibeData';
import { PromoItem, VoucherItem, ToastNotification, CustomerData } from './types';
import { subscribeToCustomPromos, subscribeToDisabledPromoIds, getLocalDisabledPromoIds } from './services/promoService';

export default function App() {
  // Real-time custom promos from Firebase Firestore
  const [customPromos, setCustomPromos] = useState<PromoItem[]>([]);
  // Real-time disabled promo IDs from Firebase / LocalStorage
  const [disabledPromoIds, setDisabledPromoIds] = useState<string[]>(() => getLocalDisabledPromoIds());

  // Listen to custom promos & disabled promo settings from Firestore
  useEffect(() => {
    const unsubscribePromos = subscribeToCustomPromos((promos) => {
      setCustomPromos(promos);
    });
    const unsubscribeDisabled = subscribeToDisabledPromoIds((disabledIds) => {
      setDisabledPromoIds(disabledIds);
    });
    return () => {
      unsubscribePromos();
      unsubscribeDisabled();
    };
  }, []);

  // Merged Active Promos for public display
  const allPromos = React.useMemo(() => {
    const customActive = customPromos.filter(
      (p) => !disabledPromoIds.includes(p.id) && (p.isActive !== false)
    );
    const systemActive = PROMO_ITEMS.filter(
      (p) => !disabledPromoIds.includes(p.id)
    );
    return [...customActive, ...systemActive];
  }, [customPromos, disabledPromoIds]);

  // Merged Active Vouchers for public display
  const allVouchers = React.useMemo(() => {
    const customAsVouchers: VoucherItem[] = customPromos
      .filter((p) => !disabledPromoIds.includes(p.id) && (p.isActive !== false))
      .map((p) => ({
        id: p.id,
        code: p.code,
        discountTag: p.discountTag,
        title: p.title,
        description: p.subtitle || p.description,
        minPurchaseText: p.applicableCategory ? `Kategori: ${p.applicableCategory}` : 'Sesuai pesanan',
        minPurchaseValue: 35000,
        validUntil: p.validUntil,
        badge: (p.badge as any) || 'BEST DEAL',
        terms: p.terms,
      }));

    const systemActiveVouchers = VOUCHER_ITEMS.filter((v) => {
      const isPromoDisabled =
        (v.id === 'voucher-01' && disabledPromoIds.includes('promo-01')) ||
        (v.id === 'voucher-02' && disabledPromoIds.includes('promo-02')) ||
        (v.id === 'voucher-04' && disabledPromoIds.includes('promo-03')) ||
        disabledPromoIds.includes(v.id) ||
        disabledPromoIds.includes(v.code);
      return !isPromoDisabled;
    });

    return [...customAsVouchers, ...systemActiveVouchers];
  }, [customPromos, disabledPromoIds]);

  // Claimed codes state with localStorage persistence
  const [claimedCodes, setClaimedCodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arkanza_claimed_vouchers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);
  const [claimedVoucherModalItem, setClaimedVoucherModalItem] = useState<VoucherItem | null>(null);
  const [isClaimedDrawerOpen, setIsClaimedDrawerOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Copy state & Toasts
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync claimed codes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('arkanza_claimed_vouchers', JSON.stringify(claimedCodes));
    } catch {
      // ignore
    }
  }, [claimedCodes]);

  // Toast helper
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Copy voucher code to clipboard
  const handleCopyCode = async (code: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for iframe restriction if needed
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedCode(code);
      showToast(`Kode voucher "${code}" berhasil disalin!`);
      setTimeout(() => setCopiedCode(null), 3000);
    } catch (err) {
      setCopiedCode(code);
      showToast(`Kode voucher "${code}" berhasil disalin!`);
      setTimeout(() => setCopiedCode(null), 3000);
    }
  };

  // Claim voucher action - opens modal with customer data form
  const handleClaimVoucher = (voucher: VoucherItem) => {
    setClaimedVoucherModalItem(voucher);
  };

  // Quick claim from promo card / modal
  const handleClaimPromo = (promo: PromoItem) => {
    const matchingVoucher = allVouchers.find((v) => v.code === promo.code) || {
      id: promo.id,
      code: promo.code,
      discountTag: promo.discountTag,
      title: promo.title,
      description: promo.subtitle,
      minPurchaseText: promo.discountAmountText,
      minPurchaseValue: 50000,
      validUntil: promo.validUntil,
      badge: promo.badge as any,
      terms: promo.terms,
    };

    if (selectedPromo) {
      setSelectedPromo(null);
    }
    setClaimedVoucherModalItem(matchingVoucher);
  };

  // Callback when claim is successfully verified & saved to Firebase
  const handleSuccessClaim = (voucher: VoucherItem, customerData: CustomerData) => {
    if (!claimedCodes.includes(voucher.code)) {
      setClaimedCodes((prev) => [...prev, voucher.code]);
    }
    showToast(`🎉 Halo ${customerData.name}! Voucher ${voucher.discountTag} berhasil tersimpan ke database Arkanza.`);
  };

  // Flash promo claim
  const handleClaimFlashPromo = () => {
    const flashVoucher = allVouchers[0]; // First active voucher
    handleClaimVoucher(flashVoucher);
  };

  // Smooth scroll navigation helpers
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get claimed vouchers objects
  const claimedVouchersList = allVouchers.filter((v) => claimedCodes.includes(v.code));

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111111] flex flex-col font-sans selection:bg-[#1F4D3A] selection:text-white">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Sticky Modern Navbar */}
      <Navbar
        claimedCount={claimedCodes.length}
        onOpenClaimedModal={() => setIsClaimedDrawerOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* 1. Hero Section (Dark, Warm, Earthy) */}
      <Hero
        onDiscoverPromo={() => scrollToSection('promo')}
        onExploreVouchers={() => scrollToSection('voucher')}
      />

      {/* 2. Today's Special / Promos Section (Light) */}
      <PromosSection
        promos={allPromos}
        onSelectPromo={(promo) => setSelectedPromo(promo)}
        onQuickClaimPromo={handleClaimPromo}
        claimedCodes={claimedCodes}
      />

      {/* 3. Countdown Promo Section (Dark) */}
      <CountdownPromo onClaimFlashPromo={handleClaimFlashPromo} />

      {/* 4. Special Voucher For You (Light with Dark Ticket Coupons) */}
      <VoucherSection
        vouchers={allVouchers}
        claimedCodes={claimedCodes}
        onClaimVoucher={handleClaimVoucher}
        onCopyCode={handleCopyCode}
        copiedCode={copiedCode}
      />

      {/* 5. Opening Hours & Live Open Status (Light) */}
      <OpeningHoursSection />

      {/* 6. Catch Our Vibe - Instagram Grid (Dark) */}
      <CatchOurVibe photos={VIBE_PHOTOS} />

      {/* 7. Find Us & Location (Light) */}
      <LocationContact />

      {/* 8. Footer (Dark) */}
      <Footer onOpenAdminModal={() => setIsAdminModalOpen(true)} />

      {/* Floating WhatsApp Quick Table Booking */}
      <FloatingWhatsAppButton onOpenToast={showToast} />

      {/* MODALS */}
      {/* Admin / Cashier Claims & Customer Database Modal */}
      <AdminClaimsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onShowToast={showToast}
        customPromos={customPromos}
      />

      {/* Promo Detail Modal */}
      <PromoDetailModal
        promo={selectedPromo}
        onClose={() => setSelectedPromo(null)}
        onClaim={handleClaimPromo}
        isClaimed={selectedPromo ? claimedCodes.includes(selectedPromo.code) : false}
        onCopyCode={handleCopyCode}
        isCopied={selectedPromo ? copiedCode === selectedPromo.code : false}
      />

      {/* Voucher Claimed & Firebase Customer Data Modal */}
      <VoucherClaimModal
        voucher={claimedVoucherModalItem}
        onClose={() => setClaimedVoucherModalItem(null)}
        onSuccessClaim={handleSuccessClaim}
        isAlreadyClaimed={claimedVoucherModalItem ? claimedCodes.includes(claimedVoucherModalItem.code) : false}
        onCopyCode={handleCopyCode}
        isCopied={claimedVoucherModalItem ? copiedCode === claimedVoucherModalItem.code : false}
      />

      {/* Saved / Claimed Vouchers Drawer */}
      <ClaimedVouchersDrawer
        isOpen={isClaimedDrawerOpen}
        onClose={() => setIsClaimedDrawerOpen(false)}
        claimedVouchers={claimedVouchersList}
        onCopyCode={handleCopyCode}
        copiedCode={copiedCode}
        onExploreMore={() => scrollToSection('voucher')}
      />
    </div>
  );
}
