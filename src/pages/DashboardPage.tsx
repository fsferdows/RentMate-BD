import React from 'react';
import { motion } from 'motion/react';
import { 
  Package, Calendar, MessageSquare, Settings, 
  ChevronRight, Plus, Star, MapPin, ShieldCheck, 
  Clock, CheckCircle2, TrendingUp
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { items, bookings, currentUser, loading, login } = useMarketplace();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-100 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FCFAF8]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-200 mb-10 shadow-sm">
             <Star size={24} strokeWidth={1} />
          </div>
          <h2 className="font-display italic text-4xl text-slate-950 mb-6">Your Pocket is Locked.</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.6em] max-w-sm leading-loose mb-12">
            Login to manage your listings, bookings, and earned credits.
          </p>
          <button 
            onClick={login}
            className="px-12 py-5 bg-slate-950 text-white rounded-full font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-orange-500 transition-all shadow-2xl hover:shadow-orange-500/20 active:scale-95"
          >
            Authenticate with Google
          </button>
        </div>
      </div>
    );
  }

  const myItems = items.filter(i => i.ownerId === currentUser.id);
  const myBookings = bookings.filter(b => b.renterId === currentUser.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">My Pocket</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Managing {myItems.length} active listings and {myBookings.length} bookings</p>
          </div>
          <button 
            onClick={() => {}} // This should open the listing modal, but since it's in Navbar, we'll just link to browse for now or trigger via a state if we had global modal
            className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            Post New Gear
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-8">Trust Score</h3>
               <div className="flex items-end gap-3 mb-4">
                 <span className="text-6xl font-black leading-none">98</span>
                 <span className="text-xl font-black text-orange-500 mb-1">/100</span>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 leading-relaxed">
                 You are in the top 5% of verified lenders in Dhaka.
               </p>
               <div className="flex items-center gap-2 text-[10px] font-black text-green-400 uppercase tracking-widest bg-white/5 w-fit px-4 py-2 rounded-full border border-white/10">
                 <TrendingUp size={12} />
                 +12% vs last month
               </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Recent Activity</h3>
               <div className="space-y-6">
                 {[
                   { icon: CheckCircle2, text: "NID Verification Successful", time: "2h ago", color: "text-green-500" },
                   { icon: MessageSquare, text: "Inquiry for Sony A7IV", time: "5h ago", color: "text-blue-500" },
                   { icon: Clock, text: "Booking scheduled for Friday", time: "1d ago", color: "text-orange-500" },
                 ].map((act, i) => (
                   <div key={i} className="flex gap-4">
                     <div className={`w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center ${act.color}`}>
                       <act.icon size={16} />
                     </div>
                     <div>
                       <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{act.text}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{act.time}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Listings & Bookings Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Active Bookings */}
            <section>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-2">Gear I've Booked</h2>
              <div className="space-y-4">
                {myBookings.length > 0 ? myBookings.map(b => {
                  const item = items.find(i => i.id === b.itemId);
                  return (
                    <motion.div 
                      key={b.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-orange-500 transition-all cursor-pointer"
                      onClick={() => navigate('/chat')}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden">
                          <img src={item?.image} className="w-full h-full object-cover" alt={item?.name} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase tracking-tight mb-1">{item?.name}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{b.status}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{b.startDate} - {b.endDate}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  );
                }) : (
                  <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-[40px]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">You haven't booked anything yet.</p>
                    <button onClick={() => navigate('/browse')} className="mt-4 text-orange-500 font-black uppercase text-[10px] tracking-widest underline underline-offset-8">Explore Marketplace</button>
                  </div>
                )}
              </div>
            </section>

            {/* My Listings */}
            <section>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-2">Gear I'm Lending</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {myItems.map(item => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                         <Package size={24} />
                      </div>
                      <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Active
                      </div>
                    </div>
                    <h3 className="font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-orange-500 transition-colors">{item.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">৳{item.price} / Day</p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-1.5">
                        <Star size={12} className="text-orange-500 fill-orange-500" />
                        <span className="text-[10px] font-black text-slate-900">{item.rating}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">Verified</span>
                      </div>
                      <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">
                        Deactivate
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
