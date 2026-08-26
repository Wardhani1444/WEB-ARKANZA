import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Unlock,
  Users,
  Search,
  Download,
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCw,
  Tag,
  Phone,
  Mail,
  Calendar,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Plus,
  Trash2,
  Pencil,
  Image as ImageIcon,
  Check,
  ArrowRight,
  Coffee,
  Percent,
  Layers,
  FileText,
  ExternalLink
} from 'lucide-react';
import { StoredPromoClaim, subscribeToClaims, updateClaimStatus, getAllClaims } from '../services/promoClaimService';
import {
  addPromoToFirebase,
  updatePromoInFirebase,
  deletePromoFromFirebase,
  subscribeToCustomPromos,
  subscribeToDisabledPromoIds,
  getLocalDisabledPromoIds,
  togglePromoStatus,
  NewPromoInput
} from '../services/promoService';
import { PromoItem } from '../types';
import { PROMO_ITEMS } from '../data/promosData';
import { generateInvoiceReportPdf } from '../services/pdfReportService';
import arkanzaLogo from '../assets/arkanza-logo.jpg';

interface AdminClaimsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  customPromos?: PromoItem[];
}

// Preset photo options for quick visual selection
const PRESET_PROMO_IMAGES = [
  {
    name: 'Poster Siang Kenyang (25% OFF)',
    url: '/siang-kenyang.jpg',
  },
  {
    name: 'Espresso & Latte Art',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Iced Signature Coffee',
    url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Pastry & Butter Croissant',
    url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Cafe Ambience & Co-working',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Manual Brew V60',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  },
];

export const AdminClaimsModal: React.FC<AdminClaimsModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  // Navigation tabs in Admin
  const [activeTab, setActiveTab] = useState<'claims' | 'manage_promos'>('claims');

  // Authentication PIN state (Default: 1234)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Claims Data state
  const [claims, setClaims] = useState<StoredPromoClaim[]>([]);
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'redeemed'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Custom Promos & Disabled Promos State
  const [firestorePromos, setFirestorePromos] = useState<PromoItem[]>([]);
  const [disabledPromoIds, setDisabledPromoIds] = useState<string[]>(() => getLocalDisabledPromoIds());
  const [promoFilter, setPromoFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [togglingPromoId, setTogglingPromoId] = useState<string | null>(null);
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);
  const [showCreatePromoForm, setShowCreatePromoForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoItem | null>(null);
  const [deletingPromoId, setDeletingPromoId] = useState<string | null>(null);

  // New Promo Form Fields
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDiscountTag, setNewDiscountTag] = useState('25% OFF');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newValidUntil, setNewValidUntil] = useState('30 September 2026');
  const [newBadge, setNewBadge] = useState('PROMO SPESIAL');
  const [newDiscountAmountText, setNewDiscountAmountText] = useState('Diskon 25%');
  const [newApplicableCategory, setNewApplicableCategory] = useState('All Menu');
  const [selectedImageUrl, setSelectedImageUrl] = useState(PRESET_PROMO_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [termsList, setTermsList] = useState<string[]>([
    'Tunjukkan kode voucher kepada kasir saat pemesanan di Arkanza Coffee.',
    'Minimum pembelian berlaku sesuai ketentuan.',
    'Berlaku untuk Dine-in & Takeaway.'
  ]);
  const [newTermInput, setNewTermInput] = useState('');

  // Real-time Firestore sync for Claims, Custom Promos & Disabled Promos
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    setIsLoadingClaims(true);
    // Initial fetch of claims
    getAllClaims(200)
      .then((data) => {
        setClaims(data);
        setIsLoadingClaims(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoadingClaims(false);
      });

    // Realtime Firestore Listener for Claims
    const unsubscribeClaims = subscribeToClaims((updatedClaims) => {
      setClaims(updatedClaims);
      setIsLoadingClaims(false);
    });

    // Realtime Firestore Listener for Custom Promos
    const unsubscribePromos = subscribeToCustomPromos((updatedPromos) => {
      setFirestorePromos(updatedPromos);
    });

    // Realtime Firestore Listener for Disabled Promos
    const unsubscribeDisabled = subscribeToDisabledPromoIds((disabledIds) => {
      setDisabledPromoIds(disabledIds);
    });

    return () => {
      unsubscribeClaims();
      unsubscribePromos();
      unsubscribeDisabled();
    };
  }, [isOpen, isAuthenticated]);

  // Handle PIN Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '8166' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError(null);
      setPinInput('');
      onShowToast('Akses Kasir/Admin berhasil dibuka', 'success');
    } else {
      setPinError('PIN salah! Silakan coba lagi (PIN Default: 1234)');
    }
  };

  // Manual Refresh Claims
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const freshData = await getAllClaims(200);
      setClaims(freshData);
      onShowToast('Data klaim promo telah diperbarui', 'info');
    } catch {
      onShowToast('Gagal memuat ulang data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle Mark as Redeemed / Active
  const handleToggleRedeem = async (claim: StoredPromoClaim) => {
    const nextStatus = claim.status === 'active' ? 'redeemed' : 'active';
    setUpdatingId(claim.id);
    try {
      await updateClaimStatus(claim.id, nextStatus);
      onShowToast(
        nextStatus === 'redeemed'
          ? `Kupon ${claim.promoCode} an. ${claim.customerName} ditandai SUDAH DIGUNAKAN`
          : `Kupon ${claim.promoCode} diubah kembali menjadi AKTIF`,
        'success'
      );
    } catch {
      onShowToast('Gagal mengubah status kupon', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Add a term to termsList
  const handleAddTerm = () => {
    if (!newTermInput.trim()) return;
    setTermsList(prev => [...prev, newTermInput.trim()]);
    setNewTermInput('');
  };

  // Remove a term from termsList
  const handleRemoveTerm = (index: number) => {
    setTermsList(prev => prev.filter((_, i) => i !== index));
  };

  // Quick Preset Templates for Form
  const applyPresetTemplate = (type: 'siang_kenyang' | 'discount' | 'b1g1' | 'snack') => {
    if (type === 'siang_kenyang') {
      setNewTitle('SIANG KENYANG');
      setNewCode('SIANGKENYANG25');
      setNewDiscountTag('25% OFF');
      setNewSubtitle('DISKON ALL MENU 25% hanya di jam 12.00 - 15.00 WIB.');
      setNewDescription('Makan siang kenyang dan hemat di Arkanza Coffee & Roastery! Dapatkan potongan 25% All Menu untuk menu pilihan terbaik (Sop Buntut, Capjay, Nasi Goreng Arkanza, Dimsum Mix, Matcha Biscoff, Kopi Rum Regal, Wedang Jangkruk).');
      setNewDiscountAmountText('Diskon 25% All Menu');
      setNewBadge('LUNCH SPECIAL');
      setNewApplicableCategory('All Menu (12:00 - 15:00)');
      setNewValidUntil('Setiap Hari (12.00 - 15.00 WIB)');
      setSelectedImageUrl(PRESET_PROMO_IMAGES[0].url); // Poster Siang Kenyang
      setTermsList([
        'Hanya berlaku di jam 12.00 - 15.00 WIB.',
        'Minimal pembelian 200K (Rp200.000).',
        'Promo tidak bisa digabungkan dengan promo lain.',
        'Berlaku untuk Dine-in & Takeaway di Arkanza Coffee & Roastery.',
        'Tunjukkan kode voucher kepada kasir saat pemesanan.'
      ]);
    } else if (type === 'discount') {
      setNewTitle('PAYDAY COFFEE REWARD');
      setNewCode('PAYDAY30');
      setNewDiscountTag('30% OFF');
      setNewSubtitle('Diskon 30% all espresso and signature beverages.');
      setNewDescription('Nikmati kesegaran racikan kopi premium Arkanza dengan potongan 30% di hari gajian.');
      setNewDiscountAmountText('Diskon 30%');
      setNewBadge('PAYDAY DEAL');
      setNewApplicableCategory('Coffee & Signature');
      setSelectedImageUrl(PRESET_PROMO_IMAGES[1].url);
    } else if (type === 'b1g1') {
      setNewTitle('DOUBLE TREAT B1G1');
      setNewCode('ARKANZAB1G1');
      setNewDiscountTag('Buy 1 Get 1');
      setNewSubtitle('Beli 1 signature drink gratis 1 Iced Americano.');
      setNewDescription('Ajak teman atau pasangan menikmati sore bersama di Arkanza Roastery.');
      setNewDiscountAmountText('Beli 1 Gratis 1 Minuman');
      setNewBadge('WEEKEND SPECIAL');
      setNewApplicableCategory('All Beverages');
      setSelectedImageUrl(PRESET_PROMO_IMAGES[2].url);
    } else if (type === 'snack') {
      setNewTitle('FREE ARTISAN CROISSANT');
      setNewCode('FREESNACK');
      setNewDiscountTag('Free Pastry');
      setNewSubtitle('Gratis 1 Butter Croissant setiap pembelian 2 Coffee.');
      setNewDescription('Kombinasi sempurna kopi harum dan pastry renyah hangat khas Arkanza.');
      setNewDiscountAmountText('Gratis 1 Croissant');
      setNewBadge('EXCLUSIVE');
      setNewApplicableCategory('Coffee + Food Pairing');
      setSelectedImageUrl(PRESET_PROMO_IMAGES[3].url);
    }
  };

  // Start Editing Promo
  const handleStartEditPromo = (promo: PromoItem) => {
    setEditingPromo(promo);
    setNewTitle(promo.title || '');
    setNewCode(promo.code || '');
    setNewDiscountTag(promo.discountTag || '25% OFF');
    setNewSubtitle(promo.subtitle || '');
    setNewDescription(promo.description || '');
    setNewValidUntil(promo.validUntil || '30 September 2026');
    setNewBadge(promo.badge || 'PROMO SPESIAL');
    setNewDiscountAmountText(promo.discountAmountText || promo.discountTag || '');
    setNewApplicableCategory(promo.applicableCategory || 'All Menu');

    const isPreset = PRESET_PROMO_IMAGES.some(p => p.url === promo.image);
    if (isPreset) {
      setSelectedImageUrl(promo.image);
      setCustomImageUrl('');
    } else {
      setSelectedImageUrl('');
      setCustomImageUrl(promo.image || '');
    }

    setTermsList(promo.terms && promo.terms.length > 0 ? promo.terms : [
      'Tunjukkan kode voucher kepada barista/kasir saat pemesanan.',
      'Berlaku di Arkanza Coffee & Roastery.',
      'Tidak dapat digabungkan dengan promo lain kecuali disebutkan.'
    ]);

    setShowCreatePromoForm(true);
  };

  // Cancel Editing Promo
  const handleCancelEdit = () => {
    setEditingPromo(null);
    setNewTitle('');
    setNewCode('');
    setNewSubtitle('');
    setNewDescription('');
    setCustomImageUrl('');
    setSelectedImageUrl(PRESET_PROMO_IMAGES[0].url);
    setShowCreatePromoForm(false);
  };

  // Submit New or Updated Promo to Firebase
  const handleCreateOrUpdatePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) {
      onShowToast('Mohon isi Judul Promo dan Kode Kupon', 'error');
      return;
    }

    setIsCreatingPromo(true);

    try {
      const finalImage = customImageUrl.trim() || selectedImageUrl;

      const promoPayload: NewPromoInput = {
        title: newTitle.trim(),
        code: newCode.toUpperCase().trim(),
        discountTag: newDiscountTag.trim() || 'PROMO SPESIAL',
        subtitle: newSubtitle.trim() || newTitle.trim(),
        description: newDescription.trim() || `${newTitle.trim()} di Arkanza Coffee & Roastery.`,
        validUntil: newValidUntil.trim() || '30 September 2026',
        badge: newBadge.trim() || 'PROMO SPESIAL',
        image: finalImage,
        discountAmountText: newDiscountAmountText.trim() || newDiscountTag.trim(),
        applicableCategory: newApplicableCategory.trim() || 'All Menu',
        terms: termsList.length > 0 ? termsList : [
          'Tunjukkan kode voucher kepada barista/kasir saat pemesanan.',
          'Berlaku di Arkanza Coffee & Roastery.',
        ],
        isActive: editingPromo ? editingPromo.isActive : true
      };

      if (editingPromo) {
        if (editingPromo.isCustom) {
          await updatePromoInFirebase(editingPromo.id, promoPayload);
        } else {
          // System promo overridden: save as custom promo and disable default item ID
          await addPromoToFirebase(promoPayload);
          await togglePromoStatus(editingPromo.id, false, false);
        }
        onShowToast(`Promo ${promoPayload.code} berhasil diperbarui!`, 'success');
      } else {
        await addPromoToFirebase(promoPayload);
        onShowToast(`Promo ${promoPayload.code} berhasil disimpan dan langsung tayang di website!`, 'success');
      }

      // Reset form
      handleCancelEdit();
    } catch (err: any) {
      console.error('Error creating or updating promo:', err);
      onShowToast('Gagal menyimpan promo ke Firebase', 'error');
    } finally {
      setIsCreatingPromo(false);
    }
  };

  // Delete Custom or System Promo from Firebase
  const handleDeletePromo = async (promo: PromoItem) => {
    const promoCode = promo.code;
    const confirmMsg = `Yakin ingin menghapus promo "${promo.title || promoCode}" (${promoCode}) dari website?`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    setDeletingPromoId(promo.id);
    try {
      await deletePromoFromFirebase(promo.id, Boolean(promo.isCustom));
      if (editingPromo && editingPromo.id === promo.id) {
        handleCancelEdit();
      }
      onShowToast(`Promo ${promoCode} berhasil dihapus dari website`, 'success');
    } catch (err) {
      console.error(err);
      onShowToast('Gagal menghapus promo', 'error');
    } finally {
      setDeletingPromoId(null);
    }
  };

  // Toggle Promo Active / Inactive Status
  const handleTogglePromoActive = async (
    promoId: string,
    currentIsActive: boolean,
    isCustom: boolean,
    promoCode: string
  ) => {
    setTogglingPromoId(promoId);
    try {
      const nextStatus = !currentIsActive;
      await togglePromoStatus(promoId, nextStatus, isCustom);
      onShowToast(
        nextStatus
          ? `Promo "${promoCode}" telah DIAKTIFKAN kembali dan tayang di website!`
          : `Promo "${promoCode}" berhasil DI-NONAKTIFKAN (disembunyikan dari website).`,
        nextStatus ? 'success' : 'info'
      );
    } catch (err) {
      console.error(err);
      onShowToast('Gagal mengubah status aktif promo', 'error');
    } finally {
      setTogglingPromoId(null);
    }
  };

  // Helper for formatting date in CSV
  const formatCsvDateTime = (isoString?: string): string => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Helper for cell escaping in CSV
  const escapeCsvCell = (val: any): string => {
    if (val === null || val === undefined || val === '') return '""';
    const str = String(val).replace(/\r\n|\r|\n/g, ' ').trim();
    return `"${str.replace(/"/g, '""')}"`;
  };

  // Export to Invoice-style PDF Report
  const handleExportPDF = () => {
    if (claims.length === 0) {
      onShowToast('Belum ada data customer untuk diekspor ke PDF', 'info');
      return;
    }

    try {
      const dataToExport = filteredClaims.length > 0 ? filteredClaims : claims;
      generateInvoiceReportPdf(dataToExport, {
        statusFilter,
        generatedBy: 'Admin & Kasir Roastery'
      });
      onShowToast(`Laporan Rekapitulasi Invoice (${dataToExport.length} data) berhasil diunduh sebagai PDF!`, 'success');
    } catch (err) {
      console.error('Error exporting PDF:', err);
      onShowToast('Gagal membuat dokumen PDF', 'error');
    }
  };

  // Helper for WhatsApp Chat Click
  const getWhatsAppLink = (phone: string, name: string) => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }
    const text = encodeURIComponent(`Halo Kak ${name}, terima kasih telah mengklaim voucher promo di Arkanza Coffee & Roastery! Kami tunggu kehadirannya di cafe ya! ☕`);
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  // Filtered Claims
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesStatus = statusFilter === 'all' ? true : claim.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        claim.customerName.toLowerCase().includes(q) ||
        claim.customerPhone.toLowerCase().includes(q) ||
        claim.promoCode.toLowerCase().includes(q) ||
        claim.promoTitle.toLowerCase().includes(q) ||
        (claim.customerEmail && claim.customerEmail.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [claims, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = claims.length;
    const active = claims.filter((c) => c.status === 'active').length;
    const redeemed = claims.filter((c) => c.status === 'redeemed').length;
    const uniquePhones = new Set(claims.map((c) => c.customerPhone.trim())).size;
    return { total, active, redeemed, uniquePhones };
  }, [claims]);

  // Combined and Status-Filtered Promos for Admin Manager
  const allCatalogPromos = useMemo(() => {
    const customList = firestorePromos.map((p) => ({
      ...p,
      isCustom: true,
      isActive: p.isActive !== false && !disabledPromoIds.includes(p.id),
    }));
    const systemList = PROMO_ITEMS.map((p) => ({
      ...p,
      isCustom: false,
      isActive: !disabledPromoIds.includes(p.id),
    }));
    return [...customList, ...systemList];
  }, [firestorePromos, disabledPromoIds]);

  const filteredCatalogPromos = useMemo(() => {
    if (promoFilter === 'active') return allCatalogPromos.filter((p) => p.isActive);
    if (promoFilter === 'inactive') return allCatalogPromos.filter((p) => !p.isActive);
    return allCatalogPromos;
  }, [allCatalogPromos, promoFilter]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-5xl bg-[#121212] text-[#F7F6F2] rounded-2xl sm:rounded-3xl border border-[#1F4D3A] shadow-2xl z-10 overflow-hidden flex flex-col max-h-[94vh] my-auto"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#163A2C]/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-[#A98262]/60 overflow-hidden p-0.5 shadow-inner">
                <img
                  src={arkanzaLogo}
                  alt="Arkanza Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#A98262]">
                    STAFF &amp; KASIR PORTAL
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Firebase Cloud
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-none mt-0.5 font-serif italic">
                  Arkanza Admin &amp; Promo Manager
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  title="Kunci Panel"
                >
                  Kunci Akses
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                aria-label="Tutup Panel Kasir"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* VIEW 1: PIN AUTHENTICATION FORM */}
          {!isAuthenticated ? (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
              <div className="w-20 h-20 rounded-2xl bg-black border border-[#A98262]/60 overflow-hidden p-1 flex items-center justify-center mb-4 shadow-xl">
                <img
                  src={arkanzaLogo}
                  alt="Arkanza Official Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-1 font-serif">Masukkan PIN Kasir / Owner</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Panel ini memuat database customer dan fitur pengelolaan promo cafe. Masukkan PIN keamanan untuk mengakses.
              </p>

              {pinError && (
                <div className="w-full mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{pinError}</span>
                </div>
              )}

              <form onSubmit={handlePinSubmit} className="w-full space-y-4">
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Masukkan PIN (Default: 1234)"
                    maxLength={10}
                    autoFocus
                    className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest rounded-xl bg-white/5 border border-white/20 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] focus:outline-none text-white placeholder:text-gray-600 placeholder:text-xs placeholder:tracking-normal transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1F4D3A] hover:bg-[#163A2C] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#1F4D3A]/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Buka Panel Kasir</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#A98262]/80 pt-2">
                  💡 PIN Bawaan: <strong className="font-mono text-white">1234</strong>
                </p>
              </form>
            </div>
          ) : (
            /* VIEW 2: AUTHENTICATED DASHBOARD WITH TABS */
            <div className="flex flex-col flex-1 overflow-hidden">
              
              {/* TAB BAR (DATA CUSTOMER vs KELOLA PROMO) */}
              <div className="flex items-center gap-2 px-5 pt-3 border-b border-white/10 bg-[#161616] shrink-0">
                <button
                  onClick={() => setActiveTab('claims')}
                  className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'claims'
                      ? 'border-[#25D366] text-white'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4 text-[#25D366]" />
                  <span>Data Customer &amp; Klaim</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white">
                    {stats.total}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('manage_promos')}
                  className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'manage_promos'
                      ? 'border-[#A98262] text-white'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Tag className="w-4 h-4 text-[#A98262]" />
                  <span>Kelola &amp; Tambah Promo</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#A98262]/30 text-[#A98262]">
                    {PROMO_ITEMS.length + firestorePromos.length} Live
                  </span>
                </button>
              </div>

              {/* TAB 1: CLAIMS & CUSTOMER DATABASE */}
              {activeTab === 'claims' && (
                <div className="flex flex-col flex-1 overflow-hidden">
                  {/* TOP STATS CARDS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-4 sm:p-5 border-b border-white/10 bg-black/40 shrink-0">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between text-gray-400 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider">Total Klaim</span>
                        <Tag className="w-3.5 h-3.5 text-[#A98262]" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white font-mono">{stats.total}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                      <div className="flex items-center justify-between text-emerald-400 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider">Aktif (Belum Dipakai)</span>
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-emerald-300 font-mono">{stats.active}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30">
                      <div className="flex items-center justify-between text-blue-400 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider">Sudah Digunakan</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-300 font-mono">{stats.redeemed}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1F4D3A]/30 border border-[#1F4D3A]">
                      <div className="flex items-center justify-between text-emerald-400 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider">Database No. WA</span>
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white font-mono">{stats.uniquePhones} Kontak</div>
                    </div>
                  </div>

                  {/* SEARCH & CONTROLS TOOLBAR */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/10 shrink-0 bg-[#141414]">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nama pelanggan, nomor WhatsApp, atau kode kupon..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-xs text-white placeholder-gray-500"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
                      <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          statusFilter === 'all' ? 'bg-[#1F4D3A] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Semua ({stats.total})
                      </button>
                      <button
                        onClick={() => setStatusFilter('active')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          statusFilter === 'active' ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Aktif ({stats.active})
                      </button>
                      <button
                        onClick={() => setStatusFilter('redeemed')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          statusFilter === 'redeemed' ? 'bg-blue-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Selesai ({stats.redeemed})
                      </button>
                    </div>

                    {/* Actions: Refresh & Export PDF */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleManualRefresh}
                        disabled={isRefreshing}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                        title="Refresh Data dari Firestore"
                      >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#25D366]' : ''}`} />
                      </button>
                      <button
                        onClick={handleExportPDF}
                        className="px-3.5 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#16382a] text-white text-xs font-bold uppercase tracking-wider border border-[#C5A880]/50 transition-all flex items-center gap-2 shadow-lg shadow-black/40 hover:scale-[1.02] active:scale-95 cursor-pointer"
                        title="Download Dokumen Laporan / Invoice PDF"
                      >
                        <FileText className="w-4 h-4 text-[#C5A880]" />
                        <span className="hidden sm:inline">Download Invoice PDF</span>
                        <span className="sm:hidden">PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* TABLE AREA */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                    {isLoadingClaims ? (
                      <div className="py-16 text-center text-gray-400 flex flex-col items-center justify-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#25D366] mb-3" />
                        <p className="text-sm font-semibold">Menghubungkan ke database Firebase...</p>
                      </div>
                    ) : filteredClaims.length === 0 ? (
                      <div className="py-16 text-center text-gray-400 bg-white/5 rounded-2xl border border-white/10 p-6">
                        <Tag className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                        <h4 className="text-sm font-bold text-white mb-1">Tidak ada data klaim promo</h4>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto">
                          {searchQuery
                            ? 'Tidak ada data customer yang cocok dengan pencarian kata kunci di atas.'
                            : 'Belum ada customer yang mengklaim voucher saat ini. Data yang masuk akan otomatis tampil di sini secara real-time.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
                          <table className="w-full text-left text-xs text-gray-300">
                            <thead className="bg-white/5 text-[10px] uppercase font-bold text-[#A98262] tracking-wider border-b border-white/10">
                              <tr>
                                <th className="py-3 px-4">Nama Pelanggan</th>
                                <th className="py-3 px-4">Kontak WhatsApp</th>
                                <th className="py-3 px-4">Promo / Kupon</th>
                                <th className="py-3 px-4">Waktu Klaim</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Aksi Kasir</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {filteredClaims.map((claim) => {
                                const dateObj = new Date(claim.claimedAt);
                                const formattedDate = !isNaN(dateObj.getTime())
                                  ? dateObj.toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : claim.claimedAt;

                                return (
                                  <tr key={claim.id} className="hover:bg-white/5 transition-colors">
                                    {/* Nama */}
                                    <td className="py-3 px-4 font-semibold text-white">
                                      <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-[#1F4D3A] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                                          {claim.customerName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                          <span>{claim.customerName}</span>
                                          {claim.customerEmail && (
                                            <span className="block text-[10px] text-gray-500 font-normal">
                                              {claim.customerEmail}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </td>

                                    {/* WhatsApp */}
                                    <td className="py-3 px-4">
                                      <a
                                        href={getWhatsAppLink(claim.customerPhone, claim.customerName)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-medium transition-all group"
                                        title="Klik untuk chat WhatsApp ke customer"
                                      >
                                        <Phone className="w-3 h-3 text-[#25D366]" />
                                        <span>{claim.customerPhone}</span>
                                        <MessageSquare className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                                      </a>
                                    </td>

                                    {/* Promo Code & Title */}
                                    <td className="py-3 px-4">
                                      <div className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded inline-block text-[11px] border border-white/15">
                                        {claim.promoCode}
                                      </div>
                                      <div className="text-[11px] text-gray-400 truncate max-w-[200px] mt-0.5">
                                        {claim.discountTag} • {claim.promoTitle}
                                      </div>
                                    </td>

                                    {/* Tanggal */}
                                    <td className="py-3 px-4 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                                      {formattedDate}
                                    </td>

                                    {/* Status */}
                                    <td className="py-3 px-4">
                                      {claim.status === 'redeemed' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                          <CheckCircle2 className="w-3 h-3" />
                                          Sudah Digunakan
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                          <Clock className="w-3 h-3" />
                                          Aktif (Siap Pakai)
                                        </span>
                                      )}
                                    </td>

                                    {/* Aksi Button */}
                                    <td className="py-3 px-4 text-right">
                                      <button
                                        onClick={() => handleToggleRedeem(claim)}
                                        disabled={updatingId === claim.id}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                          claim.status === 'active'
                                            ? 'bg-[#1F4D3A] hover:bg-[#163A2C] text-white border border-[#25D366]/40 shadow-sm'
                                            : 'bg-white/10 hover:bg-white/20 text-gray-300'
                                        }`}
                                      >
                                        {updatingId === claim.id ? (
                                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        ) : claim.status === 'active' ? (
                                          'Tandai Terpakai'
                                        ) : (
                                          'Aktifkan Lagi'
                                        )}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card List View */}
                        <div className="md:hidden space-y-3">
                          {filteredClaims.map((claim) => {
                            const dateObj = new Date(claim.claimedAt);
                            const formattedDate = !isNaN(dateObj.getTime())
                              ? dateObj.toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : claim.claimedAt;

                            return (
                              <div
                                key={claim.id}
                                className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-bold text-white text-sm">{claim.customerName}</h4>
                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                                      <Calendar className="w-3 h-3 text-[#A98262]" />
                                      <span>{formattedDate}</span>
                                    </div>
                                  </div>
                                  {claim.status === 'redeemed' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                      Sudah Pakai
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      Aktif
                                    </span>
                                  )}
                                </div>

                                <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                                  <div>
                                    <span className="text-[10px] uppercase font-bold text-[#A98262] tracking-wider block">
                                      {claim.discountTag}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-white">{claim.promoCode}</span>
                                  </div>
                                  <span className="text-[11px] text-gray-400 text-right truncate max-w-[140px]">
                                    {claim.promoTitle}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between pt-1 gap-2">
                                  <a
                                    href={getWhatsAppLink(claim.customerPhone, claim.customerName)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5"
                                  >
                                    <Phone className="w-3 h-3 text-[#25D366]" />
                                    <span>{claim.customerPhone}</span>
                                  </a>

                                  <button
                                    onClick={() => handleToggleRedeem(claim)}
                                    disabled={updatingId === claim.id}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                                      claim.status === 'active'
                                        ? 'bg-[#1F4D3A] text-white border border-[#25D366]/40'
                                        : 'bg-white/10 text-gray-300'
                                    }`}
                                  >
                                    {updatingId === claim.id
                                      ? '...'
                                      : claim.status === 'active'
                                      ? 'Tandai Pakai'
                                      : 'Reset'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: MANAGE & ADD PROMOS */}
              {activeTab === 'manage_promos' && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                  
                  {/* Top Bar for Promos Tab */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div>
                      <h3 className="font-bold text-white text-base font-serif italic">
                        Katalog Promo &amp; Voucher Aktif
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Tambah promo baru, edit rincian diskon, atau hapus promo yang sudah tidak digunakan.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (showCreatePromoForm) {
                          handleCancelEdit();
                        } else {
                          setEditingPromo(null);
                          setShowCreatePromoForm(true);
                        }
                      }}
                      className={`px-4 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                        showCreatePromoForm
                          ? 'bg-white/10 hover:bg-white/20 text-gray-300'
                          : 'bg-[#1F4D3A] hover:bg-[#163A2C]'
                      }`}
                    >
                      {showCreatePromoForm ? (
                        <>
                          <X className="w-4 h-4 text-gray-400" />
                          <span>Tutup Formulir</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-[#A98262]" />
                          <span>+ Buat Promo Baru</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* CREATE / EDIT PROMO FORM */}
                  {showCreatePromoForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 sm:p-6 rounded-2xl bg-black/70 border shadow-2xl space-y-5 transition-all ${
                        editingPromo
                          ? 'border-amber-500/60 ring-2 ring-amber-500/20'
                          : 'border-[#A98262]/40'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          {editingPromo ? (
                            <Pencil className="w-5 h-5 text-amber-400" />
                          ) : (
                            <Sparkles className="w-5 h-5 text-[#A98262]" />
                          )}
                          <div>
                            <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                              {editingPromo ? 'Edit Data Promo' : 'Formulir Tambah Promo Baru'}
                              {editingPromo && (
                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs border border-amber-500/40">
                                  {editingPromo.code}
                                </span>
                              )}
                            </h4>
                            {editingPromo && (
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                Perubahan akan langsung disinkronkan ke database Firebase dan tayang di website.
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Quick Presets for New Promo */}
                        {!editingPromo ? (
                          <div className="flex items-center gap-1.5 text-xs flex-wrap">
                            <span className="text-gray-500 text-[10px] hidden sm:inline">Template:</span>
                            <button
                              type="button"
                              onClick={() => applyPresetTemplate('siang_kenyang')}
                              className="px-2.5 py-1 rounded bg-[#1F4D3A] hover:bg-[#163A2C] text-[11px] text-amber-300 font-bold border border-[#A98262]/40 cursor-pointer shadow-sm"
                            >
                              🌟 Siang Kenyang 25%
                            </button>
                            <button
                              type="button"
                              onClick={() => applyPresetTemplate('discount')}
                              className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-[11px] text-gray-300 cursor-pointer"
                            >
                              Diskon 30%
                            </button>
                            <button
                              type="button"
                              onClick={() => applyPresetTemplate('b1g1')}
                              className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-[11px] text-gray-300 cursor-pointer"
                            >
                              Buy 1 Get 1
                            </button>
                            <button
                              type="button"
                              onClick={() => applyPresetTemplate('snack')}
                              className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-[11px] text-gray-300 cursor-pointer"
                            >
                              Free Pastry
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-gray-300 font-medium cursor-pointer"
                          >
                            Batal Edit
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleCreateOrUpdatePromoSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Judul Promo */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                              Judul Promo *
                            </label>
                            <input
                              type="text"
                              value={newTitle}
                              onChange={(e) => setNewTitle(e.target.value)}
                              placeholder="Contoh: PAYDAY SPECIAL COFFEE"
                              required
                              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-xs text-white placeholder-gray-500"
                            />
                          </div>

                          {/* Kode Kupon */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                              Kode Kupon / Voucher (Auto Huruf Besar) *
                            </label>
                            <input
                              type="text"
                              value={newCode}
                              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                              placeholder="Contoh: ARKANZA30"
                              required
                              className="w-full px-3 py-2.5 font-mono font-bold rounded-xl bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-xs text-white placeholder-gray-500 uppercase"
                            />
                          </div>

                          {/* Tag Diskon */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                              Tag Diskon (Badge Utama) *
                            </label>
                            <input
                              type="text"
                              value={newDiscountTag}
                              onChange={(e) => setNewDiscountTag(e.target.value)}
                              placeholder="Contoh: 30% OFF / Buy 1 Get 1 / Free Pastry"
                              required
                              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-xs text-white placeholder-gray-500"
                            />
                          </div>

                          {/* Masa Berlaku */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                              Periode / Masa Berlaku *
                            </label>
                            <input
                              type="text"
                              value={newValidUntil}
                              onChange={(e) => setNewValidUntil(e.target.value)}
                              placeholder="Contoh: 30 September 2026 / Weekend Only"
                              required
                              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-xs text-white placeholder-gray-500"
                            />
                          </div>

                          {/* Label Badge */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                              Label Status Promo
                            </label>
                            <select
                              value={newBadge}
                              onChange={(e) => setNewBadge(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/15 focus:border-[#25D366] focus:outline-none text-xs text-white"
                            >
                              <option value="PROMO SPESIAL">PROMO SPESIAL</option>
                              <option value="PAYDAY DEAL">PAYDAY DEAL</option>
                              <option value="BEST DEAL">BEST DEAL</option>
                              <option value="WEEKEND SPECIAL">WEEKEND SPECIAL</option>
                              <option value="LIMITED">LIMITED</option>
                              <option value="TODAY ONLY">TODAY ONLY</option>
                              <option value="EXCLUSIVE">EXCLUSIVE</option>
                            </select>
                          </div>

                          {/* Kategori Menu */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                              Kategori Menu yang Berlaku
                            </label>
                            <input
                              type="text"
                              value={newApplicableCategory}
                              onChange={(e) => setNewApplicableCategory(e.target.value)}
                              placeholder="Contoh: All Menu / Espresso & Latte / Beverage"
                              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-xs text-white placeholder-gray-500"
                            />
                          </div>
                        </div>

                        {/* Subtitle / Ringkasan */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Ringkasan Promo (Subtitle)
                          </label>
                          <input
                            type="text"
                            value={newSubtitle}
                            onChange={(e) => setNewSubtitle(e.target.value)}
                            placeholder="Contoh: Nikmati potongan 30% untuk seluruh varian espresso & signature blend."
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-xs text-white placeholder-gray-500"
                          />
                        </div>

                        {/* Deskripsi Lengkap */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Deskripsi Lengkap Promo
                          </label>
                          <textarea
                            rows={2}
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Contoh: Awali harimu bersama racikan kopi istimewa Arkanza Coffee. Dapatkan penawaran spesial ini..."
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-xs text-white placeholder-gray-500 resize-none"
                          />
                        </div>

                        {/* Foto Banner Promo */}
                        <div className="space-y-2">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Pilih Foto Banner Promo
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {PRESET_PROMO_IMAGES.map((preset) => {
                              const isSelected = selectedImageUrl === preset.url && !customImageUrl;
                              return (
                                <div
                                  key={preset.name}
                                  onClick={() => {
                                    setSelectedImageUrl(preset.url);
                                    setCustomImageUrl('');
                                  }}
                                  className={`group relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                                    isSelected
                                      ? 'border-[#25D366] ring-2 ring-[#25D366]/40 scale-102'
                                      : 'border-white/10 hover:border-white/40'
                                  }`}
                                >
                                  <img
                                    src={preset.url}
                                    alt={preset.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-black/50 p-1 flex items-end">
                                    <span className="text-[10px] text-white font-medium line-clamp-1">
                                      {preset.name}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#25D366] text-black flex items-center justify-center font-bold text-xs">
                                      ✓
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="pt-1 space-y-1.5">
                            <input
                              type="url"
                              value={customImageUrl}
                              onChange={(e) => setCustomImageUrl(e.target.value)}
                              placeholder="Atau tempel URL gambar (https://...)"
                              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-xs text-white placeholder-gray-500"
                            />
                            {customImageUrl.includes('instagram.com') && (
                              <p className="text-[10px] text-amber-300 flex items-center gap-1 leading-tight">
                                ℹ️ Tautan Instagram akan otomatis disimpan sebagai tautan promo dan dipasangkan dengan foto kopi berkualitas tinggi.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Syarat & Ketentuan */}
                        <div className="space-y-2">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Syarat &amp; Ketentuan Promo
                          </label>
                          <div className="space-y-1.5">
                            {termsList.map((term, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/5 text-xs text-gray-300">
                                <span className="flex-1">• {term}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTerm(idx)}
                                  className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2 pt-1">
                            <input
                              type="text"
                              value={newTermInput}
                              onChange={(e) => setNewTermInput(e.target.value)}
                              placeholder="Tambah poin syarat & ketentuan baru..."
                              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-xs text-white placeholder-gray-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTerm();
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleAddTerm}
                              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white cursor-pointer"
                            >
                              + Tambah
                            </button>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3 flex gap-3">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            disabled={isCreatingPromo}
                            className={`flex-2 py-3 rounded-xl disabled:bg-gray-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                              editingPromo
                                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40'
                                : 'bg-[#1F4D3A] hover:bg-[#163A2C] shadow-[#1F4D3A]/40'
                            }`}
                          >
                            {isCreatingPromo ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                                <span>{editingPromo ? 'Menyimpan Perubahan...' : 'Menyimpan ke Firebase...'}</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 text-white" />
                                <span>{editingPromo ? 'Simpan Perubahan Promo' : 'Simpan & Publikasikan ke Website'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* ACTIVE & INACTIVE PROMOS LIST */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#A98262] flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          <span>Daftar Promo Website ({allCatalogPromos.length})</span>
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Gunakan tombol <span className="text-amber-300 font-semibold">Edit</span> untuk mengubah isi promo, atau <span className="text-red-400 font-semibold">Hapus</span> untuk menghapusnya dari website.
                        </p>
                      </div>

                      {/* Filter Buttons */}
                      <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                        <button
                          type="button"
                          onClick={() => setPromoFilter('all')}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                            promoFilter === 'all'
                              ? 'bg-[#1F4D3A] text-white shadow'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Semua ({allCatalogPromos.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPromoFilter('active')}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                            promoFilter === 'active'
                              ? 'bg-emerald-600 text-white shadow'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Aktif ({allCatalogPromos.filter(p => p.isActive).length})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPromoFilter('inactive')}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                            promoFilter === 'inactive'
                              ? 'bg-red-600 text-white shadow'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-red-400"></span>
                          <span>Nonaktif ({allCatalogPromos.filter(p => !p.isActive).length})</span>
                        </button>
                      </div>
                    </div>

                    {filteredCatalogPromos.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-gray-400 text-xs">
                        Tidak ada promo pada kategori <span className="font-bold text-white capitalize">{promoFilter}</span>.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCatalogPromos.map((promo) => {
                          const isToggling = togglingPromoId === promo.id;
                          const isCurrentlyEdited = editingPromo?.id === promo.id;
                          const isDeleting = deletingPromoId === promo.id;

                          return (
                            <div
                              key={promo.id}
                              className={`relative rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg transition-all duration-300 ${
                                isCurrentlyEdited
                                  ? 'bg-black/90 border-2 border-amber-400 ring-2 ring-amber-400/40 scale-[1.01]'
                                  : promo.isActive
                                  ? promo.isCustom
                                    ? 'bg-black/70 border border-[#25D366]/40'
                                    : 'bg-[#151a17] border border-[#1F4D3A]'
                                  : 'bg-black/40 border border-red-500/30 opacity-75 ring-1 ring-red-500/20'
                              }`}
                            >
                              <div className="relative h-32 bg-gray-900 overflow-hidden">
                                <img
                                  src={promo.image}
                                  alt={promo.title}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80';
                                  }}
                                  className={`w-full h-full object-cover transition-transform duration-500 ${
                                    promo.isActive ? 'hover:scale-105' : 'grayscale contrast-75 opacity-60'
                                  }`}
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                
                                {/* Badge Source & Status */}
                                <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                                  {isCurrentlyEdited && (
                                    <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-extrabold text-[9px] uppercase tracking-wider shadow">
                                      Sedang Diedit
                                    </span>
                                  )}

                                  {promo.isCustom ? (
                                    <span className="px-2 py-0.5 rounded bg-emerald-700/90 text-white font-bold text-[9px] uppercase tracking-wider shadow">
                                      Custom Cloud
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-white/20 text-white font-bold text-[9px] uppercase tracking-wider backdrop-blur-xs">
                                      Bawaan Sistem
                                    </span>
                                  )}

                                  {promo.isActive ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-black font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow">
                                      <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                                      Tayang
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow">
                                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                      Nonaktif
                                    </span>
                                  )}
                                </div>

                                <div className="absolute bottom-2 left-2 font-mono font-bold text-white text-xs bg-black/85 px-2 py-0.5 rounded border border-white/20">
                                  {promo.code}
                                </div>
                              </div>

                              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                                <div>
                                  <div className="flex items-center justify-between text-[10px] text-[#A98262] font-bold">
                                    <span>{promo.badge}</span>
                                    <span>{promo.validUntil}</span>
                                  </div>
                                  <h5 className={`font-bold text-xs leading-snug mt-0.5 ${promo.isActive ? 'text-white' : 'text-gray-300'}`}>
                                    {promo.discountTag} — {promo.title}
                                  </h5>
                                  <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                                    {promo.subtitle || promo.description}
                                  </p>
                                </div>

                                {/* Action Buttons: Toggle, Edit, and Delete */}
                                <div className="pt-2 border-t border-white/10 space-y-2">
                                  <div className="flex items-center gap-2">
                                    {/* Toggle Active / Inactive Button */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleTogglePromoActive(
                                          promo.id,
                                          promo.isActive,
                                          Boolean(promo.isCustom),
                                          promo.code
                                        )
                                      }
                                      disabled={isToggling}
                                      className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                                        promo.isActive
                                          ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-500/40 hover:border-amber-400'
                                          : 'bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-emerald-900/40 shadow'
                                      }`}
                                      title={promo.isActive ? 'Sembunyikan promo dari website' : 'Tampilkan kembali di website'}
                                    >
                                      {isToggling ? (
                                        <>
                                          <RefreshCw className="w-3 h-3 animate-spin" />
                                          <span>Proses...</span>
                                        </>
                                      ) : promo.isActive ? (
                                        <>
                                          <EyeOff className="w-3.5 h-3.5 text-amber-300" />
                                          <span>Nonaktifkan</span>
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="w-3.5 h-3.5 text-white" />
                                          <span>Aktifkan</span>
                                        </>
                                      )}
                                    </button>

                                    {/* Edit Promo Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditPromo(promo)}
                                      className={`py-1.5 px-3 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                                        isCurrentlyEdited
                                          ? 'bg-amber-500 text-black border-amber-400 font-bold'
                                          : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-amber-400/60'
                                      }`}
                                      title="Edit rincian data promo ini"
                                    >
                                      <Pencil className="w-3.5 h-3.5 text-amber-300" />
                                      <span>Edit</span>
                                    </button>

                                    {/* Delete Promo Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleDeletePromo(promo)}
                                      disabled={isDeleting}
                                      className="py-1.5 px-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                                      title="Hapus promo dari website"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                      <span>{isDeleting ? '...' : 'Hapus'}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* FOOTER BAR */}
              <div className="px-5 py-3 border-t border-white/10 bg-black/60 flex items-center justify-between text-xs text-gray-400 shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Database Cloud Firestore Tersinkronisasi Otomatis</span>
                  <span className="sm:hidden">Firebase Synced</span>
                </div>
                <div className="font-mono text-[11px] text-[#A98262]">
                  {activeTab === 'claims'
                    ? `Total: ${filteredClaims.length} Klaim Ditampilkan`
                    : `${allCatalogPromos.filter(p => p.isActive).length} Tayang di Web (${allCatalogPromos.length} Total Promo)`}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
