import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Sparkles, ArrowUpDown, X, Coffee, Eye, UtensilsCrossed, ExternalLink } from 'lucide-react';
import { MenuItem, MenuCategory } from '../types';

interface MenuSectionProps {
  menuItems: MenuItem[];
  onSelectMenuItem: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ menuItems, onSelectMenuItem }) => {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');

  const categories: MenuCategory[] = ['All', 'Coffee', 'Non Coffee', 'Signature', 'Food & Snack', 'Manual Brew'];

  // Real-time filtering and sorting
  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Category Filter
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;

        // Search Query Filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.tastingNotes?.some((note) => note.toLowerCase().includes(query)) ||
          item.ingredients?.some((ing) => ing.toLowerCase().includes(query));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        // recommended: signatures and best sellers first
        const scoreA = a.badge === 'SIGNATURE' ? 3 : a.badge === 'BEST SELLER' ? 2 : a.badge === 'FAVORITE' ? 1 : 0;
        const scoreB = b.badge === 'SIGNATURE' ? 3 : b.badge === 'BEST SELLER' ? 2 : b.badge === 'FAVORITE' ? 1 : 0;
        return scoreB - scoreA;
      });
  }, [menuItems, activeCategory, searchQuery, sortBy]);

  const handleReset = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSortBy('recommended');
  };

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'SIGNATURE':
        return 'bg-[#1F4D3A] text-white border-emerald-400/30';
      case 'BEST SELLER':
        return 'bg-[#6B4A35] text-white border-amber-400/30';
      case 'NEW':
        return 'bg-emerald-800 text-white border-emerald-400/30';
      case 'FAVORITE':
        return 'bg-[#A98262] text-white border-amber-200/30';
      case 'SPECIALTY':
        return 'bg-black text-[#A98262] border-[#A98262]/40';
      default:
        return 'bg-black/70 text-white';
    }
  };

  return (
    <section id="menu" className="py-20 sm:py-28 bg-[#F7F6F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-block mb-2 px-3 py-1 bg-[#1F4D3A] text-white text-[10px] font-bold tracking-widest uppercase rounded">
            <span>CRAFTED WITH PASSION</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-bold text-[#111111] tracking-tight mb-2">
            Our Menu
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            From classic coffee to signature favorites. Setiap cangkir diseduh menggunakan biji kopi specialty pilihan hasil roasting mandiri.
          </p>
        </div>

        {/* GoFood Order Online Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#EE2737]/10 via-white to-[#1F4D3A]/10 border border-[#EE2737]/25 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#EE2737] text-white flex items-center justify-center shrink-0 shadow-md">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                <span className="text-xs sm:text-sm font-bold text-[#111111]">Pesan Antar Praktis ke Lokasimu</span>
                <span className="bg-[#EE2737] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  GoFood
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                Nikmati kopi specialty, camilan, dan makanan khas Arkanza Coffee langsung dari aplikasi GoFood.
              </p>
            </div>
          </div>
          <a
            href="https://gofood.co.id/surabaya/restaurant/arkanza-coffee-and-roastery-96b124bb-eca7-4897-a775-77512ee9ef75"
            target="_blank"
            rel="noopener noreferrer"
            id="btn-menu-gofood-cta"
            className="shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#EE2737] hover:bg-[#D31F2E] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>Order via GoFood</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Filter Bar & Controls */}
        <div className="bg-white rounded p-4 sm:p-5 border border-black/10 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu favoritmu..."
                className="w-full pl-10 pr-10 py-2.5 rounded bg-[#F7F6F2] border border-black/10 focus:border-[#1F4D3A] focus:bg-white text-xs sm:text-sm text-[#111111] placeholder-gray-400 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 whitespace-nowrap">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#1F4D3A]" />
                SORT:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2 px-3 rounded bg-[#F7F6F2] border border-black/10 text-xs font-bold text-[#111111] focus:border-[#1F4D3A] outline-none cursor-pointer uppercase tracking-wider"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 mt-3 border-t border-black/5 pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'bg-[#F7F6F2] text-gray-600 hover:bg-black/5 hover:text-[#111111]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#111111]/60 px-1">
          <span>Menampilkan <strong className="text-[#111111]">{filteredItems.length}</strong> menu</span>
          {(searchQuery || activeCategory !== 'All' || sortBy !== 'recommended') && (
            <button
              onClick={handleReset}
              className="text-[#1F4D3A] hover:underline font-semibold flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {/* Menu Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-black/5 p-8 max-w-lg mx-auto">
            <Coffee className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="font-editorial text-xl font-bold text-[#111111] mb-2">
              Menu tidak ditemukan.
            </h3>
            <p className="text-xs text-[#111111]/60 mb-6">
              Tidak ada menu yang sesuai dengan kata kunci &quot;{searchQuery}&quot; pada kategori &quot;{activeCategory}&quot;.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#163A2C] text-white text-xs font-semibold shadow-md cursor-pointer transition-all"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                {/* Product Image Container */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-[#111111]">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out brightness-95 group-hover:brightness-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${getBadgeStyle(item.badge)}`}>
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Category Tag */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[11px] font-medium text-white/90 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[#111111] group-hover:text-[#1F4D3A] transition-colors line-clamp-1 mb-1">
                      {item.name}
                    </h3>
                    
                    <p className="text-xs text-[#111111]/70 line-clamp-2 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-black/5">
                      <div>
                        <span className="text-[10px] text-[#111111]/50 uppercase font-semibold block">Harga</span>
                        <span className="text-base font-bold text-[#111111]">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectMenuItem(item)}
                        id={`btn-menu-detail-${item.id}`}
                        className="py-2 px-3.5 rounded-xl bg-[#F7F6F2] hover:bg-[#1F4D3A] text-[#111111] hover:text-white text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer group/btn border border-black/5 hover:border-[#1F4D3A]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#1F4D3A] group-hover/btn:text-white" />
                        <span>Detail</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
