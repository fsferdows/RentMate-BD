import { Camera, Hammer, Tent, Music, Monitor, Trophy, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'Camera', name: 'Photography', icon: Camera, count: 128 },
  { id: 'Drone', name: 'Drones', icon: Camera, count: 45 },
  { id: 'Power Tools', name: 'Power Tools', icon: Hammer, count: 32 },
  { id: 'Outdoor', name: 'Outdoor', icon: Tent, count: 18 },
  { id: 'Music', name: 'Music', icon: Music, count: 24 },
  { id: 'Electronics', name: 'Electronics', icon: Smartphone, count: 56 },
];

export default function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <section id="categories" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 overflow-hidden">
      <div className="flex items-end justify-between mb-12">
        <div className="relative">
          <div className="w-12 h-px bg-orange-500 mb-6" />
          <h2 className="text-4xl md:text-5xl font-display italic text-slate-950 mb-2">Curated Assets.</h2>
          <p className="text-slate-400 font-medium text-[9px] uppercase tracking-[0.4em] opacity-80">Premium equipment for the discerning creative.</p>
        </div>
        <button 
          onClick={() => navigate('/browse')}
          className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400 hover:text-orange-500 transition-colors"
        >
          EXPLORE ALL &rarr;
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            viewport={{ once: true }}
            onClick={() => navigate(`/browse?category=${cat.id}`)}
            className="flex-shrink-0 bg-[#fdfdfc] border border-slate-100 px-8 py-5 rounded-lg flex items-center gap-4 shadow-sm hover:border-orange-500/20 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 bg-slate-50 rounded-md flex items-center justify-center group-hover:bg-orange-50 transition-colors">
              <cat.icon size={16} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">{cat.name}</span>
              <span className="block text-[7px] font-bold text-slate-400 uppercase tracking-widest">{cat.count} listings</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
