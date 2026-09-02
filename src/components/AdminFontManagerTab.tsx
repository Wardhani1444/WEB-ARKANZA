import React, { useState, useEffect } from 'react';
import {
  Type,
  Sparkles,
  Check,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Layers,
  Search,
  ArrowRight,
  Coffee,
  Flame,
  Star,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { FontSettings, FontPreset } from '../types';
import {
  DEFAULT_FONT_SETTINGS,
  AVAILABLE_HEADING_FONTS,
  AVAILABLE_BODY_FONTS,
  FONT_PRESETS,
  getLocalFontSettings,
  subscribeToFontSettings,
  updateFontSettingsInFirestore,
  resetFontSettings,
  loadGoogleFont,
  applyFontSettings,
} from '../services/fontService';

interface AdminFontManagerTabProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminFontManagerTab: React.FC<AdminFontManagerTabProps> = ({
  onShowToast,
}) => {
  const [fontSettings, setFontSettings] = useState<FontSettings>(() => getLocalFontSettings());
  const [selectedHeading, setSelectedHeading] = useState<string>(() => getLocalFontSettings().headingFont);
  const [selectedBody, setSelectedBody] = useState<string>(() => getLocalFontSettings().bodyFont);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    () => getLocalFontSettings().presetId || 'preset-editorial-coffee'
  );
  const [subMode, setSubMode] = useState<'presets' | 'custom'>('presets');
  const [headingSearch, setHeadingSearch] = useState('');
  const [bodySearch, setBodySearch] = useState('');
  const [testText, setTestText] = useState('Happiness for All');
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Subscribe to real-time font settings from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToFontSettings((settings) => {
      setFontSettings(settings);
      setSelectedHeading(settings.headingFont);
      setSelectedBody(settings.bodyFont);
      if (settings.presetId) {
        setSelectedPresetId(settings.presetId);
      }
    });

    return () => unsubscribe();
  }, []);

  // Preload Google Fonts when selected in the picker for instant preview
  useEffect(() => {
    loadGoogleFont(selectedHeading);
    loadGoogleFont(selectedBody);
  }, [selectedHeading, selectedBody]);

  // Preload all preset fonts so previews render nicely
  useEffect(() => {
    FONT_PRESETS.forEach((preset) => {
      loadGoogleFont(preset.headingFont);
      loadGoogleFont(preset.bodyFont);
    });
    AVAILABLE_HEADING_FONTS.slice(0, 8).forEach((f) => loadGoogleFont(f.name));
  }, []);

  // Select Preset Handler
  const handleSelectPreset = (preset: FontPreset) => {
    setSelectedPresetId(preset.id);
    setSelectedHeading(preset.headingFont);
    setSelectedBody(preset.bodyFont);
    loadGoogleFont(preset.headingFont);
    loadGoogleFont(preset.bodyFont);
    onShowToast(`Preset "${preset.name}" dipilih. Klik "Simpan & Terapkan" untuk mempublikasikan.`, 'info');
  };

  // Save changes to Firestore
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateFontSettingsInFirestore({
        headingFont: selectedHeading,
        bodyFont: selectedBody,
        presetId: selectedPresetId,
      });
      setFontSettings(updated);
      applyFontSettings(updated);
      onShowToast(
        `Font berhasil diperbarui ke "${selectedHeading}" & "${selectedBody}" untuk semua pengunjung!`,
        'success'
      );
    } catch (err) {
      console.error(err);
      onShowToast('Gagal menyimpan setelan font ke cloud', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (
      !window.confirm(
        'Kembalikan font website ke setelan bawaan asli Arkanza (Playfair Display & Plus Jakarta Sans)?'
      )
    ) {
      return;
    }
    setIsResetting(true);
    try {
      const reset = await resetFontSettings();
      setFontSettings(reset);
      setSelectedHeading(reset.headingFont);
      setSelectedBody(reset.bodyFont);
      setSelectedPresetId(reset.presetId || 'preset-editorial-coffee');
      applyFontSettings(reset);
      onShowToast('Font website berhasil dikembalikan ke setelan bawaan!', 'success');
    } catch (err) {
      console.error(err);
      onShowToast('Gagal mereset font', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Filtered lists
  const filteredHeadings = AVAILABLE_HEADING_FONTS.filter(
    (f) =>
      f.name.toLowerCase().includes(headingSearch.toLowerCase()) ||
      f.style.toLowerCase().includes(headingSearch.toLowerCase())
  );

  const filteredBodies = AVAILABLE_BODY_FONTS.filter(
    (f) =>
      f.name.toLowerCase().includes(bodySearch.toLowerCase()) ||
      f.style.toLowerCase().includes(bodySearch.toLowerCase())
  );

  const hasUnsavedChanges =
    selectedHeading !== fontSettings.headingFont ||
    selectedBody !== fontSettings.bodyFont ||
    selectedPresetId !== fontSettings.presetId;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* HEADER INFO & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-black/40 border border-purple-500/30 p-4 sm:p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Type className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-white text-base sm:text-lg">
              Kustomisasi Font &amp; Tipografi Website
            </h3>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Ubah jenis font judul dan teks website secara global. Tersedia preset estetik kafe atau kombinasi bebas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={handleReset}
            disabled={isResetting || isSaving}
            id="btn-reset-font"
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/15 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            title="Kembalikan ke font bawaan"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Default</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || isResetting}
            id="btn-save-font"
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <CheckCircle2 className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan & Terapkan'}</span>
          </button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Ada perubahan font yang dipilih (<strong>Judul: {selectedHeading}</strong>,{' '}
              <strong>Isi: {selectedBody}</strong>). Klik tombol <strong>Simpan &amp; Terapkan</strong> agar aktif untuk semua pengunjung.
            </span>
          </div>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold uppercase tracking-wider rounded-lg shrink-0 cursor-pointer"
          >
            Terapkan Sekarang
          </button>
        </div>
      )}

      {/* LIVE PREVIEW BOX */}
      <div className="bg-gradient-to-br from-black/80 to-[#121212] border border-white/15 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#A98262]" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
              Live Preview Tipografi
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-gray-400">Judul:</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
              {selectedHeading}
            </span>
            <span className="text-gray-400 ml-2">Teks:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {selectedBody}
            </span>
          </div>
        </div>

        {/* Live Rendered Canvas */}
        <div className="bg-[#F7F6F2] text-[#111111] p-6 sm:p-8 rounded-xl shadow-inner space-y-4">
          {/* Tagline sample */}
          <div
            style={{ fontFamily: `'${selectedBody}', system-ui, sans-serif` }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F4D3A] text-white text-[10px] font-bold tracking-widest uppercase rounded"
          >
            <Sparkles className="w-3 h-3 text-[#A98262]" />
            <span>ARKANZA COFFEE &amp; ROASTERY</span>
          </div>

          {/* Heading Sample */}
          <h2
            style={{ fontFamily: `'${selectedHeading}', Georgia, serif` }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F4D3A] tracking-tight leading-tight"
          >
            {testText || 'Happiness for All'}
          </h2>

          {/* Body Paragraph Sample */}
          <p
            style={{ fontFamily: `'${selectedBody}', system-ui, sans-serif` }}
            className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-2xl"
          >
            Nikmati aroma kopi segar dari biji kopi pilihan nusantara yang disangrai dengan presisi tinggi.
            Setiap cangkir menyajikan kehangatan, inspirasi, dan momen santai terbaik untuk Anda.
          </p>

          {/* Interactive Button Preview */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              style={{ fontFamily: `'${selectedBody}', system-ui, sans-serif` }}
              className="px-5 py-2.5 bg-[#1F4D3A] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md cursor-default"
            >
              Klaim Voucher Spesial
            </button>
            <button
              style={{ fontFamily: `'${selectedBody}', system-ui, sans-serif` }}
              className="px-5 py-2.5 bg-white text-[#1F4D3A] border border-[#EAD7C5] text-xs font-bold uppercase tracking-wider rounded-full shadow-xs cursor-default"
            >
              Lihat Menu Kopi
            </button>
          </div>
        </div>

        {/* Live typing tester input */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-3">
          <span className="text-[11px] text-gray-400 font-medium shrink-0">Uji Coba Teks:</span>
          <input
            type="text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Ketik teks kustom untuk menguji tampilan judul..."
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* MODE NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setSubMode('presets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            subMode === 'presets'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>1. Koleksi Preset Estetik ({FONT_PRESETS.length})</span>
        </button>

        <button
          onClick={() => setSubMode('custom')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            subMode === 'custom'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>2. Kustomisasi Bebas (Mix &amp; Match)</span>
        </button>
      </div>

      {/* SUB-VIEW 1: PRESET CARDS */}
      {subMode === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Pilih kombinasi font yang telah dirancang khusus untuk estetika kafe &amp; roastery:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FONT_PRESETS.map((preset) => {
              const isSelected =
                selectedPresetId === preset.id &&
                selectedHeading === preset.headingFont &&
                selectedBody === preset.bodyFont;
              const isCurrentActive =
                fontSettings.presetId === preset.id ||
                (fontSettings.headingFont === preset.headingFont &&
                  fontSettings.bodyFont === preset.bodyFont);

              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/50 shadow-xl'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
                  }`}
                >
                  <div>
                    {/* Badge & Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                        {preset.badge || 'Preset'}
                      </span>

                      {isCurrentActive && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aktif di Web</span>
                        </span>
                      )}
                    </div>

                    {/* Preset Name */}
                    <h4 className="text-white font-bold text-sm mb-1">{preset.name}</h4>
                    <p className="text-gray-400 text-xs mb-4 leading-relaxed">{preset.tagline}</p>

                    {/* Mini Visual Sample Box */}
                    <div className="bg-[#111111] p-3.5 rounded-xl border border-white/10 mb-4">
                      <p
                        style={{ fontFamily: `'${preset.headingFont}', Georgia, serif` }}
                        className="text-white font-bold text-base leading-tight mb-1 truncate"
                      >
                        {preset.previewText || 'Good Coffee, Better Moments'}
                      </p>
                      <p
                        style={{ fontFamily: `'${preset.bodyFont}', system-ui, sans-serif` }}
                        className="text-gray-400 text-xs leading-normal line-clamp-2"
                      >
                        Aroma roastery segar &amp; suasana estetik yang menenangkan.
                      </p>
                    </div>

                    {/* Font Family Info Tags */}
                    <div className="space-y-1.5 text-[11px] mb-4">
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Judul (Heading):</span>
                        <span className="font-mono text-purple-300 font-bold">{preset.headingFont}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Teks (Body):</span>
                        <span className="font-mono text-emerald-300 font-bold">{preset.bodyFont}</span>
                      </div>
                    </div>
                  </div>

                  {/* Select Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPreset(preset);
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Preset Dipilih</span>
                      </>
                    ) : (
                      <span>Pilih Preset Ini</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: CUSTOM MIX & MATCH */}
      {subMode === 'custom' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* COLUMN 1: HEADING FONT SELECTOR */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Type className="w-4 h-4 text-purple-400" />
                  <span>1. Pilih Font Judul / Headline</span>
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Digunakan untuk judul section, tagline promo, dan headline banner
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-mono font-bold">
                {selectedHeading}
              </span>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={headingSearch}
                onChange={(e) => setHeadingSearch(e.target.value)}
                placeholder="Cari nama font judul..."
                className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Font Options List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredHeadings.map((font) => {
                const isSelected = selectedHeading === font.name;
                return (
                  <div
                    key={font.name}
                    onClick={() => {
                      setSelectedHeading(font.name);
                      setSelectedPresetId('');
                      loadGoogleFont(font.name);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-950/50 border-purple-500 text-white'
                        : 'bg-black/30 border-white/5 hover:border-white/20 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div
                        style={{ fontFamily: `'${font.name}', Georgia, serif` }}
                        className="text-base font-bold text-white mb-0.5"
                      >
                        {font.name}
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-2">
                        <span className="capitalize">{font.category}</span>
                        <span>•</span>
                        <span>{font.style}</span>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-gray-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: BODY FONT SELECTOR */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Type className="w-4 h-4 text-emerald-400" />
                  <span>2. Pilih Font Isi / Paragraf</span>
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Digunakan untuk deskripsi promo, daftar menu, tombol, dan teks navigasi
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                {selectedBody}
              </span>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bodySearch}
                onChange={(e) => setBodySearch(e.target.value)}
                placeholder="Cari nama font paragraf..."
                className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Font Options List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredBodies.map((font) => {
                const isSelected = selectedBody === font.name;
                return (
                  <div
                    key={font.name}
                    onClick={() => {
                      setSelectedBody(font.name);
                      setSelectedPresetId('');
                      loadGoogleFont(font.name);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/50 border-emerald-500 text-white'
                        : 'bg-black/30 border-white/5 hover:border-white/20 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div
                        style={{ fontFamily: `'${font.name}', system-ui, sans-serif` }}
                        className="text-sm font-semibold text-white mb-0.5"
                      >
                        {font.name}
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-2">
                        <span className="capitalize">{font.category}</span>
                        <span>•</span>
                        <span>{font.style}</span>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-gray-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
