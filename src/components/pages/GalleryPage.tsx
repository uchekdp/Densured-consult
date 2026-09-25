import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';
import { Sparkles, Maximize2, X, CheckCircle2 } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { galleryItems } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = [
    'All',
    'CBT Lab',
    'Classrooms',
    'Practicals',
    'Awards & Achievers',
    'Campus Life',
  ];

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#25166B] via-[#1c1152] to-[#25166B] text-white py-16 px-4 sm:px-6 lg:px-8 text-center space-y-4 border-b-4 border-[#D5241B]">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D5241B] text-white text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-[#FFC600]" />
            Official 2026/2027 Academic Session • Lagos Campus Facilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FFC600]">
            Learning Environment & Achievers Gallery
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Take a visual tour inside our CBT laboratories, science practical theaters, multimedia lecture halls, and academic award celebrations at our Lagos center.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#D5241B] text-white shadow-md'
                  : 'bg-white text-[#25166B] border border-slate-200 hover:border-[#D5241B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-[#D5241B] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#25166B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-between text-white">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-[#FFC600]">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Enlarge view
                  </span>
                  {item.year && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] bg-black/60 backdrop-blur-xs font-mono font-bold text-white border border-white/20">
                      {item.year}
                    </span>
                  )}
                </div>
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-[#25166B]/95 text-white border border-[#D5241B]/50 uppercase tracking-wider">
                    {item.category}
                  </span>
                  {item.page && item.page !== 'gallery' && (
                    <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black bg-[#FFC600] text-[#25166B] uppercase tracking-wider shadow-xs">
                      {item.page === 'hero' ? '★ Hero' : `${item.page} page`}
                    </span>
                  )}
                </div>
              </div>

              {/* Caption Content */}
              <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                <h3 className="text-sm font-bold text-[#25166B] group-hover:text-[#D5241B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facility Highlights Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-[#25166B] to-[#1a0e50] text-white rounded-3xl p-8 sm:p-10 border-2 border-[#D5241B]/40 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFC600] bg-[#D5241B] px-3 py-1 rounded-full inline-block shadow-xs">
                Campus Infrastructure
              </span>
              <h3 className="text-2xl font-black text-[#FFC600]">
                Modern Learning Spaces in Lagos
              </h3>
              <p className="text-slate-200 text-xs leading-relaxed">
                We believe exceptional performance is nurtured in an environment equipped with modern pedagogical tools.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#1f125a] rounded-2xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009E49]" />
                  Dual Redundant Fiber Internet
                </h4>
                <p className="text-slate-200 leading-relaxed">
                  Zero latency or buffering during simulated JAMB CBT and British Council online tests.
                </p>
              </div>

              <div className="p-4 bg-[#1f125a] rounded-2xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009E49]" />
                  Uninterrupted Solar & Diesel Power
                </h4>
                <p className="text-slate-200 leading-relaxed">
                  Continuous energy supply ensures test sessions and lectures run without interruption.
                </p>
              </div>

              <div className="p-4 bg-[#1f125a] rounded-2xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009E49]" />
                  Fully Air-Conditioned Suites
                </h4>
                <p className="text-slate-200 leading-relaxed">
                  Acoustically treated halls for maximum cognitive retention and comfortable study hours.
                </p>
              </div>

              <div className="p-4 bg-[#1f125a] rounded-2xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009E49]" />
                  24/7 Security & CCTV Coverage
                </h4>
                <p className="text-slate-200 leading-relaxed">
                  Secured premises with access control for the complete safety of all scholars.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-16/10 w-full bg-black">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-2 bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md text-[10px] font-bold bg-[#f59e0b]/20 text-[#d97706] uppercase">
                  {selectedItem.category}
                </span>
                {selectedItem.year && (
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    Captured: {selectedItem.year}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-[#0a192f]">{selectedItem.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
