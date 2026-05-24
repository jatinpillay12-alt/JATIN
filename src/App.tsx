import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import PhotoGrid from './components/PhotoGrid';
import Lightbox from './components/Lightbox';
import { photos } from './data';
import { Photo, InquiryFormState } from './types';
import { Camera, Layers, Award, Sparkles, Filter, CheckCircle } from 'lucide-react';

export default function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Local state for inquiries tracking
  const [submittedInquiries, setSubmittedInquiries] = useState<InquiryFormState[]>([]);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Load previously submitted inquiries (useful mock feature)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('elena_rousseau_inquiries');
      if (stored) {
        setSubmittedInquiries(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed reading inquiries', e);
    }
  }, []);

  const handleInquirySubmitted = (formData: InquiryFormState) => {
    const updated = [...submittedInquiries, formData];
    setSubmittedInquiries(updated);
    try {
      localStorage.setItem('elena_rousseau_inquiries', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed saving inquiries', e);
    }

    // Set interactive visual notification toast
    if (formData.printSize) {
      setLastNotification(
        `Print order configured for "${photos.find((p) => p.id === formData.photoId)?.title}" (${formData.printSize}"). Confirmation sent to ${formData.email}.`
      );
    } else {
      setLastNotification(`Studio inquiry captured successfully. Response routed to ${formData.email}.`);
    }

    // Clear toast message in 5s
    setTimeout(() => {
      setLastNotification(null);
    }, 6000);
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const filtered = photos.filter((photo) => {
      const matchesCategory = activeCategory === 'All' || photo.category === activeCategory;
      const matchesSearch =
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.camera.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.lens.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const currIdx = filtered.findIndex((p) => p.id === selectedPhoto.id);
    if (currIdx === -1) return;
    const nextIdx = (currIdx + 1) % filtered.length;
    setSelectedPhoto(filtered[nextIdx]);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const filtered = photos.filter((photo) => {
      const matchesCategory = activeCategory === 'All' || photo.category === activeCategory;
      const matchesSearch =
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.camera.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.lens.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const currIdx = filtered.findIndex((p) => p.id === selectedPhoto.id);
    if (currIdx === -1) return;
    const prevIdx = (currIdx - 1 + filtered.length) % filtered.length;
    setSelectedPhoto(filtered[prevIdx]);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-zinc-100 selection:bg-amber-500 selection:text-zinc-950 flex flex-col justify-between">
      
      {/* Dynamic Notification Toast */}
      <AnimatePresence>
        {lastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-zinc-900/90 backdrop-blur-md border border-amber-500/30 text-zinc-200 p-4 rounded-xl shadow-2xl flex items-start gap-3">
              <div className="p-1 rounded bg-amber-500/10 text-amber-500 mt-0.5 shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold">Studio Notification</span>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">{lastNotification}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow">
        {/* Navigation / Header */}
        <Header
          isAboutOpen={isAboutOpen}
          onAboutToggle={() => setIsAboutOpen(!isAboutOpen)}
          onInquirySubmitted={handleInquirySubmitted}
        />

        {/* Main Content Stage */}
        <main className="max-w-7xl mx-auto px-6 py-10 md:py-16">
          
          {/* Hero Banner Grid (Visible when Bio is closed) */}
          <AnimatePresence>
            {!isAboutOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-12 border border-zinc-900 rounded-2xl bg-[#090909] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-500 uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" /> Curated Retrospective Exhibition
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-100 uppercase tracking-tight">
                    Aesthetics of Geometry & Atmosphere
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed font-sans">
                    A visual narrative capturing silent landscapes, minimalist architecture lines, and high-contrast urban street photography. Every record traces camera data and creative backgrounds.
                  </p>
                </div>

                {/* Micro metrics showing literal statistics (Authentic & Professional) */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-[11px] shrink-0 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-8">
                  <div>
                    <span className="text-zinc-500 uppercase">Archive Count:</span>
                    <span className="block text-zinc-200 font-semibold">{photos.length} Captured Frames</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase">Target Print:</span>
                    <span className="block text-zinc-200 font-semibold">Baryta Fine-Art Paper</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase">Exhibition Sites:</span>
                    <span className="block text-zinc-200 font-semibold">Paris / New York / Geneva</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase">Status:</span>
                    <span className="block text-amber-500 font-semibold uppercase">Active Retrospective</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Portfolio Elements */}
          <PhotoGrid
            photos={photos}
            onSelectPhoto={(photo) => setSelectedPhoto(photo)}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </main>
      </div>

      {/* Lightbox Trigger Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox
            photo={selectedPhoto}
            photos={photos.filter((p) => {
              const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
              const matchesSearch =
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.camera.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.lens.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesCategory && matchesSearch;
            })}
            onClose={() => setSelectedPhoto(null)}
            onNext={handleNextPhoto}
            onPrev={handlePrevPhoto}
            onInquirySubmitted={handleInquirySubmitted}
          />
        )}
      </AnimatePresence>

      {/* Footer Details */}
      <footer className="bg-[#050505] border-t border-zinc-900 py-6 font-mono text-[10px] text-zinc-500 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} ELENA ROUSSEAU. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span>STRICTLY HANDCRAFTED IN PARIS, FRANCE</span>
            <span>•</span>
            <span>ISO 9001 RESOLUTION</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
