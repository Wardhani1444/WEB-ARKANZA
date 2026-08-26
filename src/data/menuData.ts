import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // Signature
  {
    id: 'arkanza-signature',
    name: 'Arkanza Signature',
    category: 'Signature',
    price: 35000,
    description: 'Signature coffee blend with artisanal creamy milk and organic palm nectar.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    badge: 'SIGNATURE',
    tastingNotes: ['Brown Sugar', 'Dark Cocoa', 'Velvety Cream'],
    ingredients: ['Specialty Espresso Blend', 'Fresh Milk', 'Secret Artisan Syrup', 'Organic Palm Sugar'],
    temperature: 'Iced',
    isSpecialty: true
  },
  {
    id: 'palm-sugar-macchiato',
    name: 'Palm Sugar Macchiato',
    category: 'Signature',
    price: 34000,
    description: 'Layered espresso with aromatic aren sugar, silky textured milk, and sea salt foam.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    badge: 'BEST SELLER',
    tastingNotes: ['Caramel', 'Sea Salt', 'Toasted Hazelnut'],
    ingredients: ['Double Espresso', 'Hokkaido Milk', 'Organic Aren Syrup', 'Light Sea Salt Cream'],
    temperature: 'Iced',
    isSpecialty: true
  },
  {
    id: 'avocado-espresso',
    name: 'Avocado Espresso Glaze',
    category: 'Signature',
    price: 38000,
    description: 'Fresh butter avocado purée topped with double shot ristretto and chocolate drizzle.',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    tastingNotes: ['Rich Butter Avocado', 'Espresso Punch', 'Dark Chocolate'],
    ingredients: ['Fresh Butter Avocado', 'Specialty Ristretto', 'Organic Cane Sugar', 'Dark Cocoa'],
    temperature: 'Iced',
    isSpecialty: true
  },
  {
    id: 'cold-brew-citrus',
    name: 'Citrus Nitro Cold Brew',
    category: 'Signature',
    price: 36000,
    description: '18-hour cold steeped single origin Ethiopian beans infused with fresh Valencia orange slice.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    badge: 'FAVORITE',
    tastingNotes: ['Bergamot', 'Jasmine Blossom', 'Orange Zest'],
    ingredients: ['Ethiopia Yirgacheffe Cold Brew', 'Valencia Orange Zest', 'Craft Tonic Water'],
    temperature: 'Iced',
    isSpecialty: true
  },

  // Classic Coffee
  {
    id: 'americano',
    name: 'Americano',
    category: 'Coffee',
    price: 25000,
    description: 'Classic espresso diluted with pure hot or ice water, preserving deep aroma and crema.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    badge: 'FAVORITE',
    tastingNotes: ['Dark Chocolate', 'Almond', 'Mild Acidity'],
    ingredients: ['Arkanza House Blend Espresso', 'Filtered Spring Water'],
    temperature: 'Hot & Iced',
    isSpecialty: false
  },
  {
    id: 'cafe-latte',
    name: 'Cafe Latte',
    category: 'Coffee',
    price: 30000,
    description: 'Smooth espresso balanced perfectly with rich, steamed creamy whole milk and delicate microfoam.',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80',
    badge: 'BEST SELLER',
    tastingNotes: ['Sweet Milk', 'Nutty', 'Smooth Cocoa Finish'],
    ingredients: ['Espresso Blend (Aceh Gayo + Flores)', 'Steam Whole Milk'],
    temperature: 'Hot & Iced',
    isSpecialty: false
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'Coffee',
    price: 30000,
    description: 'Rich espresso shot crowned with equal parts steamed milk and dense, velvety milk foam.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
    badge: 'FAVORITE',
    tastingNotes: ['Bold Espresso', 'Creamy Foam', 'Cinnamon Dusting'],
    ingredients: ['Double Shot Espresso', 'Microfoam Milk', 'Optional Ceylon Cinnamon'],
    temperature: 'Hot & Iced',
    isSpecialty: false
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    category: 'Coffee',
    price: 32000,
    description: 'Double ristretto with microfoam, delivering an intense coffee punch with silky mouthfeel.',
    image: 'https://images.unsplash.com/photo-1577968897866-be0c8a079b74?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    tastingNotes: ['Roasted Walnut', 'Cacao Nibs', 'Sweet Cream'],
    ingredients: ['Double Ristretto', 'Fine Velvety Steamed Milk'],
    temperature: 'Hot',
    isSpecialty: false
  },
  {
    id: 'caramel-macchiato',
    name: 'Caramel Macchiato',
    category: 'Coffee',
    price: 33000,
    description: 'Freshly steamed milk with vanilla syrup, marked with espresso and drizzled with caramel.',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80',
    tastingNotes: ['Salted Butterscotch', 'Bourbon Vanilla', 'Rich Crema'],
    ingredients: ['Vanilla Syrup', 'Steamed Milk', 'Espresso Float', 'Buttery Caramel Sauce'],
    temperature: 'Hot & Iced',
    isSpecialty: false
  },

  // Manual Brew / Roastery
  {
    id: 'v60-single-origin',
    name: 'V60 Pour Over - Single Origin',
    category: 'Manual Brew',
    price: 35000,
    description: 'Handcrafted pour-over using light-medium roasted single-origin Indonesian specialty beans.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    badge: 'SPECIALTY',
    tastingNotes: ['Floral Jasmine', 'Peach', 'Tangerine', 'Tea-like Body'],
    ingredients: ['15g Single Origin Bean (Gayo Anaerobic / Kerinci Honey)', '225ml 92°C Filtered Water'],
    temperature: 'Hot & Iced',
    roastOrigin: 'Aceh Gayo / Kerinci',
    isSpecialty: true
  },
  {
    id: 'japanese-iced-drip',
    name: 'Japanese Iced Drip Coffee',
    category: 'Manual Brew',
    price: 36000,
    description: 'Manual pour-over brewed directly over crystal ice cubes to lock in bright, crisp fruity aromatics.',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    badge: 'FAVORITE',
    tastingNotes: ['Crisp Apple', 'Lemon Drop', 'Wild Honey'],
    ingredients: ['Light Roasted Specialty Arabica', 'Ice Crystal Filter'],
    temperature: 'Iced',
    roastOrigin: 'Flores Bajawa Natural',
    isSpecialty: true
  },

  // Non Coffee
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    category: 'Non Coffee',
    price: 32000,
    description: 'Ceremonial grade Uji Japanese matcha whisked with fresh creamy steamed milk.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    badge: 'BEST SELLER',
    tastingNotes: ['Earthy Umami', 'Subtle Sweetness', 'Silky Green Tea'],
    ingredients: ['Ceremonial Uji Matcha', 'Fresh Steamed Milk', 'Touch of Honey'],
    temperature: 'Hot & Iced',
    isSpecialty: false
  },
  {
    id: 'artisan-chocolate',
    name: 'Artisan Dark Chocolate',
    category: 'Non Coffee',
    price: 30000,
    description: 'Single-origin 70% Indonesian dark cocoa melted with milk and whipped to perfection.',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80',
    badge: 'FAVORITE',
    tastingNotes: ['Fudge Cocoa', 'Malted Grain', 'Creamy Warmth'],
    ingredients: ['70% Sulawesi Cocoa Paste', 'Fresh Whole Milk', 'Brown Sugar'],
    temperature: 'Hot & Iced',
    isSpecialty: false
  },
  {
    id: 'houjicha-latte',
    name: 'Roasted Houjicha Latte',
    category: 'Non Coffee',
    price: 33000,
    description: 'Charcoal roasted green tea leaves delivering a comforting nutty, smoky roasted aroma.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    tastingNotes: ['Toasted Barley', 'Warm Smoke', 'Chestnut'],
    ingredients: ['Kyoto Roasted Houjicha Powder', 'Fresh Milk', 'Maple Drop'],
    temperature: 'Hot & Iced',
    isSpecialty: false
  },
  {
    id: 'earl-grey-tea',
    name: 'Artisan Earl Grey Lavender',
    category: 'Non Coffee',
    price: 26000,
    description: 'Premium whole-leaf black tea infused with Italian bergamot oil and French lavender buds.',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    tastingNotes: ['Bergamot Citrus', 'Gentle Floral Lavender', 'Clean Tannin'],
    ingredients: ['Artisan Tea Leaves', 'French Lavender', 'Filtered Hot Spring Water'],
    temperature: 'Hot & Iced',
    isSpecialty: false
  },

  // Food & Snack
  {
    id: 'french-fries-truffle',
    name: 'French Fries Truffle & Herb',
    category: 'Food & Snack',
    price: 25000,
    description: 'Crispy golden straight-cut fries tossed with aromatic white truffle oil, sea salt, and fresh herbs.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    badge: 'BEST SELLER',
    tastingNotes: ['White Truffle', 'Crispy Golden Potato', 'Parmesan Herb Dust'],
    ingredients: ['Selected Russet Potatoes', 'Italian Truffle Oil', 'Grated Grana Padano', 'House Dip'],
    isSpecialty: false
  },
  {
    id: 'butter-croissant',
    name: 'Butter Croissant Artisan',
    category: 'Food & Snack',
    price: 25000,
    description: 'Classic French viennoiserie made with 100% Normandy butter, golden flaky exterior and soft honeycomb interior.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    badge: 'FAVORITE',
    tastingNotes: ['Rich French Butter', 'Crispy Layers', 'Honeycomb Texture'],
    ingredients: ['Normandy Unsalted Butter', 'Unbleached Flour', 'Natural Sourdough Starter'],
    isSpecialty: false
  },
  {
    id: 'cinnamon-roll-pecan',
    name: 'Cinnamon Roll with Glaze',
    category: 'Food & Snack',
    price: 28000,
    description: 'Soft warm brioche swirled with Ceylon cinnamon and brown sugar, topped with cream cheese glaze.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    tastingNotes: ['Ceylon Cinnamon', 'Cream Cheese Icing', 'Soft Brioche Butter'],
    ingredients: ['Brioche Dough', 'Indonesian Cinnamon Spice', 'Cream Cheese Glaze', 'Roasted Pecans'],
    isSpecialty: false
  },
  {
    id: 'crispy-chicken-bites',
    name: 'Crispy Garlic Chicken Bites',
    category: 'Food & Snack',
    price: 32000,
    description: 'Bite-sized tender chicken thigh marinated in roasted garlic and herbs with signature chili mayo.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    badge: 'BEST SELLER',
    tastingNotes: ['Garlic Herb Crust', 'Juicy Tender Chicken', 'Spicy Mayo Dip'],
    ingredients: ['Fresh Chicken Thigh', 'Crispy Batter', 'Garlic Butter Glaze', 'Signature Dip Sauce'],
    isSpecialty: false
  }
];
