import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Instagram, ExternalLink, Clock, Navigation, Share2, MessageSquare, Sparkles, Music2 } from 'lucide-react';

export const LocationContact: React.FC = () => {
  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#F7F6F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block mb-2 px-3 py-1 bg-[#1F4D3A] text-white text-[10px] font-bold tracking-widest uppercase rounded">
            <span>STORE LOCATION &amp; CONTACT</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-bold text-[#111111] tracking-tight mb-2">
            Find Us
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Kunjungi outlet Arkanza Coffee &amp; Roastery untuk merasakan pengalaman seduhan kopi terbaik dan suasana yang nyaman.
          </p>
        </div>

        {/* Location & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Details & Info Card */}
          <div className="lg:col-span-5 bg-white rounded p-6 sm:p-8 border-l-4 border-[#1F4D3A] shadow-md flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Address */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1F4D3A] block mb-1">
                  ALAMAT CAFE &amp; ROASTERY
                </span>
                <p className="font-serif italic text-xl font-bold text-[#111111] mb-1">
                  Jl. Raya Kebon Agung No.KM 007 No 17
                </p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Sambang, Kebonagung, Kec. Sukodono, Kabupaten Sidoarjo, Jawa Timur 61258
                </p>
              </div>

              {/* Hours reminder */}
              <div className="p-4 rounded bg-[#F7F6F2] border border-black/5 flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#A98262] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#111111]">Jam Operasional</p>
                  <p className="text-xs text-gray-600">Senin – Jumat: 08.00 – 23.00 WIB</p>
                  <p className="text-xs text-gray-600">Sabtu – Minggu: 08.00 – 00.00 WIB</p>
                </div>
              </div>

              {/* Contact Links */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
                  HUBUNGI KAMI &amp; RESERVASI
                </span>
                
                {/* WhatsApp */}
                <a
                  href="https://wa.me/6281125512006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded bg-[#1F4D3A]/10 hover:bg-[#1F4D3A] text-[#1F4D3A] hover:text-white transition-all font-bold text-xs group cursor-pointer uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp (+62 811-2551-2006)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/arkanzacoffeeandroastery/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded bg-[#F7F6F2] hover:bg-[#111111] text-[#111111] hover:text-white transition-all font-bold text-xs group cursor-pointer uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2.5">
                    <Instagram className="w-4 h-4 text-[#A98262]" />
                    <span>Instagram @arkanzacoffeeandroastery</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@arkanzacoffee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded bg-[#F7F6F2] hover:bg-[#111111] text-[#111111] hover:text-white transition-all font-bold text-xs group cursor-pointer uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2.5">
                    <Music2 className="w-4 h-4 text-[#A98262]" />
                    <span>TikTok @arkanzacoffee</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>

                {/* Linktree */}
                <a
                  href="https://linktr.ee/arkanzacoffeeandroastery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F6F2] hover:bg-[#6B4A35] text-[#111111] hover:text-white transition-all font-semibold text-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Share2 className="w-4 h-4 text-[#6B4A35] group-hover:text-white" />
                    <span>Linktree Resmi Arkanza</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </div>

            </div>
          </div>

          {/* Map Preview Card & Interactive Embed */}
          <div className="lg:col-span-7 bg-[#111111] rounded overflow-hidden shadow-xl border border-white/10 relative flex flex-col min-h-[380px]">
            {/* Live Interactive Google Map Embed */}
            <div className="relative flex-1 w-full min-h-[300px] overflow-hidden bg-[#161616]">
              <iframe
                title="Peta Lokasi Arkanza Coffee & Roastery Sukodono"
                src="https://maps.google.com/maps?q=Arkanza%20Coffee%20%26%20Roastery%2C%20Jl.%20Raya%20Kebon%20Agung%20KM%20007%20No%2017%2C%20Sukodono%2C%20Sidoarjo&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[300px] border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>

            {/* Bottom Action Bar */}
            <div className="p-4 sm:p-5 bg-[#111111] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-[#A98262] font-bold uppercase tracking-wider">NAVIGASI GOOGLE MAPS</p>
                <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">Arkanza Coffee &amp; Roastery Sukodono</p>
              </div>

              <a
                href="https://maps.google.com/?q=Arkanza+Coffee+%26+Roastery,+Jl.+Raya+Kebon+Agung+No.KM+007+No+17,+Sambang,+Kebonagung,+Kec.+Sukodono,+Kabupaten+Sidoarjo,+Jawa+Timur+61258"
                target="_blank"
                rel="noopener noreferrer"
                id="btn-google-maps"
                className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#1F4D3A] hover:bg-[#163A2C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Buka Rute di Google Maps</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
