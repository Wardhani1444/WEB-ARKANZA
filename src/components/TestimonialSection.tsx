import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  Sparkles,
  MessageSquareQuote,
  ExternalLink,
} from 'lucide-react';
import { TestimonialItem } from '../types';
import { INITIAL_TESTIMONIALS } from '../data/testimonialsData';

interface TestimonialSectionProps {
  testimonials?: TestimonialItem[];
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  testimonials = INITIAL_TESTIMONIALS,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = testimonials.length;

  const nextSlide = useCallback(() => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused || total <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide, total]);

  const current = testimonials[currentIndex];

  // Slide transition variants
  const slideVariants = {
    enter: (dir: 'next' | 'prev') => ({
      opacity: 0,
      x: dir === 'next' ? 60 : -60,
      scale: 0.98,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir: 'next' | 'prev') => ({
      opacity: 0,
      x: dir === 'next' ? -60 : 60,
      scale: 0.98,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 bg-[#111111] text-[#F7F6F2] relative overflow-hidden border-y border-white/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Background Ambience Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#1F4D3A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-[#A98262]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dark-grain opacity-25 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#163A2C] border border-[#1F4D3A] text-[#F7F6F2] text-[11px] font-bold tracking-widest uppercase rounded mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#A98262]" />
              <span>TESTIMONIALS &amp; REVIEWS</span>
            </div>
            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Words From Coffee Lovers.
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1.5 font-light">
              Cerita &amp; ulasan autentik dari pengunjung setia Arkanza Coffee &amp; Roastery
            </p>
          </div>

          {/* Rating Summary & Carousel Controls */}
          <div className="flex items-center justify-center md:justify-end gap-3 self-center md:self-end shrink-0">
            <a
              href="https://share.google/iDi3DOYbcnGLORCUc"
              target="_blank"
              rel="noopener noreferrer"
              title="Buka Ulasan Google Maps Arkanza Coffee"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 px-3.5 py-2 rounded-xl backdrop-blur-xs transition-all group cursor-pointer"
            >
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-white">4.9 / 5.0</span>
              <span className="text-[11px] text-gray-400 font-normal hidden sm:inline">(250+ Ulasan)</span>
              <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-amber-400 transition-colors ml-0.5" />
            </a>

            {/* Next / Prev Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                id="btn-prev-testimonial"
                aria-label="Previous review"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#1F4D3A] text-gray-300 hover:text-white border border-white/15 hover:border-[#1F4D3A] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                id="btn-next-testimonial"
                aria-label="Next review"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#1F4D3A] text-gray-300 hover:text-white border border-white/15 hover:border-[#1F4D3A] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Showcase Card */}
        <div className="relative min-h-[340px] sm:min-h-[300px] flex items-center">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full bg-gradient-to-br from-[#181818] via-[#141414] to-[#101010] rounded-3xl border border-white/10 p-6 sm:p-9 shadow-2xl relative overflow-hidden"
            >
              {/* Giant Background Quote Mark */}
              <Quote className="absolute right-6 top-6 sm:right-10 sm:top-8 w-24 h-24 sm:w-32 sm:h-32 text-white/[0.03] pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
                {/* Left Profile Details (4 cols) */}
                <div className="lg:col-span-4 flex flex-row lg:flex-col items-center lg:items-start gap-4 pb-5 lg:pb-0 border-b lg:border-b-0 lg:border-r border-white/10 lg:pr-6">
                  {/* Avatar with Ring */}
                  <div className="relative shrink-0">
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover ring-2 ring-[#1F4D3A] border border-white/20 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-[#1F4D3A] text-white rounded-full shadow-xs border border-black/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white leading-tight">
                      {current.name}
                    </h3>
                    {current.role && (
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {current.role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Review Content (8 cols) */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <div>
                    {/* Stars & Date */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < current.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-white/10 text-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      {current.date && (
                        <span className="text-xs text-gray-400 font-medium">
                          {current.date}
                        </span>
                      )}
                    </div>

                    {/* Review Text */}
                    <p className="text-sm sm:text-base md:text-lg text-gray-100 leading-relaxed font-normal italic">
                      &ldquo;{current.comment}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators & Thumbnails */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Dot Indicators */}
          <div className="flex items-center gap-2">
            {testimonials.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => goToSlide(idx)}
                id={`btn-testimonial-dot-${idx}`}
                aria-label={`Go to review ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 bg-[#A98262]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Quick Mini Avatars Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium hidden sm:inline mr-1">
              Ulasan Lainnya:
            </span>
            {testimonials.map((item, idx) => (
              <button
                key={`thumb-${item.id}`}
                onClick={() => goToSlide(idx)}
                title={item.name}
                className={`relative w-8 h-8 rounded-full overflow-hidden transition-all duration-200 cursor-pointer ${
                  currentIndex === idx
                    ? 'ring-2 ring-[#A98262] scale-110 opacity-100'
                    : 'opacity-40 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Leave a Review / Google Maps CTA */}
        <div className="mt-10 text-center">
          <a
            href="https://share.google/iDi3DOYbcnGLORCUc"
            target="_blank"
            rel="noopener noreferrer"
            id="btn-google-review-cta"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-[#1F4D3A] text-gray-200 hover:text-white border border-white/15 hover:border-[#1F4D3A] text-xs font-bold uppercase tracking-wider transition-all group cursor-pointer shadow-sm"
          >
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#A98262] group-hover:text-white transition-colors" />
            <span>Bagikan Pengalamanmu di Google Review</span>
          </a>
        </div>
      </div>
    </section>
  );
};
