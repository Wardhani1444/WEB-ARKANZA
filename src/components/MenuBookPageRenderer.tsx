import React from 'react';
import { MenuBookPage } from '../data/pdfMenuData';
import { 
  Sparkles, 
  Coffee, 
  UtensilsCrossed, 
  Clock, 
  MapPin, 
  Phone, 
  Instagram, 
  CheckCircle2, 
  Users, 
  Monitor, 
  Wifi, 
  Flame,
  Award
} from 'lucide-react';

interface MenuBookPageRendererProps {
  page: MenuBookPage;
  scale?: number;
  customJpgUrl?: string;
}

export const MenuBookPageRenderer: React.FC<MenuBookPageRendererProps> = ({ page, customJpgUrl }) => {
  // If user provided a custom JPG version for this page, render it directly!
  if (customJpgUrl) {
    return (
      <div className="w-full h-full min-h-[580px] sm:min-h-[640px] bg-[#141414] text-white rounded-2xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col justify-between relative group">
        <div className="w-full h-full flex items-center justify-center bg-black/40 p-2 sm:p-4">
          <img 
            src={customJpgUrl} 
            alt={`Halaman ${page.pageNumber} - ${page.title}`} 
            className="w-full h-auto max-h-[820px] object-contain rounded-xl shadow-lg border border-white/10"
          />
        </div>
        <div className="bg-[#1C1C1C] border-t border-stone-800 px-4 py-2 flex items-center justify-between text-[11px] text-stone-400">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Versi JPG Kustom Aktif
          </span>
          <span className="font-bold text-stone-300">Halaman {page.pageNumber}: {page.title}</span>
        </div>
      </div>
    );
  }
  // Page 1: Official Front Cover
  if (page.pageNumber === 1) {
    return (
      <div className="w-full h-full min-h-[580px] sm:min-h-[640px] bg-gradient-to-br from-[#0c2e22] via-[#093525] to-[#041a12] text-white relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 select-none shadow-2xl rounded-2xl border border-emerald-900/40">
        {/* Emerald Swirl Background Aesthetic */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/50 via-teal-800/30 to-black"></div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 bottom-10 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>

        {/* Golden dust / swirl line */}
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-amber-300/40 via-amber-200/10 to-transparent rotate-12 pointer-events-none"></div>

        {/* Left Vertical "MENU" Typography */}
        <div className="absolute left-4 sm:left-6 top-8 bottom-8 flex items-center pointer-events-none">
          <span 
            className="text-6xl sm:text-8xl lg:text-9xl font-extrabold tracking-widest text-transparent select-none uppercase font-serif"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              WebkitTextStroke: '2px rgba(217, 163, 94, 0.75)',
              letterSpacing: '0.15em'
            }}
          >
            MENU
          </span>
        </div>

        {/* Cursive Happiness for all! script */}
        <div className="relative z-10 pl-20 sm:pl-28 pt-8 sm:pt-14">
          <p 
            className="text-4xl sm:text-6xl text-[#E8D4A2] font-serif italic font-light tracking-wide drop-shadow-md select-none"
            style={{
              fontFamily: "'Playfair Display', 'Brush Script MT', cursive, serif",
              transform: 'rotate(-10deg)',
              transformOrigin: 'left top'
            }}
          >
            Happiness for all!
          </p>
        </div>

        {/* Arkanza Diamond & Logo at Bottom Right */}
        <div className="relative z-10 self-end text-right flex flex-col items-end pr-2 sm:pr-4 pb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-300 to-green-100 p-0.5 shadow-xl flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#072418] flex items-center justify-center overflow-hidden border border-emerald-400/40">
              <div className="w-10 h-10 rounded-full bg-emerald-400/30 flex items-center justify-center animate-pulse">
                <Sparkles className="w-6 h-6 text-emerald-300" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-[0.25em] text-[#F7F6F2] font-bold">
            ARKANZA
          </h2>
          <p className="text-[11px] sm:text-xs tracking-[0.3em] text-[#D9A35E] font-medium uppercase mt-1">
            Coffee &amp; Roastery
          </p>
        </div>

        {/* Page Footer Marker */}
        <div className="relative z-10 text-center text-[10px] tracking-widest uppercase text-emerald-300/40 pt-2 border-t border-emerald-800/40">
          Cover — Arkanza Official Menu Book
        </div>
      </div>
    );
  }

  // Page 2: Photo Collage Page
  if (page.pageNumber === 2) {
    return (
      <div className="w-full h-full min-h-[580px] sm:min-h-[640px] bg-[#3B2519] text-[#F7F6F2] relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between select-none shadow-2xl rounded-2xl border border-amber-950">
        <div className="text-center mb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D9A35E]">Galeri Hangat</p>
          <h3 className="font-serif italic text-2xl sm:text-3xl text-white font-bold">Kebersamaan di Arkanza</h3>
        </div>

        {/* Framed Photo Collage Simulation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto">
          {[
            { label: 'Live Acoustic Session', bg: 'from-amber-900 to-stone-900', icon: '🎸' },
            { label: 'Kumpul Komunitas & Sahabat', bg: 'from-amber-800 to-stone-800', icon: '☕' },
            { label: 'Dinner Keluarga Hangat', bg: 'from-emerald-900 to-stone-900', icon: '🍽️' },
            { label: 'Meeting & Coworking', bg: 'from-stone-900 to-amber-950', icon: '💻' },
            { label: 'Barista Service with Heart', bg: 'from-yellow-950 to-stone-900', icon: '✨' },
            { label: 'Suasana Malam Syahdu', bg: 'from-stone-950 to-emerald-950', icon: '🌙' },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#523524] p-2 rounded-xl shadow-lg border-2 border-[#D9A35E]/40 flex flex-col items-center text-center">
              <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${item.bg} flex items-center justify-center text-2xl shadow-inner mb-2`}>
                <span>{item.icon}</span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#F7F6F2]/90 font-medium leading-tight">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4 border-t border-amber-900/50">
          <p 
            className="text-3xl sm:text-4xl text-[#E8D4A2] font-serif italic"
            style={{ fontFamily: "'Playfair Display', cursive, serif" }}
          >
            Happiness for all!
          </p>
        </div>
      </div>
    );
  }

  // Page 3: Classic Coffee Section Divider
  if (page.pageNumber === 3) {
    return (
      <div className="w-full h-full min-h-[580px] sm:min-h-[640px] bg-gradient-to-b from-[#1C1613] via-[#2A1D17] to-[#120D0A] text-[#F7F6F2] relative overflow-hidden p-6 sm:p-10 flex flex-col justify-between select-none shadow-2xl rounded-2xl border border-stone-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-700/20 via-transparent to-black pointer-events-none"></div>

        <div>
          <span className="text-amber-500 font-serif italic text-3xl sm:text-4xl">Classic</span>
          <h2 className="text-5xl sm:text-6xl font-serif tracking-widest text-white font-extrabold uppercase mt-1">
            COFFEE
          </h2>
        </div>

        {/* Center Graphic: Double Portafilter Espresso Art */}
        <div className="my-auto text-center py-8">
          <div className="inline-flex items-center justify-center p-8 rounded-full bg-gradient-to-tr from-amber-950 via-[#3B2519] to-stone-800 border-4 border-[#D9A35E]/30 shadow-2xl">
            <Coffee className="w-24 h-24 sm:w-28 sm:h-28 text-[#D9A35E]" />
          </div>
          <p className="text-xs sm:text-sm text-stone-300 max-w-sm mx-auto mt-6 leading-relaxed">
            Freshly Roasted Coffee Beans, Ground to Perfection &amp; Extracted with High Precision.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-amber-400/80 border-t border-stone-800 pt-3">
          <span>ARKANZA SPECIALTY COFFEE</span>
          <span>Halaman 3</span>
        </div>
      </div>
    );
  }

  // Page 10: Milk Based Divider
  if (page.pageNumber === 10) {
    return (
      <div className="w-full h-full min-h-[580px] sm:min-h-[640px] bg-gradient-to-b from-[#2B1B17] via-[#38231C] to-[#1F120E] text-[#F7F6F2] relative overflow-hidden p-6 sm:p-10 flex flex-col justify-between select-none shadow-2xl rounded-2xl border border-stone-800">
        <div className="text-center pt-6">
          <h2 className="text-6xl sm:text-7xl font-serif italic font-bold text-white tracking-wider">
            Milk
          </h2>
          <span 
            className="text-4xl sm:text-5xl font-extrabold tracking-widest text-transparent uppercase"
            style={{ WebkitTextStroke: '2px #F7F6F2' }}
          >
            BASED
          </span>
        </div>

        <div className="my-auto text-center py-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full bg-gradient-to-b from-white/20 to-white/5 border border-white/30 flex items-center justify-center shadow-xl mb-4">
            <span className="text-5xl">🥛</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-200/80 max-w-sm mx-auto">
            Sensasi lembutnya susu segar berpadu dengan varian rasa manis premium favorit segala usia.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-amber-400/80 border-t border-stone-800 pt-3">
          <span>ARKANZA MILK BASED</span>
          <span>Halaman 10</span>
        </div>
      </div>
    );
  }

  // Page 40: Meeting Room Divider
  if (page.pageNumber === 40) {
    return (
      <div className="w-full h-full min-h-[580px] sm:min-h-[640px] bg-gradient-to-br from-[#0c2e22] via-[#093525] to-[#041a12] text-white relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 select-none shadow-2xl rounded-2xl border border-emerald-900">
        <div className="absolute left-6 top-8 bottom-8 flex items-center pointer-events-none">
          <span 
            className="text-6xl sm:text-8xl font-extrabold tracking-widest text-transparent uppercase font-serif"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              WebkitTextStroke: '2px rgba(217, 163, 94, 0.75)',
            }}
          >
            PACKAGE
          </span>
        </div>

        <div className="relative z-10 pl-24 pt-6">
          <h2 className="text-4xl sm:text-5xl font-serif font-extrabold tracking-wide text-white leading-tight">
            MEETING<br />ROOM
          </h2>
          <div className="w-16 h-1 bg-[#D9A35E] mt-3"></div>
        </div>

        <div className="relative z-10 self-end text-right pr-4 pb-4">
          <div className="w-16 h-16 mb-2 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/40">
            <Users className="w-8 h-8 text-emerald-300" />
          </div>
          <h3 className="text-2xl font-serif tracking-widest text-white font-bold">ARKANZA</h3>
          <p className="text-xs text-[#D9A35E] tracking-widest uppercase">Coffee &amp; Roastery</p>
        </div>

        <div className="relative z-10 text-center text-[10px] tracking-widest uppercase text-emerald-300/40 border-t border-emerald-800/40 pt-2">
          Meeting Room &amp; Event Packages — Halaman 40
        </div>
      </div>
    );
  }

  // Page 41: Robusta Room Photo
  if (page.pageNumber === 41) {
    return (
      <div className="w-full h-full min-h-[580px] sm:min-h-[640px] bg-[#1a1a1a] text-white relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between select-none shadow-2xl rounded-2xl border border-stone-800">
        <div className="text-center mb-4">
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-widest text-white uppercase">
            ROBUSTA ROOM
          </h2>
          <p className="text-xs text-amber-400 uppercase tracking-widest mt-1">Private Meeting &amp; Gathering</p>
        </div>

        <div className="my-auto bg-stone-900/90 rounded-2xl p-6 border border-stone-700/60 shadow-xl text-center">
          <div className="w-20 h-20 rounded-2xl bg-amber-900/30 border border-amber-600/40 flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-amber-400" />
          </div>
          <h4 className="text-xl font-bold font-serif text-white mb-2">Kapasitas hingga 12 Pax</h4>
          <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed mb-4">
            Ruangan ber-AC privat, pencahayaan modern, colokan stop kontak di setiap meja, akses High-Speed Wi-Fi, dan suasana nyaman untuk meeting tim, presentasi, maupun temu komunitas.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-stone-800 rounded-lg text-[10px] text-amber-300 font-medium">Free Room 3 Jam</span>
            <span className="px-3 py-1 bg-stone-800 rounded-lg text-[10px] text-amber-300 font-medium">Full AC</span>
            <span className="px-3 py-1 bg-stone-800 rounded-lg text-[10px] text-amber-300 font-medium">Dedicated WiFi</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800 pt-3">
          <span>ROBUSTA ROOM PREVIEW</span>
          <span>Halaman 41</span>
        </div>
      </div>
    );
  }

  // Page 43: Arabica Room Photo
  if (page.pageNumber === 43) {
    return (
      <div className="w-full h-full min-h-[580px] sm:min-h-[640px] bg-[#1a1f1d] text-white relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between select-none shadow-2xl rounded-2xl border border-emerald-950">
        <div className="text-center mb-4">
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-widest text-emerald-200 uppercase">
            ARABICA ROOM
          </h2>
          <p className="text-xs text-emerald-400 uppercase tracking-widest mt-1">Executive Boardroom &amp; Conference</p>
        </div>

        <div className="my-auto bg-emerald-950/40 rounded-2xl p-6 border border-emerald-800/40 shadow-xl text-center">
          <div className="w-20 h-20 rounded-2xl bg-emerald-900/30 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
            <Monitor className="w-10 h-10 text-emerald-300" />
          </div>
          <h4 className="text-xl font-bold font-serif text-white mb-2">Kapasitas hingga 15 Pax</h4>
          <p className="text-xs text-emerald-100/80 max-w-md mx-auto leading-relaxed mb-4">
            Ruangan eksekutif premium dengan meja konferensi luas, Smart TV Monitor besar untuk presentasi, sound system, full AC, dan stop kontak terintegrasi.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-emerald-900/60 rounded-lg text-[10px] text-emerald-200 font-medium">Smart TV Presentasi</span>
            <span className="px-3 py-1 bg-emerald-900/60 rounded-lg text-[10px] text-emerald-200 font-medium">Free Room 3 Jam</span>
            <span className="px-3 py-1 bg-emerald-900/60 rounded-lg text-[10px] text-emerald-200 font-medium">12 - 15 Pax</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-emerald-400/80 border-t border-emerald-900/60 pt-3">
          <span>ARABICA ROOM PREVIEW</span>
          <span>Halaman 43</span>
        </div>
      </div>
    );
  }

  // Page 45: Reservasi Activity Photo Collage
  if (page.pageNumber === 45) {
    return (
      <div className="w-full h-full min-h-[580px] sm:min-h-[640px] bg-[#222] text-white relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between select-none shadow-2xl rounded-2xl border border-stone-800">
        <div className="flex items-center justify-between border-b border-stone-700 pb-3">
          <div>
            <h2 className="text-3xl font-serif font-extrabold tracking-widest text-[#D9A35E]">
              RESERVASI
            </h2>
            <p className="text-[10px] text-stone-300 uppercase tracking-widest">Pilihan Acara &amp; Kegiatan di Arkanza</p>
          </div>
          <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold">Event &amp; Gathering</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-auto">
          <div className="bg-stone-800/80 rounded-xl p-4 border border-stone-700 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <h4 className="text-sm font-bold text-amber-300 mb-1">BIRTHDAY PARTY</h4>
            <p className="text-[10px] text-stone-300">Dekorasi balon, menu prasmanan/buffet lengkap, sound system musik.</p>
          </div>
          <div className="bg-stone-800/80 rounded-xl p-4 border border-stone-700 text-center">
            <div className="text-3xl mb-2">💄</div>
            <h4 className="text-sm font-bold text-pink-300 mb-1">BEAUTY CLASS</h4>
            <p className="text-[10px] text-stone-300">Tempat ideal untuk workshop kecantikan (e.g. Wardah Beauty Class) dengan cermin &amp; penerangan prima.</p>
          </div>
          <div className="bg-stone-800/80 rounded-xl p-4 border border-stone-700 text-center">
            <div className="text-3xl mb-2">💼</div>
            <h4 className="text-sm font-bold text-blue-300 mb-1">MEETING KANTOR</h4>
            <p className="text-[10px] text-stone-300">Meeting formal korporat, evaluasi bulanan, maupun presentasi klien dengan fasilitas lengkap.</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-700/50 p-3 rounded-xl text-center">
          <p className="text-xs text-amber-200">
            Hubungi kami untuk reservasi dan penyesuaian kebutuhan khusus acara Anda.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800 pt-3">
          <span>EVENT &amp; GATHERING</span>
          <span>Halaman 45</span>
        </div>
      </div>
    );
  }

  // Page 46: Service & Barista Photo Page
  if (page.pageNumber === 46) {
    return (
      <div className="w-full h-full min-h-[580px] sm:min-h-[640px] bg-gradient-to-b from-[#1C1613] via-[#2A1D17] to-[#120D0A] text-[#F7F6F2] relative overflow-hidden p-6 sm:p-10 flex flex-col justify-between select-none shadow-2xl rounded-2xl border border-stone-800">
        <div className="text-right">
          <div className="inline-block p-1 rounded-full bg-emerald-500/20 mb-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-serif tracking-widest text-white font-bold">ARKANZA</h3>
          <p className="text-[10px] text-[#D9A35E] tracking-widest uppercase">Coffee &amp; Roastery</p>
        </div>

        <div className="my-auto text-center py-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-[#523524] border-4 border-[#D9A35E]/40 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl mb-6">
            ☕
          </div>
          <p 
            className="text-4xl sm:text-6xl text-[#E8D4A2] font-serif italic mb-4"
            style={{ fontFamily: "'Playfair Display', cursive, serif" }}
          >
            Happiness for all!
          </p>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
            Menyajikan senyum, kehangatan, dan secangkir kenikmatan sejati dalam setiap tegukan.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800 pt-3">
          <span>OUR HOSPITALITY</span>
          <span>Halaman 46</span>
        </div>
      </div>
    );
  }

  // Page 47: Official Back Cover with Contacts & Operating Hours
  if (page.pageNumber === 47) {
    return (
      <div className="w-full h-full min-h-[580px] sm:min-h-[640px] bg-gradient-to-b from-[#0a120e] via-[#0d1c15] to-[#040806] text-white relative overflow-hidden p-6 sm:p-10 flex flex-col justify-between select-none shadow-2xl rounded-2xl border border-emerald-900/60">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#D9A35E]" />
            <span className="text-xs uppercase tracking-widest text-[#D9A35E] font-bold">JAM BUKA / OPENING HOURS</span>
          </div>
          <div className="space-y-1 text-xs sm:text-sm text-stone-200">
            <p><strong className="text-white">OPENS WEEKDAYS:</strong> 9.00 AM - 23.00 PM</p>
            <p><strong className="text-white">OPENS WEEKEND:</strong> 9.00 AM - 24.00 PM</p>
          </div>
        </div>

        {/* Center: Glowing Neon "Happiness for all!" */}
        <div className="my-auto text-center py-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-emerald-300" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif tracking-[0.2em] text-white font-bold mb-1">
            ARKANZA
          </h3>
          <p className="text-[10px] sm:text-xs tracking-[0.25em] text-[#D9A35E] uppercase mb-4">
            Coffee &amp; Roastery
          </p>

          <div className="inline-block px-6 py-2 rounded-2xl bg-black/40 border border-emerald-500/30 backdrop-blur-sm">
            <p 
              className="text-3xl sm:text-4xl text-emerald-300 font-serif italic drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]"
              style={{ fontFamily: "'Playfair Display', cursive, serif" }}
            >
              Happiness for all!
            </p>
          </div>
        </div>

        {/* Contact Info & Location */}
        <div className="space-y-2 border-t border-emerald-800/50 pt-4 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#D9A35E]" />
            <span className="font-semibold text-white">081 125 512 006</span>
          </div>
          <div className="flex items-center gap-2">
            <Instagram className="w-3.5 h-3.5 text-[#D9A35E]" />
            <span>@arkanzacoffeeandroastery | TikTok: @arkanzacoffee</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#D9A35E] shrink-0 mt-0.5" />
            <span>Jl. Raya Kebon Agung KM 007, No. 17, Sukodono, Sidoarjo</span>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD CONTENT PAGES (4 to 39, 42, 44)
  // Background themes mapping
  const getThemeStyles = (theme: MenuBookPage['theme']) => {
    switch (theme) {
      case 'cream':
        return {
          bg: 'bg-[#F5EFE6] text-[#2A2421]',
          headerColor: 'text-[#D9531E]',
          headerBorder: 'border-[#D9531E]',
          cardBg: 'bg-white/80 border-[#E8DEC8]',
          badgeBg: 'bg-[#E65100] text-white',
          descColor: 'text-stone-600',
          titleOutline: true
        };
      case 'pink':
        return {
          bg: 'bg-gradient-to-b from-[#FDE8E9] via-[#FCE4E6] to-[#F8D7DA] text-[#2A2421]',
          headerColor: 'text-white',
          headerBorder: 'border-white',
          cardBg: 'bg-white/85 border-[#F8B4B8]',
          badgeBg: 'bg-[#E65100] text-white',
          descColor: 'text-stone-600',
          titleOutline: true
        };
      case 'matcha':
        return {
          bg: 'bg-gradient-to-b from-[#1C281E] via-[#243526] to-[#172218] text-[#F7F6F2]',
          headerColor: 'text-white',
          headerBorder: 'border-emerald-500',
          cardBg: 'bg-[#18231A]/90 border-emerald-800/60',
          badgeBg: 'bg-[#E65100] text-white',
          descColor: 'text-emerald-200/80',
          titleOutline: true
        };
      case 'milk':
        return {
          bg: 'bg-gradient-to-b from-[#FFB703] via-[#FFA200] to-[#FB8500] text-[#111111]',
          headerColor: 'text-white',
          headerBorder: 'border-white',
          cardBg: 'bg-white/90 border-amber-300',
          badgeBg: 'bg-[#00897B] text-white',
          descColor: 'text-stone-600',
          titleOutline: true
        };
      case 'sky':
        return {
          bg: 'bg-gradient-to-b from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] text-[#0C4A6E]',
          headerColor: 'text-[#EA580C]',
          headerBorder: 'border-sky-300',
          cardBg: 'bg-white/90 border-sky-200',
          badgeBg: 'bg-[#0284C7] text-white',
          descColor: 'text-sky-800',
          titleOutline: false
        };
      case 'indigo':
        return {
          bg: 'bg-gradient-to-b from-[#2E1065] via-[#3B0764] to-[#1E1B4B] text-[#F3E8FF]',
          headerColor: 'text-white',
          headerBorder: 'border-purple-400',
          cardBg: 'bg-purple-950/70 border-purple-800',
          badgeBg: 'bg-[#16A34A] text-white',
          descColor: 'text-purple-200',
          titleOutline: true
        };
      case 'tea':
        return {
          bg: 'bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] text-[#451A03]',
          headerColor: 'text-[#B45309]',
          headerBorder: 'border-amber-300',
          cardBg: 'bg-white/85 border-amber-200',
          badgeBg: 'bg-[#EA580C] text-white',
          descColor: 'text-stone-700',
          titleOutline: false
        };
      case 'herbal':
        return {
          bg: 'bg-[#FAF6EE] text-[#292524]',
          headerColor: 'text-[#C2410C]',
          headerBorder: 'border-amber-700',
          cardBg: 'bg-white/90 border-stone-200',
          badgeBg: 'bg-[#15803D] text-white',
          descColor: 'text-stone-600',
          titleOutline: false
        };
      case 'juice':
        return {
          bg: 'bg-gradient-to-b from-[#FFF1F2] via-[#FFE4E6] to-[#FED7AA] text-[#3F3F46]',
          headerColor: 'text-[#15803D]',
          headerBorder: 'border-rose-300',
          cardBg: 'bg-white/90 border-rose-200',
          badgeBg: 'bg-[#EA580C] text-white',
          descColor: 'text-stone-600',
          titleOutline: true
        };
      case 'snack':
        return {
          bg: 'bg-gradient-to-b from-[#FEF08A] via-[#FDE047] to-[#FACC15] text-[#1C1917]',
          headerColor: 'text-white',
          headerBorder: 'border-yellow-200',
          cardBg: 'bg-white/95 border-yellow-300',
          badgeBg: 'bg-[#EA580C] text-white',
          descColor: 'text-stone-600',
          titleOutline: true
        };
      case 'dimsum':
        return {
          bg: 'bg-[#FFFFFF] text-[#1C1917]',
          headerColor: 'text-[#15803D]',
          headerBorder: 'border-green-600',
          cardBg: 'bg-[#FAFAF9] border-stone-200',
          badgeBg: 'bg-[#EA580C] text-white',
          descColor: 'text-stone-600',
          titleOutline: false
        };
      case 'burger':
        return {
          bg: 'bg-gradient-to-b from-[#291B14] via-[#3B2519] to-[#1C120C] text-[#F7F6F2]',
          headerColor: 'text-white',
          headerBorder: 'border-amber-600',
          cardBg: 'bg-[#40281B]/80 border-amber-800/60',
          badgeBg: 'bg-[#16A34A] text-white',
          descColor: 'text-stone-300',
          titleOutline: true
        };
      case 'pasta':
        return {
          bg: 'bg-gradient-to-b from-[#EA580C] via-[#F97316] to-[#FB923C] text-white',
          headerColor: 'text-white',
          headerBorder: 'border-white',
          cardBg: 'bg-white/95 text-[#1C1917] border-orange-300',
          badgeBg: 'bg-[#0D9488] text-white',
          descColor: 'text-stone-600',
          titleOutline: true
        };
      case 'salad':
        return {
          bg: 'bg-gradient-to-b from-[#FCE7F3] to-[#FBCFE8] text-[#831843]',
          headerColor: 'text-white',
          headerBorder: 'border-pink-300',
          cardBg: 'bg-white/90 border-pink-200',
          badgeBg: 'bg-[#059669] text-white',
          descColor: 'text-stone-600',
          titleOutline: true
        };
      case 'katsu':
      case 'ricebowl':
        return {
          bg: 'bg-[#FDFBF7] text-[#1C1917]',
          headerColor: 'text-[#15803D]',
          headerBorder: 'border-emerald-600',
          cardBg: 'bg-white border-stone-200',
          badgeBg: 'bg-[#059669] text-white',
          descColor: 'text-stone-600',
          titleOutline: true
        };
      case 'meat':
        return {
          bg: 'bg-gradient-to-b from-[#FFEDD5] via-[#FED7AA] to-[#FDBA74] text-[#431407]',
          headerColor: 'text-[#EA580C]',
          headerBorder: 'border-orange-400',
          cardBg: 'bg-white/90 border-orange-200',
          badgeBg: 'bg-[#059669] text-white',
          descColor: 'text-stone-700',
          titleOutline: false
        };
      case 'nasgor':
        return {
          bg: 'bg-gradient-to-b from-[#FEF9C3] via-[#FEF08A] to-[#FDE047] text-[#1C1917]',
          headerColor: 'text-[#1C1917]',
          headerBorder: 'border-stone-800',
          cardBg: 'bg-white/90 border-yellow-300',
          badgeBg: 'bg-[#059669] text-white',
          descColor: 'text-stone-700',
          titleOutline: false
        };
      case 'chinese':
        return {
          bg: 'bg-gradient-to-b from-[#E2E8F0] via-[#CBD5E1] to-[#94A3B8] text-[#0F172A]',
          headerColor: 'text-[#0F172A]',
          headerBorder: 'border-slate-600',
          cardBg: 'bg-white/90 border-slate-300',
          badgeBg: 'bg-[#15803D] text-white',
          descColor: 'text-slate-600',
          titleOutline: false
        };
      case 'meeting':
        return {
          bg: 'bg-[#F5F2EB] text-[#292524]',
          headerColor: 'text-[#1B4332]',
          headerBorder: 'border-[#1B4332]',
          cardBg: 'bg-white border-stone-200',
          badgeBg: 'bg-[#1B4332] text-white',
          descColor: 'text-stone-600',
          titleOutline: false
        };
      default:
        return {
          bg: 'bg-[#F7F6F2] text-[#111111]',
          headerColor: 'text-[#1F4D3A]',
          headerBorder: 'border-[#1F4D3A]',
          cardBg: 'bg-white border-black/10',
          badgeBg: 'bg-[#E65100] text-white',
          descColor: 'text-stone-600',
          titleOutline: false
        };
    }
  };

  const themeStyles = getThemeStyles(page.theme);

  return (
    <div className={`w-full h-full min-h-[580px] sm:min-h-[640px] ${themeStyles.bg} relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between select-none shadow-2xl rounded-2xl border border-black/10 transition-all`}>
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 border-b border-black/10 pb-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-stone-500">
            {page.category}
          </span>
          <span className="text-[10px] font-serif font-bold text-stone-500">
            Arkanza Coffee &amp; Roastery
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 
            className={`text-2xl sm:text-3xl font-extrabold tracking-wider font-serif uppercase ${themeStyles.headerColor}`}
            style={themeStyles.titleOutline ? { textShadow: '0 2px 4px rgba(0,0,0,0.15)' } : undefined}
          >
            {page.title}
          </h2>
          {page.subtitle && (
            <p className="text-xs sm:text-sm font-medium opacity-80 mt-1 max-w-md mx-auto">
              {page.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Menu Items List / Grid */}
      <div className="my-auto space-y-3">
        {page.items?.map((item, idx) => (
          <div 
            key={idx}
            className={`p-3 sm:p-4 rounded-xl shadow-xs transition-all flex items-start justify-between gap-3 ${themeStyles.cardBg}`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm sm:text-base tracking-tight leading-snug">
                  {item.name}
                </h4>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500 text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.description && (
                <p className={`text-xs mt-1 leading-relaxed ${themeStyles.descColor}`}>
                  {item.description}
                </p>
              )}
            </div>

            {/* Price Badge */}
            <div className={`shrink-0 px-2.5 py-1 rounded-full font-bold text-xs sm:text-sm shadow-xs ${themeStyles.badgeBg}`}>
              {item.price}
            </div>
          </div>
        ))}

        {/* Benefits list (if present, e.g. Meeting Room) */}
        {page.benefits && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-900/10 border border-emerald-900/20">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>Fasilitas Termasuk:</span>
            </h5>
            <div className="flex flex-wrap gap-2">
              {page.benefits.map((b, bIdx) => (
                <span key={bIdx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-[11px] font-medium text-emerald-950 border border-emerald-800/10 shadow-xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Page Number & Footer */}
      <div className="flex items-center justify-between text-[11px] opacity-60 border-t border-black/10 pt-3">
        <span>Arkanza Coffee &amp; Roastery</span>
        <span className="font-bold">Halaman {page.pageNumber}</span>
      </div>
    </div>
  );
};
