import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Maximize2, 
  Minimize2,
  MoveHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  subscribeToMenuImages, 
  DEFAULT_MENU_IMAGES 
} from '../services/menuJpgService';

interface MenuSectionProps {
  menuItems?: any[];
  onSelectMenuItem?: (item: any) => void;
  onBackToHome?: () => void;
  onOpenAdminMenu?: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ 
  onBackToHome, 
  onOpenAdminMenu 
}) => {
  const [jpgImages, setJpgImages] = useState<string[]>(DEFAULT_MENU_IMAGES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Touch swipe gesture refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const minSwipeDistance = 45;

  // Real-time synchronization with Firebase Firestore & IndexedDB
  useEffect(() => {
    const unsubscribe = subscribeToMenuImages((images) => {
      setJpgImages(images);
      setIsLoading(false);
      if (currentIndex >= images.length && images.length > 0) {
        setCurrentIndex(images.length - 1);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const goToNext = useCallback(() => {
    if (currentIndex < jpgImages.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, jpgImages.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchEndY.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = touchStartY.current !== null && touchEndY.current !== null 
      ? Math.abs(touchStartY.current - touchEndY.current) 
      : 0;

    // Check if horizontal swipe was intentional and larger than vertical scrolling
    if (Math.abs(distanceX) > minSwipeDistance && Math.abs(distanceX) > distanceY * 1.2) {
      if (distanceX > 0) {
        // Swiped Left -> Go to next page
        goToNext();
      } else {
        // Swiped Right -> Go to previous page
        goToPrev();
      }
    }

    // Reset touch coordinates
    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : dir < 0 ? -80 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.15 },
      },
    }),
  };

  return (
    <section 
      id="menu-section" 
      ref={containerRef}
      className={`bg-[#121212] text-[#F7F6F2] min-h-screen transition-all select-none ${
        isFullscreen 
          ? 'fixed inset-0 z-50 p-4 sm:p-6 overflow-y-auto bg-black flex flex-col justify-between' 
          : 'pt-24 sm:pt-28 md:pt-32 pb-12'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        
        {/* Top Header & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-stone-800 mt-2 sm:mt-4">
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                id="btn-back-to-home"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-[#D9A35E]" />
                <span>Kembali ke Beranda</span>
              </button>
            )}

            <div className="hidden sm:flex items-center text-xs text-stone-400">
              <span>Arkanza</span>
              <span className="mx-2 text-stone-600">/</span>
              <span className="text-[#D9A35E] font-bold">Buku Menu</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer"
              title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Buku Menu Arkanza
          </h1>
          {jpgImages.length > 1 && (
            <div className="sm:hidden flex items-center justify-center gap-1.5 text-xs text-stone-400 mt-2">
              <MoveHorizontal className="w-3.5 h-3.5 text-[#D9A35E] animate-pulse" />
              <span>Geser layar ke kiri / kanan untuk membalik halaman</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        {jpgImages.length === 0 ? (
          /* Empty State for Public Visitors */
          <div className="my-16 p-10 border border-stone-800 rounded-3xl text-center bg-[#181818] max-w-lg mx-auto">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/5 flex items-center justify-center">
              <ImageIcon className="w-7 h-7 text-[#D9A35E]" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Buku Menu Sedang Dipersiapkan</h2>
            <p className="text-xs text-stone-400">
              Daftar menu foto akan segera tampil di sini. Silakan hubungi kami atau datang langsung ke outlet kami.
            </p>
          </div>
        ) : (
          /* Clean, Aesthetic Display for Public Visitors */
          <div className="flex flex-col items-center">
            
            {/* Current Page Image Display with Swipe Listener & Slide Animation */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full max-w-2xl rounded-2xl overflow-hidden bg-black/80 border border-stone-800 shadow-2xl flex items-center justify-center p-2 sm:p-4 relative touch-pan-y cursor-grab active:cursor-grabbing"
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.img
                  key={currentIndex}
                  src={jpgImages[currentIndex]}
                  alt={`Menu Halaman ${currentIndex + 1}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  draggable={false}
                  className="w-full h-auto max-h-[820px] object-contain rounded-xl shadow-lg select-none pointer-events-none"
                />
              </AnimatePresence>

              {/* Edge Touch / Click Areas for Mobile & Desktop */}
              {currentIndex > 0 && (
                <button
                  onClick={goToPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-14 sm:w-12 sm:h-16 rounded-xl bg-black/50 hover:bg-black/80 border border-white/10 text-white flex items-center justify-center opacity-70 hover:opacity-100 transition-all cursor-pointer z-10 active:scale-95"
                  aria-label="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6 text-[#D9A35E]" />
                </button>
              )}

              {currentIndex < jpgImages.length - 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-14 sm:w-12 sm:h-16 rounded-xl bg-black/50 hover:bg-black/80 border border-white/10 text-white flex items-center justify-center opacity-70 hover:opacity-100 transition-all cursor-pointer z-10 active:scale-95"
                  aria-label="Halaman Berikutnya"
                >
                  <ChevronRight className="w-6 h-6 text-[#D9A35E]" />
                </button>
              )}
            </div>

            {/* Navigation Controls */}
            {jpgImages.length > 1 && (
              <div className="w-full max-w-2xl mt-5 flex items-center justify-between gap-3 bg-[#181818] p-3 rounded-2xl border border-stone-800">
                <button
                  onClick={goToPrev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D9A35E]" />
                  <span>Sebelumnya</span>
                </button>

                {/* Page Number Indicators */}
                <div className="flex items-center gap-1.5 overflow-x-auto px-2 max-w-[200px] sm:max-w-md scrollbar-none">
                  {jpgImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDirection(idx > currentIndex ? 1 : -1);
                        setCurrentIndex(idx);
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        currentIndex === idx
                          ? 'bg-[#D9A35E] text-black scale-110 shadow-md'
                          : 'bg-white/10 text-stone-400 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNext}
                  disabled={currentIndex === jpgImages.length - 1}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer active:scale-95"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4 text-[#D9A35E]" />
                </button>
              </div>
            )}

            {/* Page Counter text */}
            <div className="mt-3 text-xs text-stone-500 font-medium">
              Halaman {currentIndex + 1} dari {jpgImages.length}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
