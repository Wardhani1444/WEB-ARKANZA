import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Calendar, Clock, Users, Coffee, Sparkles, MapPin } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  phoneNumber?: string;
  onOpenToast?: (message: string) => void;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  phoneNumber = '6281125512006',
  onOpenToast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [pax, setPax] = useState('2');
  const [area, setArea] = useState('Indoor AC');
  const [notes, setNotes] = useState('');

  // Default pre-filled booking message template
  const generateMessage = (isCustom = false) => {
    if (isCustom && (name || date || time || notes || pax)) {
      return (
        `Halo Arkanza Coffee & Roastery! ☕\n\n` +
        `Saya ingin reservasi / booking meja:\n` +
        `• Nama: ${name.trim() || '-'}\n` +
        `• Tanggal: ${date || 'Hari ini'}\n` +
        `• Jam: ${time || '-'}\n` +
        `• Jumlah Tamu: ${pax} Orang\n` +
        `• Pilihan Area: ${area}\n` +
        (notes.trim() ? `• Catatan Khusus: ${notes.trim()}\n` : '') +
        `\nMohon info ketersediaan mejanya. Terima kasih!`
      );
    }

    return (
      `Halo Arkanza Coffee & Roastery! ☕\n\n` +
      `Saya ingin reservasi / booking meja untuk kunjungan:\n` +
      `• Nama:\n` +
      `• Tanggal & Jam:\n` +
      `• Jumlah Orang:\n` +
      `• Pilihan Area (Indoor AC / Semi-Outdoor / Outdoor):\n` +
      `• Catatan Khusus:\n\n` +
      `Mohon info ketersediaan meja ya. Terima kasih!`
    );
  };

  const handleOpenWhatsApp = (custom = false) => {
    const text = generateMessage(custom);
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    if (onOpenToast) {
      onOpenToast('Membuka WhatsApp untuk reservasi meja Arkanza Coffee...');
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Interactive Reservation Mini-Card Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            id="whatsapp-booking-card"
            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm bg-[#111111] text-white rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1F4D3A] via-[#163A2C] to-[#111111] p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shrink-0">
                  <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-wide">Reservasi Meja</h3>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-[#F7F6F2]/75">Arkanza Coffee &amp; Roastery</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                id="btn-close-wa-card"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup form reservasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content / Form */}
            <div className="p-4 space-y-3.5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="bg-white/5 p-3 rounded border border-white/10">
                <p className="text-xs text-gray-300 leading-relaxed">
                  Isi form singkat ini untuk generate template booking otomatis, atau klik langsung kirim ke WhatsApp kami.
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Nama */}
                <div>
                  <label htmlFor="wa-name" className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Nama Pemesan
                  </label>
                  <input
                    type="text"
                    id="wa-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3 py-2 text-xs rounded bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-white placeholder-gray-500"
                  />
                </div>

                {/* Tanggal & Waktu */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="wa-date" className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#A98262]" /> Tanggal
                    </label>
                    <input
                      type="date"
                      id="wa-date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="wa-time" className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#A98262]" /> Jam
                    </label>
                    <input
                      type="time"
                      id="wa-time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-white"
                    />
                  </div>
                </div>

                {/* Jumlah Pax & Area */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="wa-pax" className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#A98262]" /> Jumlah Tamu
                    </label>
                    <select
                      id="wa-pax"
                      value={pax}
                      onChange={(e) => setPax(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded bg-[#1A1A1A] border border-white/15 focus:border-[#25D366] focus:outline-none text-white"
                    >
                      <option value="1">1 Orang</option>
                      <option value="2">2 Orang</option>
                      <option value="3-4">3 - 4 Orang</option>
                      <option value="5-8">5 - 8 Orang</option>
                      <option value="9+">9+ Orang (Group / Meeting)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="wa-area" className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#A98262]" /> Area
                    </label>
                    <select
                      id="wa-area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded bg-[#1A1A1A] border border-white/15 focus:border-[#25D366] focus:outline-none text-white"
                    >
                      <option value="Indoor AC">Indoor AC</option>
                      <option value="Semi-Outdoor">Semi-Outdoor</option>
                      <option value="Outdoor / Smoking">Outdoor</option>
                      <option value="Meeting Room">Meeting Room</option>
                    </select>
                  </div>
                </div>

                {/* Catatan */}
                <div>
                  <label htmlFor="wa-notes" className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Catatan Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    id="wa-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Dekat colokan listrik / Ulang tahun"
                    className="w-full px-3 py-2 text-xs rounded bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2 border-t border-white/10">
                <button
                  type="button"
                  id="btn-submit-wa-custom"
                  onClick={() => handleOpenWhatsApp(true)}
                  className="w-full py-2.5 px-4 rounded bg-[#25D366] hover:bg-[#20bd5a] text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Pesan ke WhatsApp</span>
                </button>

                <button
                  type="button"
                  id="btn-submit-wa-template"
                  onClick={() => handleOpenWhatsApp(false)}
                  className="w-full py-2 px-3 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Atau Buka Template Kosong Langsung</span>
                </button>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <Coffee className="w-3 h-3 text-[#A98262]" /> Sukodono, Sidoarjo
              </span>
              <span>Respon Cepat (08.00 - 23.00 WIB)</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <div className="flex items-center gap-2.5 group">
        {/* Tooltip / Label Badge on Desktop */}
        {!isOpen && (
          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            id="badge-wa-trigger"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold shadow-xl border border-white/15 hover:border-[#25D366]/50 transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Reservasi Meja via WA</span>
          </motion.button>
        )}

        <motion.button
          type="button"
          id="btn-floating-whatsapp"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Buka kontak WhatsApp reservasi meja Arkanza Coffee"
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl shadow-[#25D366]/40 cursor-pointer border-2 border-white/30 transition-all"
        >
          {/* Animated Ring Indicator */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

          {isOpen ? (
            <X className="w-6 h-6 text-white relative z-10" />
          ) : (
            <div className="relative z-10 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
};
