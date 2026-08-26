import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Tag, Calendar, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { PromoItem } from '../types';

interface PromoDetailModalProps {
  promo: PromoItem | null;
  onClose: () => void;
  onClaim: (promo: PromoItem) => void;
  isClaimed: boolean;
  onCopyCode?: (code: string) => void;
  isCopied?: boolean;
}

export const PromoDetailModal: React.FC<PromoDetailModalProps> = ({
  promo,
  onClose,
  onClaim,
  isClaimed,
}) => {
  if (!promo) return null;

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
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-black/10 my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Image */}
          <div className="relative h-60 sm:h-72 bg-[#111111] overflow-hidden">
            <img
              src={promo.image}
              alt={promo.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
            
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-[#1F4D3A] text-white text-xs font-bold tracking-wider uppercase shadow-md">
                {promo.badge}
              </span>
            </div>

            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A98262] uppercase tracking-wider mb-1">
                <Tag className="w-3.5 h-3.5" />
                <span>{promo.title}</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white leading-tight">
                {promo.discountTag}
              </h3>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto">
            {/* Description */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F4D3A] mb-2">
                Tentang Promo
              </h4>
              <p className="text-sm text-[#111111]/80 leading-relaxed">
                {promo.description}
              </p>
            </div>

            {/* Validity */}
            <div className="mb-6">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#F7F6F2] border border-black/5 text-xs text-[#111111]">
                <Calendar className="w-4 h-4 text-[#6B4A35]" />
                <div>
                  <span className="font-semibold">Masa Berlaku: </span>
                  <span>{promo.validUntil}</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] mb-2.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#6B4A35]" />
                <span>Syarat &amp; Ketentuan</span>
              </div>
              <ul className="space-y-2 text-xs text-[#111111]/75 list-disc list-inside bg-[#F7F6F2] p-4 rounded-xl border border-black/5">
                {promo.terms.map((term, i) => (
                  <li key={i} className="leading-relaxed">
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 sm:p-6 bg-[#F7F6F2] border-t border-black/10 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-black/15 text-xs font-semibold text-[#111111] hover:bg-black/5 transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              onClick={() => onClaim(promo)}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                isClaimed
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#1F4D3A] hover:bg-[#163A2C] text-white hover:shadow-lg'
              }`}
            >
              {isClaimed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Voucher Telah Diklaim</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Klaim Voucher Sekarang</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
