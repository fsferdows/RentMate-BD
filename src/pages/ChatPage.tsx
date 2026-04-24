import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  ChevronLeft, 
  User, 
  Shield, 
  CheckCircle2, 
  MapPin, 
  Search, 
  MessageSquare, 
  Lock,
  Plus,
  Camera,
  Mic,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { useMarketplace, Message } from '../context/MarketplaceContext';
import Navbar from '../components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ChatPage() {
  const { threads, items, messages, sendMessage, currentUser, loading, login } = useMarketplace();
  const location = useLocation();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    (location.state as any)?.threadId || null
  );
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Update selected thread if one was passed in state but not yet set
  useEffect(() => {
    if (!selectedThreadId && threads.length > 0) {
       const initialId = (location.state as any)?.threadId || threads[0].id;
       setSelectedThreadId(initialId);
    }
  }, [threads, selectedThreadId, location.state]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedThreadId]);

  const activeThread = threads.find(t => t.id === selectedThreadId);
  const activeItem = activeThread ? items.find(i => i.id === activeThread.itemId) : null;
  const chatMessages = messages.filter(m => m.threadId === selectedThreadId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedThreadId) return;
    sendMessage(selectedThreadId, inputText);
    setInputText('');
  };

  if (loading) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center">
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
            <Lock size={24} strokeWidth={1} />
          </div>
          <h2 className="font-display italic text-4xl text-slate-950 mb-6">Restricted Access.</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.6em] max-w-sm leading-loose mb-12">
            Login is required to access secure communication channels.
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

  if (threads.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFAF8]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-200 mb-10 shadow-sm">
            <MessageSquare size={24} strokeWidth={1} />
          </div>
          <h2 className="font-display italic text-4xl text-slate-950 mb-6">No Active Sessions.</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.6em] max-w-sm leading-loose mb-12">
            Your secure inbox is currently empty. Start a conversation from any product page.
          </p>
          <button 
            onClick={() => navigate('/browse')}
            className="px-12 py-5 bg-slate-950 text-white rounded-full font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-orange-500 transition-all shadow-2xl hover:shadow-orange-500/20 active:scale-95"
          >
            Explore Registry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="flex-shrink-0">
        <Navbar />
      </div>
      
      <main className="flex-1 max-w-7xl mx-auto w-full flex overflow-hidden border-x border-slate-100 bg-white">
        {/* Sidebar */}
        <div className={`w-full md:w-96 border-r border-slate-50 flex flex-col bg-white transition-all duration-500 ${selectedThreadId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-10 pb-6">
            <h1 className="text-3xl font-display italic text-slate-950 mb-3">Inbox.</h1>
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-orange-500" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Registry Comms</p>
            </div>
          </div>
          
          <div className="px-10 py-6">
             <div className="relative group">
                <input 
                  type="text" 
                  placeholder="SEARCH RECIPIENT..." 
                  className="w-full bg-[#FCFAF8] border-b border-slate-100 py-3 text-[9px] font-bold uppercase tracking-[0.3em] focus:border-orange-500 outline-none transition-all pl-10 placeholder:text-slate-200"
                />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                   <Search size={14} strokeWidth={1} />
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-2">
            <AnimatePresence mode="popLayout">
              {threads.map((t, idx) => {
                const tItem = items.find(i => i.id === t.itemId);
                const isSelected = selectedThreadId === t.id;
                return (
                  <motion.button
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedThreadId(t.id)}
                    className={`w-full p-8 text-left flex items-start gap-6 hover:bg-[#FCFAF8] transition-all rounded-2xl group relative ${isSelected ? 'bg-[#FCFAF8]' : ''}`}
                  >
                    <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 shadow-sm">
                      <img src={tItem?.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-display italic text-lg text-slate-950 truncate leading-none">{tItem?.name}</p>
                        <span className="text-[7px] font-bold text-slate-300 uppercase tracking-[0.4em] mt-1 shrink-0">12:45PM</span>
                      </div>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-4">{tItem?.ownerName}</p>
                      <div className="flex items-center justify-between">
                         <div className={`flex items-center gap-2 ${isSelected ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                            <div className="w-1 h-1 rounded-full bg-orange-500" />
                            <span className="text-[7px] font-bold text-orange-500 uppercase tracking-[0.4em]">Active Session</span>
                         </div>
                         <div className="w-5 h-5 rounded-full border border-slate-100 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform">
                            <ChevronRight size={10} className="text-slate-300" />
                         </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex-col bg-white ${selectedThreadId ? 'flex' : 'hidden md:flex'}`}>
          {activeThread && activeItem ? (
            <>
              {/* Header */}
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white z-20">
                <div className="flex items-center gap-6">
                   <button 
                     onClick={() => setSelectedThreadId(null)}
                     className="md:hidden text-slate-400 hover:text-slate-950 transition-colors"
                   >
                     <ChevronLeft size={24} strokeWidth={1} />
                   </button>
                   <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300">
                      <User size={18} strokeWidth={1} />
                   </div>
                   <div>
                      <h3 className="font-display italic text-lg text-slate-950 flex items-center gap-3">
                        {activeItem.ownerName}
                        <CheckCircle2 size={12} className="text-orange-500" strokeWidth={3} />
                      </h3>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-1">Verified Registry Member</p>
                   </div>
                </div>
                <div className="hidden lg:flex items-center gap-4 px-5 py-2 bg-[#FCFAF8] text-slate-400 rounded-md border border-slate-50">
                  <Shield size={12} strokeWidth={1} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Encrypted Session</span>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 md:space-y-12 no-scrollbar bg-[#FCFAF8]/30">
                <div className="flex flex-col items-center mb-16 md:mb-24 opacity-60">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-100 bg-white mb-6 md:mb-8 flex items-center justify-center">
                      <Shield className="text-slate-200" size={16} strokeWidth={1} />
                   </div>
                   <p className="text-[8px] md:text-[9px] font-bold text-slate-300 uppercase tracking-[0.6em] mb-3 md:mb-4">PROTOCOL 4.0 ACTIVE</p>
                   <p className="text-[7px] md:text-[8px] font-medium text-slate-400 uppercase tracking-[0.2em] max-w-[240px] md:max-w-[280px] text-center leading-loose">Communications are recorded for quality and security assurance under the Remarket protocol.</p>
                </div>

                {chatMessages.map(m => {
                  const isMe = m.senderId === currentUser.id;
                  return (
                    <motion.div 
                      key={m.id} 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[90%] md:max-w-[60%] p-4 md:p-6 rounded-2xl text-[11px] md:text-[12px] font-medium leading-relaxed tracking-tight ${
                        isMe ? 'bg-slate-950 text-white rounded-br-none' : 'bg-[#fdfdfc] text-slate-950 border border-slate-100 rounded-bl-none'
                      }`}>
                        {m.text}
                        <div className={`text-[6px] md:text-[7px] mt-3 md:mt-4 uppercase font-bold tracking-[0.3em] opacity-40 ${isMe ? 'text-white' : 'text-slate-400'}`}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="p-4 md:p-8 border-t border-slate-50 bg-white">
                <div className="flex gap-2 md:gap-3 mb-4 md:mb-8 overflow-x-auto no-scrollbar pb-1">
                   {[
                     'Availability?', 
                     'Technical Specs?', 
                     'District Sync?', 
                     'Reserve Now'
                   ].map(chip => (
                     <button 
                       key={chip}
                       onClick={() => sendMessage(selectedThreadId!, chip)}
                       className="whitespace-nowrap px-3 py-2 md:px-5 md:py-2.5 rounded-md border border-slate-100 text-[6px] md:text-[8px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-400 hover:border-slate-300 hover:text-slate-950 transition-all bg-[#FDFDFC] flex-shrink-0"
                     >
                       {chip}
                     </button>
                   ))}
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <button className="text-slate-300 hover:text-slate-950 transition-all">
                      <Plus size={18} strokeWidth={1} />
                    </button>
                    <button className="text-slate-300 hover:text-slate-950 transition-all hidden sm:block">
                      <ImageIcon size={18} strokeWidth={1} />
                    </button>
                  </div>

                  <form onSubmit={handleSend} className="flex-1 flex gap-3 md:gap-6 relative">
                    <input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="MESSAGE THE OWNER"
                      className="flex-1 bg-transparent border-b border-slate-100 py-2 md:py-3 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] focus:border-orange-500 outline-none transition-all placeholder:text-slate-200"
                    />
                    <button 
                      type="submit"
                      disabled={!inputText.trim()}
                      className="w-10 h-10 md:w-12 md:h-12 bg-slate-950 text-white rounded-full flex items-center justify-center hover:bg-orange-500 disabled:opacity-20 transition-all shadow-xl hover:shadow-orange-500/20 flex-shrink-0"
                    >
                      <Send size={16} strokeWidth={1} />
                    </button>
                  </form>
                </div>
                
                <div className="mt-8 flex justify-center">
                   <p className="text-[7px] font-medium uppercase tracking-[0.6em] text-slate-200 flex items-center gap-3">
                     <Lock size={10} className="text-slate-200" strokeWidth={1} /> SECURE PROTOCOL v4.0.2
                   </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 bg-[#FCFAF8]/20">
              <div className="w-20 h-20 rounded-full border border-slate-100 flex items-center justify-center text-slate-100 mb-10">
                <MessageSquare size={32} strokeWidth={1} />
              </div>
              <h3 className="font-display italic text-3xl text-slate-950 mb-4">Secure Channel.</h3>
              <div className="w-12 h-px bg-slate-100 mb-6" />
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.6em] max-w-xs leading-loose">
                Select an active session to begin protected communications.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


