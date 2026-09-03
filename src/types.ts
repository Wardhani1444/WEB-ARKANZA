export type MenuCategory = 'All' | 'Coffee' | 'Non Coffee' | 'Signature' | 'Food & Snack' | 'Manual Brew';

export type MenuBadge = 'BEST SELLER' | 'NEW' | 'FAVORITE' | 'SIGNATURE' | 'SPECIALTY';

export interface MenuItem {
  id: string;
  name: string;
  category: 'Coffee' | 'Non Coffee' | 'Signature' | 'Food & Snack' | 'Manual Brew';
  price: number;
  description: string;
  image: string;
  badge?: MenuBadge;
  tastingNotes?: string[];
  ingredients?: string[];
  temperature?: 'Hot' | 'Iced' | 'Hot & Iced';
  roastOrigin?: string;
  isSpecialty?: boolean;
}

export interface PromoItem {
  id: string;
  code: string;
  title: string;
  discountTag: string;
  subtitle: string;
  description: string;
  validUntil: string;
  badge: string;
  image: string;
  terms: string[];
  discountAmountText: string;
  applicableCategory?: string;
  isCustom?: boolean;
  isActive?: boolean;
  link?: string;
}

export interface VoucherItem {
  id: string;
  code: string;
  discountTag: string;
  title: string;
  description: string;
  minPurchaseText: string;
  minPurchaseValue: number;
  validUntil: string;
  badge: 'LIMITED' | 'TODAY ONLY' | 'WEEKEND SPECIAL' | 'BEST DEAL' | 'SIGNATURE' | 'LUNCH SPECIAL' | string;
  terms: string[];
  iconName?: string;
  isActive?: boolean;
}

export interface VibePhoto {
  id: string;
  title: string;
  image: string;
  caption: string;
  category: 'Coffee' | 'Interior' | 'Barista' | 'Community' | 'Food';
  likes: number;
  comments: number;
  link?: string;
}

export interface CustomerData {
  name: string;
  phone: string;
  email?: string;
  socialMedia?: string;
  domicile?: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export interface HeroSettings {
  backgroundImage: string;
  tagline?: string;
  headlineMain?: string;
  headlineAccent?: string;
  subheadline?: string;
  overlayOpacity?: number; // 0.1 to 0.9 (e.g. 0.35 = 35% opacity)
  updatedAt?: string;
}

export interface FontSettings {
  headingFont: string; // e.g., 'Playfair Display', 'Cinzel', 'Montserrat', etc.
  bodyFont: string; // e.g., 'Plus Jakarta Sans', 'Inter', 'Lora', etc.
  headingCategory?: 'serif' | 'sans-serif' | 'display' | 'handwriting';
  bodyCategory?: 'sans-serif' | 'serif';
  presetId?: string;
  updatedAt?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  rating: number;
  comment: string;
  favoriteOrder?: string;
  date?: string;
  badge?: string;
  source?: 'Google Maps' | 'Instagram' | 'Direct Customer';
}

export interface FontPreset {
  id: string;
  name: string;
  tagline: string;
  headingFont: string;
  bodyFont: string;
  headingCategory: 'serif' | 'sans-serif' | 'display';
  bodyCategory: 'sans-serif' | 'serif';
  previewText?: string;
  badge?: string;
}

export interface BrandingSettings {
  logoUrl: string;
  brandName?: string;
  brandSubtitle?: string;
  logoShape?: 'rounded' | 'circle' | 'square';
  updatedAt?: string;
}

export interface LogoPreset {
  id: string;
  name: string;
  category: string;
  url: string;
  description?: string;
}
