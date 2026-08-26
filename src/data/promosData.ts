import { PromoItem } from '../types';

export const PROMO_ITEMS: PromoItem[] = [
  {
    id: 'promo-siang-kenyang',
    code: 'SIANGKENYANG25',
    title: 'SIANG KENYANG',
    discountTag: '25% OFF',
    subtitle: 'DISKON ALL MENU 25% hanya di jam 12.00 - 15.00 WIB.',
    description: 'Makan siang kenyang dan puas di Arkanza Coffee & Roastery! Nikmati potongan 25% All Menu untuk menu pilihan terbaik: Sop Buntut, Capjay, Nasi Goreng Arkanza, Dimsum Mix, Matcha Biscoff, Kopi Rum Regal, dan Wedang Jangkruk.',
    validUntil: 'Setiap Hari (12.00 - 15.00 WIB)',
    badge: 'LUNCH SPECIAL',
    discountAmountText: 'Diskon 25% All Menu',
    applicableCategory: 'All Menu (12:00 - 15:00)',
    image: '/siang-kenyang.jpg',
    link: 'https://www.instagram.com/p/DcSW8MwlGGk/',
    terms: [
      'Hanya berlaku di jam 12.00 - 15.00 WIB.',
      'Minimal pembelian 200K (Rp200.000).',
      'Promo tidak bisa digabung dengan promo lain.',
      'Berlaku untuk Dine-in & Takeaway di Arkanza Coffee & Roastery.',
      'Tunjukkan kode voucher kepada kasir saat pemesanan.'
    ]
  },
  {
    id: 'promo-01',
    code: 'ARKANZA20',
    title: 'COFFEE TIME',
    discountTag: '20% OFF',
    subtitle: 'Nikmati diskon 20% untuk menu coffee pilihan.',
    description: 'Awali harimu dengan sentuhan kopi berkualitas tinggi dari Arkanza. Dapatkan potongan harga 20% untuk seluruh varian Classic Coffee & Signature Blend.',
    validUntil: '31 Agustus 2026',
    badge: 'LIMITED',
    discountAmountText: '20% Diskon',
    applicableCategory: 'Coffee & Signature',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    link: 'https://www.instagram.com/p/DcSW8MwlGGk/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==',
    terms: [
      'Berlaku untuk dine-in dan take-away di outlet Arkanza Coffee & Roastery.',
      'Minimum transaksi Rp50.000.',
      'Tunjukkan kode voucher kepada barista/kasir saat pemesanan.',
      'Tidak dapat digabungkan dengan promo bundling lainnya.'
    ]
  },
  {
    id: 'promo-02',
    code: 'ARKANZAB1G1',
    title: 'WEEKEND SPECIAL',
    discountTag: 'Buy 1 Get 1',
    subtitle: 'Promo spesial untuk kunjungan akhir pekan bersama teman & keluarga.',
    description: 'Habiskan waktu akhir pekanmu lebih seru! Beli 1 menu minuman pilihan apa saja dan dapatkan 1 Free Americano atau Iced Cafe Latte.',
    validUntil: 'Setiap Sabtu & Minggu',
    badge: 'WEEKEND SPECIAL',
    discountAmountText: 'Beli 1 Gratis 1 Minuman',
    applicableCategory: 'All Beverages',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    terms: [
      'Berlaku setiap hari Sabtu & Minggu (08.00 - 00.00 WIB).',
      'Free item berlaku untuk Americano atau Iced Cafe Latte (Regular size).',
      'Wajib menunjukkan kode voucher sebelum pembayaran.',
      'Maksimal 1 klaim per transaksi per meja.'
    ]
  },
  {
    id: 'promo-03',
    code: 'ARKANZA15K',
    title: 'COFFEE & SNACK',
    discountTag: 'Save 15K',
    subtitle: 'Dapatkan harga spesial untuk kombinasi coffee favorit dan snack lezat.',
    description: 'Bekerja atau santai jadi lebih nikmat dengan pairing sempurna. Hemat Rp15.000 setiap pembelian 1 Coffee pilihan bersama 1 menu Snack/Pastry.',
    validUntil: '31 Agustus 2026',
    badge: 'TODAY ONLY',
    discountAmountText: 'Potongan Rp15.000',
    applicableCategory: 'Coffee + Food Pairing',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    terms: [
      'Berlaku setiap hari untuk pembelian kombinasi 1 Beverage + 1 Snack/Pastry.',
      'Berlaku untuk menu Truffle Fries, Croissant, Cinnamon Roll, atau Garlic Chicken.',
      'Tunjukkan kode kupon saat memesan di kasir.',
      'Hanya berlaku di outlet Arkanza Coffee & Roastery.'
    ]
  }
];
