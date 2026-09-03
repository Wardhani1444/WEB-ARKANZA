import React from 'react';
import { motion } from 'motion/react';
import { Tag, Clock, ArrowUpRight, Sparkles } from 'lucide-react';
import { PromoItem } from '../types';
import { triggerHapticFeedback } from '../utils/haptics';

interface PromosSectionProps {
  promos: PromoItem[];
  onSelectPromo: (promo: PromoItem) => void;
  onQuickClaimPromo: (promo: PromoItem) => void;
  claimedCodes: string[];
}

export const PromosSection: React.FC<PromosSectionProps> = ({
  promos,
  onSelectPromo,
  onQuickClaimPromo,
  claimedCodes,
}) => {
  return (
    <section id="promo" className="py-20 sm:py-28 bg-[#F7F6F2] text-[#111111] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Fade-In Animation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12"
        >
          <div>
            <h2 className="font-serif italic text-3xl sm:text-4xl text-[#1F4D3A] font-bold tracking-tight">
              Today&apos;s Special
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
              Nikmati promo pilihan Arkanza
            </p>
          </div>
          <p className="text-[#111111]/70 text-xs sm:text-sm max-w-md mt-3 md:mt-0 leading-relaxed font-medium">
            Kombinasi terbaik racikan kopi, menu santapan, dan diskon eksklusif untuk menemani harimu.
          </p>
        </motion.div>

        {/* Promo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo, index) => {
            const isClaimed = claimedCodes.includes(promo.code);
            const isDarkCard = index % 2 === 1;

            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative p-5 flex flex-col justify-between shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all rounded ${
                  isDarkCard
                    ? 'bg-[#111111] text-[#F7F6F2] border-l-4 border-[#A98262]'
                    : 'bg-white text-[#111111] border-l-4 border-[#1F4D3A]'
                }`}
              >
                <div>
                  {/* Top Image Preview & Badges */}
                  <div className="relative h-44 rounded overflow-hidden mb-4 bg-gray-900">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider ${
                        promo.badge === 'LIMITED'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-[#1F4D3A] text-white'
                      }`}>
                        {promo.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-3">
                      <span className={`text-base font-bold ${
                        isDarkCard ? 'text-[#A98262]' : 'text-emerald-300'
                      }`}>
                        {promo.discountTag}
                      </span>
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold uppercase tracking-tight">
                        {promo.title}
                      </h3>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#A98262] uppercase">
                        {promo.code}
                      </span>
                    </div>
                    
                    <p className={`text-xs mb-2 leading-relaxed ${
                      isDarkCard ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {promo.subtitle}
                    </p>

                    <div className={`flex items-center gap-1.5 text-[11px] ${
                      isDarkCard ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <Clock className="w-3.5 h-3.5 text-[#A98262]" />
                      <span>Valid: {promo.validUntil}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className={`pt-3 border-t flex items-center justify-between ${
                  isDarkCard ? 'border-white/10' : 'border-black/10'
                }`}>
                  <button
                    onClick={() => onSelectPromo(promo)}
                    className={`text-[11px] font-bold uppercase tracking-wider border-b transition-colors cursor-pointer ${
                      isDarkCard
                        ? 'text-[#A98262] border-[#A98262] hover:text-white hover:border-white'
                        : 'text-[#6B4A35] border-[#6B4A35] hover:text-[#1F4D3A] hover:border-[#1F4D3A]'
                    }`}
                  >
                    LIHAT DETAIL
                  </button>

                  <button
                    onClick={() => {
                      triggerHapticFeedback('light');
                      onQuickClaimPromo(promo);
                    }}
                    className={`px-3 py-1.5 rounded text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      isClaimed
                        ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/50'
                        : 'bg-[#1F4D3A] hover:bg-[#163A2C] text-white shadow-sm'
                    }`}
                  >
                    {isClaimed ? '✓ DIKLAIM' : 'KLAIM PROMO'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
