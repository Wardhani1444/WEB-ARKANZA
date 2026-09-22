import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

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
            
            {/* Current Page Image Display */}
            <div className="w-full max-w-2xl rounded-2xl overflow-hidden bg-black/80 border border-stone-800 shadow-2xl flex items-center justify-center p-2 sm:p-4 relative">
              <img
                src={jpgImages[currentIndex]}
                alt={`Menu Halaman ${currentIndex + 1}`}
                className="w-full h-auto max-h-[820px] object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Navigation Controls */}
            {jpgImages.length > 1 && (
              <div className="w-full max-w-2xl mt-5 flex items-center justify-between gap-3 bg-[#181818] p-3 rounded-2xl border border-stone-800">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D9A35E]" />
                  <span>Sebelumnya</span>
                </button>

                {/* Page Number Indicators */}
                <div className="flex items-center gap-1.5 overflow-x-auto px-2 max-w-[200px] sm:max-w-md scrollbar-none">
                  {jpgImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
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
                  onClick={() => setCurrentIndex((prev) => Math.min(jpgImages.length - 1, prev + 1))}
                  disabled={currentIndex === jpgImages.length - 1}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
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
