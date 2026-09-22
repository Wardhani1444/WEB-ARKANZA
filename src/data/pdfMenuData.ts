export interface MenuBookPage {
  pageNumber: number;
  category: string;
  title: string;
  subtitle?: string;
  theme: 'emerald' | 'coffee' | 'cream' | 'pink' | 'matcha' | 'milk' | 'sky' | 'indigo' | 'tea' | 'herbal' | 'juice' | 'snack' | 'dimsum' | 'burger' | 'pasta' | 'salad' | 'katsu' | 'ricebowl' | 'meat' | 'nasgor' | 'chinese' | 'meeting' | 'night';
  items?: {
    name: string;
    price: string;
    description?: string;
    badge?: string;
  }[];
  notes?: string[];
  benefits?: string[];
  contactInfo?: {
    phone?: string;
    instagram?: string;
    tiktok?: string;
    address?: string;
    hoursWeekday?: string;
    hoursWeekend?: string;
  };
  imageType?: 'cover' | 'collage' | 'coffee-beans' | 'milk-pour' | 'matcha-art' | 'tea-pot' | 'room-robusta' | 'room-arabica' | 'events' | 'service' | 'building';
}

export const MENU_BOOK_SECTIONS = [
  { name: 'Cover & Galeri', startPage: 1, endPage: 2 },
  { name: 'Classic Coffee & Espresso', startPage: 3, endPage: 5 },
  { name: 'Signature Drinks', startPage: 6, endPage: 7 },
  { name: 'Matcha Series', startPage: 8, endPage: 9 },
  { name: 'Milk Based', startPage: 10, endPage: 12 },
  { name: 'Cloud Series', startPage: 13, endPage: 13 },
  { name: 'Mocktail', startPage: 14, endPage: 14 },
  { name: 'Tea & Tea Series', startPage: 15, endPage: 16 },
  { name: 'Herbal Healthy & Tradisional', startPage: 17, endPage: 18 },
  { name: 'Healthy Juice', startPage: 19, endPage: 20 },
  { name: 'Simple Snacks & Pastry', startPage: 21, endPage: 24 },
  { name: 'Dimsum Five Star', startPage: 25, endPage: 26 },
  { name: 'Beef Burger & Pasta', startPage: 27, endPage: 29 },
  { name: 'Chicken Katsu & Rice Bowl', startPage: 30, endPage: 31 },
  { name: 'Main Course & Iga Mania', startPage: 32, endPage: 34 },
  { name: 'Nasi Goreng Sukodono Asli', startPage: 35, endPage: 36 },
  { name: 'Chinese Food', startPage: 37, endPage: 39 },
  { name: 'Meeting Room Package', startPage: 40, endPage: 45 },
  { name: 'Kontak & Lokasi', startPage: 46, endPage: 47 }
];

export const MENU_BOOK_PAGES: MenuBookPage[] = [
  // Page 1
  {
    pageNumber: 1,
    category: 'Cover',
    title: 'MENU',
    subtitle: 'Happiness for all!',
    theme: 'emerald',
    imageType: 'cover'
  },
  // Page 2
  {
    pageNumber: 2,
    category: 'Photo Gallery',
    title: 'Happiness for all!',
    subtitle: 'Moments at Arkanza Coffee & Roastery',
    theme: 'coffee',
    imageType: 'collage'
  },
  // Page 3
  {
    pageNumber: 3,
    category: 'Coffee',
    title: 'Classic COFFEE',
    subtitle: 'Selected Specialty Coffee Beans Freshly Roasted in Our Roastery',
    theme: 'coffee',
    imageType: 'coffee-beans'
  },
  // Page 4
  {
    pageNumber: 4,
    category: 'Coffee',
    title: 'ESPRESSO BASED',
    theme: 'cream',
    items: [
      { name: 'Espresso', price: '20k', description: 'Satu shot ekstrasi kopi, air dan biskuit' },
      { name: 'Ice Americano', price: '23k', description: 'Dua shot kopi & es batu' },
      { name: 'Mochaccino', price: '28k', description: 'Satu shot Espresso, bubuk coklat, susu steam, foam susu dan biskuit' },
      { name: 'Hot Americano', price: '20k', description: 'Satu shot kopi dan air panas, biskuit' }
    ]
  },
  // Page 5
  {
    pageNumber: 5,
    category: 'Coffee',
    title: 'ESPRESSO BASED',
    theme: 'cream',
    items: [
      { name: 'Caffe Latte', price: '27k', description: 'Satu shot Espresso, susu steam, foam susu tipis dan biskuit' },
      { name: 'Cappuccino', price: '27k', description: 'Satu shot Espresso, susu steam, foam susu dan biskuit' },
      { name: 'Ristretto', price: '20k', description: 'Satu shot ekstrasi kopi dengan waktu dan air lebih sedikit dari Espresso, air, dan biskuit' }
    ]
  },
  // Page 6
  {
    pageNumber: 6,
    category: 'Signature',
    title: 'SIGNATURE DRINKS',
    theme: 'pink',
    items: [
      { name: 'Vanilla Latte', price: '25k', description: 'Espresso, Susu, dan Vanilla Syrup' },
      { name: 'Caramel Latte', price: '25k', description: 'Espresso, Susu, dan Caramel Syrup' },
      { name: 'Arunika Latte', price: '27k', description: 'Espresso, Gula Aren, Steam Milk dan Foam Susu' },
      { name: 'Hazelnut Latte', price: '25k', description: 'Espresso, Susu, dan Hazelnut Syrup' }
    ]
  },
  // Page 7
  {
    pageNumber: 7,
    category: 'Signature',
    title: 'SIGNATURE DRINKS',
    theme: 'pink',
    items: [
      { name: 'Americano Peach', price: '22k', description: 'Perpaduan kesegaran sirup peach dan espresso' },
      { name: 'Americano Orange', price: '27k', description: 'Espresso dan Orange juice' },
      { name: 'Americano Coconut', price: '27k', description: 'Espresso dan Air Kelapa' },
      { name: 'Kopi Susu Biscoff', price: '25k', description: 'Espresso, Selai Biscoff, Steam Milk, dan Biscoff Crumb' },
      { name: 'Caramel Macchiato', price: '25k', description: 'Espresso, Steam Milk, Foam Susu, dan Saus Caramel' },
      { name: 'Kopi Rum Regal', price: '25k', description: 'Espresso, Sirup Rum, Steam Milk, dan Regal Crumb' }
    ]
  },
  // Page 8
  {
    pageNumber: 8,
    category: 'Matcha',
    title: 'Matcha',
    theme: 'matcha',
    imageType: 'matcha-art',
    items: [
      { name: 'Creamy Matcha', price: '27k', description: 'Matcha, Susu Steam, Cream Cheese dan Es batu' }
    ]
  },
  // Page 9
  {
    pageNumber: 9,
    category: 'Matcha',
    title: 'MATCHA SERIES',
    theme: 'matcha',
    items: [
      { name: 'Matcha Latte', price: '25k', description: 'Matcha, dan Susu Steam' },
      { name: 'Matcha Berry', price: '25k', description: 'Matcha, Susu, Selai Strawberry, dan Es batu' },
      { name: 'Matcha Butterscotch', price: '27k', description: 'Matcha, Susu, Sirup Baileys, dan Es batu' },
      { name: 'Matcha Choco', price: '25k', description: 'Matcha, Susu, Bubuk Coklat, dan Es batu' },
      { name: 'Matcha Biscoff', price: '25k', description: 'Matcha, Susu, Selai Biscoff, Crumb Biscoff dan Es batu' },
      { name: 'Matcha Caramel', price: '25k', description: 'Matcha, Susu, Sirup Caramel, Saus Caramel, dan Es Batu' }
    ]
  },
  // Page 10
  {
    pageNumber: 10,
    category: 'Milk Based',
    title: 'Milk BASED',
    subtitle: 'Creamy, Sweet & Refreshing Milk Creations',
    theme: 'milk',
    imageType: 'milk-pour'
  },
  // Page 11
  {
    pageNumber: 11,
    category: 'Milk Based',
    title: 'MILK BASED',
    theme: 'milk',
    items: [
      { name: 'Red Velvet', price: '22k', description: 'Red velvet powder dan susu' },
      { name: 'Rum Regal', price: '22k', description: 'Rum syrup, Susu, dan Biskuit regal' },
      { name: 'Taro', price: '22k', description: 'Taro powder dan Susu' },
      { name: 'Cotton Candy', price: '25k', description: 'Cotton candy powder, Susu, dan Taburan sprinkle' },
      { name: 'Bubble Gum', price: '25k', description: 'Bubble gum powder, Susu dan Taburan marshmallow' },
      { name: 'Thai Tea', price: '22k', description: 'Thai tea dan Susu' }
    ]
  },
  // Page 12
  {
    pageNumber: 12,
    category: 'Milk Based',
    title: 'MILK BASED',
    theme: 'milk',
    items: [
      { name: 'Strawberry Milk', price: '25k', description: 'Selai Strawberry, Susu, dan Sirup strawberry' },
      { name: 'Hazelnut Choco', price: '25k', description: 'Hazelnut syrup, Coklat Powder, dan Susu' },
      { name: 'Creamy Choco', price: '27k', description: 'Cream Cheese, Coklat, dan Susu' },
      { name: 'Chocolate', price: '22k', description: 'Chocolate powder dan Susu' }
    ]
  },
  // Page 13
  {
    pageNumber: 13,
    category: 'Cloud Series',
    title: 'Cloud Series',
    subtitle: 'Sensasi Minuman Segar dengan Topping Whipped Cream Lembut Bagai Awan',
    theme: 'sky',
    items: [
      { name: 'Cloud Matcha', price: '25k', description: 'Creamy & matcha, bercampur air kelapa' },
      { name: 'Cloud Brown Sugar', price: '22k', description: 'Brown sugar yang bercampur dengan asam espresso' }
    ]
  },
  // Page 14
  {
    pageNumber: 14,
    category: 'Mocktail',
    title: 'MOCKTAIL',
    subtitle: 'Sparkling & Fruity Refreshers',
    theme: 'indigo',
    items: [
      { name: 'Summer Breeze', price: '23k', description: 'Rasa unik dari Strawberry dan Apel juice' },
      { name: 'Summer Rain', price: '22k', description: 'Strawberry dan orange juice dengan soda' },
      { name: 'Blue Lemonade', price: '20k', description: 'Lemon, Soda, dan Sari bunga telang' },
      { name: 'Green Apple', price: '25k', description: 'Apple syrup, Soda, Lemon, dan Selasih' }
    ]
  },
  // Page 15
  {
    pageNumber: 15,
    category: 'Tea',
    title: 'TEA TIME',
    theme: 'tea',
    items: [
      { name: 'Lemon Tea', price: '18k', description: 'Teh, Lemon, dan Buah lemon fresh' },
      { name: 'Lychee Tea', price: '23k', description: 'Teh, Sirup leci, dan Buah leci' },
      { name: 'Peach Tea', price: '23k', description: 'Sirup peach, Teh, dan Potongan buah peach' }
    ]
  },
  // Page 16
  {
    pageNumber: 16,
    category: 'Tea',
    title: 'TEA SERIES',
    subtitle: 'Semangat dalam kehangatan',
    theme: 'tea',
    items: [
      { name: 'Chamomile Tea', price: '20k', description: 'Teh bunga chamomile' },
      { name: 'Original Tea', price: '18k', description: 'Teh Asli' }
    ]
  },
  // Page 17
  {
    pageNumber: 17,
    category: 'Herbal',
    title: 'HERBAL Healthy',
    subtitle: 'Seduhan Alami Berkhasiat Penuh Kehangatan',
    theme: 'herbal',
    imageType: 'tea-pot',
    items: [
      { name: 'Wedang Uwuh', price: '23k', description: 'Jahe merah, Kayu secang, Kayu manis, Cengkeh, dan rempah pilihan' }
    ]
  },
  // Page 18
  {
    pageNumber: 18,
    category: 'Herbal',
    title: 'HERBAL & TRADISIONAL',
    theme: 'herbal',
    items: [
      { name: 'Wedang Jangkruk', price: '22k', description: 'Jahe, Sereh, Kencur, Madu, dan Lemon' },
      { name: 'Wedang Jahe Gepruk', price: '22k', description: 'Jahe, Serai, dan Jeruk Nipis' },
      { name: 'Honey Lime', price: '22k', description: 'Madu dan Jeruk nipis' },
      { name: 'Kopi Jahe', price: '20k', description: 'Kopi tubruk dan Jahe' },
      { name: 'Kopi Tubruk', price: '18k', description: 'Kopi medium grind, biskuit dan air panas' }
    ]
  },
  // Page 19
  {
    pageNumber: 19,
    category: 'Juice',
    title: 'HEALTHY JUICE',
    theme: 'juice',
    items: [
      { name: 'Jus Semangka', price: '18k', description: 'Buah Semangka, Air dan Es Batu (opsional)' }
    ]
  },
  // Page 20
  {
    pageNumber: 20,
    category: 'Juice',
    title: 'HEALTHY JUICE',
    theme: 'juice',
    items: [
      { name: 'Jus Melon', price: '18k', description: 'Buah Melon, Air dan Es Batu (opsional)' },
      { name: 'Jus Stroberi', price: '20k', description: 'Buah Stroberi, Air dan Es Batu (opsional)' },
      { name: 'Jus Sirsak', price: '20k', description: 'Buah Sirsak, Air dan Es Batu (opsional)' },
      { name: 'Jus Mangga', price: '20k', description: 'Buah mangga, Air dan Es batu (optional)' },
      { name: 'Jus Alpukat', price: '20k', description: 'Buah Alpukat, Air dan Es Batu (opsional)' }
    ]
  },
  // Page 21
  {
    pageNumber: 21,
    category: 'Snack',
    title: 'SIMPLE SNACKS',
    theme: 'snack',
    items: [
      { name: 'Onion Ring', price: '18k', description: 'Bawang bombay dengan potongan ring lalu digoreng berbalut tepung' },
      { name: 'Chicken Popcorn', price: '25k', description: 'Olahan daging ayam dipotong kecil dan dibalur tepung' },
      { name: 'Mix Platter', price: '38k', description: 'Sosis, kentang, nugget dan bakso sapi' },
      { name: 'Tahu Crispy', price: '18k', description: 'Gorengan tahu berbalur tepung dengan saus spesial' },
      { name: 'Pisang Coklat Keju', price: '20k', description: 'Pisang dengan topping coklat, meses dan keju' },
      { name: 'Sosis Bakar', price: '25k', description: '3 pcs Sosis dan kentang goreng' }
    ]
  },
  // Page 22
  {
    pageNumber: 22,
    category: 'Snack',
    title: 'SIMPLE SNACKS',
    theme: 'snack',
    items: [
      { name: 'French Fries Original', price: '22k', description: 'Kentang goreng dengan bumbu spesial' },
      { name: 'Cheesy French Fries', price: '25k', description: 'Kentang Goreng dengan saus keju' },
      { name: 'Tahu Balado', price: '18k', description: 'Potongan dadu tahu yang dibalut dengan bumbu balado' },
      { name: 'Singkong Keju', price: '18k', description: 'Singkong goreng dengan cita rasa keju' },
      { name: 'Jamur Crispy', price: '18k', description: 'Jamur Enoki goreng berbalut tepung' },
      { name: 'Cireng', price: '18k', description: 'Gorengan Aci, dengan saus rujak' },
      { name: 'Churros', price: '23k', description: "Churros dengan saus coklat 7's" },
      { name: 'Chicken Wings', price: '28k', description: 'Sayap ayam berbalur saus BBQ' }
    ]
  },
  // Page 23
  {
    pageNumber: 23,
    category: 'Pastry',
    title: 'PASTRY & BAKERY',
    theme: 'snack',
    items: [
      { name: 'Canele Coklat', price: '15k', description: 'Pastry klasik asal Prancis dan dilapisi lelehan coklat' },
      { name: 'Canele Original', price: '15k', description: 'Pastry klasik asal Prancis yang dilapisi karamel' },
      { name: 'Donat Kentang', price: '12k', description: 'Donat kentang dengan taburan gula halus' }
    ]
  },
  // Page 24
  {
    pageNumber: 24,
    category: 'Snack',
    title: 'SNACK TOPLES & CANDY',
    theme: 'snack',
    items: [
      { name: 'Peeled Fudge Strawberry', price: '20k', description: 'Permen lembut kupas rasa strawberry' },
      { name: 'Peeled Fudge Lychee', price: '20k', description: 'Permen lembut kupas rasa leci' },
      { name: 'Peeled Fudge Orange', price: '20k', description: 'Permen lembut kupas rasa jeruk' },
      { name: 'Peeled Fudge Mango', price: '20k', description: 'Permen lembut kupas rasa mangga' },
      { name: 'Keripik Stik Bawang', price: '15k', description: '1 Toples Keripik Stik Bawang' },
      { name: 'Soes Chocolate', price: '13k', description: '1 Toples Soes Coklat' },
      { name: 'Keripik Usus Crispy', price: '13k', description: '1 Toples Keripik Usus Crispy' }
    ]
  },
  // Page 25
  {
    pageNumber: 25,
    category: 'Dimsum',
    title: 'DIMSUM Five Star',
    subtitle: 'Kukusan Hangat & Gurih Berkualitas Bintang Lima',
    theme: 'dimsum',
    items: [
      { name: 'Dimsum Mix', price: '23k', description: 'Isi 1 Siomay, 1 Hakau, 1 Kuotie' }
    ]
  },
  // Page 26
  {
    pageNumber: 26,
    category: 'Dimsum',
    title: 'DIMSUM Five Star',
    theme: 'dimsum',
    items: [
      { name: 'Hakau', price: '22k', description: 'Dimsum kulit tipis bening isi udang dan ayam cincang yang kenyal dan juicy' },
      { name: 'Siomay', price: '23k', description: 'Siomay kulit wonton isi ayam giling berbumbu. Gurih, tekstur padat kenyal' },
      { name: 'Kuotie', price: '23k', description: 'Dimsum kukus bentuk setengah bulan yang lembut. Isi ayam dan sayur' }
    ]
  },
  // Page 27
  {
    pageNumber: 27,
    category: 'Burger',
    title: 'ORIGINAL BEEF BURGER',
    theme: 'burger',
    items: [
      { name: 'Beef Burger', price: '32k', description: 'Chef Signature' },
      { name: 'Special Beef Burger', price: '36k', description: 'dengan tambahan telur' }
    ]
  },
  // Page 28
  {
    pageNumber: 28,
    category: 'Pasta',
    title: 'PASTA HOUSE',
    theme: 'pasta',
    items: [
      { name: 'Spaghetti Carbonara', price: '32k', description: 'Pasta dan Smoke Beef, yang di masak dengan saus creamy Cabonara' },
      { name: 'Spaghetti Bolognese', price: '32k', description: 'Pasta dan daging sapi, yang di masak dengan saus Bolognese' },
      { name: 'Spaghetti Aglio e Olio', price: '32k', description: 'Pasta dengan tumisan bawang putih, Ayam & Chili flakes' }
    ]
  },
  // Page 29
  {
    pageNumber: 29,
    category: 'Salad',
    title: 'FRESH & HEALTHY',
    theme: 'salad',
    items: [
      { name: 'Grilled Chicken Salad', price: '32k', description: 'Perpaduan antara selada romaine dengan tomato cherry, grilled chicken, telur dan saus salad arkanza' }
    ]
  },
  // Page 30
  {
    pageNumber: 30,
    category: 'Katsu',
    title: 'CHICKEN KATSU',
    theme: 'katsu',
    items: [
      { name: 'Chicken Katsu Sambal Matah', price: '35k', description: 'Ayam katsu dengan Sambal Matah dan Nasi' },
      { name: 'Chicken Katsu Curry', price: '35k', description: 'Ayam katsu dengan Kari ala Jepang dan Nasi' },
      { name: 'Chicken Katsu Sambal Dabu-Dabu', price: '35k', description: 'Ayam katsu dengan Sambal Dabu-dabu dan Nasi' }
    ]
  },
  // Page 31
  {
    pageNumber: 31,
    category: 'Rice Bowl',
    title: 'RICE BOWL',
    theme: 'ricebowl',
    items: [
      { name: 'Chicken Rice Bowl', price: '30k', description: 'Ayam pop, telur mata sapi, sambal matah, telur dan Mix vegetable' },
      { name: 'Chicken Yakiniku Rice Bowl', price: '30k', description: 'Ayam goreng tepung dengan telur, nasi, saus yakiniku, telur dan Mix vegetable' },
      { name: 'Chicken Teriyaki Rice Bowl', price: '30k', description: 'Ayam goreng tepung dengan telur, nasi, saus teriyaki & Mix vegetable' },
      { name: 'Beef Black Pepper Rice Bowl', price: '35k', description: 'Daging dengan saus black pepper, nasi & Mix vegetable' },
      { name: 'Beef Teriyaki Rice Bowl', price: '35k', description: 'Daging dengan saus teriyaki, nasi & Mix vegetable' },
      { name: 'Beef Yakiniku Rice Bowl', price: '35k', description: 'Daging dengan saus yakiniku, nasi & Mix vegetable' }
    ]
  },
  // Page 32
  {
    pageNumber: 32,
    category: 'Main Course',
    title: 'MAIN COURSE',
    theme: 'meat',
    items: [
      { name: 'Sate Taichan', price: '30k', description: '8 tusuk sate ayam dengan bumbu taichan, nasi, dan sambal taichan' }
    ]
  },
  // Page 33
  {
    pageNumber: 33,
    category: 'Main Course',
    title: 'MAIN COURSE',
    theme: 'meat',
    items: [
      { name: 'Sop Buntut', price: '67k', description: 'Kuah Segar, Daging Ekor Sapi, Irisan Tomat dengan nasi' },
      { name: 'Ikan Gurame', price: '67k', description: 'Gurame Bakar, Tanpa Nasi' },
      { name: 'Crispy Chicken Steak', price: '37k', description: 'Ayam, kentang, mix vegetables dan saus steak' }
    ]
  },
  // Page 34
  {
    pageNumber: 34,
    category: 'Main Course',
    title: 'IGA MANIA',
    subtitle: 'Lembut Dagingnya, Seger Kuahnya!',
    theme: 'meat',
    items: [
      { name: 'Sop Iga Sapi', price: '67k', description: 'Iga sapi, kuah segar, irisan Tomat dengan nasi' },
      { name: 'Asem Asem Iga Sapi', price: '67k', description: 'Iga sapi, kuah segar, irisan wortel dengan nasi' }
    ]
  },
  // Page 35
  {
    pageNumber: 35,
    category: 'Nasi Goreng',
    title: 'NASI GORENG SUKODONO ASLI',
    theme: 'nasgor',
    items: [
      { name: 'Nasi Goreng Jawa', price: '30k', description: 'Nasi, bumbu spesial, sayuran, potongan ayam, tmata sapi, acar dan taburan krupuk' },
      { name: 'Nasi Goreng Arkanza', price: '35k', description: 'Nasi, bumbu spesial Arkanza, sayuran, sayap ayam, acar, telur mata sapi, dan taburan krupuk' }
    ]
  },
  // Page 36
  {
    pageNumber: 36,
    category: 'Nasi Goreng',
    title: 'NASI GORENG SUKODONO ASLI',
    theme: 'nasgor',
    items: [
      { name: 'Nasi Goreng Kampung', price: '30k', description: 'Nasi goreng dengan bumbu khas kampung yang gurih, dengan potongan ikan asin dan sayur, serta disajikan lengkap dengan sate ayam, telur mata sapi, dan kerupuk' },
      { name: 'Nasi Goreng Sambal Matah', price: '30k', description: 'Nasi goreng dengan cita unik rasa khas sambal matah yang gurih dan segar, serta potongan ayam, Telur mata sapi dan kerupuk' },
      { name: 'Nasi Goreng Ikan Asin', price: '30k', description: 'Nasi, bumbu spesial, sayuran, dan ikan asin + ayam' },
      { name: 'Nasi Goreng Seafood', price: '35k', description: 'Nasi goreng dengan bumbu spesial, potongan cumi dan udang serta disajikan dengan telur mata sapi dan kerupuk' }
    ]
  },
  // Page 37
  {
    pageNumber: 37,
    category: 'Chinese Food',
    title: 'CHINESE FOOD',
    theme: 'chinese',
    items: [
      { name: 'Sapo Tahu', price: '30k', description: 'Potongan ayam, tofu, brokoli, jamur kuping, dan potongan sayur lainnya' },
      { name: 'Tamie', price: '28k', description: 'Mie kriuk yang disiram dengan kuah kental, ayam, dan sayur' }
    ]
  },
  // Page 38
  {
    pageNumber: 38,
    category: 'Chinese Food',
    title: 'CHINESE FOOD',
    theme: 'chinese',
    items: [
      { name: 'Bakmi Goreng Ayam', price: '33k', description: 'Hidangan mie lurus kecil yang digoreng dengan sayur, Udang dan Cumi' },
      { name: 'Bakmi Goreng Seafood', price: '33k', description: 'Hidangan mie dengan sayur, Udang dan Cumi' },
      { name: 'Bihun Goreng', price: '27k', description: 'Hidangan mie bihun dengan sayur, Ayam, dan Bakso' },
      { name: 'Bihun Goreng Seafood', price: '33k', description: 'Hidangan mie bihun dengan sayur, Udang dan Cumi' },
      { name: 'Kwetiau Goreng', price: '28k', description: 'Hidangan kwetiau dengan sayur, Ayam, dan Bakso' },
      { name: 'Kwetiau Goreng Seafood', price: '31k', description: 'Mie kenyal yang digoreng dengan potongan sayur, Udang, dan Cumi' }
    ]
  },
  // Page 39
  {
    pageNumber: 39,
    category: 'Chinese Food',
    title: 'CHINESE FOOD',
    theme: 'chinese',
    items: [
      { name: 'Capjay', price: '25k', description: 'Sawi, Sawi Putih, Wortel, Bakso Bunga kol, Sosis, dan Ayam' },
      { name: 'Ayam Mentega', price: '30k', description: 'Potongan Ayam goreng dengan saus mentega spesial' }
    ]
  },
  // Page 40
  {
    pageNumber: 40,
    category: 'Meeting Room',
    title: 'MEETING ROOM PACKAGE',
    subtitle: 'Private & Modern Space for Productive Gatherings',
    theme: 'meeting',
    imageType: 'cover'
  },
  // Page 41
  {
    pageNumber: 41,
    category: 'Meeting Room',
    title: 'ROBUSTA ROOM',
    subtitle: 'Cozy, AC, Projector & High Speed WiFi Space',
    theme: 'meeting',
    imageType: 'room-robusta'
  },
  // Page 42
  {
    pageNumber: 42,
    category: 'Meeting Room',
    title: 'ROBUSTA ROOM',
    subtitle: 'MEET UP PACKAGE',
    theme: 'meeting',
    items: [
      {
        name: 'MEET UP PACKAGE A',
        price: 'Rp. 750.000 / net',
        description: 'Free Room for 3 hours | 12 pax: Nasi Putih, Mie Goreng Ayam, Ayam Saus Mentega / Saus Inggris, Fuyung Hai, Fruit Slice (Melon/ Semangka / Nanas), Iced Tea / Lemon Tea Ice, Air Mineral'
      },
      {
        name: 'MEET UP PACKAGE B',
        price: 'Rp. 900.000 / net',
        description: 'Free Room for 3 hours | 12 pax: Nasi Putih, Sapo Tahu, Kwetiaw Seafood, Ayam Saus Mentega / Saus Inggris, Fuyung Hai, Beed Yakiniku (Beef "Beef Slice"), Pisang Goreng, Fruit Slice (Melon/ Semangka / Nanas), Iced Tea / Lemon Tea Ice, Air Mineral'
      }
    ],
    benefits: ['Mushola', 'Wifi', 'Stop Kontak', 'Ruangan Ber-AC', 'Instagramable Interior']
  },
  // Page 43
  {
    pageNumber: 43,
    category: 'Meeting Room',
    title: 'ARABICA ROOM',
    subtitle: 'Executive Conference Room with Big Screen & Sound System',
    theme: 'meeting',
    imageType: 'room-arabica'
  },
  // Page 44
  {
    pageNumber: 44,
    category: 'Meeting Room',
    title: 'ARABICA ROOM',
    subtitle: 'BUFFET PACKAGE',
    theme: 'meeting',
    items: [
      {
        name: 'BUFFET PACKAGE A',
        price: 'Rp. 1.000.000 / net',
        description: 'Free Room for 3 hours | 12-15 pax: Nasi Putih, Mie Goreng Ayam, Ayam Saus Mentega / Saus Inggris, Fuyung Hai, Fruit Slice (Melon/ Semangka / Nanas), Iced Tea / Lemon Tea Ice, Air Mineral'
      },
      {
        name: 'BUFFET PACKAGE B',
        price: 'Rp. 1.500.000 / net',
        description: 'Free Room for 3 hours | 12-15 pax: Nasi Putih, Sapo Tahu, Kwetiaw Seafood, Ayam Saus Mentega / Saus Inggris, Fuyung Hai, Beed Yakiniku, Pisang Goreng, Fruit Slice (Melon/ Semangka / Nanas), Iced Tea / Lemon Tea Ice, Air Mineral'
      }
    ],
    benefits: ['Mushola', 'Wifi', 'Stop Kontak', 'Ruangan Ber-AC', 'Instagramable Interior']
  },
  // Page 45
  {
    pageNumber: 45,
    category: 'Events & Reservasi',
    title: 'RESERVASI',
    subtitle: 'Birthday Party, Wardah Beauty Class, Meeting Kantor',
    theme: 'meeting',
    imageType: 'events'
  },
  // Page 46
  {
    pageNumber: 46,
    category: 'Hospitality',
    title: 'Happiness for all!',
    subtitle: 'Pelayanan Ramah & Hangat dari Hati',
    theme: 'coffee',
    imageType: 'service'
  },
  // Page 47
  {
    pageNumber: 47,
    category: 'Contact & Location',
    title: 'ARKANZA COFFEE & ROASTERY',
    subtitle: 'Happiness for all!',
    theme: 'night',
    imageType: 'building',
    contactInfo: {
      phone: '081 125 512 006',
      instagram: '@arkanzacoffeeandroastery',
      tiktok: '@arkanzacoffee',
      address: 'Jl. Raya Kebon Agung KM 007, No. 17, Sukodono, Sidoarjo',
      hoursWeekday: '9.00 AM - 23.00 PM',
      hoursWeekend: '9.00 AM - 24.00 PM'
    }
  }
];
