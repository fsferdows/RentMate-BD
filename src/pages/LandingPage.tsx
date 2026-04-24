import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { Shield, CreditCard, UserCheck, MessageSquare, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import Footer from '../components/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const { items } = useMarketplace();
  const featuredItems = items.slice(0, 8);
  const allItems = items;
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <CategoryGrid />
      
      {/* How it Works */}
      <section id="how-it-works" className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { number: "01", title: "Curation", desc: "Access a private registry of high-end creative equipment.", icon: Shield },
            { number: "02", title: "Verification", desc: "Identity and assets verified through our proprietary protocol.", icon: CreditCard },
            { number: "03", title: "Exchange", desc: "Secure, white-glove handovers within your local community.", icon: Zap }
          ].map((step, idx) => (
            <div key={idx} className="relative group">
              <span className="font-display text-[10rem] font-extralight text-slate-100 absolute -top-20 -left-10 tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 select-none italic pointer-events-none">{step.number}</span>
              <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
                <div className="w-12 h-12 rounded-xl bg-[#FCFAF8] shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 mb-8 group-hover:text-orange-500 group-hover:border-orange-500/20 transition-all duration-500">
                   <step.icon size={20} strokeWidth={1} />
                </div>
                <h3 className="font-display italic text-2xl mb-4 text-slate-950">{step.title}</h3>
                <p className="text-slate-400 font-medium text-[10px] leading-relaxed tracking-[0.2em] uppercase max-w-[200px] opacity-80">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 bg-[#f9f8f6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <div className="w-12 h-px bg-orange-500 mb-6" />
              <h2 className="text-4xl md:text-5xl font-display italic text-slate-950 mb-2">The Selection.</h2>
              <p className="text-slate-400 font-medium text-[9px] uppercase tracking-[0.4em] opacity-80">Top-tier assets from verified collectors in your district.</p>
            </div>
            <Link to="/browse" className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400 hover:text-orange-500 transition-colors border-b border-slate-200 pb-1">
              MARKETPLACE &rarr;
            </Link>
          </div>
          
          <div className="compact-grid">
            {featuredItems.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* The Gear Archive */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 mb-20 text-center">
           <div className="w-12 h-px bg-slate-200 mb-8 mx-auto" />
           <h2 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.6em] mb-4">CURATED ARCHIVE</h2>
           <p className="text-4xl md:text-5xl font-display italic text-slate-950 leading-tight">A comprehensive registry of local high-end assets.</p>
        </div>
        
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-1 px-4">
           {allItems.map((item, idx) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               transition={{ delay: idx * 0.01 }}
               className="group relative aspect-square overflow-hidden bg-slate-50 cursor-pointer"
               onClick={() => navigate(`/product/${item.id}`)}
             >
               <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/[0.08] transition-colors duration-700" />
             </motion.div>
           ))}
        </div>
      </section>
      
      {/* Trust & Safety Section */}
      <section id="trust" className="py-32 bg-slate-950 text-white mx-0 md:mx-6 md:rounded-[40px] mb-24 overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.05] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-md bg-white/[0.03] border border-white/10 text-[9px] font-bold uppercase tracking-[0.4em] mb-12 text-orange-500/80">
                <Shield size={10} />
                Protocol 4.0
              </div>
              <h2 className="text-6xl md:text-7xl font-display italic leading-[0.9] mb-10 tracking-tight">Trust as a <br /><span className="text-orange-500 not-italic font-sans font-bold">Standard.</span></h2>
              <p className="text-slate-500 text-sm font-medium mb-16 max-w-md leading-relaxed uppercase tracking-[0.2em] opacity-80">
                A multi-layered security architecture engineered for the Dhaka creative ecosystem.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-12">
                {[
                  { icon: UserCheck, title: "Identity", desc: "Government-tier verification via EC API." },
                  { icon: Shield, title: "Custody", desc: "Secured escrow through MFS merchant flows." },
                  { icon: CreditCard, title: "Capital", desc: "Verified transactional history for every member." },
                  { icon: MessageSquare, title: "Reputation", desc: "Algorithmic community trust indexing." }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-5 group">
                    <div className="w-10 h-px bg-white/10 group-hover:bg-orange-500 transition-colors duration-500" />
                    <div>
                      <h4 className="font-display italic text-xl mb-2">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em] leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 p-1 group">
                <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1556742049-13da736c7459?q=80&w=1200&auto=format&fit=crop" 
                    alt="Safe Transaction"
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-opacity duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-12 left-12">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white">
                      <div className="w-8 h-px bg-white/20" />
                      Zero Fraud Guarantee
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-40 max-w-7xl mx-auto px-6 mb-24">
        <div className="max-w-3xl mx-auto text-center mb-32">
          <div className="w-12 h-px bg-orange-500 mb-8 mx-auto" />
          <h2 className="text-5xl md:text-6xl font-display italic text-slate-950 mb-6">The Collective Voice.</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em]">Professionals who set the standard for asset sharing in Dhaka.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-20 lg:gap-32">
          {[
            {
              name: "Tanveer Hassan",
              role: "Cinematographer",
              text: "The verification protocol is unparalleled. It's allowed me to monetize my high-end studio assets with complete professional confidence.",
              avatar: "TH"
            },
            {
              name: "Sarah Ahmed",
              role: "Design Lead",
              text: "A curated experience from start to finish. The quality of equipment available in Bashundhara was a genuine discovery for our studio.",
              avatar: "SA"
            },
            {
              name: "Rashed Khan",
              role: "Architect",
              text: "Efficiency meets premium service. The local exchange model has transformed how we manage our specialized tool inventory.",
              avatar: "RK"
            }
          ].map((t, i) => (
            <motion.div 
              key={i}
              className="flex flex-col text-center items-center group"
            >
              <div className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-300 mb-10 group-hover:border-orange-500/20 group-hover:text-slate-950 transition-all duration-500 shadow-sm">
                {t.avatar}
              </div>
              <p className="text-xl md:text-2xl font-display italic text-slate-950 leading-relaxed mb-10 opacity-85">
                "{t.text}"
              </p>
              <div>
                <h4 className="text-[10px] font-bold text-slate-950 uppercase tracking-[0.2em] mb-1.5">{t.name}</h4>
                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-[0.4em]">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
