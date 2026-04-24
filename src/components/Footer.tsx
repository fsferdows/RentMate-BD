import { motion } from 'motion/react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#FCFAF8] pt-32 pb-12 px-6 sm:px-10 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-8 h-8 bg-slate-950 rounded-full flex items-center justify-center text-white font-black text-xs group-hover:bg-orange-500 transition-colors">R</div>
              <span className="font-display text-lg italic lowercase tracking-tight text-slate-950">remarket <span className="text-orange-500">bd</span></span>
            </Link>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.4em] leading-[2] mb-10 max-w-sm opacity-80">
              The premier peer-to-peer asset network for Dhaka's high-end creative community.
            </p>
            <div className="flex gap-6">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="text-slate-400 hover:text-orange-500 transition-colors">
                  <Icon size={14} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[9px] font-bold uppercase tracking-[0.6em] text-slate-950 mb-10">REGISTRY</h4>
            <ul className="space-y-4">
              {['Photography', 'Drones', 'AV Kit', 'Creative Lab'].map((item) => (
                <li key={item}>
                  <Link to="/browse" className="text-[8px] font-medium text-slate-400 uppercase tracking-[0.4em] hover:text-slate-950 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[9px] font-bold uppercase tracking-[0.6em] text-slate-950 mb-10">PROTOCOL</h4>
            <ul className="space-y-4">
              {['Verification', 'Insurance', 'Terms', 'Privacy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[8px] font-medium text-slate-400 uppercase tracking-[0.4em] hover:text-slate-950 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[9px] font-bold uppercase tracking-[0.6em] text-slate-950 mb-10">OFFICE</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <MapPin size={10} className="text-orange-500/60" />
                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-[0.4em]">Gulshan, Dhaka</p>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={10} className="text-orange-500/60" />
                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-[0.4em]">concierge@remarket.bd</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[7px] font-bold text-slate-300 uppercase tracking-[0.6em]">© 2024 REMARKET BD. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-10 opacity-30">
             <div className="text-[7px] font-bold uppercase tracking-[0.4em] text-slate-400">Dhaka</div>
             <div className="text-[7px] font-bold uppercase tracking-[0.4em] text-slate-400">London</div>
             <div className="text-[7px] font-bold uppercase tracking-[0.4em] text-slate-400">Dubai</div>
          </div>
        </div>
      </div>
    </footer>

  );
}
