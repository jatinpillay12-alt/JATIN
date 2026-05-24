import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ArrowRight, MapPin, Calendar, Compass, ShoppingCart, Sparkles, Sliders } from 'lucide-react';
import { Photo, InquiryFormState } from '../types';

interface LightboxProps {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onInquirySubmitted: (formData: InquiryFormState) => void;
}

export default function Lightbox({
  photo,
  photos,
  onClose,
  onNext,
  onPrev,
  onInquirySubmitted,
}: LightboxProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [size, setSize] = useState<'8x12' | '12x18' | '16x24' | '24x36'>('12x18');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const handleSubmitPrintInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setSubmitting(true);
    setTimeout(() => {
      onInquirySubmitted({
        fullName: name,
        email,
        message: msg || `Interested in custom print order of size ${size}.`,
        photoId: photo.id,
        printSize: size,
      });
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setInquiryOpen(false);
        // Reset states
        setName('');
        setEmail('');
        setMsg('');
      }, 3500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col items-center justify-center bg-[#070707]/98 backdrop-blur-lg">
      
      {/* Top action header for lightbox */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-50">
        <div className="text-xs font-mono text-zinc-400">
          INDEX <span className="text-zinc-200">{(photos.indexOf(photo) + 1).toString().padStart(2, '0')}</span> / <span className="text-zinc-500">{photos.length.toString().padStart(2, '0')}</span>
        </div>
        
        {/* Category designation banner */}
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>{photo.title}</span>
        </div>

        {/* Close trigger */}
        <button
          onClick={onClose}
          className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-full transition-colors cursor-pointer"
          title="Close Lightbox (Esc)"
          id="lightbox-close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main navigation and slider body */}
      <div className="relative w-full h-[calc(100vh-140px)] flex items-center justify-center px-4 md:px-16 mt-12 mb-4">
        {/* Navigation - Arrow Left */}
        <button
          onClick={onPrev}
          className="absolute left-4 md:left-8 z-20 p-3 bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 hover:border-zinc-700 transition-colors shadow-lg cursor-pointer max-sm:hidden"
          title="Previous Photo (Arrow Left)"
          id="lightbox-prev"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Photography Canvas display */}
        <div className="max-w-5xl max-h-full aspect-auto flex items-center justify-center relative">
          <motion.img
            key={photo.imageUrl}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            src={photo.imageUrl}
            alt={photo.title}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[70vh] object-contain rounded-md shadow-2xl border border-zinc-850 select-none"
          />
        </div>

        {/* Navigation - Arrow Right */}
        <button
          onClick={onNext}
          className="absolute right-4 md:right-8 z-20 p-3 bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 hover:border-zinc-700 transition-colors shadow-lg cursor-pointer max-sm:hidden"
          title="Next Photo (Arrow Right)"
          id="lightbox-next-btn"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* EXIF Data Strip (Horizontal scrollable bar) */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#090909] border-t border-zinc-850 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 z-40 max-h-[160px] overflow-y-auto">
        {/* Camera meta */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-xs text-zinc-400 font-mono w-full md:w-auto">
          {/* Location details */}
          <div className="flex items-center gap-1.5 bg-zinc-900/60 px-3 py-1 rounded border border-zinc-800">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-zinc-200">{photo.location}</span>
          </div>

          <div className="flex gap-4 border-l border-zinc-800 pl-4">
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Camera</span>
              <span className="text-zinc-200">{photo.camera}</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-zinc-500 text-[10px] block uppercase">Lens</span>
              <span className="text-zinc-200">{photo.lens}</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Parameters</span>
              <span className="text-amber-500 font-semibold">{photo.shutter} @ {photo.aperture}</span>
            </div>
            <div className="hidden md:block">
              <span className="text-zinc-500 text-[10px] block uppercase">ISO / Focal</span>
              <span className="text-zinc-200">ISO {photo.iso} • {photo.focalLength}</span>
            </div>
          </div>
        </div>

        {/* Actions panel */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-center sm:justify-end">
          {/* Floating phone navigation markers */}
          <div className="sm:hidden flex items-center gap-2 mr-2">
            <button
              onClick={onPrev}
              className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-400 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNext}
              className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-400 rounded-lg"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Inquiry Form */}
          <button
            onClick={() => setInquiryOpen(!inquiryOpen)}
            className="flex items-center gap-2 bg-amber-500 text-zinc-950 font-medium px-4 py-2 rounded text-xs tracking-wider uppercase hover:bg-amber-400 cursor-pointer duration-150 shadow-md shadow-amber-500/10 shrink-0"
            id="btn-print-inquiry"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Customize Fine-Art Print</span>
          </button>
        </div>
      </div>

      {/* Embedded print order drawer overlay */}
      <AnimatePresence>
        {inquiryOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-[80px] sm:right-6 w-full max-w-sm bg-zinc-950/95 border border-zinc-800 rounded-xl p-5 shadow-2xl z-50 overflow-hidden backdrop-blur-md"
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div>
                <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-400">Archival Print request</h4>
                <p className="text-xs text-white truncate max-w-[200px] font-semibold mt-0.5">"{photo.title}"</p>
              </div>
              <button
                onClick={() => setInquiryOpen(false)}
                className="p-1 hover:bg-zinc-900 rounded-full text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-3 font-mono">
                <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center mx-auto">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <h5 className="text-xs text-emerald-400 uppercase font-semibold">Inquiry Successful</h5>
                <p className="text-[11px] text-zinc-400 leading-relaxed px-4">
                  We have cataloged your print selection. The signature packaging details have been sent to your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitPrintInquiry} className="space-y-3.5 font-mono text-xs">
                {/* Size Selector */}
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5 block">Select Archival Dimensions</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['8x12', '12x18', '16x24', '24x36'] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSize(sz)}
                        className={`py-1.5 rounded border text-[10px] text-center font-medium uppercase font-mono ${
                          size === sz
                            ? 'border-amber-500 text-amber-500 bg-amber-500/10'
                            : 'border-zinc-800 text-zinc-400 bg-zinc-900/40 hover:border-zinc-700'
                        }`}
                      >
                        {sz}"
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">Printed on Hahnemühle Photo Rag Baryta 315gsm.</span>
                </div>

                {/* Name */}
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Message / Details */}
                <div>
                  <textarea
                    rows={2}
                    placeholder="Custom mounting requests or shipping details..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  ></textarea>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold uppercase font-sans tracking-widest rounded transition-all duration-150 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Confirming with Studio...' : 'Submit Print Order Request'}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
