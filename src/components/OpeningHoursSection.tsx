import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar, CheckCircle2, MapPin, Sparkles, Coffee } from 'lucide-react';

export const OpeningHoursSection: React.FC = () => {
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [currentDayStr, setCurrentDayStr] = useState('');
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    const updateOpenStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday, 6 is Saturday
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentDecimalHour = hours + minutes / 60;

      const isWeekend = day === 0 || day === 6;
      const openingHour = 8.0;
      const closingHour = isWeekend ? 24.0 : 23.0; // midnight on weekend, 23.00 on weekdays

      const open = currentDecimalHour >= openingHour && currentDecimalHour < closingHour;
      setIsOpenNow(open);

      const daysName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      setCurrentDayStr(daysName[day]);
      setCurrentTimeStr(
        `${hours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')} WIB`
      );
    };

    updateOpenStatus();
    const interval = setInterval(updateOpenStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hours" className="py-20 sm:py-24 bg-[#F7F6F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Card with Fade-In Animation */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded p-6 sm:p-10 border border-black/10 shadow-lg max-w-4xl mx-auto relative overflow-hidden"
        >
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-6 border-b border-black/10">
            <div>
              <div className="inline-block mb-2 px-3 py-1 bg-[#1F4D3A] text-white text-[10px] font-bold tracking-widest uppercase rounded">
                <span>VISIT &amp; SCHEDULE</span>
              </div>
              <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
                Come Visit Us
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Pintu kami selalu terbuka untuk menyambut hari produktif dan momen santai Anda.
              </p>
            </div>

            {/* Live Open Status Indicator */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded bg-[#111111] text-[#F7F6F2] shadow border border-[#1F4D3A]/40">
              <div className="relative flex h-2.5 w-2.5">
                {isOpenNow ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  {isOpenNow ? '● OPEN TODAY' : '○ CLOSED (BUKA 08.00)'}
                </p>
                <p className="text-[10px] text-[#A98262]">
                  {currentDayStr} • {currentTimeStr}
                </p>
              </div>
            </div>
          </div>

          {/* Opening Hours Schedule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Weekdays */}
            <div className="p-5 rounded bg-[#F7F6F2] border-l-4 border-[#1F4D3A] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#1F4D3A]">
                  HARI KERJA
                </span>
                <span className="text-xs font-bold text-[#6B4A35]">Senin – Jumat</span>
              </div>
              
              <div className="my-2">
                <p className="font-serif italic text-2xl sm:text-3xl font-bold text-[#111111]">
                  08.00 – 23.00 <span className="text-xs font-sans font-bold text-gray-500 uppercase">WIB</span>
                </p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Ideal untuk pagi produktif, remote work, meeting santai, hingga kopi sore.
                </p>
              </div>

              <div className="pt-3 border-t border-black/10 flex items-center gap-2 text-xs text-[#1F4D3A] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Full Kitchen &amp; Espresso Bar Active</span>
              </div>
            </div>

            {/* Weekend */}
            <div className="p-5 rounded bg-[#111111] text-[#F7F6F2] border-l-4 border-[#A98262] flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#A98262]">
                  AKHIR PEKAN
                </span>
                <span className="text-xs font-bold text-gray-300">Sabtu – Minggu</span>
              </div>
              
              <div className="my-2">
                <p className="font-serif italic text-2xl sm:text-3xl font-bold text-white">
                  08.00 – 00.00 <span className="text-xs font-sans font-bold text-gray-400 uppercase">WIB</span>
                </p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Malam lebih panjang untuk bersantai bersama teman, live chill vibes, dan manual brew slow bar.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-[#A98262] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Late Night Coffee &amp; Weekend Vouchers Apply</span>
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};
