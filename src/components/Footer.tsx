import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Instagram, Share2, ArrowUp, Heart, ShieldCheck, Music2, UtensilsCrossed } from 'lucide-react';
import { BrandingSettings } from '../types';
import defaultLogo from '../assets/arkanza-logo.jpg';

interface FooterProps {
  onOpenAdminModal?: () => void;
  brandingSettings?: BrandingSettings;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminModal, brandingSettings }) => {
  const activeLogo = brandingSettings?.logoUrl || defaultLogo;
  const brandName = brandingSettings?.brandName || 'ARKANZA';
  const brandSubtitle = brandingSettings?.brandSubtitle || 'COFFEE & ROASTERY';
  const shapeClass = brandingSettings?.logoShape === 'circle'
    ? 'rounded-full'
    : brandingSettings?.logoShape === 'square'
    ? 'rounded-none'
    : 'rounded-xl';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Promo Hari Ini', href: '#promo' },
    { name: 'Jam Operasional', href: '#hours' },
    { name: 'Catch Our Vibe', href: '#vibe' },
    { name: 'Ulasan Pelanggan', href: '#testimonials' },
    { name: 'Contact & Location', href: '#contact' },
  ];

  return (
    <footer className="bg-[#111111] text-[#F7F6F2] pt-16 pb-12 border-t border-white/10 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className={`w-11 h-11 overflow-hidden border border-[#A98262]/60 shadow-md bg-black p-0.5 shrink-0 flex items-center justify-center ${shapeClass}`}>
                  <img
                    src={activeLogo}
                    alt={`${brandName} Logo`}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-serif italic text-lg font-bold tracking-wider text-white">
                    {brandName}
                  </h3>
                  <span className="text-[9px] tracking-[0.25em] text-[#A98262] uppercase font-bold block">
                    {brandSubtitle}
                  </span>
                </div>
              </div>

              <p className="font-serif italic text-base text-[#A98262] mb-3">
                &quot;Working feels better with coffee.&quot;
              </p>

              <p className="text-xs text-gray-400 max-w-sm leading-relaxed font-light">
                Kopi pilihan specialty grade, racikan signature minuman, dan atmosfer hangat yang dirancang untuk mendukung setiap karya serta momen terbaik Anda.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-3 mt-6">
              <a
                href="https://gofood.co.id/surabaya/restaurant/arkanza-coffee-and-roastery-96b124bb-eca7-4897-a775-77512ee9ef75"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-3 rounded-lg bg-[#EE2737]/20 border border-[#EE2737]/40 hover:bg-[#EE2737] flex items-center gap-1.5 text-white transition-all text-xs font-bold group shadow-xs cursor-pointer"
                aria-label="Order via GoFood"
                title="Pesan Online di GoFood"
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#EE2737] group-hover:text-white transition-colors" />
                <span>GoFood</span>
              </a>

              <a
                href="https://www.instagram.com/arkanzacoffeeandroastery/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-white/5 border border-white/10 hover:bg-[#1F4D3A] flex items-center justify-center text-white transition-all"
                aria-label="Instagram"
                title="Instagram @arkanzacoffeeandroastery"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://www.tiktok.com/@arkanzacoffee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-white/5 border border-white/10 hover:bg-[#111111] hover:border-[#25F4EE]/50 flex items-center justify-center text-white transition-all"
                aria-label="TikTok"
                title="TikTok @arkanzacoffee"
              >
                <Music2 className="w-4 h-4" />
              </a>

              <a
                href="https://linktr.ee/arkanzacoffeeandroastery"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-white/5 border border-white/10 hover:bg-[#6B4A35] flex items-center justify-center text-white transition-all"
                aria-label="Linktree"
                title="Linktree Resmi Arkanza"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#A98262] mb-4">
              NAVIGASI HALAMAN
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-xs text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cafe Info & Scroll to Top */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#A98262] mb-4">
                ROASTERY HOURS
              </h4>
              <div className="text-xs text-gray-400 space-y-1.5 mb-6">
                <p><strong className="text-white">Senin – Jumat:</strong> 08.00 – 23.00 WIB</p>
                <p><strong className="text-white">Sabtu – Minggu:</strong> 08.00 – 00.00 WIB</p>
                <p className="text-[#A98262] pt-1">Jl. Raya Kebon Agung KM 007 No 17, Sukodono, Sidoarjo</p>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer w-fit p-2 rounded bg-white/5 border border-white/10 hover:bg-white/10"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Copyright & Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F6F2]/50">
          <p>© 2026 Arkanza Coffee &amp; Roastery. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            {onOpenAdminModal && (
              <button
                onClick={onOpenAdminModal}
                id="btn-footer-admin-portal"
                className="hidden sm:flex text-xs text-[#A98262] hover:text-white items-center gap-1.5 transition-colors cursor-pointer p-1 rounded hover:bg-white/5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Portal Kasir &amp; Data Customer (PIN)</span>
              </button>
            )}
            <p className="hidden sm:flex items-center gap-1">
              Crafted for Coffee Lovers &amp; Creators
            </p>
          </div>
        </div>

      </motion.div>
    </footer>
  );
};
