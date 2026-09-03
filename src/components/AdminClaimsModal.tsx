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
  ExternalLink,
  Upload,
  UploadCloud,
  RotateCcw,
  Sliders,
  Type,
  Link as LinkIcon,
  Instagram,
  MapPin
} from 'lucide-react';
import { compressAndEncodeImage } from '../utils/imageUtils';
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
import { PromoItem, VibePhoto, HeroSettings } from '../types';
import { PROMO_ITEMS } from '../data/promosData';
import { generateInvoiceReportPdf } from '../services/pdfReportService';
import {
  subscribeToVibePhotos,
  updateVibePhotoInFirestore,
  resetSingleVibePhoto,
  PRESET_VIBE_SUGGESTIONS,
  getLocalVibePhotos
} from '../services/vibeService';
import {
  DEFAULT_HERO_SETTINGS,
  HERO_PRESET_BACKGROUNDS,
  getLocalHeroSettings,
  subscribeToHeroSettings,
  updateHeroSettingsInFirestore,
  resetHeroSettings,
  compressUploadedHeroImage,
  HeroPreset
} from '../services/heroService';
import { AdminFontManagerTab } from './AdminFontManagerTab';
import { AdminBrandingManagerTab } from './AdminBrandingManagerTab';
import arkanzaLogo from '../assets/arkanza-logo.jpg';

interface AdminClaimsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  customPromos?: PromoItem[];
  initialTab?: 'claims' | 'manage_promos' | 'manage_vibe' | 'manage_hero' | 'manage_fonts' | 'manage_branding';
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
  initialTab = 'claims'
}) => {
  // Navigation tabs in Admin: 'claims' | 'manage_promos' | 'manage_vibe' | 'manage_hero' | 'manage_fonts' | 'manage_branding'
  const [activeTab, setActiveTab] = useState<'claims' | 'manage_promos' | 'manage_vibe' | 'manage_hero' | 'manage_fonts' | 'manage_branding'>(initialTab);

  // Sync initialTab if changed from parent
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

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

  // Date Range Filter State for Claims & Invoice PDF
  const [datePreset, setDatePreset] = useState<'all' | 'today' | '7days' | '30days' | 'this_month' | 'custom'>('all');
  const [startDate, setStartDate] = useState<string>(''); // YYYY-MM-DD
  const [endDate, setEndDate] = useState<string>('');   // YYYY-MM-DD

  // Custom Promos & Disabled Promos State
  const [firestorePromos, setFirestorePromos] = useState<PromoItem[]>([]);
  const [disabledPromoIds, setDisabledPromoIds] = useState<string[]>(() => getLocalDisabledPromoIds());
  const [promoFilter, setPromoFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [togglingPromoId, setTogglingPromoId] = useState<string | null>(null);
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);
  const [showCreatePromoForm, setShowCreatePromoForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoItem | null>(null);
  const [deletingPromoId, setDeletingPromoId] = useState<string | null>(null);

  // VIBE PHOTOS STATE (Catch Our Vibe Gallery)
  const [vibePhotosList, setVibePhotosList] = useState<VibePhoto[]>(() => getLocalVibePhotos());
  const [editingVibePhoto, setEditingVibePhoto] = useState<VibePhoto | null>(null);
  const [vibePhotoTitle, setVibePhotoTitle] = useState('');
  const [vibePhotoCaption, setVibePhotoCaption] = useState('');
  const [vibePhotoCategory, setVibePhotoCategory] = useState<'Coffee' | 'Interior' | 'Barista' | 'Community' | 'Food'>('Coffee');
  const [vibePhotoImage, setVibePhotoImage] = useState('');
  const [vibePhotoLikes, setVibePhotoLikes] = useState<number>(350);
  const [vibePhotoComments, setVibePhotoComments] = useState<number>(24);
  const [isProcessingVibeImage, setIsProcessingVibeImage] = useState(false);
  const [isDraggingVibeFile, setIsDraggingVibeFile] = useState(false);
  const [isSavingVibePhoto, setIsSavingVibePhoto] = useState(false);
  const [isResettingVibeId, setIsResettingVibeId] = useState<string | null>(null);

  // HERO BACKGROUND SETTINGS STATE
  const [heroSettingsData, setHeroSettingsData] = useState<HeroSettings>(() => getLocalHeroSettings());
  const [heroBgUrl, setHeroBgUrl] = useState<string>(() => getLocalHeroSettings().backgroundImage);
  const [heroTagline, setHeroTagline] = useState<string>(() => getLocalHeroSettings().tagline || '');
  const [heroHeadlineMain, setHeroHeadlineMain] = useState<string>(() => getLocalHeroSettings().headlineMain || '');
  const [heroHeadlineAccent, setHeroHeadlineAccent] = useState<string>(() => getLocalHeroSettings().headlineAccent || '');
  const [heroSubheadline, setHeroSubheadline] = useState<string>(() => getLocalHeroSettings().subheadline || '');
  const [heroOverlayOpacity, setHeroOverlayOpacity] = useState<number>(() => getLocalHeroSettings().overlayOpacity ?? 0.35);
  const [heroCustomUrlInput, setHeroCustomUrlInput] = useState<string>('');
  const [isProcessingHeroImage, setIsProcessingHeroImage] = useState<boolean>(false);
  const [isSavingHero, setIsSavingHero] = useState<boolean>(false);
  const [isResettingHero, setIsResettingHero] = useState<boolean>(false);
  const [heroTabSubMode, setHeroTabSubMode] = useState<'preset' | 'upload' | 'url' | 'text'>('preset');

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
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [termsList, setTermsList] = useState<string[]>([
    'Tunjukkan kode voucher kepada kasir saat pemesanan di Arkanza Coffee.',
    'Minimum pembelian berlaku sesuai ketentuan.',
    'Berlaku untuk Dine-in & Takeaway.'
  ]);
  const [newTermInput, setNewTermInput] = useState('');

  // Real-time Firestore sync for Claims, Custom Promos, Vibe & Hero Settings
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

    // Realtime Firestore Listener for Vibe Photos
    const unsubscribeVibe = subscribeToVibePhotos((photos) => {
      setVibePhotosList(photos);
    });

    // Realtime Firestore Listener for Hero Settings
    const unsubscribeHero = subscribeToHeroSettings((settings) => {
      setHeroSettingsData(settings);
      setHeroBgUrl(settings.backgroundImage);
      setHeroTagline(settings.tagline || '');
      setHeroHeadlineMain(settings.headlineMain || '');
      setHeroHeadlineAccent(settings.headlineAccent || '');
      setHeroSubheadline(settings.subheadline || '');
      setHeroOverlayOpacity(settings.overlayOpacity ?? 0.35);
    });

    return () => {
      unsubscribeClaims();
      unsubscribePromos();
      unsubscribeDisabled();
      unsubscribeVibe();
      unsubscribeHero();
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

  // VIBE PHOTO HANDLERS
  const handleStartEditVibePhoto = (photo: VibePhoto) => {
    setEditingVibePhoto(photo);
    setVibePhotoTitle(photo.title);
    setVibePhotoCaption(photo.caption);
    setVibePhotoCategory(photo.category);
    setVibePhotoImage(photo.image);
    setVibePhotoLikes(photo.likes || 350);
    setVibePhotoComments(photo.comments || 24);
  };

  const handleVibeFileUploadProcess = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onShowToast('Mohon pilih file gambar yang valid (JPG, PNG, WebP)', 'error');
      return;
    }

    setIsProcessingVibeImage(true);
    try {
      const compressedDataUrl = await compressAndEncodeImage(file, 900, 900, 0.84);
      setVibePhotoImage(compressedDataUrl);
      onShowToast('Foto berhasil diunggah & dikompresi! Siap disimpan ke galeri.', 'success');
    } catch (err: any) {
      console.error('Error processing vibe image:', err);
      onShowToast(err.message || 'Gagal memproses file foto', 'error');
    } finally {
      setIsProcessingVibeImage(false);
      setIsDraggingVibeFile(false);
    }
  };

  const handleSaveVibePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVibePhoto) return;
    if (!vibePhotoImage.trim()) {
      onShowToast('Mohon sediakan foto atau pilih dari preset', 'error');
      return;
    }

    setIsSavingVibePhoto(true);
    try {
      const updated: VibePhoto = {
        ...editingVibePhoto,
        title: vibePhotoTitle.trim() || editingVibePhoto.title,
        caption: vibePhotoCaption.trim() || editingVibePhoto.caption,
        category: vibePhotoCategory,
        image: vibePhotoImage.trim(),
        likes: Number(vibePhotoLikes) || 350,
        comments: Number(vibePhotoComments) || 24,
      };

      await updateVibePhotoInFirestore(updated);
      onShowToast(`Foto "${updated.title}" berhasil diperbarui & tersimpan permanen!`, 'success');
      setEditingVibePhoto(null);
    } catch (err: any) {
      console.error('Failed to save vibe photo:', err);
      onShowToast('Gagal menyimpan foto ke database', 'error');
    } finally {
      setIsSavingVibePhoto(false);
    }
  };

  const handleResetVibePhoto = async (photoId: string) => {
    setIsResettingVibeId(photoId);
    try {
      await resetSingleVibePhoto(photoId);
      onShowToast('Foto berhasil dikembalikan ke tampilan awal bawaan', 'info');
      if (editingVibePhoto?.id === photoId) {
        setEditingVibePhoto(null);
      }
    } catch {
      onShowToast('Gagal mereset foto', 'error');
    } finally {
      setIsResettingVibeId(null);
    }
  };

  // Upload and compress image file from user device
  const handleFileUploadProcess = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onShowToast('Mohon pilih file gambar yang valid (JPG, PNG, WebP)', 'error');
      return;
    }

    setIsProcessingImage(true);
    try {
      // Compress to optimal web dimensions & quality under 150KB for reliable Firestore persistence
      const compressedDataUrl = await compressAndEncodeImage(file, 900, 900, 0.82);
      setCustomImageUrl(compressedDataUrl);
      setSelectedImageUrl('');
      onShowToast('Foto berhasil diunggah & dikompresi! Siap disimpan secara permanen.', 'success');
    } catch (err: any) {
      console.error('Error processing image:', err);
      onShowToast(err.message || 'Gagal memproses file foto', 'error');
    } finally {
      setIsProcessingImage(false);
      setIsDraggingFile(false);
    }
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

  // Handle Date Preset Selection
  const handleDatePresetChange = (preset: 'all' | 'today' | '7days' | '30days' | 'this_month' | 'custom') => {
    setDatePreset(preset);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const formatYMD = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'today') {
      const todayStr = formatYMD(now);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === '7days') {
      const past = new Date(now);
      past.setDate(past.getDate() - 6);
      setStartDate(formatYMD(past));
      setEndDate(formatYMD(now));
    } else if (preset === '30days') {
      const past = new Date(now);
      past.setDate(past.getDate() - 29);
      setStartDate(formatYMD(past));
      setEndDate(formatYMD(now));
    } else if (preset === 'this_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStartDate(formatYMD(firstDay));
      setEndDate(formatYMD(lastDay));
    }
  };

  // Human-readable date range label for UI and Invoice PDF
  const dateRangeLabel = useMemo(() => {
    if (!startDate && !endDate) return 'Semua Waktu';

    const formatDateID = (ymd: string) => {
      const [y, m, d] = ymd.split('-');
      if (!y || !m || !d) return ymd;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
    };

    if (startDate && endDate) {
      if (startDate === endDate) return formatDateID(startDate);
      return `${formatDateID(startDate)} - ${formatDateID(endDate)}`;
    }
    if (startDate) return `Sejak ${formatDateID(startDate)}`;
    if (endDate) return `Hingga ${formatDateID(endDate)}`;
    return 'Semua Waktu';
  }, [startDate, endDate]);

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

  // Filtered Claims (Status, Search query, and Date Range)
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      // 1. Status Filter
      const matchesStatus = statusFilter === 'all' ? true : claim.status === statusFilter;

      // 2. Search Query Filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        claim.customerName.toLowerCase().includes(q) ||
        claim.customerPhone.toLowerCase().includes(q) ||
        claim.promoCode.toLowerCase().includes(q) ||
        claim.promoTitle.toLowerCase().includes(q) ||
        (claim.customerSocialMedia && claim.customerSocialMedia.toLowerCase().includes(q)) ||
        (claim.customerDomicile && claim.customerDomicile.toLowerCase().includes(q)) ||
        (claim.customerEmail && claim.customerEmail.toLowerCase().includes(q));

      // 3. Date Range Filter
      let matchesDate = true;
      if (startDate || endDate) {
        if (!claim.claimedAt) {
          matchesDate = false;
        } else {
          const claimDate = new Date(claim.claimedAt);
          if (isNaN(claimDate.getTime())) {
            matchesDate = false;
          } else {
            if (startDate) {
              const start = new Date(`${startDate}T00:00:00`);
              if (claimDate < start) matchesDate = false;
            }
            if (endDate) {
              const end = new Date(`${endDate}T23:59:59.999`);
              if (claimDate > end) matchesDate = false;
            }
          }
        }
      }

      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [claims, statusFilter, searchQuery, startDate, endDate]);

  // Export to Invoice-style PDF Report with Date Range Filter
  const handleExportPDF = () => {
    if (claims.length === 0) {
      onShowToast('Belum ada data customer untuk diekspor ke PDF', 'info');
      return;
    }

    if (filteredClaims.length === 0) {
      onShowToast(`Tidak ada data klaim promo pada rentang waktu [${dateRangeLabel}] untuk diekspor ke PDF`, 'info');
      return;
    }

    try {
      generateInvoiceReportPdf(filteredClaims, {
        statusFilter,
        dateRangeLabel,
        generatedBy: 'Admin & Kasir Roastery'
      });
      onShowToast(`Laporan Invoice [${dateRangeLabel}] (${filteredClaims.length} data) berhasil diunduh sebagai PDF!`, 'success');
    } catch (err) {
      console.error('Error exporting PDF:', err);
      onShowToast('Gagal membuat dokumen PDF', 'error');
    }
  };

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
                  <span>Kelola Promo</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#A98262]/30 text-[#A98262]">
                    {PROMO_ITEMS.length + firestorePromos.length} Live
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('manage_vibe')}
                  className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'manage_vibe'
                      ? 'border-emerald-400 text-white'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Galeri Foto Vibe</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                    {vibePhotosList.length} Foto
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('manage_hero')}
                  className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'manage_hero'
                      ? 'border-amber-400 text-white'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Background &amp; Hero</span>
                </button>

                <button
                  onClick={() => setActiveTab('manage_branding')}
                  id="tab-btn-manage-branding"
                  className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'manage_branding'
                      ? 'border-rose-400 text-white'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span>Logo &amp; Brand</span>
                </button>

                <button
                  onClick={() => setActiveTab('manage_fonts')}
                  className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'manage_fonts'
                      ? 'border-purple-400 text-white'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Type className="w-4 h-4 text-purple-400" />
                  <span>Font &amp; Tipografi</span>
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
                        title={`Download Invoice PDF (${dateRangeLabel})`}
                      >
                        <FileText className="w-4 h-4 text-[#C5A880]" />
                        <span className="hidden sm:inline">Download Invoice PDF</span>
                        <span className="sm:hidden">PDF</span>
                        {filteredClaims.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-[#C5A880] text-black font-bold font-mono">
                            {filteredClaims.length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* DATE RANGE FILTER TOOLBAR */}
                  <div className="px-4 sm:px-5 py-2.5 bg-[#171717] border-b border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 text-xs">
                    {/* Presets */}
                    <div className="flex items-center flex-wrap gap-1.5">
                      <div className="flex items-center gap-1.5 text-gray-400 font-semibold mr-1 shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span className="text-[11px] uppercase tracking-wider text-[#A98262]">Rentang Waktu:</span>
                      </div>
                      <button
                        onClick={() => handleDatePresetChange('all')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          datePreset === 'all'
                            ? 'bg-[#C5A880] text-[#121212] shadow-xs'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                      >
                        Semua Waktu
                      </button>
                      <button
                        onClick={() => handleDatePresetChange('today')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          datePreset === 'today'
                            ? 'bg-[#C5A880] text-[#121212] shadow-xs'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                      >
                        Hari Ini
                      </button>
                      <button
                        onClick={() => handleDatePresetChange('7days')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          datePreset === '7days'
                            ? 'bg-[#C5A880] text-[#121212] shadow-xs'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                      >
                        7 Hari
                      </button>
                      <button
                        onClick={() => handleDatePresetChange('30days')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          datePreset === '30days'
                            ? 'bg-[#C5A880] text-[#121212] shadow-xs'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                      >
                        30 Hari
                      </button>
                      <button
                        onClick={() => handleDatePresetChange('this_month')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          datePreset === 'this_month'
                            ? 'bg-[#C5A880] text-[#121212] shadow-xs'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                      >
                        Bulan Ini
                      </button>
                    </div>

                    {/* Custom Date Range Picker & Reset */}
                    <div className="flex items-center flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 rounded-lg px-2.5 py-1">
                        <span className="text-[10px] text-gray-400 font-semibold">Dari:</span>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            setDatePreset('custom');
                          }}
                          className="bg-transparent text-[11px] text-white focus:outline-none [color-scheme:dark] cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 rounded-lg px-2.5 py-1">
                        <span className="text-[10px] text-gray-400 font-semibold">Sampai:</span>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            setDatePreset('custom');
                          }}
                          className="bg-transparent text-[11px] text-white focus:outline-none [color-scheme:dark] cursor-pointer"
                        />
                      </div>

                      {(startDate || endDate) && (
                        <button
                          onClick={() => handleDatePresetChange('all')}
                          className="px-2 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-[10px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                          title="Reset Rentang Waktu"
                        >
                          <X className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}

                      <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        <span>{dateRangeLabel}</span>
                        <span className="text-gray-400">({filteredClaims.length} klaim)</span>
                      </div>
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
                          {searchQuery || startDate || endDate
                            ? `Tidak ada data klaim yang cocok dengan filter aktif (${dateRangeLabel}${statusFilter !== 'all' ? `, status: ${statusFilter}` : ''}).`
                            : 'Belum ada customer yang mengklaim voucher saat ini. Data yang masuk akan otomatis tampil di sini secara real-time.'}
                        </p>
                        {(startDate || endDate || searchQuery || statusFilter !== 'all') && (
                          <button
                            onClick={() => {
                              handleDatePresetChange('all');
                              setSearchQuery('');
                              setStatusFilter('all');
                            }}
                            className="mt-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>Reset Semua Filter</span>
                          </button>
                        )}
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
                                          <div className="flex flex-col gap-0.5 mt-0.5">
                                            {claim.customerSocialMedia && (
                                              <span className="text-[10px] text-pink-400 font-normal flex items-center gap-1">
                                                <Instagram className="w-2.5 h-2.5 shrink-0" />
                                                <span className="truncate max-w-[130px]">{claim.customerSocialMedia}</span>
                                              </span>
                                            )}
                                            {claim.customerDomicile && (
                                              <span className="text-[10px] text-amber-300 font-normal flex items-center gap-1">
                                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                                <span className="truncate max-w-[130px]">{claim.customerDomicile}</span>
                                              </span>
                                            )}
                                            {!claim.customerSocialMedia && !claim.customerDomicile && claim.customerEmail && (
                                              <span className="block text-[10px] text-gray-500 font-normal">
                                                {claim.customerEmail}
                                              </span>
                                            )}
                                          </div>
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
                        <div className="space-y-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300">
                              Foto Banner Promo
                            </label>
                            {customImageUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomImageUrl('');
                                  setSelectedImageUrl(PRESET_PROMO_IMAGES[0].url);
                                }}
                                className="text-[10px] text-amber-300 hover:text-amber-200 underline font-medium cursor-pointer"
                              >
                                Gunakan Pilihan Preset
                              </button>
                            )}
                          </div>

                          {/* DRAG & DROP / FILE UPLOADER */}
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingFile(true);
                            }}
                            onDragLeave={() => setIsDraggingFile(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDraggingFile(false);
                              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                handleFileUploadProcess(e.dataTransfer.files[0]);
                              }
                            }}
                            className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                              isDraggingFile
                                ? 'border-[#25D366] bg-[#25D366]/10'
                                : customImageUrl
                                ? 'border-[#1F4D3A] bg-black/40'
                                : 'border-white/20 hover:border-white/40 bg-white/5'
                            }`}
                          >
                            <input
                              type="file"
                              id="promo-image-file-input"
                              accept="image/png, image/jpeg, image/webp, image/jpg"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleFileUploadProcess(e.target.files[0]);
                                }
                              }}
                            />

                            {isProcessingImage ? (
                              <div className="py-4 flex flex-col items-center justify-center gap-2">
                                <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                                <p className="text-xs text-amber-200 font-medium">Sedang mengompresi & menyiapkan foto untuk database...</p>
                              </div>
                            ) : customImageUrl ? (
                              <div className="flex flex-col sm:flex-row items-center gap-3">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/20 shrink-0 shadow-md">
                                  <img
                                    src={customImageUrl}
                                    alt="Preview Foto"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="text-left flex-1 space-y-1">
                                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                                    <Check className="w-3 h-3" /> Foto Siap Tersimpan Permanen
                                  </div>
                                  <p className="text-xs text-white font-semibold">Foto Kustom Aktif</p>
                                  <p className="text-[11px] text-gray-400">
                                    Foto otomatis tersimpan di database Firebase &amp; tidak akan hilang saat halaman di-refresh.
                                  </p>
                                  <div className="pt-1 flex gap-2">
                                    <label
                                      htmlFor="promo-image-file-input"
                                      className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-[11px] text-white font-medium cursor-pointer transition-colors"
                                    >
                                      Ganti Foto
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCustomImageUrl('');
                                        setSelectedImageUrl(PRESET_PROMO_IMAGES[0].url);
                                      }}
                                      className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-[11px] text-red-300 font-medium cursor-pointer"
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <label
                                htmlFor="promo-image-file-input"
                                className="cursor-pointer flex flex-col items-center justify-center py-2"
                              >
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 text-[#A98262]">
                                  <UploadCloud className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold text-white mb-0.5">
                                  Klik untuk Unggah Foto dari Perangkat (Galeri / File)
                                </p>
                                <p className="text-[11px] text-gray-400">
                                  atau tarik &amp; lepas (drag &amp; drop) file gambar di sini (JPG, PNG, WebP)
                                </p>
                              </label>
                            )}
                          </div>

                          {/* PRESET PROMO IMAGES */}
                          <div className="pt-1 space-y-1.5">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                              Atau Pilih dari Galeri Preset:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                              {PRESET_PROMO_IMAGES.map((preset) => {
                                const isSelected = selectedImageUrl === preset.url && !customImageUrl;
                                return (
                                  <div
                                    key={preset.name}
                                    onClick={() => {
                                      setSelectedImageUrl(preset.url);
                                      setCustomImageUrl('');
                                    }}
                                    className={`group relative h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                                      isSelected
                                        ? 'border-[#25D366] ring-2 ring-[#25D366]/40 scale-102'
                                        : 'border-white/10 hover:border-white/40 opacity-80 hover:opacity-100'
                                    }`}
                                  >
                                    <img
                                      src={preset.url}
                                      alt={preset.name}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-black/50 p-1 flex items-end">
                                      <span className="text-[9px] text-white font-medium line-clamp-1">
                                        {preset.name}
                                      </span>
                                    </div>
                                    {isSelected && (
                                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#25D366] text-black flex items-center justify-center font-bold text-[10px]">
                                        ✓
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Direct URL input fallback */}
                          <div className="pt-1">
                            <input
                              type="url"
                              value={customImageUrl.startsWith('data:image') ? '' : customImageUrl}
                              onChange={(e) => {
                                setCustomImageUrl(e.target.value);
                                if (e.target.value) setSelectedImageUrl('');
                              }}
                              placeholder="Atau tempel tautan URL gambar web langsung (https://...)"
                              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-[#25D366] focus:outline-none text-xs text-white placeholder-gray-500"
                            />
                            {customImageUrl.includes('instagram.com') && (
                              <p className="text-[10px] text-amber-300 flex items-center gap-1 leading-tight mt-1">
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

              {/* TAB 3: CATCH OUR VIBE (PHOTO GALLERY MANAGER) */}
              {activeTab === 'manage_vibe' && (
                <div className="flex flex-col flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                  {/* Top Intro Header */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1F4D3A]/40 via-[#1F4D3A]/20 to-transparent border border-[#1F4D3A]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Visual Stories Manager</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white font-serif italic">
                        Kelola Foto Galeri (Catch Our Vibe)
                      </h3>
                      <p className="text-xs text-gray-300 mt-0.5 max-w-2xl leading-relaxed">
                        Ubah foto galeri dengan mengunggah foto langsung dari galeri HP/laptop atau pilih dari koleksi preset estetik. Foto otomatis tersimpan permanen di cloud database.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-emerald-300 font-semibold">
                        6 Slot Foto Aktif
                      </span>
                    </div>
                  </div>

                  {/* FORM EDIT / GANTI FOTO (JIKA ADA FOTO YANG SEDANG DIEDIT) */}
                  {editingVibePhoto && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl bg-[#181818] border-2 border-emerald-500/50 shadow-2xl space-y-5"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#1F4D3A] text-white flex items-center justify-center font-bold text-xs">
                            <Pencil className="w-4 h-4 text-emerald-300" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">
                              Ganti Foto: {editingVibePhoto.title}
                            </h4>
                            <p className="text-[11px] text-gray-400">
                              Slot ID: {editingVibePhoto.id} &bull; Kategori: {editingVibePhoto.category}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setEditingVibePhoto(null)}
                          className="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>

                      <form onSubmit={handleSaveVibePhoto} className="space-y-4">
                        {/* File Upload Box */}
                        <div className="space-y-2">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300">
                            Pilih atau Unggah Foto Baru
                          </label>

                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingVibeFile(true);
                            }}
                            onDragLeave={() => setIsDraggingVibeFile(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDraggingVibeFile(false);
                              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                handleVibeFileUploadProcess(e.dataTransfer.files[0]);
                              }
                            }}
                            className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                              isDraggingVibeFile
                                ? 'border-emerald-400 bg-emerald-500/10'
                                : vibePhotoImage
                                ? 'border-[#1F4D3A] bg-black/40'
                                : 'border-white/20 hover:border-white/40 bg-white/5'
                            }`}
                          >
                            <input
                              type="file"
                              id="vibe-image-file-input"
                              accept="image/png, image/jpeg, image/webp, image/jpg"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleVibeFileUploadProcess(e.target.files[0]);
                                }
                              }}
                            />

                            {isProcessingVibeImage ? (
                              <div className="py-4 flex flex-col items-center justify-center gap-2">
                                <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                                <p className="text-xs text-emerald-200 font-medium">Sedang mengompresi &amp; menyiapkan foto galeri...</p>
                              </div>
                            ) : vibePhotoImage ? (
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-lg aspect-square bg-black">
                                  <img
                                    src={vibePhotoImage}
                                    alt="Preview Vibe"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="text-left flex-1 space-y-1.5">
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                                    <Check className="w-3 h-3" /> Foto Siap Digunakan
                                  </div>
                                  <p className="text-xs text-white font-semibold">Tampilan Foto Galeri Baru</p>
                                  <p className="text-[11px] text-gray-400">
                                    Foto otomatis tersimpan permanen di cloud Firestore.
                                  </p>
                                  <div className="pt-1 flex gap-2">
                                    <label
                                      htmlFor="vibe-image-file-input"
                                      className="px-3 py-1 rounded bg-white/15 hover:bg-white/25 text-xs text-white font-medium cursor-pointer transition-colors"
                                    >
                                      Ganti File Foto
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <label
                                htmlFor="vibe-image-file-input"
                                className="cursor-pointer flex flex-col items-center justify-center py-3"
                              >
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 text-emerald-400">
                                  <UploadCloud className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold text-white mb-0.5">
                                  Klik untuk Unggah Foto dari Perangkat (Galeri / Kamera)
                                </p>
                                <p className="text-[11px] text-gray-400">
                                  atau tarik &amp; lepas (drag &amp; drop) file gambar di sini (JPG, PNG, WebP)
                                </p>
                              </label>
                            )}
                          </div>
                        </div>

                        {/* Preset Suggestions */}
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Atau Pilih dari Preset Foto Estetik Arkanza:
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {PRESET_VIBE_SUGGESTIONS.map((preset) => {
                              const isSelected = vibePhotoImage === preset.url;
                              return (
                                <div
                                  key={preset.name}
                                  onClick={() => setVibePhotoImage(preset.url)}
                                  className={`group relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                                    isSelected
                                      ? 'border-emerald-400 ring-2 ring-emerald-400/40 scale-102'
                                      : 'border-white/10 hover:border-white/40 opacity-80 hover:opacity-100'
                                  }`}
                                >
                                  <img
                                    src={preset.url}
                                    alt={preset.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/60 p-1 flex items-end">
                                    <span className="text-[9px] text-white font-medium line-clamp-1">
                                      {preset.name}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-400 text-black flex items-center justify-center font-bold text-[9px]">
                                      ✓
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* URL direct link fallback */}
                        <div>
                          <input
                            type="url"
                            value={vibePhotoImage.startsWith('data:image') ? '' : vibePhotoImage}
                            onChange={(e) => setVibePhotoImage(e.target.value)}
                            placeholder="Atau masukkan tautan URL gambar eksternal (https://...)"
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-400 focus:outline-none text-xs text-white placeholder-gray-500"
                          />
                        </div>

                        {/* Form Fields: Title, Category, Caption, Likes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                              Judul Foto (Title)
                            </label>
                            <input
                              type="text"
                              value={vibePhotoTitle}
                              onChange={(e) => setVibePhotoTitle(e.target.value)}
                              placeholder="Contoh: Morning Dial-In & Latte Art"
                              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-400 focus:outline-none text-xs text-white"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                              Kategori
                            </label>
                            <select
                              value={vibePhotoCategory}
                              onChange={(e) => setVibePhotoCategory(e.target.value as any)}
                              className="w-full px-3 py-2 rounded-xl bg-[#222222] border border-white/15 focus:border-emerald-400 focus:outline-none text-xs text-white"
                            >
                              <option value="Coffee">Coffee (Racikan Kopi & Beans)</option>
                              <option value="Interior">Interior (Suasana & Workspace)</option>
                              <option value="Barista">Barista (Roastery & Craft)</option>
                              <option value="Food">Food (Pastry & Makanan)</option>
                              <option value="Community">Community (Nongkrong & Malam)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                            Caption Cerita (Teks Instagram)
                          </label>
                          <textarea
                            value={vibePhotoCaption}
                            onChange={(e) => setVibePhotoCaption(e.target.value)}
                            rows={2}
                            placeholder="Tuliskan cerita singkat tentang foto ini..."
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-400 focus:outline-none text-xs text-white"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                              Jumlah Likes
                            </label>
                            <input
                              type="number"
                              value={vibePhotoLikes}
                              onChange={(e) => setVibePhotoLikes(Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-400 focus:outline-none text-xs text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                              Jumlah Komentar
                            </label>
                            <input
                              type="number"
                              value={vibePhotoComments}
                              onChange={(e) => setVibePhotoComments(Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-400 focus:outline-none text-xs text-white font-mono"
                            />
                          </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            disabled={isSavingVibePhoto}
                            className="flex-1 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40"
                          >
                            {isSavingVibePhoto ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Menyimpan ke Cloud...</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                <span>Simpan Perubahan Foto</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingVibePhoto(null)}
                            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* 6 FOTO GRID CARDS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Daftar 6 Foto Galeri Catch Our Vibe
                      </h4>
                      <span className="text-[11px] text-[#A98262]">
                        Klik tombol &quot;Ganti Foto&quot; pada slot yang diinginkan
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vibePhotosList.map((photo, idx) => {
                        const isCurrentlyEditing = editingVibePhoto?.id === photo.id;
                        const isResetting = isResettingVibeId === photo.id;

                        return (
                          <div
                            key={photo.id}
                            className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                              isCurrentlyEditing
                                ? 'border-emerald-400 bg-emerald-950/20 ring-2 ring-emerald-500/30'
                                : 'border-white/10 bg-white/5 hover:border-white/25'
                            }`}
                          >
                            <div className="space-y-2.5">
                              {/* Thumbnail preview with category pill */}
                              <div className="relative aspect-video sm:aspect-square w-full rounded-xl overflow-hidden bg-black/60 border border-white/10">
                                <img
                                  src={photo.image}
                                  alt={photo.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80';
                                  }}
                                />
                                <div className="absolute top-2 left-2 flex gap-1.5">
                                  <span className="px-2 py-0.5 rounded-full bg-[#1F4D3A] text-white font-bold text-[9px] uppercase tracking-wider shadow">
                                    Slot #{idx + 1}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-emerald-300 font-semibold text-[9px] uppercase tracking-wider border border-white/15">
                                    {photo.category}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <h5 className="text-sm font-bold text-white leading-snug line-clamp-1">
                                  {photo.title}
                                </h5>
                                <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                                  {photo.caption}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-3 mt-2 border-t border-white/10 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleStartEditVibePhoto(photo)}
                                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                  isCurrentlyEditing
                                    ? 'bg-emerald-500 text-black shadow'
                                    : 'bg-[#1F4D3A] hover:bg-emerald-700 text-white shadow-sm'
                                }`}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Ganti Foto</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleResetVibePhoto(photo.id)}
                                disabled={isResetting}
                                className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white text-xs border border-white/10 transition-colors cursor-pointer"
                                title="Kembalikan ke foto awal"
                              >
                                {isResetting ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                                ) : (
                                  <RotateCcw className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: HERO BACKGROUND & HEADER SETTINGS */}
              {activeTab === 'manage_hero' && (
                <div className="flex flex-col flex-1 overflow-hidden">
                  {/* HERO TAB SUB-NAV / HEADER */}
                  <div className="p-4 sm:p-5 border-b border-white/10 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-400" />
                        Pengaturan Background &amp; Teks Hero Website
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Ganti gambar banner utama cafe, pilih preset estetik, sesuaikan headline atau kegelapan overlay.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm('Kembalikan background & teks Hero ke setelan awal Arkanza?')) return;
                          setIsResettingHero(true);
                          try {
                            const res = await resetHeroSettings();
                            setHeroBgUrl(res.backgroundImage);
                            setHeroTagline(res.tagline || '');
                            setHeroHeadlineMain(res.headlineMain || '');
                            setHeroHeadlineAccent(res.headlineAccent || '');
                            setHeroSubheadline(res.subheadline || '');
                            setHeroOverlayOpacity(res.overlayOpacity ?? 0.35);
                            onShowToast('Background Hero telah direset ke default', 'success');
                          } catch (e) {
                            console.error(e);
                          } finally {
                            setIsResettingHero(false);
                          }
                        }}
                        disabled={isResettingHero}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-rose-300 text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Default</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          setIsSavingHero(true);
                          try {
                            await updateHeroSettingsInFirestore({
                              backgroundImage: heroBgUrl,
                              tagline: heroTagline.trim(),
                              headlineMain: heroHeadlineMain.trim(),
                              headlineAccent: heroHeadlineAccent.trim(),
                              subheadline: heroSubheadline.trim(),
                              overlayOpacity: heroOverlayOpacity
                            });
                            onShowToast('✨ Background & Tampilan Hero berhasil disimpan ke server!', 'success');
                          } catch (e) {
                            console.error(e);
                            onShowToast('Gagal menyimpan ke server, tersimpan di cache lokal', 'error');
                          } finally {
                            setIsSavingHero(false);
                          }
                        }}
                        disabled={isSavingHero}
                        className="px-5 py-2 rounded-xl bg-[#1F4D3A] hover:bg-[#256149] text-white text-xs font-bold shadow-lg shadow-[#1F4D3A]/30 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isSavingHero ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                      </button>
                    </div>
                  </div>

                  {/* SCROLLABLE HERO SETTINGS BODY */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    {/* 1. Real-time Live Preview */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#A98262] flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          Pratinjau Langsung (Live Preview)
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Perubahan langsung terlihat sebelum disimpan
                        </span>
                      </div>

                      <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/15 bg-black flex items-center justify-center text-center shadow-2xl">
                        <img
                          src={heroBgUrl}
                          alt="Hero Live Preview"
                          className="absolute inset-0 w-full h-full object-cover object-center"
                        />

                        <div className="relative z-10 px-4 max-w-lg mx-auto pointer-events-none">
                          {heroTagline && (
                            <div className="inline-block mb-1.5 px-2.5 py-0.5 bg-[#1F4D3A] text-[10px] font-bold tracking-widest uppercase text-white rounded shadow">
                              {heroTagline}
                            </div>
                          )}
                          <h2 className="font-serif italic text-lg sm:text-2xl font-bold tracking-tight text-white leading-tight mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                            {heroHeadlineMain} <span className="text-[#A98262]">{heroHeadlineAccent}</span>
                          </h2>
                          <p className="text-[11px] text-gray-200 line-clamp-2 max-w-sm mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                            {heroSubheadline}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 2. Sub-tabs Selector */}
                    <div className="flex border-b border-white/10 gap-1 overflow-x-auto pb-0.5">
                      <button
                        type="button"
                        onClick={() => setHeroTabSubMode('preset')}
                        className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                          heroTabSubMode === 'preset'
                            ? 'bg-[#1F4D3A] text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Pilihan Preset Tema ({HERO_PRESET_BACKGROUNDS.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeroTabSubMode('upload')}
                        className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                          heroTabSubMode === 'upload'
                            ? 'bg-[#1F4D3A] text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload Foto Dari Perangkat
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeroTabSubMode('url')}
                        className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                          heroTabSubMode === 'url'
                            ? 'bg-[#1F4D3A] text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        Link URL Gambar
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeroTabSubMode('text')}
                        className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                          heroTabSubMode === 'text'
                            ? 'bg-[#1F4D3A] text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        Edit Teks &amp; Kegelapan
                      </button>
                    </div>

                    {/* SUBMODE 1: PRESET GRID */}
                    {heroTabSubMode === 'preset' && (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-400">
                          Klik salah satu foto preset di bawah untuk langsung mengganti background Hero:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {HERO_PRESET_BACKGROUNDS.map((preset) => {
                            const isSelected = heroBgUrl === preset.url;
                            return (
                              <div
                                key={preset.id}
                                onClick={() => {
                                  setHeroBgUrl(preset.url);
                                  onShowToast(`Preset "${preset.name}" dipilih`, 'info');
                                }}
                                className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 aspect-[4/3] ${
                                  isSelected
                                    ? 'border-amber-400 ring-2 ring-amber-400 scale-[1.02]'
                                    : 'border-white/10 hover:border-white/40'
                                }`}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                {isSelected && (
                                  <div className="absolute top-2 right-2 bg-amber-400 text-black p-1 rounded-full shadow-lg">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                )}

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

                    {/* SUBMODE 2: FILE UPLOAD */}
                    {heroTabSubMode === 'upload' && (
                      <div className="space-y-4">
                        <label
                          className="border-2 border-dashed border-white/20 hover:border-[#1F4D3A] bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 block"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#1F4D3A]/20 flex items-center justify-center text-[#F7F6F2]">
                            <Upload className="w-6 h-6 text-[#A98262]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">
                              Pilih Foto dari Galeri / Kamera / Komputer
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Format JPG, PNG, atau WebP. Otomatis dikompresi agar loading kilat.
                            </p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsProcessingHeroImage(true);
                              try {
                                const compressed = await compressUploadedHeroImage(file);
                                setHeroBgUrl(compressed);
                                onShowToast('Foto background berhasil dipasang!', 'success');
                              } catch (err) {
                                console.error(err);
                                onShowToast('Gagal memproses gambar', 'error');
                              } finally {
                                setIsProcessingHeroImage(false);
                              }
                            }}
                            className="hidden"
                          />
                          {isProcessingHeroImage && (
                            <p className="text-xs text-[#A98262] font-semibold animate-pulse">
                              Memproses gambar...
                            </p>
                          )}
                        </label>
                      </div>
                    )}

                    {/* SUBMODE 3: CUSTOM URL */}
                    {heroTabSubMode === 'url' && (
                      <div className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/10">
                        <label className="block text-xs font-semibold text-gray-300">
                          Masukkan URL Gambar Langsung:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={heroCustomUrlInput}
                            onChange={(e) => setHeroCustomUrlInput(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1F4D3A]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!heroCustomUrlInput.trim()) return;
                              setHeroBgUrl(heroCustomUrlInput.trim());
                              onShowToast('URL Background kustom diterapkan!', 'success');
                            }}
                            className="px-5 py-2.5 bg-[#1F4D3A] hover:bg-[#256149] text-white text-xs font-bold rounded-xl transition-all shadow"
                          >
                            Terapkan
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SUBMODE 4: TEXT & OPACITY */}
                    {heroTabSubMode === 'text' && (
                      <div className="space-y-4 bg-white/[0.02] p-4 rounded-xl border border-white/10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                              Tagline Atas
                            </label>
                            <input
                              type="text"
                              value={heroTagline}
                              onChange={(e) => setHeroTagline(e.target.value)}
                              className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#1F4D3A] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                              Tingkat Kegelapan Overlay ({(heroOverlayOpacity * 100).toFixed(0)}%)
                            </label>
                            <input
                              type="range"
                              min="0.10"
                              max="0.85"
                              step="0.05"
                              value={heroOverlayOpacity}
                              onChange={(e) => setHeroOverlayOpacity(parseFloat(e.target.value))}
                              className="w-full accent-amber-400 cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                              Headline Utama (Baris 1)
                            </label>
                            <input
                              type="text"
                              value={heroHeadlineMain}
                              onChange={(e) => setHeroHeadlineMain(e.target.value)}
                              className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#1F4D3A] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                              Headline Aksen Emas (Baris 2)
                            </label>
                            <input
                              type="text"
                              value={heroHeadlineAccent}
                              onChange={(e) => setHeroHeadlineAccent(e.target.value)}
                              className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#1F4D3A] focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                              Subheadline Deskripsi
                            </label>
                            <textarea
                              rows={2}
                              value={heroSubheadline}
                              onChange={(e) => setHeroSubheadline(e.target.value)}
                              className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#1F4D3A] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: LOGO & IDENTITAS BRAND */}
              {activeTab === 'manage_branding' && (
                <AdminBrandingManagerTab onShowToast={onShowToast} />
              )}

              {/* TAB 6: FONT & TIPOGRAFI WEBSITE */}
              {activeTab === 'manage_fonts' && (
                <AdminFontManagerTab onShowToast={onShowToast} />
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
                    : activeTab === 'manage_vibe'
                    ? `${vibePhotosList.length} Foto Galeri Tersimpan`
                    : activeTab === 'manage_hero'
                    ? `Background Hero Aktif`
                    : activeTab === 'manage_branding'
                    ? `Logo & Brand Identity Aktif`
                    : activeTab === 'manage_fonts'
                    ? `Tipografi Global Website Aktif`
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
