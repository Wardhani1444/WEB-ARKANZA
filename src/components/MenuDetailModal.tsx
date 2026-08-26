import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Coffee, Flame, CheckCircle, Tag, Thermometer, ShieldCheck } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onViewPromos: () => void;
}

export const MenuDetailModal: React.FC<MenuDetailModalProps> = ({
  item,
  onClose,
  onViewPromos,
}) => {
  if (!item) return null;

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-black/10 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Large Image */}
          <div className="relative h-64 sm:h-72 bg-[#111111] overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {item.badge && (
                <span className="px-3 py-1 rounded-full bg-[#1F4D3A] text-white text-xs font-bold tracking-wider uppercase shadow-md">
                  {item.badge}
                </span>
              )}
              {item.isSpecialty && (
                <span className="px-3 py-1 rounded-full bg-[#6B4A35] text-white text-xs font-bold tracking-wider uppercase shadow-md">
                  Specialty Grade
                </span>
              )}
            </div>

            {/* Title & Price overlay */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#A98262] uppercase tracking-widest block mb-0.5">
                  {item.category}
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {item.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#F7F6F2]/60 uppercase block">Harga</span>
                <span className="font-editorial text-xl sm:text-2xl font-bold text-emerald-400">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-7 max-h-[55vh] overflow-y-auto space-y-6">
            
            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F4D3A] mb-1.5">
                Deskripsi Menu
              </h4>
              <p className="text-sm text-[#111111]/80 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Temperature & Serving info */}
            {item.temperature && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F7F6F2] border border-black/5 text-xs text-[#111111]">
                <Thermometer className="w-4 h-4 text-[#1F4D3A]" />
                <div>
                  <span className="font-bold">Sajian: </span>
                  <span>Tersedia dalam varian <strong>{item.temperature}</strong></span>
                </div>
              </div>
            )}

            {/* Tasting Notes */}
            {item.tastingNotes && item.tastingNotes.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2.5 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-[#A98262]" />
                  <span>Tasting Notes &amp; Flavor Profile</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.tastingNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-[#F7F6F2] text-[#111111] font-semibold text-xs border border-black/5"
                    >
                      ✦ {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                  Bahan Baku Pilihan
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#111111]/75">
                  {item.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#F7F6F2]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F4D3A]" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Roastery Promise */}
            <div className="p-4 rounded-xl bg-[#163A2C]/10 border border-[#1F4D3A]/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1F4D3A] shrink-0 mt-0.5" />
              <p className="text-xs text-[#111111]/80 leading-relaxed">
                Setiap biji kopi disangrai segar di roastery lab kami dengan standar specialty coffee untuk cita rasa optimal dan konsisten.
              </p>
            </div>

          </div>

          {/* Modal Actions */}
          <div className="p-4 sm:p-6 bg-[#F7F6F2] border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-black/15 text-xs font-semibold text-[#111111] hover:bg-black/5 transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              onClick={() => {
                onClose();
                onViewPromos();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#163A2C] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5 text-[#A98262]" />
              <span>Lihat Promo &amp; Voucher Menu Ini</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
