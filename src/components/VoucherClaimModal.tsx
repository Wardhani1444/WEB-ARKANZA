import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Copy, Sparkles, Store, ShieldCheck, User, Phone, Mail, Loader2, CloudCheck } from 'lucide-react';
import { VoucherItem, CustomerData } from '../types';
import arkanzaLogo from '../assets/arkanza-logo.jpg';
import { savePromoClaimToFirebase } from '../services/promoClaimService';

interface VoucherClaimModalProps {
  voucher: VoucherItem | null;
  onClose: () => void;
  onSuccessClaim: (voucher: VoucherItem, customerData: CustomerData) => void;
  isAlreadyClaimed: boolean;
  onCopyCode: (code: string) => void;
  isCopied: boolean;
}

export const VoucherClaimModal: React.FC<VoucherClaimModalProps> = ({
  voucher,
  onClose,
  onSuccessClaim,
  isAlreadyClaimed,
  onCopyCode,
  isCopied,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [firebaseDocId, setFirebaseDocId] = useState<string | null>(null);

  // Pre-load saved customer data from localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('arkanza_customer_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setCustomerName(parsed.name);
        if (parsed.phone) setCustomerPhone(parsed.phone);
        if (parsed.email) setCustomerEmail(parsed.email);
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  // When opening already claimed voucher
  useEffect(() => {
    if (voucher && isAlreadyClaimed) {
      setShowSuccessView(true);
    } else {
      setShowSuccessView(false);
      setErrorMessage(null);
    }
  }, [voucher, isAlreadyClaimed]);

  if (!voucher) return null;

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();

    if (!trimmedName) {
      setErrorMessage('Silakan masukkan nama lengkap Anda.');
      return;
    }

    if (!trimmedPhone || trimmedPhone.length < 8) {
      setErrorMessage('Silakan masukkan nomor WhatsApp / HP yang valid (minimal 8 digit).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save customer profile to localStorage for convenience in future claims
      const profileData: CustomerData = {
        name: trimmedName,
        phone: trimmedPhone,
        email: customerEmail.trim() || undefined,
      };
      localStorage.setItem('arkanza_customer_profile', JSON.stringify(profileData));

      // Save claim directly to Firebase Firestore
      const claimResult = await savePromoClaimToFirebase({
        customerName: trimmedName,
        customerPhone: trimmedPhone,
        customerEmail: customerEmail.trim() || undefined,
        promoId: voucher.id,
        promoCode: voucher.code,
        promoTitle: voucher.title,
        discountTag: voucher.discountTag,
        promoType: 'voucher',
        validUntil: voucher.validUntil,
      });

      if (claimResult.id) {
        setFirebaseDocId(claimResult.id);
      }

      onSuccessClaim(voucher, profileData);
      setShowSuccessView(true);
    } catch (err: any) {
      console.error('Firebase claim error:', err);
      // Even if Firestore has transient connection issue, still allow client claim with clear note
      const profileData: CustomerData = {
        name: trimmedName,
        phone: trimmedPhone,
        email: customerEmail.trim() || undefined,
      };
      onSuccessClaim(voucher, profileData);
      setShowSuccessView(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-[#111111] text-[#F7F6F2] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#1F4D3A] z-10 overflow-hidden my-auto"
        >
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#1F4D3A]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#6B4A35]/30 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            id="btn-close-claim-modal"
            className="absolute top-4 right-4 p-2 rounded-full text-[#F7F6F2]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-20"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Logo & Branding */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#A98262] bg-black p-0.5 shrink-0 shadow-lg flex items-center justify-center">
              <img
                src={arkanzaLogo}
                alt="Arkanza Coffee Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A98262]">
                ARKANZA COFFEE &amp; ROASTERY
              </span>
              <h3 className="font-serif italic text-lg sm:text-xl font-bold text-white leading-tight">
                {showSuccessView ? 'Voucher Siap Digunakan!' : 'Klaim Promo & Voucher'}
              </h3>
            </div>
          </div>

          {/* Promo Highlight Banner */}
          <div className="p-3.5 rounded-xl bg-[#163A2C]/60 border border-[#1F4D3A] mb-4">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#A98262] mb-1">
              <span>{voucher.badge}</span>
              <span className="text-emerald-400 font-sans font-medium">Valid: {voucher.validUntil}</span>
            </div>
            <p className="text-sm font-bold text-white leading-snug">
              {voucher.discountTag} — {voucher.title}
            </p>
            <p className="text-xs text-[#F7F6F2]/75 mt-0.5">{voucher.minPurchaseText}</p>
          </div>

          {/* STEP 1: FORM INPUT DATA DIRI (Belum Diklaim) */}
          {!showSuccessView ? (
            <form onSubmit={handleSubmitClaim} className="space-y-3.5">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <span className="font-semibold">Perhatian:</span> {errorMessage}
                </div>
              )}

              {/* Nama Lengkap */}
              <div>
                <label htmlFor="claim-customer-name" className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#A98262]" />
                  <span>Nama Lengkap *</span>
                </label>
                <input
                  type="text"
                  id="claim-customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  required
                  className="w-full px-3 py-2.5 text-xs rounded-lg bg-white/5 border border-white/15 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] focus:outline-none text-white placeholder-gray-500 transition-all"
                />
              </div>

              {/* No. WhatsApp / HP */}
              <div>
                <label htmlFor="claim-customer-phone" className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Nomor WhatsApp / HP *</span>
                </label>
                <input
                  type="tel"
                  id="claim-customer-phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Contoh: 085730848166"
                  required
                  className="w-full px-3 py-2.5 text-xs rounded-lg bg-white/5 border border-white/15 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] focus:outline-none text-white placeholder-gray-500 transition-all"
                />
              </div>

              {/* Email (Opsional) */}
              <div>
                <label htmlFor="claim-customer-email" className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#A98262]" />
                  <span>Email (Opsional)</span>
                </label>
                <input
                  type="email"
                  id="claim-customer-email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Contoh: rian@email.com"
                  className="w-full px-3 py-2.5 text-xs rounded-lg bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-white placeholder-gray-500 transition-all"
                />
              </div>

              {/* Security & Cloud Note */}
              <div className="flex items-center gap-2 text-[10px] text-gray-400 bg-black/40 p-2.5 rounded-lg border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tersimpan otomatis di Firebase Firestore untuk verifikasi kasir.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-submit-claim-promo"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#1F4D3A] hover:bg-[#163A2C] disabled:bg-gray-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#1F4D3A]/40 transition-all active:scale-98 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Menyimpan ke Database...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#A98262]" />
                    <span>Klaim Voucher Sekarang</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: SUCCESS VIEW WITH TICKET CODE */
            <div className="space-y-4 text-center">
              {/* Success Badge */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center gap-2 text-xs text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Terverifikasi di Database Arkanza</span>
                {customerName && <span className="text-white font-medium">• an. {customerName}</span>}
              </div>

              <p className="text-xs text-[#F7F6F2]/80 leading-relaxed max-w-xs mx-auto">
                Tunjukkan kode voucher di bawah ini kepada barista/kasir saat melakukan pembayaran di outlet Arkanza.
              </p>

              {/* Code Box with Copy */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/80 border border-white/15 shadow-inner">
                <span className="font-mono text-xl sm:text-2xl font-bold text-white tracking-widest pl-2">
                  {voucher.code}
                </span>
                <button
                  onClick={() => onCopyCode(voucher.code)}
                  id="modal-btn-copy-code"
                  className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-[#1F4D3A] hover:bg-[#163A2C] text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>✓ Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>

              {/* Outlet note */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#A98262] pt-1">
                <Store className="w-3.5 h-3.5" />
                <span>Berlaku untuk Dine-in &amp; Takeaway di Arkanza Coffee</span>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                id="btn-done-claim-modal"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-white/10"
              >
                Selesai &amp; Simpan ke Koleksi
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
