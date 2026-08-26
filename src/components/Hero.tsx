import React from 'react';
import { motion } from 'motion/react';

interface HeroProps {
  onDiscoverPromo: () => void;
  onExploreVouchers?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDiscoverPromo, onExploreVouchers }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center bg-[#111111] text-[#F7F6F2] overflow-hidden pt-20 pb-16"
    >
      {/* Background Image with Cinematic Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=85"
          alt="Arkanza Coffee Roastery Interior"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms] opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/75 to-[#111111]/90" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#111111]/40 to-[#111111]" />
      </div>

      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 bg-dark-grain pointer-events-none opacity-40 z-0" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Working feels better tag */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="inline-block mb-4 px-3.5 py-1.5 bg-[#1F4D3A] text-xs font-bold tracking-widest uppercase text-[#F7F6F2] rounded shadow-md"
        >
          <span>☕ Working feels better with coffee</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="font-serif italic text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F7F6F2] leading-[1.1] mb-4 max-w-4xl"
        >
          Good Coffee,<br />
          <span className="text-[#A98262]">Better Moments.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="text-base sm:text-lg font-light opacity-80 mb-8 max-w-xl mx-auto leading-relaxed text-[#F7F6F2]"
        >
          Nikmati kopi pilihan, signature drinks, dan suasana nyaman di Arkanza Coffee &amp; Roastery.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onDiscoverPromo}
            id="hero-btn-discover-promo"
            className="w-full sm:w-auto bg-[#F7F6F2] text-[#111111] px-8 py-3.5 font-bold hover:bg-[#A98262] hover:text-white transition-all text-xs sm:text-sm tracking-widest uppercase rounded shadow-lg active:scale-95 cursor-pointer"
          >
            Lihat Promo Hari Ini
          </button>

          <button
            onClick={onExploreVouchers || onDiscoverPromo}
            id="hero-btn-explore-vouchers"
            className="w-full sm:w-auto border border-[#F7F6F2] text-[#F7F6F2] px-8 py-3.5 font-bold hover:bg-white/10 transition-all text-xs sm:text-sm tracking-widest uppercase rounded cursor-pointer"
          >
            Klaim Voucher
          </button>
        </motion.div>

      </div>
    </section>
  );
};
