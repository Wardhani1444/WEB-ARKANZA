import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Camera } from 'lucide-react';
import { VibePhoto } from '../types';

interface CatchOurVibeProps {
  photos: VibePhoto[];
}

export const CatchOurVibe: React.FC<CatchOurVibeProps> = ({ photos }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Coffee', 'Interior', 'Barista', 'Food', 'Community'];

  const filteredPhotos = selectedCategory === 'All'
    ? photos
    : photos.filter((p) => p.category === selectedCategory);

  return (
    <section id="vibe" className="py-20 sm:py-28 bg-[#111111] text-[#F7F6F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
          <div>
            <div className="inline-block mb-2 px-3 py-1 bg-[#1F4D3A] text-white text-[10px] font-bold tracking-widest uppercase rounded">
              <span>VISUAL STORIES</span>
            </div>
            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Catch Our Vibe
            </h2>
            <p className="text-xs sm:text-sm text-[#A98262] mt-1 font-bold uppercase tracking-widest">
              See what&apos;s brewing at Arkanza.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/15">
              <Camera className="w-4 h-4 text-[#A98262]" />
              <span>Galeri Arkanza Roastery</span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredPhotos.map((photo, index) => {
            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-[#163A2C]/30 border border-white/10 shadow-lg block select-none"
              >
                {/* Image */}
                <img
                  src={photo.image}
                  alt={photo.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Hover Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  
                  {/* Top Info */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#1F4D3A] text-[10px] font-bold uppercase tracking-wider text-white">
                      {photo.category}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold">
                      <Camera className="w-3.5 h-3.5 text-[#A98262]" />
                    </div>
                  </div>

                  {/* Bottom Caption & Stats */}
                  <div>
                    <p className="text-sm font-semibold text-white leading-snug mb-3 line-clamp-3">
                      {photo.caption}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#A98262] font-semibold pt-2 border-t border-white/10">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                          {photo.likes}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-white/80" />
                          {photo.comments}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/60 font-medium tracking-wide">
                        {photo.title}
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
