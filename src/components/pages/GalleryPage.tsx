import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';
import { Sparkles, Maximize2, X, CheckCircle2 } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { galleryItems, galleryCategories } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = ['All', ...(galleryCategories || [])];

  const currentCategory = categories.includes(activeCategory) ? activeCategory : 'All';

  const filteredItems =
    currentCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === currentCategory);

  return (
    <div className="space-y-12 pb-16 bg-slate-50/60">
      {/* Hero Header - Attractive Light Colors */}
      <section className="bg-gradient-to-b from-sky-50 via-white to-sky-50 py-14 sm:py-16 px-4 sm:px-6 lg:px-8 text-center space-y-4 border-b-2 border-sky-200">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-bold border border-sky-300">
            <Sparkles className="w-4 h-4 text-sky-600" />
            Official 2026/2027 Academic Session • Lagos Campus Facilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-sky-600">
            Learning Environment &amp; Achievers Gallery
          </h1>
          <p className="text-sky-800 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-semibold">
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
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-sky-200 hover:border-sky-400'
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
              className="group bg-white rounded-3xl overflow-hidden border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-between text-white">
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
                  <span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-sky-700/90 text-white border border-sky-500/50 uppercase tracking-wider">
                    {item.category}
                  </span>
                  {item.page && item.page !== 'gallery' && (
                    <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black bg-[#FFC600] text-slate-900 uppercase tracking-wider shadow-xs">
                      {item.page === 'hero' ? '★ Hero' : `${item.page} page`}
                    </span>
                  )}
                </div>
              </div>

              {/* Caption Content */}
              <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                <h3 className="text-sm font-bold text-sky-600 group-hover:text-sky-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-semibold">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facility Highlights Banner - Attractive Light Colors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50/70 text-slate-800 rounded-3xl p-8 sm:p-10 border-2 border-sky-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 border border-sky-300 px-3 py-1 rounded-full inline-block">
                Campus Infrastructure
              </span>
              <h3 className="text-2xl font-black text-sky-600">
                Modern Learning Spaces in Lagos
              </h3>
              <p className="text-sky-800 text-xs leading-relaxed font-semibold">
                We believe exceptional performance is nurtured in an environment equipped with modern pedagogical tools.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-sky-200 space-y-1.5 shadow-xs">
                <h4 className="font-bold text-sky-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009E49]" />
                  Dual Redundant Fiber Internet
                </h4>
                <p className="text-slate-700 leading-relaxed font-medium">
                  Zero latency or buffering during simulated JAMB CBT and British Council online tests.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-sky-200 space-y-1.5 shadow-xs">
                <h4 className="font-bold text-sky-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009E49]" />
                  Uninterrupted Solar &amp; Diesel Power
                </h4>
                <p className="text-slate-700 leading-relaxed font-medium">
                  Continuous energy supply ensures test sessions and lectures run without interruption.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-sky-200 space-y-1.5 shadow-xs">
                <h4 className="font-bold text-sky-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009E49]" />
                  Fully Air-Conditioned Suites
                </h4>
                <p className="text-slate-700 leading-relaxed font-medium">
                  Acoustically treated halls for maximum cognitive retention and comfortable study hours.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-sky-200 space-y-1.5 shadow-xs">
                <h4 className="font-bold text-sky-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009E49]" />
                  24/7 Security &amp; CCTV Coverage
                </h4>
                <p className="text-slate-700 leading-relaxed font-medium">
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
                <span className="px-3 py-1 rounded-md text-[10px] font-bold bg-sky-100 text-sky-700 uppercase">
                  {selectedItem.category}
                </span>
                {selectedItem.year && (
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    Captured: {selectedItem.year}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-sky-600">{selectedItem.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{selectedItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default GalleryPage;
