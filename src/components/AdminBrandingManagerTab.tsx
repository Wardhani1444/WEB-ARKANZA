import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  RotateCcw,
  Upload,
  Link as LinkIcon,
  Eye,
  Sliders,
  CheckCircle2,
  Coffee,
  Ticket,
  Image as ImageIcon,
  Layers,
  Store,
  RefreshCw,
} from 'lucide-react';
import { BrandingSettings } from '../types';
import {
  DEFAULT_BRANDING_SETTINGS,
  LOGO_PRESETS,
  getLocalBrandingSettings,
  subscribeToBrandingSettings,
  updateBrandingSettingsInFirestore,
  resetBrandingSettings,
  compressUploadedLogoImage,
} from '../services/brandingService';

interface AdminBrandingManagerTabProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminBrandingManagerTab: React.FC<AdminBrandingManagerTabProps> = ({
  onShowToast,
}) => {
  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>(() => getLocalBrandingSettings());
  const [logoUrl, setLogoUrl] = useState<string>(() => getLocalBrandingSettings().logoUrl);
  const [brandName, setBrandName] = useState<string>(() => getLocalBrandingSettings().brandName || 'ARKANZA');
  const [brandSubtitle, setBrandSubtitle] = useState<string>(
    () => getLocalBrandingSettings().brandSubtitle || 'COFFEE & ROASTERY'
  );
  const [logoShape, setLogoShape] = useState<'rounded' | 'circle' | 'square'>(
    () => getLocalBrandingSettings().logoShape || 'rounded'
  );

  const [subMode, setSubMode] = useState<'upload' | 'preset' | 'url' | 'customize'>('upload');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Subscribe to real-time branding updates from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToBrandingSettings((settings) => {
      setBrandingSettings(settings);
      setLogoUrl(settings.logoUrl);
      setBrandName(settings.brandName || 'ARKANZA');
      setBrandSubtitle(settings.brandSubtitle || 'COFFEE & ROASTERY');
      setLogoShape(settings.logoShape || 'rounded');
    });

    return () => unsubscribe();
  }, []);

  // Save changes to Firestore
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateBrandingSettingsInFirestore({
        logoUrl: logoUrl.trim(),
        brandName: brandName.trim(),
        brandSubtitle: brandSubtitle.trim(),
        logoShape,
      });
      onShowToast('✨ Logo dan Identitas Brand berhasil diperbarui!', 'success');
    } catch (err) {
      console.error(err);
      onShowToast('Gagal menyimpan ke server Firestore, disimpan di cache browser', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default Arkanza logo
  const handleResetDefault = async () => {
    if (!window.confirm('Kembalikan logo dan nama brand ke setelan resmi Arkanza Coffee & Roastery?')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await resetBrandingSettings();
      setLogoUrl(res.logoUrl);
      setBrandName(res.brandName || 'ARKANZA');
      setBrandSubtitle(res.brandSubtitle || 'COFFEE & ROASTERY');
      setLogoShape(res.logoShape || 'rounded');
      onShowToast('Logo & brand dikembalikan ke default resmi', 'info');
    } catch (err) {
      console.error(err);
      onShowToast('Gagal mereset logo', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Handle uploaded logo file
  const handleLogoFileUpload = async (file: File) => {
    setIsProcessingImage(true);
    try {
      const compressedDataUrl = await compressUploadedLogoImage(file);
      setLogoUrl(compressedDataUrl);
      onShowToast('Foto logo baru berhasil dipasang! Klik "Simpan Perubahan" untuk menerapkan.', 'success');
    } catch (err) {
      console.error(err);
      onShowToast('Gagal memproses file gambar logo', 'error');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Apply custom URL
  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) {
      onShowToast('Masukkan URL gambar logo yang valid', 'error');
      return;
    }
    setLogoUrl(customUrlInput.trim());
    onShowToast('URL logo berhasil dipasang!', 'info');
  };

  // Shape class helper
  const getShapeClass = () => {
    switch (logoShape) {
      case 'circle':
        return 'rounded-full';
      case 'square':
        return 'rounded-none';
      case 'rounded':
      default:
        return 'rounded-xl';
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* HEADER ACTION BAR */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Kelola Logo &amp; Identitas Brand Website
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Unggah logo baru cafe, atur bentuk bingkai, serta sesuaikan nama brand di Navbar, Footer, &amp; Voucher.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefault}
            disabled={isResetting}
            id="btn-reset-branding-default"
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-rose-300 text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isResetting ? 'Mereset...' : 'Reset Default'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || isProcessingImage}
            id="btn-save-branding-changes"
            className="px-5 py-2 rounded-xl bg-[#1F4D3A] hover:bg-[#256149] text-white text-xs font-bold shadow-lg shadow-[#1F4D3A]/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* 1. LIVE PREVIEW SHOWCASE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A98262] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Pratinjau Langsung (Live Preview)
            </span>
            <span className="text-[11px] text-gray-400">
              Logo akan otomatis sinkron ke Navbar, Footer, &amp; Voucher
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Live Preview 1: Navbar Header Card */}
            <div className="md:col-span-7 bg-[#111111] border border-white/15 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-[#A98262]" />
                Tampilan di Navbar Utama
              </div>

              <div className="bg-[#181818] border border-white/10 rounded-xl p-3 flex items-center justify-between">
                {/* Brand Logo & Text */}
                <div className="flex items-center gap-3">
                  <div
                    className={`relative w-10 h-10 overflow-hidden border border-[#A98262]/60 bg-black p-0.5 flex items-center justify-center shadow-md ${getShapeClass()}`}
                  >
                    <img
                      src={logoUrl}
                      alt="Brand Logo Preview"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-serif italic text-base font-bold tracking-wider text-[#F7F6F2] leading-tight">
                      {brandName || 'ARKANZA'}
                    </span>
                    <span className="text-[9px] tracking-[0.25em] text-[#A98262] uppercase font-bold">
                      {brandSubtitle || 'COFFEE & ROASTERY'}
                    </span>
                  </div>
                </div>

                {/* Mock CTA Button */}
                <div className="px-3.5 py-1.5 rounded-lg bg-[#1F4D3A] text-white text-[10px] font-bold tracking-wider uppercase">
                  Lihat Promo
                </div>
              </div>
            </div>

            {/* Live Preview 2: Voucher Ticket Preview */}
            <div className="md:col-span-5 bg-[#181818] border border-white/15 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                Tampilan di Header Voucher
              </div>

              <div className="bg-gradient-to-br from-[#121212] to-[#1E1E1E] border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <div
                  className={`w-9 h-9 overflow-hidden border border-[#A98262]/50 bg-black p-0.5 shrink-0 flex items-center justify-center ${getShapeClass()}`}
                >
                  <img
                    src={logoUrl}
                    alt="Logo Voucher Preview"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{brandName || 'ARKANZA'}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">Voucher Diskon Terverifikasi</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SUB-MODE NAVIGATION TABS */}
        <div className="flex border-b border-white/10 gap-1 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => setSubMode('upload')}
            id="btn-submode-upload-logo"
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              subMode === 'upload'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File Logo
          </button>

          <button
            type="button"
            onClick={() => setSubMode('preset')}
            id="btn-submode-preset-logo"
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              subMode === 'preset'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Pilihan Preset ({LOGO_PRESETS.length})
          </button>

          <button
            type="button"
            onClick={() => setSubMode('url')}
            id="btn-submode-url-logo"
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              subMode === 'url'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Link URL Logo
          </button>

          <button
            type="button"
            onClick={() => setSubMode('customize')}
            id="btn-submode-customize-logo"
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              subMode === 'customize'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Nama Brand &amp; Bentuk Logo
          </button>
        </div>

        {/* SUBMODE 1: UPLOAD LOGO */}
        {subMode === 'upload' && (
          <div className="space-y-4">
            <label
              htmlFor="input-upload-logo-file"
              className="border-2 border-dashed border-white/20 hover:border-[#1F4D3A] bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 block"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1F4D3A]/30 border border-[#1F4D3A] flex items-center justify-center text-[#F7F6F2] shadow-lg">
                <Upload className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Klik untuk Pilih File Logo Baru dari Perangkat
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                  Mendukung format PNG transparan, JPG, WebP, atau SVG. Gambar otomatis dioptimasi resolusinya untuk tampilan yang jernih di semua layar.
                </p>
              </div>
              <input
                id="input-upload-logo-file"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoFileUpload(file);
                }}
                className="hidden"
              />
              {isProcessingImage && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Memproses dan mengoptimasi resolusi logo...</span>
                </div>
              )}
            </label>

            {/* Current Active Logo Info */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 bg-black border border-[#A98262]/60 p-0.5 overflow-hidden flex items-center justify-center shrink-0 ${getShapeClass()}`}
                >
                  <img
                    src={logoUrl}
                    alt="Active Logo"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Logo yang Sedang Aktif</div>
                  <div className="text-[11px] text-gray-400">Siap disimpan ke server cloud Firestore</div>
                </div>
              </div>
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Terpasang</span>
              </div>
            </div>
          </div>
        )}

        {/* SUBMODE 2: PRESETS */}
        {subMode === 'preset' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400">
              Pilih salah satu preset logo roastery di bawah ini untuk langsung diaplikasikan:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {LOGO_PRESETS.map((preset) => {
                const isSelected = logoUrl === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setLogoUrl(preset.url);
                      onShowToast(`Preset logo "${preset.name}" dipilih`, 'info');
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-[#1F4D3A]/30 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 bg-black border border-white/20 p-1 shrink-0 overflow-hidden flex items-center justify-center ${getShapeClass()}`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#A98262]">
                          {preset.category}
                        </span>
                        {isSelected && (
                          <span className="p-0.5 rounded-full bg-amber-400 text-black">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white truncate">{preset.name}</div>
                      {preset.description && (
                        <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5 font-light">
                          {preset.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBMODE 3: URL INPUT */}
        {subMode === 'url' && (
          <div className="space-y-4 bg-white/[0.02] p-5 rounded-2xl border border-white/10">
            <div>
              <label className="block text-xs font-bold text-white mb-1">
                Masukkan URL Gambar Logo (Direct Link):
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Tempel link gambar dari web hosting, Cloudinary, Imgur, atau link website cafe Anda.
              </p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://example.com/images/my-coffee-logo.png"
                  className="flex-1 bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1F4D3A]"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-4 py-2.5 bg-[#1F4D3A] hover:bg-[#256149] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Pasang Logo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBMODE 4: CUSTOMIZE BRAND TEXT & LOGO SHAPE */}
        {subMode === 'customize' && (
          <div className="space-y-5 bg-white/[0.02] p-5 rounded-2xl border border-white/10">
            {/* Logo Shape Selector */}
            <div>
              <label className="block text-xs font-bold text-white mb-2">
                Bentuk Bingkai Logo (Logo Shape):
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setLogoShape('rounded')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    logoShape === 'rounded'
                      ? 'bg-[#1F4D3A]/40 border-amber-400 text-white font-bold'
                      : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg border-2 border-current" />
                  <span className="text-xs">Rounded (12px)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLogoShape('circle')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    logoShape === 'circle'
                      ? 'bg-[#1F4D3A]/40 border-amber-400 text-white font-bold'
                      : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="w-7 h-7 mx-auto mb-1.5 rounded-full border-2 border-current" />
                  <span className="text-xs">Circle (Bulat)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLogoShape('square')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    logoShape === 'square'
                      ? 'bg-[#1F4D3A]/40 border-amber-400 text-white font-bold'
                      : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="w-7 h-7 mx-auto mb-1.5 rounded-none border-2 border-current" />
                  <span className="text-xs">Square (Persegi)</span>
                </button>
              </div>
            </div>

            {/* Brand Title & Subtitle Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Nama Brand Utama:
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="ARKANZA"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1F4D3A]"
                />
                <p className="text-[11px] text-gray-500 mt-1">Tampil sebagai judul brand utama di header</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Subtitle / Tagline Singkat:
                </label>
                <input
                  type="text"
                  value={brandSubtitle}
                  onChange={(e) => setBrandSubtitle(e.target.value)}
                  placeholder="COFFEE & ROASTERY"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1F4D3A]"
                />
                <p className="text-[11px] text-gray-500 mt-1">Tampil di bawah nama brand dengan aksen emas</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
