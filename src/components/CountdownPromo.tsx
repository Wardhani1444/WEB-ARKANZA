import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Flame, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { triggerHapticFeedback } from '../utils/haptics';

interface CountdownPromoProps {
  onClaimFlashPromo: () => void;
}

export const CountdownPromo: React.FC<CountdownPromoProps> = ({ onClaimFlashPromo }) => {
  // 2 hours, 15 minutes, 32 seconds timer calculation from load or daily reset
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>(() => {
    // Initial standard timer 2h 15m 32s
    return { hours: 2, minutes: 15, seconds: 32 };
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          setIsExpired(true);
          clearInterval(timer);
          return prev;
        }

        let newSec = prev.seconds - 1;
        let newMin = prev.minutes;
        let newHr = prev.hours;

        if (newSec < 0) {
          newSec = 59;
          newMin -= 1;
        }
        if (newMin < 0) {
          newMin = 59;
          newHr -= 1;
        }

        return { hours: Math.max(0, newHr), minutes: Math.max(0, newMin), seconds: Math.max(0, newSec) };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="py-16 sm:py-20 bg-[#111111] text-[#F7F6F2] relative overflow-hidden border-y border-white/10">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1F4D3A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dark-grain opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Flash Deal Tag */}
        <div className="inline-block mb-3 px-3.5 py-1 bg-[#1F4D3A] text-[#F7F6F2] text-xs font-bold tracking-widest uppercase rounded">
          <span>☕ FLASH ROASTERY DEAL</span>
        </div>

        {/* Headline & Subheadline */}
        <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
          Promo Ends Soon.
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto mb-8 font-light">
          Promo spesial ini hanya tersedia dalam waktu terbatas. Klaim voucher sebelum hitungan mundur berakhir.
        </p>

        {/* Countdown Box Display */}
        {isExpired ? (
          <div className="p-6 rounded bg-white/5 border border-white/10 max-w-md mx-auto">
            <p className="text-sm font-bold text-red-400 uppercase tracking-wider">Promo telah berakhir.</p>
            <p className="text-xs text-gray-400 mt-1">Nantikan promo eksklusif batch roasting berikutnya besok!</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-8">
            
            {/* Timer Digits */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded bg-[#163A2C] border border-[#1F4D3A] flex items-center justify-center text-2xl sm:text-3xl font-mono font-bold text-white shadow-md">
                  {formatDigit(timeLeft.hours)}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                  HOURS
                </span>
              </div>

              <span className="text-xl font-mono font-bold text-[#A98262] mb-5">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded bg-[#163A2C] border border-[#1F4D3A] flex items-center justify-center text-2xl sm:text-3xl font-mono font-bold text-white shadow-md">
                  {formatDigit(timeLeft.minutes)}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                  MINUTES
                </span>
              </div>

              <span className="text-xl font-mono font-bold text-[#A98262] mb-5">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded bg-[#163A2C] border border-[#1F4D3A] flex items-center justify-center text-2xl sm:text-3xl font-mono font-bold text-[#A98262] shadow-md">
                  {formatDigit(timeLeft.seconds)}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                  SECONDS
                </span>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="flex flex-col items-center sm:items-start text-left pl-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                KUPON TERBATAS
              </span>
              <p className="text-sm font-bold text-white mb-3 uppercase tracking-wide">
                Diskon 20% + Free Upgrade Oat Milk
              </p>
              <button
                onClick={() => {
                  triggerHapticFeedback('light');
                  onClaimFlashPromo();
                }}
                id="btn-claim-flash-deal"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-[#1F4D3A] hover:bg-[#163A2C] text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Klaim Flash Promo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 uppercase tracking-wider font-medium">
          <Clock className="w-3.5 h-3.5 text-[#A98262]" />
          <span>Reset otomatis setiap hari pukul 08.00 WIB</span>
        </div>

      </div>
    </section>
  );
};
