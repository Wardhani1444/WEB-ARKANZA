import React from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import { HeroSettings } from '../types';
import { DEFAULT_HERO_SETTINGS } from '../services/heroService';

interface HeroProps {
  onDiscoverPromo: () => void;
  onExploreLocation?: () => void;
  settings?: HeroSettings;
  onOpenBackgroundEditor?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onDiscoverPromo,
  onExploreLocation,
  settings,
  onOpenBackgroundEditor
}) => {
  const current = settings || DEFAULT_HERO_SETTINGS;
  const bgImg = current.backgroundImage || DEFAULT_HERO_SETTINGS.backgroundImage;
  const taglineText = current.tagline !== undefined ? current.tagline : DEFAULT_HERO_SETTINGS.tagline;
  const headlineMain = current.headlineMain !== undefined ? current.headlineMain : DEFAULT_HERO_SETTINGS.headlineMain;
  const headlineAccent = current.headlineAccent !== undefined ? current.headlineAccent : DEFAULT_HERO_SETTINGS.headlineAccent;
  const subheadline = current.subheadline !== undefined ? current.subheadline : DEFAULT_HERO_SETTINGS.subheadline;
  const opacityVal = current.overlayOpacity ?? 0.35;

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center bg-[#111111] text-[#F7F6F2] overflow-hidden pt-20 pb-16"
    >
      {/* Background Image with Dynamic Source & Cinematic Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          key={bgImg}
          src={bgImg}
          alt="Arkanza Coffee Roastery Background"
          className="w-full h-full object-cover object-center scale-105 transition-opacity duration-1000"
          style={{ opacity: opacityVal }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/75 to-[#111111]/90" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#111111]/40 to-[#111111]" />
      </div>

      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 bg-dark-grain pointer-events-none opacity-40 z-0" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Working feels better tag */}
        {taglineText && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="inline-block mb-4 px-3.5 py-1.5 bg-[#1F4D3A] text-xs font-bold tracking-widest uppercase text-[#F7F6F2] rounded shadow-md"
          >
            <span>{taglineText}</span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="font-serif italic text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F7F6F2] leading-[1.1] mb-4 max-w-4xl"
        >
          {headlineMain}
          {headlineAccent && (
            <>
              <br />
              <span className="text-[#A98262]">{headlineAccent}</span>
            </>
          )}
        </motion.h1>

        {/* Subheadline */}
        {subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="text-base sm:text-lg font-light opacity-80 mb-8 max-w-xl mx-auto leading-relaxed text-[#F7F6F2]"
          >
            {subheadline}
          </motion.p>
        )}

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
            onClick={onExploreLocation || onDiscoverPromo}
            id="hero-btn-explore-location"
            className="w-full sm:w-auto border border-[#F7F6F2] text-[#F7F6F2] px-8 py-3.5 font-bold hover:bg-white/10 transition-all text-xs sm:text-sm tracking-widest uppercase rounded cursor-pointer"
          >
            Lokasi &amp; Jam Buka
          </button>
        </motion.div>

      </div>
    </section>
  );
};

