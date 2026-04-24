import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User, Menu, MessageSquare, LogOut, Settings, CreditCard, ChevronRight, X, Heart, ShieldCheck, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ListingModal from './ListingModal';
import { useMarketplace } from '../context/MarketplaceContext';

export default function Navbar() {
  const { currentUser, login, logout, loading } = useMarketplace();
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = location.pathname === '/chat';

  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { label: 'Browse Gallery', icon: <Search size={14} />, path: '/browse' },
    { label: 'Verified Listing', icon: <ShieldCheck size={14} />, path: '/browse' },
    { label: 'Rentals & Earns', icon: <CreditCard size={14} />, path: '/dashboard' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] flex justify-center p-2 sm:p-3 pointer-events-none">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`w-full max-w-3xl ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white/90 backdrop-blur-lg border-slate-200'} border rounded-2xl px-3 py-1.5 flex items-center justify-between pointer-events-auto shadow-xl shadow-slate-900/5 relative`}
        >
          <Link to="/" className="flex items-center gap-3 pr-6 border-r border-slate-100 group">
            <div className="w-7 h-7 bg-slate-950 rounded-full flex items-center justify-center text-white font-black text-[10px] group-hover:bg-orange-500 transition-colors">R</div>
            <span className={`font-display text-sm italic lowercase tracking-tight ${isDark ? 'text-white' : 'text-slate-950'} hidden sm:block`}>remarket <span className="text-orange-500">bd</span></span>
          </Link>

          <div className={`hidden md:flex items-center gap-6 font-sans text-[8px] uppercase font-bold tracking-[0.4em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Link to="/browse" className="hover:text-slate-950 transition-colors flex items-center gap-2 focus:scale-95 duration-200">
              Gallery
            </Link>
            <Link to="/chat" className="hover:text-slate-950 transition-colors flex items-center gap-2 relative group">
              Inbox
              <div className="w-1 h-1 rounded-full bg-orange-500 absolute -right-2 top-0" />
            </Link>
            <Link to="/dashboard" className="hover:text-slate-950 transition-colors flex items-center gap-2">
              Account
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {!loading && (
              currentUser ? (
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`w-7 h-7 ${isDark ? 'bg-slate-800 border-white/10' : 'bg-slate-50 border-slate-200 shadow-sm'} rounded-lg border flex items-center justify-center text-slate-500 hover:border-orange-500 transition-colors overflow-hidden group`}
                  >
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} className="w-full h-full object-cover" />
                    ) : (
                      <User size={12} className="group-hover:scale-110 transition-transform" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-10 right-0 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 overflow-hidden"
                      >
                        <div className="p-2 bg-slate-50 rounded-xl mb-2 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                             {currentUser.photoURL && <img src={currentUser.photoURL} className="w-full h-full object-cover" />}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[8px] font-black uppercase tracking-tight text-slate-900 truncate">{currentUser.name}</p>
                            <p className="text-[6px] font-bold text-slate-400 uppercase tracking-widest">VERIFIED</p>
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <button onClick={() => { navigate('/dashboard'); setIsProfileOpen(false); }} className="w-full flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-lg transition-colors group text-[8px] font-bold uppercase tracking-widest text-slate-600">
                            <div className="flex items-center gap-2">
                              <Settings size={10} className="text-slate-400 group-hover:text-orange-500" />
                              Settings
                            </div>
                          </button>
                          <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-lg transition-colors group text-[8px] font-bold uppercase tracking-widest text-slate-600">
                            <div className="flex items-center gap-2">
                              <LogOut size={10} className="text-slate-400 group-hover:text-orange-500" />
                              Logout
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className={`w-7 h-7 ${isDark ? 'bg-slate-800 border-white/10' : 'bg-slate-50 border-slate-200 shadow-sm'} rounded-lg border flex items-center justify-center text-slate-500 hover:text-orange-500 transition-colors group`}
                >
                  <LogIn size={12} className="group-hover:scale-110 transition-transform" />
                </button>
              )
            )}

            <button 
              onClick={() => setIsListingModalOpen(true)}
              className="bg-slate-950 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all hidden sm:block"
            >
              List Gear
            </button>

            <div className="md:hidden relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-1.5 hover:bg-slate-100 rounded-lg transition-colors ${isDark ? 'text-white' : 'text-slate-600'}`}
              >
                {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute top-12 right-0 w-[calc(100vw-3rem)] max-w-sm bg-white border border-slate-100 rounded-2xl shadow-2xl p-4"
                  >
                    <div className="space-y-4">
                      {menuItems.map((item) => (
                        <Link 
                          key={item.label}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group hover:bg-orange-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-orange-500 shadow-sm transition-colors">
                              {item.icon}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 group-hover:text-orange-600">{item.label}</span>
                          </div>
                          <ChevronRight size={10} className="text-slate-300" />
                        </Link>
                      ))}
                      {!currentUser && (
                        <button 
                          onClick={() => { login(); setIsMenuOpen(false); }}
                          className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl group hover:bg-orange-50 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-orange-500 shadow-sm transition-colors">
                            <LogIn size={14} />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 group-hover:text-orange-600">Login with Google</span>
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsListingModalOpen(true);
                        }}
                        className="w-full bg-orange-500 text-white p-4 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                      >
                        List My Gear
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </nav>

      <ListingModal isOpen={isListingModalOpen} onClose={() => setIsListingModalOpen(false)} />
      <div className="h-16 sm:h-20" /> {/* Spacer */}
    </>
  );
}
