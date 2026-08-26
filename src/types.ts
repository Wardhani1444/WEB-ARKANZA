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
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}
