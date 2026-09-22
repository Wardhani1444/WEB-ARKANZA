import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Image as ImageIcon, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  FolderUp, 
  RefreshCw,
  Sparkles,
  Maximize2,
  Save,
  Cloud,
  Check
} from 'lucide-react';
import { 
  subscribeToMenuImages, 
  saveAllMenuImages, 
  fileToDataUrl,
  DEFAULT_MENU_IMAGES
} from '../services/menuJpgService';

interface AdminMenuImagesTabProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const isImageFile = (f: File) => {
  return (
    (f.type && f.type.startsWith('image/')) ||
    /\.(jpe?g|png|webp|svg|heic|heif|bmp|gif)$/i.test(f.name)
  );
};

export const AdminMenuImagesTab: React.FC<AdminMenuImagesTabProps> = ({ onShowToast }) => {
  const [images, setImages] = useState<string[]>(DEFAULT_MENU_IMAGES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savingStatus, setSavingStatus] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<{ url: string; index: number } | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);
  const [isClearAllOpen, setIsClearAllOpen] = useState<boolean>(false);

  // Subscribe to real-time Firebase Firestore menu images
  useEffect(() => {
    const unsubscribe = subscribeToMenuImages((cloudImages) => {
      setImages(cloudImages);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Upload new images (append to list)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const imageFiles = files.filter(isImageFile);
    if (imageFiles.length === 0) {
      onShowToast('Pilih file gambar yang valid (JPG, PNG, WEBP).', 'error');
      return;
    }

    // Sort files logically if numbered (e.g. 1.jpg, 2.jpg)
    imageFiles.sort((a, b) => {
      const numA = a.name.match(/\d+/);
      const numB = b.name.match(/\d+/);
      if (numA && numB) return parseInt(numA[0], 10) - parseInt(numB[0], 10);
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    setIsSaving(true);
    setSavingStatus(`Mengompresi ${imageFiles.length} gambar menu...`);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        setSavingStatus(`Memproses gambar ${i + 1} dari ${imageFiles.length}...`);
        const dataUrl = await fileToDataUrl(imageFiles[i]);
        newUrls.push(dataUrl);
      }

      const updated = [...images, ...newUrls];
      setSavingStatus('Menyimpan ke Cloud Firestore...');
      await saveAllMenuImages(updated, (curr, total) => {
        setSavingStatus(`Menyimpan halaman ${curr} dari ${total} ke Cloud...`);
      });
      setImages(updated);
      onShowToast(`✓ Berhasil menambahkan ${newUrls.length} gambar ke database Cloud!`, 'success');
    } catch (err: any) {
      console.error(err);
      onShowToast(`Gagal menyimpan: ${err?.message || 'Periksa koneksi'}`, 'error');
    } finally {
      setIsSaving(false);
      setSavingStatus('');
      if (e.target) e.target.value = '';
    }
  };

  // Replace specific image
  const handleReplaceSpecific = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replacingIndex === null) return;
    const file = e.target.files?.[0];
    if (!file || !isImageFile(file)) {
      onShowToast('Pilih file gambar yang valid.', 'error');
      return;
    }

    setIsSaving(true);
    setSavingStatus('Mengompresi gambar pengganti...');
    try {
      const dataUrl = await fileToDataUrl(file);
      const updated = [...images];
      updated[replacingIndex] = dataUrl;
      setSavingStatus('Menyimpan pembaruan ke Cloud...');
      await saveAllMenuImages(updated, (curr, total) => {
        setSavingStatus(`Menyimpan halaman ${curr} dari ${total}...`);
      });
      setImages(updated);
      onShowToast(`✓ Gambar halaman ${replacingIndex + 1} berhasil diperbarui!`, 'success');
    } catch (err: any) {
      console.error(err);
      onShowToast(`Gagal memperbarui: ${err?.message || 'Periksa koneksi'}`, 'error');
    } finally {
      setIsSaving(false);
      setSavingStatus('');
      setReplacingIndex(null);
      if (e.target) e.target.value = '';
    }
  };

  // Move image up
  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;

    setIsSaving(true);
    setSavingStatus('Menyimpan urutan baru ke Cloud...');
    try {
      await saveAllMenuImages(updated);
      setImages(updated);
    } catch (err: any) {
      onShowToast(`Gagal menyimpan urutan: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsSaving(false);
      setSavingStatus('');
    }
  };

  // Move image down
  const handleMoveDown = async (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;

    setIsSaving(true);
    setSavingStatus('Menyimpan urutan baru ke Cloud...');
    try {
      await saveAllMenuImages(updated);
      setImages(updated);
    } catch (err: any) {
      onShowToast(`Gagal menyimpan urutan: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsSaving(false);
      setSavingStatus('');
    }
  };

  // Delete single image from Cloud & Local
  const executeDelete = async (index: number) => {
    setIsSaving(true);
    setSavingStatus('Menghapus halaman dari Cloud...');
    try {
      const updated = images.filter((_, idx) => idx !== index);
      await saveAllMenuImages(updated);
      setImages(updated);
      setDeleteTargetIndex(null);
      onShowToast(`Halaman ${index + 1} berhasil dihapus dari cloud.`, 'info');
    } catch (err: any) {
      console.error(err);
      onShowToast(`Gagal menghapus gambar: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsSaving(false);
      setSavingStatus('');
    }
  };

  // Delete all images from Cloud & Local
  const executeClearAll = async () => {
    setIsSaving(true);
    setSavingStatus('Menghapus semua halaman dari Cloud...');
    try {
      await saveAllMenuImages([]);
      setImages([]);
      setIsClearAllOpen(false);
      onShowToast('Semua gambar menu telah dihapus dari cloud.', 'info');
    } catch (err: any) {
      console.error(err);
      onShowToast(`Gagal membersihkan gambar: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsSaving(false);
      setSavingStatus('');
    }
  };

  // Manual save trigger to give complete control to the admin
  const handleManualSave = async () => {
    if (images.length === 0) {
      onShowToast('Belum ada gambar menu untuk disimpan.', 'info');
      return;
    }
    setIsSaving(true);
    setSavingStatus('Menyimpan semua halaman ke Cloud Firestore...');
    try {
      await saveAllMenuImages(images, (curr, total) => {
        setSavingStatus(`Sinkronisasi halaman ${curr} dari ${total}...`);
      });
      onShowToast(`✓ Berhasil! Semua ${images.length} halaman menu tersimpan aman di Cloud Firestore.`, 'success');
    } catch (err: any) {
      console.error(err);
      onShowToast(`Gagal menyimpan: ${err?.message || 'Periksa koneksi'}`, 'error');
    } finally {
      setIsSaving(false);
      setSavingStatus('');
    }
  };

  // Drag & drop upload handler
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files: File[] = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    if (files.length === 0) return;

    const imageFiles = files.filter(isImageFile);
    if (imageFiles.length === 0) return;

    setIsSaving(true);
    setSavingStatus(`Mengompresi ${imageFiles.length} gambar...`);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        setSavingStatus(`Memproses gambar ${i + 1} dari ${imageFiles.length}...`);
        const dataUrl = await fileToDataUrl(imageFiles[i]);
        newUrls.push(dataUrl);
      }
      const updated = [...images, ...newUrls];
      setSavingStatus('Menyimpan ke Cloud Firestore...');
      await saveAllMenuImages(updated, (curr, total) => {
        setSavingStatus(`Menyimpan halaman ${curr} dari ${total}...`);
      });
      setImages(updated);
      onShowToast(`✓ ${newUrls.length} gambar berhasil ditambahkan ke Cloud!`, 'success');
    } catch (err: any) {
      console.error(err);
      onShowToast(`Gagal mengunggah gambar: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsSaving(false);
      setSavingStatus('');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0E0E0E] text-white">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*,.jpg,.jpeg,.png,.webp"
        onChange={handleUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={replaceInputRef}
        accept="image/*,.jpg,.jpeg,.png,.webp"
        onChange={handleReplaceSpecific}
        className="hidden"
      />

      {/* Real-time Saving / Processing Banner */}
      {isSaving && (
        <div className="mb-4 p-3.5 rounded-xl bg-[#1F4D3A]/40 border border-[#2e7256] flex items-center gap-3 animate-pulse shadow-lg">
          <RefreshCw className="w-4 h-4 text-[#D9A35E] animate-spin shrink-0" />
          <div className="flex-1 text-xs text-stone-200">
            <span className="font-bold text-white mr-2">Sedang Memproses:</span>
            <span>{savingStatus || 'Menyimpan perubahan ke Firebase Firestore...'}</span>
          </div>
        </div>
      )}

      {/* Header & Status Card */}
      <div className="bg-[#181818] border border-white/10 rounded-2xl p-4 sm:p-5 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Kelola Gambar Buku Menu (Versi JPG)
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
              Cloud Synced
            </span>
          </div>
          <p className="text-xs text-stone-400 max-w-xl">
            Unggah dan atur foto halaman menu Anda di sini. Disimpan otomatis dan permanen ke Firebase Cloud Firestore untuk pengunjung website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {images.length > 0 && (
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9A35E] hover:bg-[#c48f4b] text-black text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 active:scale-95"
              title="Simpan ulang seluruh perubahan ke database Cloud"
            >
              <Save className="w-4 h-4" />
              <span>Simpan ke Cloud</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#28634c] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Upload className="w-4 h-4 text-[#D9A35E]" />
            <span>Unggah Gambar (JPG/PNG)</span>
          </button>

          {images.length > 0 && (
            <button
              onClick={() => setIsClearAllOpen(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              title="Hapus semua gambar dari database"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`mb-6 p-6 border-2 border-dashed rounded-2xl text-center transition-all ${
          isDragOver 
            ? 'border-[#D9A35E] bg-[#D9A35E]/10 ring-4 ring-[#D9A35E]/20' 
            : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}
      >
        <FolderUp className="w-8 h-8 text-[#D9A35E] mx-auto mb-2 opacity-80" />
        <p className="text-xs font-bold text-white mb-0.5">
          Tarik &amp; Lepas File Gambar (JPG / PNG) ke Sini
        </p>
        <p className="text-[11px] text-stone-400">
          Mendukung unggah satu atau banyak file foto sekaligus. Urutan nama file (1.jpg, 2.jpg) otomatis dirapikan.
        </p>
      </div>

      {/* Grid of Uploaded Images */}
      {images.length === 0 ? (
        <div className="bg-[#141414] border border-stone-800 rounded-2xl p-10 text-center">
          <ImageIcon className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">Belum Ada Gambar Menu</h3>
          <p className="text-xs text-stone-400 mb-4">
            Silakan klik tombol &quot;Unggah Gambar Menu&quot; di atas untuk menambahkan gambar menu.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-400 px-1">
            <span className="font-bold text-white">
              Daftar Halaman Menu ({images.length} Halaman Tersimpan di Cloud)
            </span>
            <span>Ubah urutan menggunakan tombol panah atas / bawah</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((imgUrl, index) => (
              <div 
                key={index} 
                className="group relative bg-[#181818] border border-white/10 hover:border-[#D9A35E] rounded-xl overflow-hidden shadow-lg transition-all flex flex-col"
              >
                {/* Header item */}
                <div className="px-3 py-2 bg-black/60 border-b border-white/5 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#D9A35E]">Halaman {index + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Geser ke atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === images.length - 1}
                      className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Geser ke bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Image preview */}
                <div 
                  onClick={() => setPreviewImage({ url: imgUrl, index })}
                  className="relative aspect-3/4 bg-black/80 flex items-center justify-center p-2 cursor-pointer overflow-hidden"
                >
                  <img
                    src={imgUrl}
                    alt={`Halaman ${index + 1}`}
                    className="w-full h-full object-contain rounded transition-transform duration-300 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-lg bg-black/80 text-white text-[11px] font-bold flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#D9A35E]" />
                      Lihat Detail
                    </span>
                  </div>
                </div>

                {/* Actions footer */}
                <div className="p-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => {
                      setReplacingIndex(index);
                      replaceInputRef.current?.click();
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-all cursor-pointer text-center"
                  >
                    Ganti Foto
                  </button>
                  <button
                    onClick={() => setDeleteTargetIndex(index)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-white transition-all cursor-pointer"
                    title="Hapus foto ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Single Page */}
      {deleteTargetIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteTargetIndex(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#181818] border border-stone-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Hapus Halaman {deleteTargetIndex + 1}?
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Foto halaman ini akan dihapus dari Cloud Firestore dan tidak akan tampil di buku menu. Halaman berikutnya akan otomatis menyesuaikan urutan.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetIndex(null)}
                disabled={isSaving}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => executeDelete(deleteTargetIndex)}
                disabled={isSaving}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isSaving ? 'Menghapus...' : 'Ya, Hapus'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete All Pages */}
      {isClearAllOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsClearAllOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#181818] border border-stone-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Hapus Semua Foto Menu?
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Seluruh {images.length} halaman foto akan dihapus dari Cloud database. Pengunjung akan melihat status menu sedang dipersiapkan.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full pt-2">
              <button
                type="button"
                onClick={() => setIsClearAllOpen(false)}
                disabled={isSaving}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeClearAll}
                disabled={isSaving}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isSaving ? 'Menghapus...' : 'Ya, Hapus Semua'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[90vh] bg-[#141414] border border-stone-800 rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="p-3 bg-black/70 border-b border-stone-800 flex items-center justify-between text-xs px-4">
              <span className="font-bold text-[#D9A35E]">
                Preview Halaman {previewImage.index + 1}
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-stone-300 text-xs cursor-pointer"
              >
                Tutup (ESC)
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-black/90 overflow-auto">
              <img
                src={previewImage.url}
                alt={`Preview Halaman ${previewImage.index + 1}`}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
