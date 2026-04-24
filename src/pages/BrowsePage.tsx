import { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useMarketplace } from '../context/MarketplaceContext';
import { Search, SlidersHorizontal, MapPin, Camera, Hammer, Tent, Monitor, Music, Trophy, Smartphone, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: null },
  { id: 'Camera', name: 'Photography', icon: Camera },
  { id: 'Drone', name: 'Drones', icon: Camera },
  { id: 'Power Tools', name: 'Power Tools', icon: Hammer },
  { id: 'Outdoor', name: 'Outdoor', icon: Tent },
  { id: 'Event & AV', name: 'Event & AV', icon: Monitor },
  { id: 'Music', name: 'Music', icon: Music },
  { id: 'Electronics', name: 'Electronics', icon: Smartphone },
  { id: 'Sports', name: 'Sports', icon: Trophy },
  { id: 'Appliances', name: 'Appliances', icon: Smartphone },
];

export default function BrowsePage() {
  const { items } = useMarketplace();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, items]);

  return (
    <div className="pt-20 min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex max-w-[1600px] mx-auto w-full px-2 sm:px-6">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-500 overflow-hidden hidden lg:block bg-white sticky top-20 h-[calc(100vh-5rem)] border-r border-slate-50`}>
          <div className="p-8 w-64">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.6em] text-slate-400 mb-10">REGISTRY</h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center justify-between px-0 py-2.5 transition-all text-[9px] font-bold uppercase tracking-[0.2em] group ${
                    selectedCategory === cat.id 
                    ? 'text-orange-500 pl-2' 
                    : 'text-slate-400 hover:text-slate-950 pl-0'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                    <span>{cat.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 px-4 lg:px-12 py-8">
          {/* Header */}
          <div className="bg-[#fdfdfc] p-8 rounded-xl border border-slate-100 mb-12">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
              <div>
                 <div className="flex items-center gap-4 mb-3">
                    <h1 className="font-display text-4xl italic text-slate-950">Marketplace.</h1>
                    <div className="bg-slate-950 text-white px-2.5 py-1 rounded-sm text-[7px] font-bold uppercase tracking-[0.3em]">{filteredItems.length} ASSETS</div>
                 </div>
                 <div className="w-12 h-px bg-orange-500 mb-3" />
                 <p className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.4em] opacity-80">Verified high-grade creative equipment nearby.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                <div className="relative w-full sm:w-64 lg:w-80">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={14} strokeWidth={1} />
                  <input 
                    type="text" 
                    placeholder="Search the archive..."
                    className="w-full bg-[#fdfdfc] py-3 pl-8 pr-4 border-b border-slate-100 focus:border-orange-500 transition-all font-medium text-[10px] uppercase tracking-widest outline-none placeholder:text-slate-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="compact-grid">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredItems.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                <Search size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No gear found matching your search.</p>
              <button 
                onClick={() => {setSearch(''); setSelectedCategory('all');}}
                className="mt-6 text-orange-500 font-black text-sm uppercase tracking-widest hover:underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
