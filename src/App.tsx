/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PromosSection } from './components/PromosSection';
import { MenuSection } from './components/MenuSection';
import { MenuDetailModal } from './components/MenuDetailModal';
import { PromoDetailModal } from './components/PromoDetailModal';
import { VoucherClaimModal } from './components/VoucherClaimModal';
import { ClaimedVouchersDrawer } from './components/ClaimedVouchersDrawer';
import { AdminClaimsModal } from './components/AdminClaimsModal';
import { HeroBackgroundCustomizerModal } from './components/HeroBackgroundCustomizerModal';
import { OpeningHoursSection } from './components/OpeningHoursSection';
import { CatchOurVibe } from './components/CatchOurVibe';
import { TestimonialSection } from './components/TestimonialSection';
import { LocationContact } from './components/LocationContact';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';

import { PROMO_ITEMS } from './data/promosData';
import { MENU_ITEMS } from './data/menuData';
import { VOUCHER_ITEMS } from './data/vouchersData';
import { VIBE_PHOTOS } from './data/vibeData';
import { PromoItem, VoucherItem, MenuItem, ToastNotification, CustomerData, VibePhoto, HeroSettings, FontSettings, BrandingSettings } from './types';
import { subscribeToCustomPromos, subscribeToDisabledPromoIds, getLocalDisabledPromoIds } from './services/promoService';
import { subscribeToVibePhotos, getLocalVibePhotos } from './services/vibeService';
import { subscribeToHeroSettings, getLocalHeroSettings } from './services/heroService';
import { subscribeToFontSettings, getLocalFontSettings, applyFontSettings } from './services/fontService';
import { subscribeToBrandingSettings, getLocalBrandingSettings } from './services/brandingService';
import { triggerHapticFeedback } from './utils/haptics';

export default function App() {
  // Real-time custom promos from Firebase Firestore
  const [customPromos, setCustomPromos] = useState<PromoItem[]>([]);
  // Real-time disabled promo IDs from Firebase / LocalStorage
  const [disabledPromoIds, setDisabledPromoIds] = useState<string[]>(() => getLocalDisabledPromoIds());
  // Real-time Catch Our Vibe gallery photos from Firebase / LocalStorage
  const [vibePhotos, setVibePhotos] = useState<VibePhoto[]>(() => getLocalVibePhotos());
  // Real-time Hero Background and Headlines from Firebase / LocalStorage
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(() => getLocalHeroSettings());
  // Real-time Font settings from Firebase / LocalStorage
  const [fontSettings, setFontSettings] = useState<FontSettings>(() => getLocalFontSettings());
  // Real-time Logo & Brand settings from Firebase / LocalStorage
  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>(() => getLocalBrandingSettings());

  // Listen to custom promos, disabled promo settings, vibe photos, hero background & fonts from Firestore
  useEffect(() => {
    // Initial font application
    applyFontSettings(getLocalFontSettings());

    const unsubscribePromos = subscribeToCustomPromos((promos) => {
      setCustomPromos(promos);
    });
    const unsubscribeDisabled = subscribeToDisabledPromoIds((disabledIds) => {
      setDisabledPromoIds(disabledIds);
    });
    const unsubscribeVibe = subscribeToVibePhotos((photos) => {
      setVibePhotos(photos);
    });
    const unsubscribeHero = subscribeToHeroSettings((settings) => {
      setHeroSettings(settings);
    });
    const unsubscribeFont = subscribeToFontSettings((settings) => {
      setFontSettings(settings);
      applyFontSettings(settings);
    });
    const unsubscribeBranding = subscribeToBrandingSettings((settings) => {
      setBrandingSettings(settings);
    });
    return () => {
      unsubscribePromos();
      unsubscribeDisabled();
      unsubscribeVibe();
      unsubscribeHero();
      unsubscribeFont();
      unsubscribeBranding();
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

  // View state: 'home' (Landing Page), 'menu' (Dedicated Menu Section), or 'admin' (Dedicated Admin Section)
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#menu') return 'menu';
      if (window.location.hash === '#admin' || window.location.hash === '#portal-admin') return 'admin';
    }
    return 'home';
  });

  // Listen to hash changes for direct URL access (e.g. #menu, #admin)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#menu') {
        setCurrentView('menu');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#admin' || window.location.hash === '#portal-admin') {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#hero' || window.location.hash === '#home' || !window.location.hash) {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigateView = (
    view: 'home' | 'menu' | 'admin',
    targetSection?: string,
    initialTab?: 'claims' | 'manage_promos' | 'manage_vibe' | 'manage_hero' | 'manage_fonts' | 'manage_branding' | 'manage_menu'
  ) => {
    if (initialTab) {
      setAdminInitialTab(initialTab);
    }
    setCurrentView(view);
    if (view === 'menu') {
      window.location.hash = '#menu';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin') {
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (window.location.hash === '#menu' || window.location.hash === '#admin' || window.location.hash === '#portal-admin') {
        window.location.hash = targetSection || '#hero';
      }
      if (targetSection) {
        setTimeout(() => {
          const el = document.querySelector(targetSection);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Modals state
  const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [claimedVoucherModalItem, setClaimedVoucherModalItem] = useState<VoucherItem | null>(null);
  const [isClaimedDrawerOpen, setIsClaimedDrawerOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'claims' | 'manage_promos' | 'manage_vibe' | 'manage_hero' | 'manage_fonts' | 'manage_branding' | 'manage_menu'>('claims');
  const [isHeroCustomizerOpen, setIsHeroCustomizerOpen] = useState(false);

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
    triggerHapticFeedback('light');
    setClaimedVoucherModalItem(voucher);
  };

  // Quick claim from promo card / modal
  const handleClaimPromo = (promo: PromoItem) => {
    triggerHapticFeedback('light');
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
    triggerHapticFeedback('success');
    if (!claimedCodes.includes(voucher.code)) {
      setClaimedCodes((prev) => [...prev, voucher.code]);
    }
    showToast(`🎉 Halo ${customerData.name}! Voucher ${voucher.discountTag} berhasil tersimpan ke database Arkanza.`);
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
        onOpenAdminModal={() => handleNavigateView('admin', undefined, 'claims')}
        brandingSettings={brandingSettings}
        currentView={currentView}
        onNavigateView={handleNavigateView}
      />

      {/* Main View: Dedicated Admin Portal Section OR Dedicated Menu Page OR Landing Page */}
      {currentView === 'admin' ? (
        <main className="flex-1">
          <AdminClaimsModal
            isStandalone={true}
            isOpen={true}
            onClose={() => handleNavigateView('home')}
            onBackToHome={() => handleNavigateView('home')}
            onShowToast={showToast}
            customPromos={customPromos}
            initialTab={adminInitialTab}
          />
        </main>
      ) : currentView === 'menu' ? (
        <main className="flex-1">
          <MenuSection
            menuItems={MENU_ITEMS}
            onSelectMenuItem={(item) => setSelectedMenuItem(item)}
            onBackToHome={() => handleNavigateView('home')}
            onOpenAdminMenu={() => handleNavigateView('admin', undefined, 'manage_menu')}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* 1. Hero Section (Dark, Warm, Earthy) */}
          <Hero
            settings={heroSettings}
            onDiscoverPromo={() => scrollToSection('promo')}
            onExploreLocation={() => scrollToSection('hours')}
          />

          {/* 2. Today's Special / Promos Section (Light) */}
          <PromosSection
            promos={allPromos}
            onSelectPromo={(promo) => setSelectedPromo(promo)}
            onQuickClaimPromo={handleClaimPromo}
            claimedCodes={claimedCodes}
          />

          {/* 3. Customer Reviews & Testimonials Carousel (Dark) */}
          <TestimonialSection />

          {/* 4. Opening Hours & Live Open Status (Light) */}
          <OpeningHoursSection />

          {/* 5. Catch Our Vibe - Instagram Grid (Dark) with Real-Time Firestore Sync */}
          <CatchOurVibe
            photos={vibePhotos}
            onOpenGalleryManager={() => handleNavigateView('admin', undefined, 'manage_vibe')}
          />

          {/* 6. Find Us & Location (Light) */}
          <LocationContact />
        </main>
      )}

      {/* Footer (Dark) */}
      <Footer
        onOpenAdminModal={() => handleNavigateView('admin', undefined, 'claims')}
        onOpenAdminMenu={() => handleNavigateView('admin', undefined, 'manage_menu')}
        brandingSettings={brandingSettings}
        currentView={currentView}
        onNavigateView={handleNavigateView}
      />

      {/* Floating WhatsApp Quick Table Booking */}
      <FloatingWhatsAppButton onOpenToast={showToast} />

      {/* MODALS */}
      {/* Hero Background Customizer Modal */}
      <HeroBackgroundCustomizerModal
        isOpen={isHeroCustomizerOpen}
        onClose={() => setIsHeroCustomizerOpen(false)}
        currentSettings={heroSettings}
        onShowToast={showToast}
      />

      {/* Admin / Cashier Claims modal fallback if opened imperatively */}
      {isAdminModalOpen && (
        <AdminClaimsModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onShowToast={showToast}
          customPromos={customPromos}
          initialTab={adminInitialTab}
        />
      )}

      {/* Menu Detail Modal */}
      <MenuDetailModal
        item={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
        onViewPromos={() => scrollToSection('promo')}
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
        brandingSettings={brandingSettings}
      />

      {/* Saved / Claimed Vouchers Drawer */}
      <ClaimedVouchersDrawer
        isOpen={isClaimedDrawerOpen}
        onClose={() => setIsClaimedDrawerOpen(false)}
        claimedVouchers={claimedVouchersList}
        onCopyCode={handleCopyCode}
        copiedCode={copiedCode}
        onExploreMore={() => scrollToSection('promo')}
      />
    </div>
  );
}
