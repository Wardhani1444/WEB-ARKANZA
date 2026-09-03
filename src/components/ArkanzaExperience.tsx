import React from 'react';
import { motion } from 'motion/react';
import { Wifi, Zap, Wind, Award, Coffee, HeartHandshake, Sparkles } from 'lucide-react';

export const ArkanzaExperience: React.FC = () => {
  return (
    <section id="experience" className="py-20 sm:py-28 bg-[#111111] text-[#F7F6F2] relative overflow-hidden">
      {/* Background grain and ambient lighting */}
      <div className="absolute inset-0 bg-dark-grain opacity-25 pointer-events-none" />
      <div className="absolute -top-32 right-0 w-96 h-96 bg-[#1F4D3A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-0 w-96 h-96 bg-[#6B4A35]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Split Storytelling Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Cafe Atmosphere Collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
                alt="Arkanza Coffee Interior & Workspaces"
                className="w-full h-[420px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-transparent to-black/20" />

              {/* Floating Highlight Card on Image */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/15 text-[#F7F6F2]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1F4D3A] flex items-center justify-center text-emerald-300">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold tracking-wider text-[#A98262]">
                        Specialty Roastery Lab
                      </p>
                      <p className="text-sm font-semibold text-white">
                        Small Batch In-House Roasted
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                    100% Arabica
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Offset Box */}
            <div className="hidden sm:block absolute -top-5 -left-5 w-24 h-24 rounded-2xl border border-[#1F4D3A]/50 -z-10 bg-[#163A2C]/20 backdrop-blur-sm" />
          </motion.div>

          {/* Right Column: Storytelling & Key Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <div className="inline-block mb-3 px-3 py-1 bg-[#1F4D3A] text-white text-[10px] font-bold tracking-widest uppercase rounded w-fit">
              <span>ARKANZA EXPERIENCE</span>
            </div>

            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 leading-tight">
              More Than <span className="text-[#A98262]">Just Coffee.</span>
            </h2>

            <p className="text-sm font-bold uppercase tracking-widest text-[#A98262] mb-3">
              &quot;Happiness for all&quot;
            </p>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6 font-light">
              Arkanza dirancang sebagai perpaduan antara artisan specialty roastery dan sanctuary ruang kerja modern. 
              Tempat di mana Anda dapat menikmati seduhan kopi berstandar tinggi, menyelesaikan produktivitas harian, bersantai melepas penat, 
              hingga berbincang hangat bersama sahabat.
            </p>

            {/* Facilities Chips */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-2.5 p-3 rounded bg-white/5 border border-white/10">
                <Wifi className="w-4 h-4 text-[#A98262]" />
                <span className="text-xs font-medium text-white">Ultra Fast Wi-Fi</span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded bg-white/5 border border-white/10">
                <Zap className="w-4 h-4 text-[#A98262]" />
                <span className="text-xs font-medium text-white">Power Outlet di Meja</span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded bg-white/5 border border-white/10">
                <Wind className="w-4 h-4 text-[#A98262]" />
                <span className="text-xs font-medium text-white">Indoor AC &amp; Outdoor</span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded bg-white/5 border border-white/10">
                <HeartHandshake className="w-4 h-4 text-[#A98262]" />
                <span className="text-xs font-medium text-white">Friendly Baristas</span>
              </div>
            </div>

            {/* Key Statistics / Highlights Section */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="font-editorial text-xl sm:text-2xl font-bold text-white">08.00–23.00</p>
                <p className="text-[11px] text-[#A98262] uppercase tracking-wider font-semibold mt-1">Weekdays</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="font-editorial text-xl sm:text-2xl font-bold text-white">08.00–00.00</p>
                <p className="text-[11px] text-[#A98262] uppercase tracking-wider font-semibold mt-1">Weekend</p>
              </div>

              <div className="p-3 rounded-xl bg-[#163A2C]/60 border border-[#1F4D3A] flex flex-col justify-center">
                <p className="font-editorial text-xs sm:text-sm font-bold text-emerald-300">Coffee • Food</p>
                <p className="text-[11px] text-white/80 font-semibold mt-0.5">Good Vibes</p>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
