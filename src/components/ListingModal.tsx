import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, CheckCircle2, ChevronRight, Camera, Cpu, MapPin, DollarSign } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ListingModal({ isOpen, onClose }: ListingModalProps) {
  const { addItem, currentUser, login } = useMarketplace();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    location: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    specs: ['', '', '']
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      login();
      return;
    }
    
    await addItem({
      name: formData.name,
      category: formData.category,
      price: parseInt(formData.price),
      location: formData.location,
      description: formData.description,
      image: formData.image,
      specs: formData.specs.filter(s => s.trim() !== '')
    });
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setStep(1);
      setFormData({
        name: '',
        category: '',
        price: '',
        location: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
        specs: ['', '', '']
      });
    }, 2000);
  };

  const handleNext = () => setStep(prev => prev + 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl bg-white sm:rounded-[40px] shadow-2xl overflow-hidden min-h-[70vh] sm:min-h-0"
          >
            {isSuccess ? (
              <div className="p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px]">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white mb-10 shadow-xl"
                >
                  <CheckCircle2 size={32} strokeWidth={1} />
                </motion.div>
                <h3 className="text-3xl font-display italic text-slate-950 mb-4">Listing Live.</h3>
                <p className="text-slate-400 font-medium uppercase text-[9px] tracking-[0.4em] leading-relaxed max-w-xs opacity-80">Your assets are now visible to the creative community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 sm:p-16">
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <h2 className="text-4xl font-display italic text-slate-930 mb-3">Registry.</h2>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-px bg-orange-500" />
                      <p className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.4em]">Step {step} of 3</p>
                    </div>
                  </div>
                  <button type="button" onClick={onClose} className="text-slate-300 hover:text-slate-950 transition-colors mt-2">
                    <X size={20} strokeWidth={1} />
                  </button>
                </div>

                {step === 1 && (
                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 pl-1">Name</label>
                        <input 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. Red Komodo" 
                          className="w-full bg-[#fdfdfc] border-b border-slate-100 py-3 text-sm font-medium focus:border-orange-500 outline-none transition-all placeholder:text-slate-200"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 pl-1">Category</label>
                        <select 
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-[#fdfdfc] border-b border-slate-100 py-3 text-sm font-medium focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Selection</option>
                          <option value="Camera">Photography</option>
                          <option value="Drone">Aerial Gear</option>
                          <option value="Lens">Optics</option>
                          <option value="Lighting">Atmosphere</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 pl-1">Description</label>
                      <textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Asset details and condition..." 
                        rows={2}
                        className="w-full bg-[#fdfdfc] border-b border-slate-100 py-3 text-sm font-medium focus:border-orange-500 outline-none transition-all resize-none placeholder:text-slate-200"
                      />
                    </div>
                    <button type="button" onClick={handleNext} className="w-full py-5 bg-slate-950 text-white rounded-md font-bold text-[9px] uppercase tracking-[0.4em] hover:bg-orange-500 transition-all flex items-center justify-center gap-3 group">
                      CONTINUE <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 pl-1">Daily Rate (BDT)</label>
                        <div className="relative">
                          <input 
                            required
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            placeholder="3500" 
                            className="w-full bg-[#fdfdfc] border-b border-slate-100 py-3 text-sm font-medium focus:border-orange-500 outline-none transition-all placeholder:text-slate-200"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 pl-1">District</label>
                        <div className="relative">
                          <input 
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="e.g. Gulshan" 
                            className="w-full bg-[#fdfdfc] border-b border-slate-100 py-3 text-sm font-medium focus:border-orange-500 outline-none transition-all placeholder:text-slate-200"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 pl-1">Technical Specs</label>
                      <div className="space-y-4">
                        {formData.specs.map((spec, i) => (
                          <input 
                            key={i}
                            value={spec}
                            onChange={(e) => {
                              const newSpecs = [...formData.specs];
                              newSpecs[i] = e.target.value;
                              setFormData({...formData, specs: newSpecs});
                            }}
                            placeholder={`Parameter ${i + 1}`}
                            className="w-full bg-[#fdfdfc] border-b border-slate-100 py-3 text-sm font-medium focus:border-orange-500 outline-none transition-all placeholder:text-slate-200"
                          />
                        ))}
                      </div>
                    </div>
                    <button type="button" onClick={handleNext} className="w-full py-5 bg-slate-950 text-white rounded-md font-bold text-[9px] uppercase tracking-[0.4em] hover:bg-orange-500 transition-all flex items-center justify-center gap-3 group">
                      CONTINUE <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-10">
                    <div className="aspect-video bg-[#f9f8f6] rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-6 group hover:border-orange-500/20 transition-all cursor-pointer overflow-hidden">
                      {formData.image ? (
                        <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-orange-500 transition-colors shadow-sm">
                            <Upload size={20} strokeWidth={1} />
                          </div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400 group-hover:text-orange-500 transition-colors">Manifesto Asset Rendering</p>
                        </>
                      )}
                    </div>
                    
                    <div className="p-8 bg-[#fdfdfc] rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-8 h-px bg-orange-500" />
                         <span className="text-[9px] font-bold text-slate-950 uppercase tracking-[0.4em]">Declaration</span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-[0.2em] opacity-80">By submitting, you certify item authenticity and adherence to the Remarket BD exchange protocol.</p>
                    </div>

                    <button type="submit" className="w-full py-5 bg-orange-500 text-white rounded-md font-bold text-[9px] uppercase tracking-[0.5em] hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95">
                      PUBLISH ASSET
                    </button>
                  </motion.div>
                )}
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
