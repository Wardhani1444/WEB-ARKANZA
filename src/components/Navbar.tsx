import React, { useState, useEffect } from 'react';
import { Menu, X, Coffee, Ticket, ChevronRight, Sparkles, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import { BrandingSettings } from '../types';
import defaultLogo from '../assets/arkanza-logo.jpg';

interface NavbarProps {
  claimedCount: number;
  onOpenClaimedModal: () => void;
  onOpenAdminModal?: () => void;
  brandingSettings?: BrandingSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  claimedCount, 
  onOpenClaimedModal, 
  onOpenAdminModal,
  brandingSettings
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeLogo = brandingSettings?.logoUrl || defaultLogo;
  const brandName = brandingSettings?.brandName || 'ARKANZA';
  const brandSubtitle = brandingSettings?.brandSubtitle || 'COFFEE & ROASTERY';
  const shapeClass = brandingSettings?.logoShape === 'circle'
    ? 'rounded-full'
    : brandingSettings?.logoShape === 'square'
    ? 'rounded-none'
    : 'rounded-xl';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Promo', href: '#promo' },
    { name: 'Review', href: '#testimonials' },
    { name: 'Hours', href: '#hours' },
    { name: 'Vibe', href: '#vibe' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#111111]/95 backdrop-blur-md py-3 border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-gradient-to-b from-[#111111]/90 via-[#111111]/40 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-3 group focus:outline-none"
            id="navbar-brand-link"
          >
            <div className={`relative w-9 h-9 sm:w-10 sm:h-10 overflow-hidden border border-[#A98262]/60 shadow-md group-hover:border-[#A98262] transition-colors bg-black p-0.5 flex items-center justify-center ${shapeClass}`}>
              <img
                src={activeLogo}
                alt={`${brandName} Logo`}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif italic text-base sm:text-lg font-bold tracking-wider text-[#F7F6F2] leading-tight">
                {brandName}
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#A98262] uppercase font-bold">
                {brandSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-medium" id="desktop-nav-links">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[#F7F6F2]/80 hover:text-[#A98262] transition-colors relative py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {claimedCount > 0 && (
              <button
                onClick={onOpenClaimedModal}
                id="btn-claimed-vouchers"
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F4D3A]/40 border border-[#1F4D3A] text-emerald-400 text-xs font-semibold hover:bg-[#1F4D3A]/60 transition-all cursor-pointer"
                title="Lihat Voucher yang Diklaim"
              >
                <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                <span className="tracking-wider uppercase text-[11px]">{claimedCount} Klaim</span>
              </button>
            )}

            <a
              href="https://gofood.co.id/surabaya/restaurant/arkanza-coffee-and-roastery-96b124bb-eca7-4897-a775-77512ee9ef75"
              target="_blank"
              rel="noopener noreferrer"
              id="cta-navbar-gofood"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-[#EE2737]/15 hover:bg-[#EE2737] text-[#EE2737] hover:text-white border border-[#EE2737]/35 text-xs font-bold tracking-wider uppercase transition-all duration-200"
              title="Pesan Online di GoFood"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>GoFood</span>
            </a>

            <a
              href="#promo"
              onClick={(e) => handleNavClick(e, '#promo')}
              id="cta-navbar-promo"
              className="inline-flex items-center justify-center px-6 py-2 rounded bg-[#1F4D3A] hover:bg-[#163A2C] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-sm active:scale-95"
            >
              LIHAT PROMO
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            {claimedCount > 0 && (
              <button
                onClick={onOpenClaimedModal}
                className="p-2 rounded-lg bg-[#1F4D3A]/30 border border-[#1F4D3A] text-emerald-400"
                aria-label="Voucher diklaim"
              >
                <Ticket className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-2.5 rounded-lg text-[#F7F6F2] hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-overlay"
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-md sm:hidden flex flex-col pt-24 px-6 pb-8"
        >
          <div className="flex flex-col gap-4 divide-y divide-white/10">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-lg font-medium text-[#F7F6F2] py-2 px-3 rounded-lg hover:bg-white/5 flex items-center justify-between transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-[#A98262]" />
                </a>
              ))}
            </div>

            <div className="pt-6 flex flex-col gap-3">
              <a
                href="https://gofood.co.id/surabaya/restaurant/arkanza-coffee-and-roastery-96b124bb-eca7-4897-a775-77512ee9ef75"
                target="_blank"
                rel="noopener noreferrer"
                id="btn-mobile-drawer-gofood"
                className="w-full py-3 rounded-xl bg-[#EE2737] hover:bg-[#D31F2E] text-white text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Pesan Online di GoFood</span>
              </a>

              {claimedCount > 0 && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenClaimedModal();
                  }}
                  className="w-full py-3 rounded-xl bg-[#1F4D3A]/30 border border-[#1F4D3A] text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Lihat {claimedCount} Voucher Tersimpan</span>
                </button>
              )}

              <a
                href="#promo"
                onClick={(e) => handleNavClick(e, '#promo')}
                className="w-full py-3.5 rounded-xl bg-[#1F4D3A] text-white text-center font-semibold text-sm shadow-lg shadow-[#1F4D3A]/30"
              >
                Lihat Promo Spesial
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
