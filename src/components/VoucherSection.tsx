import React from 'react';
import { motion } from 'motion/react';
import { Ticket, Sparkles, Check, CheckCircle2, Copy, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { VoucherItem } from '../types';
import { triggerHapticFeedback } from '../utils/haptics';

interface VoucherSectionProps {
  vouchers: VoucherItem[];
  claimedCodes: string[];
  onClaimVoucher: (voucher: VoucherItem) => void;
  onCopyCode: (code: string) => void;
  copiedCode: string | null;
}

export const VoucherSection: React.FC<VoucherSectionProps> = ({
  vouchers,
  claimedCodes,
  onClaimVoucher,
  onCopyCode,
  copiedCode,
}) => {
  return (
    <section id="voucher" className="py-20 sm:py-28 bg-[#F7F6F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block mb-2 px-3 py-1 bg-[#1F4D3A] text-white text-[10px] font-bold tracking-widest uppercase rounded">
            <span>EXCLUSIVE DIGITAL COUPONS</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-bold text-[#111111] tracking-tight mb-2">
            Special Voucher For You
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
            Temukan voucher favoritmu dan nikmati lebih banyak alasan untuk kembali menikmati racikan kopi spesial Arkanza.
          </p>
        </div>

        {/* Voucher Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vouchers.map((voucher, index) => {
            const isClaimed = claimedCodes.includes(voucher.code);
            const isJustCopied = copiedCode === voucher.code;
            const isAltCard = index % 2 === 1;

            return (
              <motion.div
                key={voucher.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`rounded-lg flex flex-col sm:flex-row overflow-hidden shadow-lg border ${
                  isAltCard
                    ? 'bg-[#111111] text-[#F7F6F2] border-white/10'
                    : 'bg-white text-[#111111] border-black/10'
                }`}
              >
                {/* Left Ticket Stub */}
                <div
                  className={`w-full sm:w-1/3 p-6 flex flex-col items-center justify-center relative border-b sm:border-b-0 sm:border-r-2 border-dashed ${
                    isAltCard
                      ? 'bg-[#A98262] text-black border-gray-600'
                      : 'bg-[#111111] text-white border-gray-300'
                  }`}
                >
                  {/* Circle cutouts */}
                  <div className="hidden sm:block absolute -top-3 -right-3 w-6 h-6 bg-[#F7F6F2] rounded-full z-10" />
                  <div className="hidden sm:block absolute -bottom-3 -right-3 w-6 h-6 bg-[#F7F6F2] rounded-full z-10" />

                  <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    isAltCard ? 'text-black' : 'text-[#A98262]'
                  }`}>
                    {voucher.discountTag}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${
                    isAltCard ? 'text-black/80' : 'text-white'
                  }`}>
                    {voucher.badge}
                  </span>
                </div>

                {/* Right Ticket Body */}
                <div className="w-full sm:w-2/3 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-sm font-bold uppercase leading-tight">
                        {voucher.title}
                      </h4>
                    </div>
                    <p className={`text-xs mb-1 line-clamp-1 ${
                      isAltCard ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {voucher.description}
                    </p>
                    <p className={`text-[10px] ${
                      isAltCard ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {voucher.minPurchaseText} • Valid: {voucher.validUntil}
                    </p>
                  </div>

                  <div className="mt-3">
                    {/* Code Container */}
                    <div className={`p-1.5 px-3 text-center font-mono text-xs font-bold border border-dashed uppercase tracking-widest flex items-center justify-between rounded ${
                      isAltCard
                        ? 'bg-white/5 border-white/20 text-white'
                        : 'bg-gray-100 border-gray-400 text-[#111111]'
                    }`}>
                      <span>{voucher.code}</span>
                      <button
                        onClick={() => {
                          triggerHapticFeedback('light');
                          onCopyCode(voucher.code);
                        }}
                        title="Copy Code"
                        className="text-xs uppercase font-sans font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {isJustCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
                        <span className="text-[10px]">{isJustCopied ? 'COPIED' : 'COPY'}</span>
                      </button>
                    </div>

                    {/* Claim Button */}
                    <button
                      onClick={() => {
                        triggerHapticFeedback('light');
                        onClaimVoucher(voucher);
                      }}
                      id={`btn-claim-${voucher.id}`}
                      className={`mt-2 w-full py-2 px-3 text-[11px] font-bold rounded uppercase tracking-wider transition-all cursor-pointer ${
                        isClaimed
                          ? isAltCard
                            ? 'border border-white/30 text-white bg-transparent'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-[#1F4D3A] hover:bg-[#163A2C] text-white shadow-sm'
                      }`}
                    >
                      {isClaimed ? '✓ DIKLAIM' : 'KLAIM VOUCHER'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* How to Use Voucher Steps */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white border border-black/5 shadow-sm max-w-4xl mx-auto">
          <h4 className="text-center font-editorial text-lg font-bold text-[#111111] mb-6">
            Cara Menggunakan Voucher di Arkanza
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#1F4D3A]/10 text-[#1F4D3A] font-bold flex items-center justify-center text-sm mb-3">
                1
              </div>
              <p className="text-xs font-bold text-[#111111] mb-1">Pilih &amp; Klaim</p>
              <p className="text-[11px] text-[#111111]/70">Pilih voucher yang Anda inginkan dan tekan tombol klaim.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#1F4D3A]/10 text-[#1F4D3A] font-bold flex items-center justify-center text-sm mb-3">
                2
              </div>
              <p className="text-xs font-bold text-[#111111] mb-1">Salin Kode</p>
              <p className="text-[11px] text-[#111111]/70">Salin atau simpan kode voucher yang tertera di layar Anda.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#1F4D3A]/10 text-[#1F4D3A] font-bold flex items-center justify-center text-sm mb-3">
                3
              </div>
              <p className="text-xs font-bold text-[#111111] mb-1">Tunjukkan ke Kasir</p>
              <p className="text-[11px] text-[#111111]/70">Tunjukkan kode voucher kepada barista/kasir saat Anda memesan di cafe.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
