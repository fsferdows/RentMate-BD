import { MapPin, Star, ShieldCheck, ArrowRight, Zap, Clock, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Item } from '../context/MarketplaceContext';

interface ProductCardProps {
  item: Item;
  key?: string;
}

export default function ProductCard({ item }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="group bg-white rounded-xl p-2 border border-slate-100 flex flex-col hover:border-orange-500/20 transition-all duration-500"
    >
      <Link to={`/product/${item.id}`} className="block relative aspect-[4/5] rounded-lg overflow-hidden mb-3 bg-slate-50">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover grayscale brightness-[0.98] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2">
          <div className="bg-white/80 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-white/20">
            <Star size={8} className="text-orange-500 fill-orange-500" />
            <span className="text-[7px] font-black text-slate-900">{item.rating}</span>
          </div>
        </div>
      </Link>
      
      <div className="flex flex-col flex-1 px-1 pb-1">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[6px] font-black text-orange-500 uppercase tracking-[0.4em]">{item.category}</p>
          <div className="flex items-center gap-1 text-slate-300">
            <MapPin size={8} />
            <span className="text-[6px] font-bold uppercase truncate tracking-tighter">{item.location}</span>
          </div>
        </div>
        
        <Link to={`/product/${item.id}`}>
          <h3 className="font-display italic text-slate-950 text-base mb-3 leading-none line-clamp-1 group-hover:text-orange-500 transition-colors">{item.name}</h3>
        </Link>
        
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="text-slate-950">
            <span className="text-xs font-black tracking-tight italic">৳{item.price.toLocaleString()}</span>
            <span className="text-[7px] uppercase font-bold text-slate-400"> / day</span>
          </div>
          <Link to={`/product/${item.id}`} className="text-[7px] font-black uppercase tracking-widest text-slate-400 group-hover:text-orange-500 transition-colors flex items-center gap-1">
            DETAILS <ArrowRight size={8} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
