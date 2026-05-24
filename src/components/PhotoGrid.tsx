import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, MapPin, Calendar, Grid, List, Search, Sparkles } from 'lucide-react';
import { Photo } from '../types';

interface PhotoGridProps {
  photos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function PhotoGrid({
  photos,
  onSelectPhoto,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
}: PhotoGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'journal'>('grid');
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Landscape', 'Architecture', 'Street', 'Portrait'];

  // Filter photos based on search and category
  const filteredPhotos = photos.filter((photo) => {
    const matchesCategory = activeCategory === 'All' || photo.category === activeCategory;
    const matchesSearch =
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.camera.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.lens.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleImageLoaded = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-8">
      {/* Control Bar: Filters, Search & View Swapper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                activeCategory === cat
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/10'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:border-zinc-700'
              }`}
              id={`filter-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search, Stats and Layout Toggles */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by city, camera..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-6 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 hover:text-zinc-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-zinc-800"></div>

          {/* View Modes */}
          <div className="flex items-center gap-1.5 bg-zinc-900 p-1 border border-zinc-800 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-zinc-800 text-amber-500'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Grid Layout"
              id="layout-grid"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('journal')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'journal'
                  ? 'bg-zinc-800 text-amber-500'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Journal Layout"
              id="layout-journal"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Journal Render */}
      <AnimatePresence mode="popLayout">
        {filteredPhotos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-20 border border-dashed border-zinc-800 rounded-xl"
          >
            <p className="text-zinc-400 font-mono text-xs">NO PHOTOGRAPHY EXAMPLES MATCHED YOUR QUERIES</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 text-xs font-mono text-amber-500 border border-zinc-700 px-3.5 py-1.5 rounded-lg hover:border-zinc-500 transition-colors"
            >
              Reset Archive Search
            </button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPhotos.map((photo, idx) => {
              const isLoaded = loadedImages[photo.id];
              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.04 } }}
                  whileHover={{ y: -4 }}
                  onClick={() => onSelectPhoto(photo)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-zinc-950 border border-zinc-900/60 shadow-lg"
                >
                  {/* Photo Canvas Container */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-900 relative">
                    {/* Shimmer Placeholder */}
                    {!isLoaded && (
                      <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
                        <div className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                          <Eye className="w-3 h-3 text-zinc-700 animate-spin" /> EXIF LOAD_
                        </div>
                      </div>
                    )}

                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      onLoad={() => handleImageLoaded(photo.id)}
                      className={`w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-105 ${
                        isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-95'
                      }`}
                    />

                    {/* Photo Info Bottom Overlay (Fades in slightly or shows details elegantly) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                      <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
                        <span className="text-[10px] font-mono bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-sm font-semibold tracking-wider uppercase">
                          {photo.category}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-white tracking-wide truncate">{photo.title}</h4>
                          <span className="text-xs text-zinc-300 flex items-center gap-1 font-sans">
                            <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                            {photo.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick EXIF Preview Tag (top-right) */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 px-2.5 py-1 rounded font-mono text-[9px] text-amber-500 uppercase tracking-tight">
                        {photo.camera.split(' ')[0]} • {photo.aperture}
                      </div>
                    </div>
                  </div>

                  {/* Caption Strip Under Image (Visible by default in static layout) */}
                  <div className="p-4 border-t border-zinc-900/60 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-medium text-zinc-200 group-hover:text-amber-500 transition-colors uppercase tracking-wider">{photo.title}</h3>
                      <p className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-2.5 h-2.5 text-zinc-500" /> {photo.date}
                      </p>
                    </div>
                    <div className="text-right font-mono text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      {photo.lens.split(' ')[0]} 
                      <span className="block text-zinc-600">{photo.shutter} @ {photo.aperture}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* JOURNAL VIEW (VERTICAL CARDS focusing on individual photo stories) */
          <motion.div
            key="journal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-12 max-w-4xl mx-auto"
          >
            {filteredPhotos.map((photo, idx) => {
              const isLoaded = loadedImages[photo.id];
              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 } }}
                  className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-lg p-5 sm:p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Media Column */}
                    <div className="md:col-span-7 aspect-[3/2] rounded-lg overflow-hidden bg-zinc-900 relative cursor-pointer" onClick={() => onSelectPhoto(photo)}>
                      {!isLoaded && (
                        <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
                          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">LOADING IMAGE EXIF_</span>
                        </div>
                      )}
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        onLoad={() => handleImageLoaded(photo.id)}
                        className={`w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-102 ${
                          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-md'
                        }`}
                      />
                    </div>

                    {/* Metadata Column */}
                    <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
                      {/* Top level details */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500">{photo.category}</span>
                          <span className="text-xs text-zinc-500 font-mono">{photo.date}</span>
                        </div>
                        <h3 className="text-lg font-bold font-display tracking-tight text-white hover:text-amber-500 transition-colors cursor-pointer" onClick={() => onSelectPhoto(photo)}>{photo.title}</h3>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 font-sans">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          {photo.location}
                        </p>
                      </div>

                      {/* Technical Specs box */}
                      <div className="p-3 bg-zinc-900/70 border border-zinc-850 rounded-lg">
                        <span className="text-[9px] uppercase tracking-widest font-mono text-zinc-500 mb-2 block">Technical Metadata</span>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[11px] font-mono">
                          <div>
                            <span className="text-zinc-500">Camera:</span>
                            <span className="block text-zinc-300 truncate">{photo.camera}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500">Lens:</span>
                            <span className="block text-zinc-300 truncate">{photo.lens}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500">Exposure:</span>
                            <span className="block text-zinc-300">{photo.shutter} @ {photo.aperture}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500">ISO / Focal:</span>
                            <span className="block text-zinc-300">ISO {photo.iso} • {photo.focalLength}</span>
                          </div>
                        </div>
                      </div>

                      {/* Poetry Story */}
                      <p className="text-xs text-zinc-400 leading-relaxed italic line-clamp-3">
                        "{photo.story}"
                      </p>

                      {/* Action buttons */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => onSelectPhoto(photo)}
                          className="text-xs font-mono text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1 py-1 px-3 border border-zinc-900 hover:border-zinc-800 bg-zinc-900/50 rounded-md transition-colors"
                        >
                          View Fullscreen Lightbox &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
