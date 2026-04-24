import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=1200&auto=format&fit=crop",
    title: "DJI Inspire 3 Drone",
    subtitle: "Available for same-day rent in Bashundhara Block J.",
    tag: "Cinema Grade"
  },
  {
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    title: "Sony A7IV Mirrorless",
    subtitle: "Complete video production kit with G-Master lenses.",
    tag: "Top Rated"
  },
  {
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    title: "MacBook Pro M3 Max",
    subtitle: "Rendering powerhouse located in Gulshan 2.",
    tag: "High Demand"
  },
  {
    image: "https://images.unsplash.com/photo-1525201548942-d8b8bb66170c?q=80&w=1200&auto=format&fit=crop",
    title: "Gibson Les Paul",
    subtitle: "Legendary tone for your studio sessions.",
    tag: "Music Studio"
  },
  {
    image: "https://images.unsplash.com/photo-1617005814599-a9964a2e5452?q=80&w=1200&auto=format&fit=crop",
    title: "70-200mm GM Lens",
    subtitle: "Ultra-sharp telephoto for event coverage.",
    tag: "Pro Optics"
  }
];

export default function Hero() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-12 pb-24 overflow-hidden bg-[#FCFAF8]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/[0.03] blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/[0.03] blur-[140px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="w-full max-w-6xl z-10"
      >
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24">
          
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left relative">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 border border-slate-100 text-[8px] uppercase tracking-[0.6em] font-black mb-10 text-slate-400"
            >
              <ShieldCheck size={10} className="text-orange-500" />
              Verified P2P Dhaka
            </motion.div>
            
            <h1 className="font-display text-[15vw] md:text-[8rem] lg:text-[11rem] leading-[0.8] mb-12 tracking-[-0.04em] text-slate-950 font-extralight italic">
              Share.<br />
              <span className="text-orange-500 not-italic font-normal">Thrive.</span>
            </h1>
            
            <p className="text-[10px] md:text-xs text-slate-400 max-w-xs mb-14 font-medium uppercase tracking-[0.4em] leading-relaxed italic opacity-80">
              Dhaka's premium gear network. High-end tools delivered to your doorstep with precision.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <button 
                onClick={() => navigate('/browse')}
                className="w-full sm:w-auto bg-slate-950 text-white px-12 py-5 rounded-xl font-bold text-[10px] uppercase tracking-[0.4em] shadow-lg hover:bg-orange-500 transition-all duration-500 flex items-center justify-center gap-3 group overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Gallery <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
              <button className="w-full sm:w-auto bg-transparent text-slate-500 border-b border-slate-200 px-6 py-5 font-bold text-[10px] uppercase tracking-[0.4em] hover:text-slate-950 hover:border-slate-950 transition-all flex items-center justify-center gap-3">
                Curate Selection
              </button>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.5, duration: 1 }}
               className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 group shadow-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute inset-0"
                >
                  <img src={SLIDES[currentSlide].image} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[3s]" alt={SLIDES[currentSlide].title} referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white">
                     <div className="flex items-center gap-3 mb-3">
                       <div className="w-8 h-px bg-orange-500" />
                       <p className="text-[9px] font-black uppercase tracking-widest text-orange-500">{SLIDES[currentSlide].tag}</p>
                     </div>
                     <h3 className="text-2xl font-display italic underline underline-offset-8 decoration-white/20 mb-2">{SLIDES[currentSlide].title}</h3>
                     <p className="text-[9px] font-medium text-white/50 uppercase tracking-[0.2em]">{SLIDES[currentSlide].subtitle}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Slider Progress Indicators */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-1 h-6 rounded-full transition-all duration-700 ${
                    currentSlide === i ? "bg-orange-500 scale-y-150" : "bg-slate-200 hover:bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Overlay - Repositioned and refined */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute -bottom-10 left-0 bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 hidden lg:block shadow-sm"
        >
           <div className="flex items-center gap-10">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Network</p>
                <p className="text-2xl font-display italic">14.2K+</p>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Active Now</p>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
                  ))}
                </div>
              </div>
           </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

