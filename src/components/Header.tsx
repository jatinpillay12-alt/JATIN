import React, { useState, useEffect } from 'react';
import { Camera, Compass, Info, Mail, Clock, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InquiryFormState } from '../types';

interface HeaderProps {
  onAboutToggle: () => void;
  isAboutOpen: boolean;
  onInquirySubmitted: (formData: InquiryFormState) => void;
}

export default function Header({ onAboutToggle, isAboutOpen, onInquirySubmitted }: HeaderProps) {
  const [timeStr, setTimeStr] = useState('');
  const [contactForm, setContactForm] = useState<InquiryFormState>({
    fullName: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Local Time Tick (Paris GMT+2)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Target Paris time dynamically
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setTimeStr(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.email || !contactForm.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onInquirySubmitted(contactForm);
      setIsSubmitting(false);
      setSuccessMsg('Thank you. Elena will reach out to you within 48 hours.');
      setContactForm({ fullName: '', email: '', message: '' });
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1200);
  };

  return (
    <header className="border-b border-zinc-800 bg-[#070707]/90 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo and Sub-branding */}
        <div className="flex items-center gap-4">
          <div className="p-2 border border-zinc-700 bg-zinc-900 rounded-lg flex items-center justify-center">
            <Camera className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display uppercase tracking-widest text-zinc-100 flex items-center gap-2">
              Elena Rousseau <span className="text-[10px] px-1.5 py-0.5 border border-zinc-800 bg-zinc-900 text-zinc-400 rounded-sm font-mono tracking-tight font-normal">Paris Studio</span>
            </h1>
            <p className="text-xs text-zinc-400 tracking-wider font-mono">VISUAL JOURNAL & EXIF ARCHIVE</p>
          </div>
        </div>

        {/* Studio Diagnostics: Local Time & Offline Status */}
        <div className="hidden md:flex items-center gap-8 font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
            <span>Based in Paris, France</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Studio Local Time: <span className="text-zinc-200 font-medium font-mono">{timeStr || '00:00:00'}</span></span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAboutToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all border ${
              isAboutOpen
                ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700'
            }`}
            id="btn-about-toggle"
          >
            {isAboutOpen ? (
              <>
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                <span>Hide Bio</span>
              </>
            ) : (
              <>
                <Info className="w-3.5 h-3.5 text-zinc-400" />
                <span>About / Contact</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* About & Contact Sliding Drawer */}
      <AnimatePresence>
        {isAboutOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-zinc-800 bg-[#090909]"
          >
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Bio Column */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-500 mb-3 block">Perspective</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed font-light font-sans">
                    Elena Rousseau is an independent French documentary and architectural photographer based in Paris. 
                    Her work focuses on the dialogue between brutalist space layouts, urban shadows, and passing transient moments. 
                    Working seamlessly with high-fidelity digital back sensors and classic rangefinder frameworks, she preserves the minute lens details and raw technical characteristics (EXIF) of each frame.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-500 mb-2">Primary Hardware</h3>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-zinc-400">
                    <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded">Hasselblad X2D 100C</span>
                    <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded">Leica M11 M Monochrom</span>
                    <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded">Fujifilm GFX 100S</span>
                    <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded">Sony A7R V</span>
                  </div>
                </div>
              </div>

              {/* Exhibitions & Features */}
              <div className="lg:col-span-3 space-y-6">
                <div>
                  <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-500 mb-3">Selected Exhibitions</h3>
                  <ul className="space-y-3 font-mono text-xs text-zinc-400">
                    <li className="flex justify-between items-start gap-2 border-b border-zinc-800/60 pb-1.5">
                      <span>Galerie de L'Instant (Paris)</span>
                      <span className="text-zinc-500">2026</span>
                    </li>
                    <li className="flex justify-between items-start gap-2 border-b border-zinc-800/60 pb-1.5">
                      <span>Vanguard Spaces (New York)</span>
                      <span className="text-zinc-500">2025</span>
                    </li>
                    <li className="flex justify-between items-start gap-2 border-b border-zinc-800/60 pb-1.5">
                      <span>Exposition Nomade (Geneva)</span>
                      <span className="text-zinc-500">2024</span>
                    </li>
                    <li className="flex justify-between items-start gap-2 border-b border-zinc-800/60 pb-1.5">
                      <span>Rencontres d'Arles (Arles)</span>
                      <span className="text-zinc-500">2023</span>
                    </li>
                  </ul>
                </div>

                <div className="text-xs text-zinc-500 space-y-1">
                  <p>Inquiries regarding direct print shipping, fine-art licensing, or commissions can be made directly using the studio form.</p>
                </div>
              </div>

              {/* Sleek Form Column */}
              <div className="lg:col-span-4 border-l lg:border-l border-zinc-800 lg:pl-10">
                <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" /> Direct Studio Inquiry
                </h3>
                
                {successMsg ? (
                  <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs rounded-lg flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3 font-mono">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={contactForm.fullName}
                        onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your Email Address"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Inquiry or message details..."
                        rows={3}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full text-center bg-zinc-100 text-zinc-900 font-medium py-2 rounded text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all cursor-pointer font-sans duration-150 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending Request...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
