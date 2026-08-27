import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Eye,
  Link as LinkIcon,
  Sparkles,
  Sliders,
  AlertCircle,
  Save,
  Lock
} from 'lucide-react';
import { HeroSettings } from '../types';
import {
  DEFAULT_HERO_SETTINGS,
  HERO_PRESET_BACKGROUNDS,
  updateHeroSettingsInFirestore,
  resetHeroSettings,
  compressUploadedHeroImage,
  HeroPreset
} from '../services/heroService';

interface HeroBackgroundCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: HeroSettings;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const HeroBackgroundCustomizerModal: React.FC<HeroBackgroundCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'url' | 'text'>('preset');
  
  // Form values
  const [backgroundImage, setBackgroundImage] = useState<string>(currentSettings.backgroundImage || DEFAULT_HERO_SETTINGS.backgroundImage);
  const [tagline, setTagline] = useState<string>(currentSettings.tagline || DEFAULT_HERO_SETTINGS.tagline || '');
  const [headlineMain, setHeadlineMain] = useState<string>(currentSettings.headlineMain || DEFAULT_HERO_SETTINGS.headlineMain || '');
  const [headlineAccent, setHeadlineAccent] = useState<string>(currentSettings.headlineAccent || DEFAULT_HERO_SETTINGS.headlineAccent || '');
  const [subheadline, setSubheadline] = useState<string>(currentSettings.subheadline || DEFAULT_HERO_SETTINGS.subheadline || '');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(currentSettings.overlayOpacity ?? 0.35);
  
  // Custom URL input
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Security / PIN check (Default PIN 1234)
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or currentSettings changes
  useEffect(() => {
    if (isOpen) {
      setBackgroundImage(currentSettings.backgroundImage || DEFAULT_HERO_SETTINGS.backgroundImage);
      setTagline(currentSettings.tagline || DEFAULT_HERO_SETTINGS.tagline || '');
      setHeadlineMain(currentSettings.headlineMain || DEFAULT_HERO_SETTINGS.headlineMain || '');
      setHeadlineAccent(currentSettings.headlineAccent || DEFAULT_HERO_SETTINGS.headlineAccent || '');
      setSubheadline(currentSettings.subheadline || DEFAULT_HERO_SETTINGS.subheadline || '');
      setOverlayOpacity(currentSettings.overlayOpacity ?? 0.35);
      setUploadError(null);
      setPinError(null);
      setPinInput('');
    }
  }, [isOpen, currentSettings]);

  if (!isOpen) return null;

  // Handle PIN verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === 'arkanza' || pinInput === 'admin') {
      setIsPinUnlocked(true);
      setPinError(null);
    } else {
      setPinError('PIN salah. Masukkan PIN Admin/Kasir (Default: 1234)');
    }
  };

  // Handle Preset selection
  const handleSelectPreset = (preset: HeroPreset) => {
    setBackgroundImage(preset.url);
    onShowToast(`Preset "${preset.name}" dipilih untuk background`, 'info');
  };

  // Handle Local Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Harap pilih file gambar valid (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const compressedBase64 = await compressUploadedHeroImage(file);
      setBackgroundImage(compressedBase64);
      onShowToast('Foto background berhasil dimuat!', 'success');
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Gagal memproses gambar. Coba format atau ukuran lain.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle Custom URL apply
  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    const trimmed = customUrlInput.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setUploadError('URL harus diawali dengan http:// atau https://');
      return;
    }

    setBackgroundImage(trimmed);
    setUploadError(null);
    onShowToast('URL background kustom berhasil diterapkan!', 'success');
  };

  // Handle Save to Firestore
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updated: HeroSettings = {
        backgroundImage,
        tagline: tagline.trim(),
        headlineMain: headlineMain.trim(),
        headlineAccent: headlineAccent.trim(),
        subheadline: subheadline.trim(),
        overlayOpacity,
        updatedAt: new Date().toISOString()
      };

      await updateHeroSettingsInFirestore(updated);
      onShowToast('✨ Background & Tampilan Hero berhasil diperbarui!', 'success');
      onClose();
    } catch (err) {
      console.error('Save hero settings error:', err);
      onShowToast('Gagal menyimpan ke server, disimpan di memori lokal.', 'info');
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Reset to Default
  const handleReset = async () => {
    if (!window.confirm('Kembalikan foto background dan teks Hero ke pengaturan awal Arkanza?')) {
      return;
    }

    try {
      setIsResetting(true);
      const resetData = await resetHeroSettings();
      setBackgroundImage(resetData.backgroundImage);
      setTagline(resetData.tagline || '');
      setHeadlineMain(resetData.headlineMain || '');
      setHeadlineAccent(resetData.headlineAccent || '');
      setSubheadline(resetData.subheadline || '');
      setOverlayOpacity(resetData.overlayOpacity ?? 0.35);
      onShowToast('Background Hero telah direset ke default awal.', 'success');
      onClose();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#181818] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-[#F7F6F2] flex flex-col max-h-[90vh] my-auto z-10"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#141414]">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#1F4D3A] rounded-xl text-[#F7F6F2]">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-[#F7F6F2] flex items-center gap-2">
                  Ganti Background &amp; Tampilan Hero
                  <span className="text-[10px] px-2 py-0.5 uppercase tracking-wider bg-[#A98262]/20 text-[#A98262] rounded font-semibold border border-[#A98262]/30">
                    Live Sync
                  </span>
                </h3>
                <p className="text-xs text-white/60">
                  Ubah gambar latar belakang utama, preset tema roastery, atau sesuaikan teks header.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* PIN Lock Screen if not authenticated */}
          {!isPinUnlocked ? (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#1F4D3A]/20 border border-[#1F4D3A]/40 flex items-center justify-center text-[#F7F6F2] mb-4">
                <Lock className="w-7 h-7 text-[#A98262]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Verifikasi Akses Admin / Kasir</h4>
              <p className="text-xs text-white/60 mb-6">
                Masukkan PIN keamanan kasir untuk mengganti background website Arkanza (Default PIN: <span className="text-[#A98262] font-mono font-bold">1234</span>).
              </p>

              <form onSubmit={handleVerifyPin} className="w-full space-y-4">
                <div>
                  <input
                    type="password"
                    maxLength={10}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Masukkan PIN (1234)"
                    className="w-full text-center tracking-widest text-lg font-mono bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1F4D3A] focus:ring-1 focus:ring-[#1F4D3A]"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs text-rose-400 mt-2 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {pinError}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#256149] text-white text-xs font-bold transition-all shadow-lg"
                  >
                    Buka Editor
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* 1. Live Mini-Preview Banner */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A98262] flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Live Preview Hero
                    </span>
                    <span className="text-[11px] text-white/50">
                      Tampilan visual real-time sebelum disimpan
                    </span>
                  </div>

                  <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-white/15 bg-black flex items-center justify-center text-center shadow-inner">
                    {/* Background Image Preview */}
                    <img
                      src={backgroundImage}
                      alt="Hero Background Preview"
                      className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                      onError={() => {
                        setUploadError('URL gambar tidak dapat dimuat. Pastikan link dapat diakses secara publik.');
                      }}
                    />
                    {/* Dark gradient overlay matching Hero */}
                    <div
                      className="absolute inset-0 bg-black"
                      style={{ opacity: overlayOpacity }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111]/80" />

                    {/* Content in Preview */}
                    <div className="relative z-10 px-4 max-w-lg mx-auto pointer-events-none">
                      {tagline && (
                        <div className="inline-block mb-1.5 px-2.5 py-0.5 bg-[#1F4D3A] text-[10px] font-bold tracking-widest uppercase text-white rounded">
                          {tagline}
                        </div>
                      )}
                      <h2 className="font-serif italic text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight mb-1">
                        {headlineMain} <span className="text-[#A98262]">{headlineAccent}</span>
                      </h2>
                      <p className="text-[11px] text-white/80 line-clamp-2 max-w-sm mx-auto">
                        {subheadline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Customizer Tabs */}
                <div className="flex border-b border-white/10 gap-1 overflow-x-auto pb-0.5">
                  <button
                    onClick={() => setActiveTab('preset')}
                    className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      activeTab === 'preset'
                        ? 'bg-[#1F4D3A] text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Pilih Preset Tema ({HERO_PRESET_BACKGROUNDS.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      activeTab === 'upload'
                        ? 'bg-[#1F4D3A] text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Foto Sendiri
                  </button>

                  <button
                    onClick={() => setActiveTab('url')}
                    className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      activeTab === 'url'
                        ? 'bg-[#1F4D3A] text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Link URL Gambar
                  </button>

                  <button
                    onClick={() => setActiveTab('text')}
                    className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      activeTab === 'text'
                        ? 'bg-[#1F4D3A] text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Edit Teks &amp; Kegelapan
                  </button>
                </div>

                {/* TAB 1: PRESETS */}
                {activeTab === 'preset' && (
                  <div className="space-y-4">
                    <p className="text-xs text-white/70">
                      Pilih dari koleksi foto resolusi tinggi bernuansa kedai kopi &amp; roastery Arkanza:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {HERO_PRESET_BACKGROUNDS.map((preset) => {
                        const isSelected = backgroundImage === preset.url;
                        return (
                          <div
                            key={preset.id}
                            onClick={() => handleSelectPreset(preset)}
                            className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 aspect-[4/3] ${
                              isSelected
                                ? 'border-[#1F4D3A] ring-2 ring-[#1F4D3A] scale-[1.02]'
                                : 'border-white/10 hover:border-white/40'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                            
                            {/* Selected Badge */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-[#1F4D3A] text-white p-1 rounded-full shadow-lg">
                                <Check className="w-3 h-3" />
                              </div>
                            )}

                            {/* Category & Title */}
                            <div className="absolute bottom-2 left-2 right-2 text-left">
                              <span className="text-[9px] uppercase tracking-wider text-[#A98262] font-semibold block">
                                {preset.category}
                              </span>
                              <span className="text-[11px] font-bold text-white line-clamp-1">
                                {preset.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 2: UPLOAD */}
                {activeTab === 'upload' && (
                  <div className="space-y-4">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 hover:border-[#1F4D3A] bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#1F4D3A]/20 flex items-center justify-center text-[#F7F6F2]">
                        <Upload className="w-6 h-6 text-[#A98262]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          Klik untuk memilih foto dari Laptop / Smartphone
                        </p>
                        <p className="text-xs text-white/50 mt-1">
                          Format JPG, PNG, atau WebP (Otomatis dioptimalkan)
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {isUploading && (
                        <p className="text-xs text-[#A98262] font-semibold animate-pulse">
                          Memproses dan mengompres foto...
                        </p>
                      )}
                    </div>

                    {uploadError && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {uploadError}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: CUSTOM URL */}
                {activeTab === 'url' && (
                  <div className="space-y-4">
                    <form onSubmit={handleApplyCustomUrl} className="space-y-3">
                      <label className="block text-xs font-semibold text-white/80">
                        Masukkan Link Direct Image URL (HTTPS):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customUrlInput}
                          onChange={(e) => setCustomUrlInput(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="flex-1 bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1F4D3A]"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-[#1F4D3A] hover:bg-[#256149] text-white text-xs font-bold rounded-xl transition-all shadow"
                        >
                          Terapkan Link
                        </button>
                      </div>
                    </form>

                    {uploadError && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {uploadError}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: TEXT & OPACITY */}
                {activeTab === 'text' && (
                  <div className="space-y-4 bg-white/[0.02] p-4 rounded-xl border border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1">
                          Tagline Badge
                        </label>
                        <input
                          type="text"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#1F4D3A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1">
                          Kegelapan Overlay ({(overlayOpacity * 100).toFixed(0)}%)
                        </label>
                        <input
                          type="range"
                          min="0.10"
                          max="0.85"
                          step="0.05"
                          value={overlayOpacity}
                          onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                          className="w-full accent-[#1F4D3A] cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1">
                          Headline Utama (Baris 1)
                        </label>
                        <input
                          type="text"
                          value={headlineMain}
                          onChange={(e) => setHeadlineMain(e.target.value)}
                          className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#1F4D3A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1">
                          Headline Aksen Warna Emas (Baris 2)
                        </label>
                        <input
                          type="text"
                          value={headlineAccent}
                          onChange={(e) => setHeadlineAccent(e.target.value)}
                          className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#1F4D3A] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1">
                          Subheadline Deskripsi
                        </label>
                        <textarea
                          rows={2}
                          value={subheadline}
                          onChange={(e) => setSubheadline(e.target.value)}
                          className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#1F4D3A] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-white/10 bg-[#141414] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isResetting}
                  className="w-full sm:w-auto text-xs text-white/50 hover:text-rose-400 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset ke Default Arkanza
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-white/80 hover:bg-white/5 cursor-pointer"
                  >
                    Tutup
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#256149] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-[#1F4D3A]/20 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Menyimpan...' : 'Simpan Background'}
                  </button>
                </div>
              </div>
            </>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
