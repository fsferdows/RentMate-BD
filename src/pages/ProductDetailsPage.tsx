import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import maplibregl from 'maplibre-gl';
import { 
  ChevronLeft, Star, MapPin, Shield, Calendar, 
  MessageSquare, User, Info, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LOCATION_COORDS: Record<string, [number, number]> = {
  'Bashundhara R/A': [90.4497, 23.8223],
  'Gulshan 2': [90.4152, 23.7925],
  'Banani': [90.4007, 23.7940],
  'Dhanmondi': [90.3776, 23.7461],
  'Uttara': [90.3944, 23.8759],
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, bookItem, startThread, currentUser, login } = useMarketplace();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  const item = items.find(i => i.id === id);

  useEffect(() => {
    if (!item || !mapContainer.current) return;

    const coords = LOCATION_COORDS[item.location] || [90.4125, 23.8103];

    if (!mapInstance.current) {
      mapInstance.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: coords as [number, number],
        zoom: 13,
      });

      // Add a custom marker
      new maplibregl.Marker({ color: '#f97316' })
        .setLngLat(coords as [number, number])
        .addTo(mapInstance.current);
    } else {
      mapInstance.current.setCenter(coords as [number, number]);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [item]);

  if (!item) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-400">Item not found</div>;

  const handleBook = async () => {
    setIsBooking(true);
    try {
      await bookItem(item.id, '2026-05-01', '2026-05-03');
      setIsBooking(false);
      setBookingSuccess(true);
    } catch (error) {
      console.error(error);
      setIsBooking(false);
    }
  };

  const handleStartThread = async () => {
    if (!currentUser) login();
    const threadId = await startThread(item.id, item.ownerId);
    navigate('/chat', { state: { threadId } });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-orange-500 mb-6 transition-colors group"
        >
          <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          Marketplace
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Images */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
              <img src={item.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={item.name} />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-xl bg-slate-50 border border-slate-100 overflow-hidden opacity-60 hover:opacity-100 transition-all cursor-pointer">
                   <img src={item.image} className="w-full h-full object-cover grayscale" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-md bg-slate-100 text-[8px] font-bold uppercase tracking-widest text-slate-500">{item.category}</span>
                <div className="flex items-center gap-1 text-orange-500 text-[8px] font-black bg-orange-50 px-2.5 py-1 rounded-md">
                  <Star size={10} fill="currentColor" />
                  {item.rating}
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter mb-4 leading-none italic">{item.name}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[8px] font-black uppercase tracking-[0.2em]">
                <MapPin size={12} className="text-orange-500" />
                {item.location}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 text-white relative overflow-hidden mb-8 shadow-xl">
              <div className="flex items-end justify-between gap-6 mb-6">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Daily rate</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">৳{item.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right border-l border-white/10 pl-6">
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Status</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-400">Available</p>
                </div>
              </div>

              {bookingSuccess ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-500 text-white rounded-2xl p-4 flex flex-col items-center text-center gap-2"
                >
                  <CheckCircle2 size={24} />
                  <div>
                    <p className="font-black uppercase tracking-widest text-[9px]">Booking Ready</p>
                  </div>
                  <button 
                    onClick={handleStartThread}
                    className="mt-1 text-[8px] font-black uppercase tracking-widest bg-white text-green-600 px-4 py-2 rounded-lg"
                  >
                    Discuss Logistics
                  </button>
                </motion.div>
              ) : (
                <button 
                  onClick={handleBook}
                  disabled={isBooking}
                  className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 group"
                >
                  {isBooking ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="border-2 border-white/20 border-t-white w-4 h-4 rounded-full mx-auto"
                    />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Secure Booking <ArrowRight size={12} className="group-hover:translate-x-1" />
                    </span>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-4">
                  Specs
                  <span className="flex-1 h-px bg-slate-50" />
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {item.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-tight bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                      <CheckCircle2 size={10} className="text-orange-500" />
                      {spec}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 uppercase tracking-tight text-[11px]">{item.ownerName}</p>
                    <div className="flex items-center gap-1 text-[7px] font-black uppercase text-orange-500">
                      <Shield size={8} fill="currentColor" /> Verified Member
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleStartThread}
                  className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-orange-500 flex items-center justify-center transition-colors"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Location Map */}
        <section className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h4 className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Location Sync.</h4>
            <span className="flex-1 h-px bg-slate-50" />
          </div>
          
          <div className="relative aspect-[21/9] rounded-[40px] overflow-hidden border border-slate-100 group">
            <div ref={mapContainer} className="w-full h-full grayscale brightness-95 contrast-75 group-hover:grayscale-0 transition-all duration-1000" />
            <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-xl pointer-events-none group-hover:translate-x-2 transition-transform">
               <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest mb-0.5">{item.location}</p>
               <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Verified safe zone</p>
            </div>
          </div>
        </section>

        {/* Safety */}
        <section className="mt-16 p-8 md:p-12 rounded-[40px] bg-slate-50 border border-slate-100 mb-16 relative overflow-hidden">
           <div className="max-w-2xl">
             <h4 className="text-[8px] font-black uppercase tracking-[0.6em] text-orange-500 mb-4 italic">Guaranteed Sync.</h4>
             <h2 className="text-3xl md:text-4xl font-black text-slate-950 uppercase tracking-tighter mb-8 leading-none">Safe zones & <span className="text-slate-400">Escrow.</span></h2>
             
             <div className="grid grid-cols-2 gap-8">
               <div>
                  <Shield size={24} className="text-orange-500 mb-4" />
                  <h5 className="text-[8px] font-black uppercase tracking-widest text-slate-950 mb-2">Protection</h5>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Secured escrow active.</p>
               </div>
               <div>
                  <CheckCircle2 size={24} className="text-orange-500 mb-4" />
                  <h5 className="text-[8px] font-black uppercase tracking-widest text-slate-950 mb-2">Verified</h5>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">NID-verified hosts.</p>
               </div>
             </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
