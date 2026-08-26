import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ticket, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import { VoucherItem } from '../types';

interface ClaimedVouchersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  claimedVouchers: VoucherItem[];
  onCopyCode: (code: string) => void;
  copiedCode: string | null;
  onExploreMore: () => void;
}

export const ClaimedVouchersDrawer: React.FC<ClaimedVouchersDrawerProps> = ({
  isOpen,
  onClose,
  claimedVouchers,
  onCopyCode,
  copiedCode,
  onExploreMore,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#111111] text-[#F7F6F2] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#1F4D3A] z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1F4D3A] flex items-center justify-center text-emerald-300">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white">
                  Voucher Tersimpan ({claimedVouchers.length})
                </h3>
                <p className="text-xs text-[#A98262]">Tunjukkan kode saat memesan di kasir</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#F7F6F2]/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vouchers List */}
          <div className="max-h-[55vh] overflow-y-auto space-y-4 pr-1">
            {claimedVouchers.length === 0 ? (
              <div className="py-12 text-center text-[#F7F6F2]/60">
                <Ticket className="w-12 h-12 mx-auto mb-3 text-white/20" />
                <p className="text-sm font-semibold text-white mb-1">Belum ada voucher yang diklaim</p>
                <p className="text-xs max-w-xs mx-auto mb-5">Jelajahi voucher spesial kami dan klaim diskon hingga 20% &amp; free snack!</p>
                <button
                  onClick={() => {
                    onClose();
                    onExploreMore();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#163A2C] text-white text-xs font-semibold"
                >
                  Lihat Daftar Voucher
                </button>
              </div>
            ) : (
              claimedVouchers.map((voucher) => {
                const isJustCopied = copiedCode === voucher.code;

                return (
                  <div
                    key={voucher.id}
                    className="p-4 rounded-2xl bg-[#163A2C]/40 border border-[#1F4D3A]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-[#1F4D3A] text-white text-[10px] font-bold uppercase tracking-wider">
                          {voucher.badge}
                        </span>
                        <span className="text-xs font-bold text-white">{voucher.discountTag}</span>
                      </div>
                      <p className="text-xs text-[#F7F6F2]/80 leading-snug">{voucher.title}</p>
                      <p className="text-[11px] text-[#A98262] mt-0.5">{voucher.minPurchaseText}</p>
                    </div>

                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                      <span className="font-mono text-sm font-bold text-white bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
                        {voucher.code}
                      </span>
                      <button
                        onClick={() => onCopyCode(voucher.code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isJustCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#1F4D3A] hover:bg-[#163A2C] text-white'
                        }`}
                      >
                        {isJustCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isJustCopied ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end text-xs">
            <button
              onClick={onClose}
              id="btn-close-claimed-drawer-bottom"
              className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer border border-white/10"
            >
              Selesai
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
