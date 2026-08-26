import { VoucherItem } from '../types';

export const VOUCHER_ITEMS: VoucherItem[] = [
  {
    id: 'voucher-siang-kenyang',
    code: 'SIANGKENYANG25',
    discountTag: '25% OFF',
    title: 'Diskon 25% All Menu Siang Kenyang',
    description: 'Potongan 25% untuk seluruh menu makanan & minuman khusus jam 12.00 - 15.00 WIB.',
    minPurchaseText: 'Min. purchase Rp200.000',
    minPurchaseValue: 200000,
    validUntil: 'Setiap Hari (12.00 - 15.00 WIB)',
    badge: 'LUNCH SPECIAL',
    terms: [
      'Gunakan kode SIANGKENYANG25 di meja kasir sebelum pembayaran.',
      'Hanya berlaku pada jam 12.00 - 15.00 WIB.',
      'Minimum transaksi Rp200.000.',
      'Promo tidak bisa digabungkan dengan promo lain.',
      'Berlaku untuk Dine-in & Takeaway di Arkanza Coffee & Roastery.'
    ]
  },
  {
    id: 'voucher-01',
    code: 'ARKANZA20',
    discountTag: '20% OFF',
    title: 'Untuk menu Coffee pilihan',
    description: 'Potongan harga 20% untuk semua varian espresso, latte, & signature coffee.',
    minPurchaseText: 'Min. purchase Rp50.000',
    minPurchaseValue: 50000,
    validUntil: '31 August 2026',
    badge: 'BEST DEAL',
    terms: [
      'Gunakan kode ARKANZA20 di meja kasir sebelum pembayaran.',
      'Minimum pembelian Rp50.000.',
      'Berlaku untuk dine-in & takeaway.',
      'Satu kali penggunaan per struk transaksi.'
    ]
  },
  {
    id: 'voucher-02',
    code: 'ARKANZAB1G1',
    discountTag: 'Buy 1 Get 1',
    title: 'Weekend Coffee Treat',
    description: 'Beli 1 signature drink, dapatkan gratis 1 Iced Americano atau Latte.',
    minPurchaseText: 'Berlaku Weekend (Sabtu & Minggu)',
    minPurchaseValue: 35000,
    validUntil: '31 August 2026',
    badge: 'WEEKEND SPECIAL',
    terms: [
      'Berlaku khusus hari Sabtu dan Minggu.',
      'Gratis 1 Americano atau Cafe Latte (Hot/Iced).',
      'Tunjukkan kode voucher kepada kasir sebelum struk dicetak.',
      'Tidak dapat diuangkan.'
    ]
  },
  {
    id: 'voucher-04',
    code: 'ARKANZA15K',
    discountTag: 'Rp15.000 OFF',
    title: 'Coffee & Snack Combo',
    description: 'Potongan langsung Rp15.000 untuk bundle coffee + snack favorit.',
    minPurchaseText: 'Min. purchase Rp45.000',
    minPurchaseValue: 45000,
    validUntil: 'Today Only (23.59 WIB)',
    badge: 'TODAY ONLY',
    terms: [
      'Potongan langsung Rp15.000 pada total tagihan kombo.',
      'Berlaku untuk paket 1 minuman + 1 makanan/snack.',
      'Tunjukkan kepada kasir saat pemesanan.',
      'Kuota harian terbatas.'
    ]
  }
];
