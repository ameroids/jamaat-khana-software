import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { 
  Routes, Route, Link, NavLink, Navigate, useNavigate, useParams, Outlet, useLocation 
} from 'react-router-dom';
import { 
  Eye, EyeOff, ChevronLeft, ChevronRight, Printer, Download, LogOut, Users,
  Search, Star, Check, X, ArrowRight, ShieldCheck, Calendar as CalendarIcon,
  Clock, Sparkles, Building2, MapPin, CreditCard, Lock, Plus, SlidersHorizontal,
  Phone, CheckCircle2, AlertCircle, Menu, Layers, Award, Tag, Copy, ExternalLink, Shield
} from 'lucide-react';
import * as db from './services/db';
import { useDB, fmt, DEFAULT_HALL_IMAGES } from './services/db';

// --- HERO THEME PALETTES (NIKE STYLE DYNAMIC SHOWCASE) ---
const HERO_THEMES = [
  {
    hallId: 'h1',
    name: "Burhani Hall",
    tagline: "Royale Grandeur",
    themeClass: "bg-[#081B15]",
    textColor: "text-white",
    subTextColor: "text-emerald-100/70",
    glowColor: "rgba(34, 197, 94, 0.4)",
    accentColor: "#2BB082",
    badge: "Premier Ballroom",
    watermark: "BURHANI"
  },
  {
    hallId: 'h2',
    name: "Tayyebi Hall",
    tagline: "Ivory Imperial",
    themeClass: "bg-[#1C150A]",
    textColor: "text-white",
    subTextColor: "text-amber-100/70",
    glowColor: "rgba(245, 158, 11, 0.45)",
    accentColor: "#E5B842",
    badge: "Spacious Dining Area",
    watermark: "TAYYEBI"
  },
  {
    hallId: 'h3',
    name: "Mohammedi Hall",
    tagline: "Festive Crimson",
    themeClass: "bg-[#170E10]",
    textColor: "text-white",
    subTextColor: "text-rose-100/70",
    glowColor: "rgba(244, 63, 94, 0.4)",
    accentColor: "#F43F5E",
    badge: "Family & Milad Celebrations",
    watermark: "MOHAMMEDI"
  },
  {
    hallId: 'h4',
    name: "Hakimi Hall",
    tagline: "Intimate Onyx",
    themeClass: "bg-[#0E1318]",
    textColor: "text-white",
    subTextColor: "text-slate-200/70",
    glowColor: "rgba(99, 102, 241, 0.4)",
    accentColor: "#818CF8",
    badge: "Solemn Nikah Ceremonies",
    watermark: "HAKIMI"
  }
];

// --- HELPER SELECTORS ---
const slotOf = (s, id) => s.settings.slots.find(x => x.id === id) || { name: id, start: '', end: '' };
const hallOf = (s, id) => s.halls.find(h => h.id === id) || { name: '(removed)', image: DEFAULT_HALL_IMAGES[id] || DEFAULT_HALL_IMAGES.h1 };
const me = s => s.members.find(m => m.id === s.session.member);

const Brand = () => (
  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-zinc-400 font-medium tracking-wide">
    <span>Crafted with distinction by</span>
    <span className="font-bold text-zinc-700 tracking-wider flex items-center gap-1.5 bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-200">
      <Sparkles size={12} className="text-amber-500" />
      AMEROIDS TECH STUDIO
    </span>
    <span className="hidden sm:inline text-zinc-300">·</span>
    <span className="uppercase text-[11px] tracking-widest text-zinc-400">Innovate • Build • Elevate</span>
  </div>
);

const Pill = ({ v }) => {
  const styles = {
    Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Partially Paid': 'bg-amber-50 text-amber-700 border-amber-200',
    PendingPayment: 'bg-amber-50 text-amber-700 border-amber-200',
    'Pending Payment': 'bg-amber-50 text-amber-700 border-amber-200',
    Unpaid: 'bg-amber-50 text-amber-700 border-amber-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    Failed: 'bg-rose-50 text-rose-700 border-rose-200',
    Inactive: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    Expired: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    Disabled: 'bg-zinc-100 text-zinc-500 border-zinc-200',
    Hold: 'bg-orange-50 text-orange-700 border-orange-200',
    Blocked: 'bg-zinc-800 text-white border-zinc-900',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[v] || 'bg-zinc-100 text-zinc-700 border-zinc-200'}`}>
      {v}
    </span>
  );
};

const Err = ({ e }) => e ? (
  <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2 mb-4 animate-shake" role="alert">
    <AlertCircle size={18} className="shrink-0 text-rose-600" />
    <span>{e}</span>
  </div>
) : null;

function Pw({ value, onChange, label = 'Password' }) {
  const [v, setV] = useState(false);
  return (
    <label className="block text-sm font-semibold text-zinc-700 mb-4">
      {label}
      <div className="relative mt-1">
        <input 
          type={v ? 'text' : 'password'} 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          autoComplete="current-password"
          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:bg-white pr-11"
        />
        <button 
          type="button" 
          aria-label="Show or hide password" 
          onClick={() => setV(!v)} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          {v ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}

// --- GLOBAL TOAST SYSTEM ---
let addGlobalToast = () => {};

export function useToast() {
  return {
    show: (msg, type = 'success') => addGlobalToast(msg, type)
  };
}

// --- MAIN SHELL ---
function Shell() {
  const s = useDB();
  const m = me(s);
  const nav = useNavigate();
  const loc = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [scrollDir, setScrollDir] = useState('up');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState('default');
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expose global toast trigger
  useEffect(() => {
    addGlobalToast = (msg, type = 'success') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3500);
    };
  }, []);

  // Nike-Style Preloader Splash
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  // Track Mouse & Scroll
  useEffect(() => {
    const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setScrollDir('down');
      } else {
        setScrollDir('up');
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Cart/Pending bookings count
  const pendingCount = s.bookings.filter(b => b.memberId === s.session.member && b.bookingStatus === 'Pending Payment').length;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#061812] flex flex-col items-center justify-center z-[100] text-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-400 to-amber-300 p-0.5 shadow-[0_0_50px_rgba(43,176,130,0.5)] mb-6 animate-pulse">
            <div className="w-full h-full bg-[#061812] rounded-[14px] flex items-center justify-center">
              <Building2 size={36} className="text-emerald-400" />
            </div>
          </div>
          <h2 className="font-serif-luxury text-3xl font-bold tracking-tight text-white mb-2">Jamaat Khana Halls</h2>
          <p className="text-xs tracking-widest text-emerald-300/80 uppercase font-semibold mb-8">AMEROIDS TECH STUDIO</p>
          <div className="w-56 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="w-1/2 h-full bg-gradient-to-r from-emerald-500 to-amber-300 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 flex flex-col selection:bg-emerald-900 selection:text-emerald-100 relative">
        
        {/* --- CUSTOM INTERACTIVE CURSOR (NIKE STYLE) --- */}
        <div 
          className="hidden lg:flex fixed top-0 left-0 pointer-events-none z-[120] transition-transform duration-100 ease-out items-center justify-center mix-blend-difference"
          style={{ 
            transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) translate(-50%, -50%)`,
            width: cursorType === 'hover' ? '54px' : cursorType === 'view' ? '76px' : '16px',
            height: cursorType === 'hover' ? '54px' : cursorType === 'view' ? '76px' : '16px',
            backgroundColor: cursorType === 'default' ? 'white' : 'transparent',
            border: cursorType === 'default' ? 'none' : '2px solid white',
            borderRadius: '50%',
            opacity: 1
          }}
        >
          {cursorType === 'view' && (
            <span className="text-white text-[10px] font-black tracking-widest uppercase">VIEW</span>
          )}
        </div>

        {/* --- TOAST NOTIFICATIONS --- */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] flex flex-col gap-2 pointer-events-none w-auto max-w-md">
          <AnimatePresence>
            {toasts.map(toast => (
              <motion.div 
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="bg-zinc-950/95 text-white px-5 py-3.5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] backdrop-blur-md flex items-center gap-3 border border-white/10"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <p className="text-sm font-semibold tracking-wide pr-2">{toast.msg}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- FLOATING HEADER --- */}
        {(() => {
          const isDarkHero = !scrolled && loc.pathname === '/';
          return (
            <header 
              className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled 
                  ? 'py-3.5 glass-nav bg-white/95 border-b border-zinc-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.06)] text-zinc-900' 
                  : isDarkHero
                    ? 'py-4 glass-nav bg-[#061812]/90 border-b border-emerald-500/25 text-white shadow-[0_10px_35px_rgba(0,0,0,0.35)]'
                    : 'py-4 glass-nav bg-white/95 border-b border-zinc-200/90 text-zinc-900 shadow-sm'
              } ${scrollDir === 'down' && scrolled ? '-translate-y-full' : 'translate-y-0'}`}
              onMouseEnter={() => setCursorType('hover')}
              onMouseLeave={() => setCursorType('default')}
            >
              <div className="max-w-[1720px] mx-auto px-6 md:px-12 flex justify-between items-center">
                
                {/* Authentic Brand Crest & Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#123D32] to-[#1C5B49] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300 border border-emerald-700/30">
                    <Building2 size={22} className="text-emerald-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-serif-luxury text-xl md:text-2xl font-bold tracking-tight leading-tight ${isDarkHero ? 'text-white drop-shadow-sm' : 'text-zinc-900'}`}>
                      Jamaat Khana <i className={`font-normal ${isDarkHero ? 'text-amber-400' : 'text-amber-600'}`}>Halls</i>
                    </span>
                    <span className={`text-[10px] font-bold tracking-widest uppercase ${isDarkHero ? 'text-emerald-300' : 'text-emerald-800'}`}>
                      Dawoodi Bohra Community
                    </span>
                  </div>
                </Link>

                {/* Modern Interactive Nav Links */}
                <nav className="hidden lg:flex items-center gap-8 font-semibold text-sm">
                  <NavLink 
                    to="/" 
                    end 
                    className={({ isActive }) => `relative py-1 group overflow-hidden transition-colors ${
                      isActive 
                        ? (isDarkHero ? 'text-white font-bold' : 'text-emerald-800 font-bold') 
                        : (isDarkHero ? 'text-zinc-200 hover:text-white' : 'text-zinc-600 hover:text-zinc-900')
                    }`}
                  >
                    {({ isActive }) => (
                      <>
                        <span className="block transition-transform duration-300 group-hover:-translate-y-full">Browse Venues</span>
                        <span className={`block absolute top-1 left-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 ${isDarkHero ? 'text-amber-300' : 'text-emerald-700'}`}>Browse Venues</span>
                        <div className={`absolute -bottom-0.5 left-0 h-[2px] transition-all duration-300 ${isDarkHero ? 'bg-amber-400' : 'bg-emerald-700'} ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                      </>
                    )}
                  </NavLink>

                  {m ? (
                    <>
                      <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => `relative py-1 group overflow-hidden transition-colors ${
                          isActive 
                            ? (isDarkHero ? 'text-white font-bold' : 'text-emerald-800 font-bold') 
                            : (isDarkHero ? 'text-zinc-200 hover:text-white' : 'text-zinc-600 hover:text-zinc-900')
                        }`}
                      >
                        {({ isActive }) => (
                          <>
                            <span className="block transition-transform duration-300 group-hover:-translate-y-full">My Reservations</span>
                            <span className={`block absolute top-1 left-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 ${isDarkHero ? 'text-amber-300' : 'text-emerald-700'}`}>My Reservations</span>
                            <div className={`absolute -bottom-0.5 left-0 h-[2px] transition-all duration-300 ${isDarkHero ? 'bg-amber-400' : 'bg-emerald-700'} ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                          </>
                        )}
                      </NavLink>
                      <NavLink 
                        to="/profile" 
                        className={({ isActive }) => `relative py-1 group overflow-hidden transition-colors ${
                          isActive 
                            ? (isDarkHero ? 'text-white font-bold' : 'text-emerald-800 font-bold') 
                            : (isDarkHero ? 'text-zinc-200 hover:text-white' : 'text-zinc-600 hover:text-zinc-900')
                        }`}
                      >
                        {({ isActive }) => (
                          <>
                            <span className="block transition-transform duration-300 group-hover:-translate-y-full">ITS Profile</span>
                            <span className={`block absolute top-1 left-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 ${isDarkHero ? 'text-amber-300' : 'text-emerald-700'}`}>ITS Profile</span>
                            <div className={`absolute -bottom-0.5 left-0 h-[2px] transition-all duration-300 ${isDarkHero ? 'bg-amber-400' : 'bg-emerald-700'} ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                          </>
                        )}
                      </NavLink>
                    </>
                  ) : null}

                  <NavLink 
                    to="/admin/login" 
                    className={`text-xs uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg transition-all ${
                      isDarkHero 
                        ? 'text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15' 
                        : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/80'
                    }`}
                  >
                    Admin Desk
                  </NavLink>
                </nav>

                {/* Actions / User Controls */}
                <div className="flex items-center gap-4">
                  {m ? (
                    <div className="flex items-center gap-3">
                      {pendingCount > 0 && (
                        <button 
                          onClick={() => nav('/dashboard')} 
                          className={`relative p-2.5 rounded-full transition-colors border ${
                            isDarkHero 
                              ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-400/40' 
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200'
                          }`}
                          title="Pending Reservations"
                        >
                          <Clock size={18} />
                          <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                            {pendingCount}
                          </span>
                        </button>
                      )}
                      <div className={`hidden sm:flex items-center gap-2 pl-2 border-l ${isDarkHero ? 'border-white/20' : 'border-zinc-200'}`}>
                        <div className={`w-8 h-8 rounded-full ${isDarkHero ? 'bg-emerald-600 border border-emerald-400/40 text-white' : 'bg-emerald-700 text-white'} flex items-center justify-center font-bold text-xs uppercase shadow-sm`}>
                          {m.name.charAt(0)}
                        </div>
                        <div className="text-left text-xs">
                          <p className={`font-bold leading-tight ${isDarkHero ? 'text-white' : 'text-zinc-800'}`}>{m.name.split(' ')[0]}</p>
                          <p className={`font-medium ${isDarkHero ? 'text-emerald-200/90' : 'text-zinc-400'}`}>ITS {m.itsNumber}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { db.logout('member'); addGlobalToast('Logged out successfully'); nav('/login'); }}
                        className={`p-2 rounded-xl transition-colors ${isDarkHero ? 'text-zinc-300 hover:text-rose-400 hover:bg-white/10' : 'text-zinc-500 hover:text-rose-600 hover:bg-rose-50'}`}
                        title="Sign Out"
                      >
                        <LogOut size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link 
                        to="/login"
                        className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 ${
                          isDarkHero 
                            ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-zinc-950 font-black hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
                            : 'bg-gradient-to-r from-[#123D32] to-[#1C5B49] text-white font-bold hover:shadow-lg'
                        }`}
                      >
                        Member Sign In
                      </Link>
                    </div>
                  )}

                  {/* Mobile Menu Button */}
                  <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={`lg:hidden p-2 rounded-xl transition-colors ${isDarkHero ? 'text-white hover:bg-white/15' : 'text-zinc-700 hover:bg-zinc-100'}`}
                    aria-label="Toggle navigation"
                  >
                    {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                  </button>
                </div>
              </div>

              {/* Mobile Drawer */}
              {mobileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`lg:hidden backdrop-blur-2xl px-6 py-6 space-y-4 shadow-2xl border-b ${
                    isDarkHero 
                      ? 'bg-[#061812]/98 border-emerald-800/40 text-white' 
                      : 'bg-white/98 border-zinc-200 text-zinc-900'
                  }`}
                >
                  <Link 
                    to="/" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`block py-2 text-base font-bold transition-colors ${isDarkHero ? 'text-white hover:text-amber-300' : 'text-zinc-800 hover:text-emerald-800'}`}
                  >
                    Browse Venues
                  </Link>
                  {m ? (
                    <>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className={`block py-2 text-base font-bold transition-colors ${isDarkHero ? 'text-white hover:text-amber-300' : 'text-zinc-800 hover:text-emerald-800'}`}
                      >
                        My Bookings
                      </Link>
                      <Link 
                        to="/profile" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className={`block py-2 text-base font-bold transition-colors ${isDarkHero ? 'text-white hover:text-amber-300' : 'text-zinc-800 hover:text-emerald-800'}`}
                      >
                        ITS Profile ({m.name})
                      </Link>
                      <button 
                        onClick={() => { db.logout('member'); setMobileMenuOpen(false); nav('/login'); }}
                        className="flex items-center gap-2 text-rose-500 font-bold py-2 hover:text-rose-400"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className={`block py-2 text-base font-bold transition-colors ${isDarkHero ? 'text-amber-300 hover:text-amber-200' : 'text-emerald-800'}`}
                    >
                      Member Login
                    </Link>
                  )}
                  <Link 
                    to="/admin/login" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`block py-2 text-sm font-semibold border-t pt-3 transition-colors ${
                      isDarkHero 
                        ? 'text-emerald-200 hover:text-white border-white/10' 
                        : 'text-zinc-500 hover:text-zinc-800 border-zinc-100'
                    }`}
                  >
                    Admin Portal
                  </Link>
                </motion.div>
              )}
            </header>
          );
        })()}

        {/* --- PAGE CONTENT ROUTER --- */}
        <main className={`flex-1 ${loc.pathname === '/' ? 'pt-0' : 'pt-20'}`}>
          <Outlet context={{ setCursorType }} />
        </main>

        {/* --- LUXURY FOOTER (MATCHING NIKE REDESIGN) --- */}
        <footer className="bg-white pt-24 pb-12 overflow-hidden border-t border-zinc-200 relative mt-24">
          <div className="max-w-[1720px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 relative z-10">
            
            {/* Col 1: Brand Info */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#123D32] to-[#1C5B49] flex items-center justify-center text-white shadow-md">
                    <Building2 size={20} className="text-emerald-300" />
                  </div>
                  <h3 className="font-serif-luxury text-2xl font-bold tracking-tight text-zinc-900">
                    Jamaat Khana <i className="text-amber-600 font-normal">Halls</i>
                  </h3>
                </div>
                <p className="text-sm text-zinc-500 font-medium max-w-sm leading-relaxed mb-6">
                  Official digital reservation platform for Dawoodi Bohra community wedding halls, nikah pavilions, and festive dining suites.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Instant Automated Slot Lock System Active
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-100">
                <Brand />
              </div>
            </div>

            {/* Col 2: Venues */}
            <div className="md:col-span-2">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-zinc-900">Venues</h4>
              <ul className="space-y-3.5 font-medium text-sm text-zinc-500">
                {s.halls.map(h => (
                  <li key={h.id}>
                    <Link to={`/hall/${h.id}`} className="hover:text-emerald-800 hover:translate-x-1 inline-block transition-transform">
                      {h.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Community Services */}
            <div className="md:col-span-2">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-zinc-900">Services</h4>
              <ul className="space-y-3.5 font-medium text-sm text-zinc-500">
                {['Wedding Banquets', 'Solemn Nikah', 'Community Thaali', 'Majlis & Milad', 'Booking Guidelines'].map(link => (
                  <li key={link} className="hover:text-emerald-800 hover:translate-x-1 inline-block transition-transform cursor-pointer">
                    {link}
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Jamaat Office */}
            <div className="md:col-span-3">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-zinc-900">Office & Support</h4>
              <p className="text-sm text-zinc-500 mb-3">{s.settings.contact}</p>
              <p className="text-xs text-zinc-400 mb-6">{s.settings.policy}</p>
              <div className="space-y-2">
                <Link to="/admin/login" className="text-xs font-bold text-zinc-700 hover:text-emerald-800 flex items-center gap-1.5 underline">
                  <ShieldCheck size={14} /> Admin Management Desk
                </Link>
              </div>
            </div>
          </div>

          {/* Massive Architectural Background Watermark */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden flex justify-center translate-y-1/3 select-none pointer-events-none opacity-[0.03] z-0">
            <h1 className="text-[26vw] font-black tracking-tighter leading-none text-zinc-900">JAMAAT</h1>
          </div>

          {/* Bottom Legal / Pass Bar */}
          <div className="max-w-[1720px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-400 font-medium border-t border-zinc-200/70 pt-8 relative z-10 gap-4">
            <p>&copy; {new Date().getFullYear()} Jamaat Khana Hall Booking · AMEROIDS TECH STUDIO Concept Redesign.</p>
            <div className="flex gap-6">
              <span>Verified ITS Database</span>
              <span>•</span>
              <span>25% Advance Hold Policy</span>
              <span>•</span>
              <span>ISO Architecture</span>
            </div>
          </div>
        </footer>

      </div>
    </MotionConfig>
  );
}

// --- REQUIRE AUTH GUARDS ---
function RequireMember({ children }) {
  const s = useDB();
  return me(s) ? children : <Navigate to="/login" replace />;
}
function RequireAdmin({ children }) {
  const s = useDB();
  return s.session.admin ? children : <Navigate to="/admin/login" replace />;
}

// --- MEMBER LOGIN (MODERN SLEEK CARD) ---
function Login() {
  const [its, setIts] = useState('');
  const [pw, setPw] = useState('');
  const [e, setE] = useState('');
  const nav = useNavigate();

  const go = ev => {
    ev.preventDefault();
    if (!its.trim() || !pw) return setE('Please enter your ITS number and password.');
    try {
      db.memberLogin(its, pw);
      nav('/');
    } catch (x) {
      setE(x.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.06)] border border-zinc-200/80">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-6 border border-emerald-200/60 shadow-sm">
          <Building2 size={28} />
        </div>
        <h1 className="font-serif-luxury text-3xl md:text-4xl font-bold text-zinc-900 mb-2">Member Sign In</h1>
        <p className="text-sm text-zinc-500 font-medium mb-6">Enter your community ITS credentials to reserve halls.</p>
        <Err e={e} />
        
        <form onSubmit={go} className="space-y-4">
          <label className="block text-sm font-semibold text-zinc-700">
            ITS Number
            <input 
              inputMode="numeric" 
              placeholder="e.g. 40010001"
              value={its} 
              onChange={x => setIts(x.target.value)} 
              className="mt-1 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-medium focus:bg-white"
            />
          </label>
          <Pw value={pw} onChange={setPw} />
          
          <button 
            type="submit"
            className="w-full bg-[#123D32] hover:bg-[#1A5243] text-white py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            Authenticate & Proceed <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-xs text-amber-900 leading-relaxed">
          <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
            <Sparkles size={14} /> DEMO ITS CREDENTIALS:
          </div>
          ITS: <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold">40010001</code> to <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold">40010004</code><br/>
          Password: <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold">member123</code>
        </div>
        <div className="mt-8 pt-6 border-t border-zinc-100">
          <Brand />
        </div>
      </div>
    </div>
  );
}

// --- ADMIN LOGIN ---
function AdminLogin() {
  const [u, setU] = useState('');
  const [pw, setPw] = useState('');
  const [e, setE] = useState('');
  const nav = useNavigate();

  const go = ev => {
    ev.preventDefault();
    if (!u || !pw) return setE('Enter admin email and password.');
    try {
      db.adminLogin(u, pw);
      nav('/admin');
    } catch (x) {
      setE(x.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.06)] border border-zinc-200/80">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-sm">
          <ShieldCheck size={28} />
        </div>
        <h1 className="font-serif-luxury text-3xl font-bold text-zinc-900 mb-2">Admin Desk</h1>
        <p className="text-sm text-zinc-500 font-medium mb-6">Authorized Jamaat Office Management Portal</p>
        <Err e={e} />
        
        <form onSubmit={go} className="space-y-4">
          <label className="block text-sm font-semibold text-zinc-700">
            Admin Email
            <input 
              value={u} 
              onChange={x => setU(x.target.value)} 
              placeholder="admin@ameroids.demo"
              className="mt-1 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-medium focus:bg-white"
            />
          </label>
          <Pw value={pw} onChange={setPw} />
          <button 
            type="submit"
            className="w-full bg-zinc-900 hover:bg-black text-white py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-md flex items-center justify-center gap-2 mt-4"
          >
            Access Admin Console <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-600 leading-relaxed">
          <b>Admin Demo:</b> Email <code className="font-mono font-bold">admin@ameroids.demo</code>, password <code className="font-mono font-bold">admin123</code>
        </div>
        <div className="mt-8 pt-6 border-t border-zinc-100">
          <Brand />
        </div>
      </div>
    </div>
  );
}

// --- HOME PAGE (EPIC NIKE-STYLE HERO & SHOWCASE) ---
function Home() {
  const s = useDB();
  const nav = useNavigate();
  const [activeThemeIdx, setActiveThemeIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('morning');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [q, setQ] = useState('');
  const [capFilter, setCapFilter] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('name');
  const [quickViewHall, setQuickViewHall] = useState(null);

  const activeTheme = HERO_THEMES[activeThemeIdx];
  const activeHall = s.halls.find(h => h.id === activeTheme.hallId) || s.halls[0];

  // Mouse move for dynamic 3D glare
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const getGlareStyle = () => {
    const x = (mousePos.x / (window.innerWidth || 1)) * 100;
    const y = (mousePos.y / (window.innerHeight || 1)) * 100;
    return {
      background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.7) 0%, transparent 50%)`
    };
  };

  const startPrice = h => Math.min(...Object.values(h.prices || { morning: 10000 }));
  
  const nextAvailableDate = h => {
    for (let i = 0; i < 60; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const k = db.iso(d);
      if (['green', 'yellow'].includes(db.dayStatus(s, h.id, k))) return k;
    }
    return null;
  };

  // Filtered Halls
  const list = s.halls.filter(h => {
    if (!h.enabled) return false;
    const matchSearch = h.name.toLowerCase().includes(q.toLowerCase()) || h.description.toLowerCase().includes(q.toLowerCase());
    const matchCap = h.capacity >= capFilter;
    if (activeCategory === 'Grand (350+)') return matchSearch && h.capacity >= 350;
    if (activeCategory === 'Intimate (<350)') return matchSearch && h.capacity < 350;
    if (activeCategory === 'Available') return matchSearch && nextAvailableDate(h) !== null;
    return matchSearch && matchCap;
  }).sort((a, b) => {
    if (sort === 'price') return startPrice(a) - startPrice(b);
    if (sort === 'cap') return b.capacity - a.capacity;
    return a.name.localeCompare(b.name);
  });

  return (
    <div onMouseMove={handleMouseMove}>
      
      {/* =========================================================================
          SECTION 1: EPIC DYNAMIC HERO SECTION (NIKE AIR MAX DN BENCHMARK)
          ========================================================================= */}
      <section className={`relative min-h-[95vh] pt-28 sm:pt-32 pb-16 flex flex-col justify-center overflow-hidden transition-colors duration-1000 ease-in-out ${activeTheme.themeClass}`}>
        
        {/* Massive Architectural Watermark Typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none select-none">
          <h1 className="text-[25vw] font-black tracking-tighter leading-none opacity-5 transition-all duration-1000 text-white uppercase">
            {activeTheme.watermark}
          </h1>
        </div>

        <div className="max-w-[1720px] mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Column: Typo, Features & Slot Selection */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center animate-slide-up text-white">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-5 border border-white/15">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                {activeTheme.badge}
              </span>
              <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase mb-4 drop-shadow-md">
                {activeHall.name.split(' ')[0]}<br/>
                <span className="font-serif-luxury font-normal italic tracking-normal text-amber-300">Royale.</span>
              </h2>
              <p className={`text-base font-medium max-w-md leading-relaxed ${activeTheme.subTextColor}`}>
                {activeHall.description}
              </p>
            </div>

            {/* Quick Slot Selector & Reserve CTA */}
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/15 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">Select Preferred Slot</span>
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Capacity: {activeHall.capacity} Guests
                </span>
              </div>

              {/* Slot Buttons */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {s.settings.slots.map(sl => (
                  <button 
                    key={sl.id}
                    onClick={() => setSelectedSlot(sl.id)}
                    className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 border ${
                      selectedSlot === sl.id 
                        ? 'bg-white text-zinc-950 border-white scale-105 shadow-xl' 
                        : 'bg-white/5 border-white/15 text-white/90 hover:bg-white/15'
                    }`}
                  >
                    <span>{sl.name}</span>
                    <span className="text-[11px] opacity-80">{fmt(activeHall.prices[sl.id])}</span>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => nav(`/book/${activeHall.id}`)}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 py-4 px-6 rounded-full font-black uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(43,176,130,0.4)] group"
                >
                  Reserve Hall Now 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setQuickViewHall(activeHall)}
                  className="bg-white/10 hover:bg-white/20 text-white py-4 px-5 rounded-full font-bold uppercase tracking-wider text-xs border border-white/20 transition-colors"
                >
                  Quick Spec
                </button>
              </div>
            </div>
          </div>

          {/* Center Column: 3D Perspective Floating Hall Showcase with Glare */}
          <div className="lg:col-span-5 order-1 lg:order-2 relative h-[45vh] sm:h-[55vh] lg:h-[70vh] flex items-center justify-center">
            
            {/* Ambient Base Glow */}
            <div 
              className="absolute w-[80%] h-[80%] rounded-full blur-[110px] transition-all duration-1000 ease-in-out pointer-events-none"
              style={{ 
                backgroundColor: activeTheme.glowColor,
                transform: `translate(${mousePos.x * -0.015}px, ${mousePos.y * -0.015}px)`
              }}
            />

            {/* 3D Tilted Card Container */}
            <div 
              className="relative z-10 w-full max-w-[620px] aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-[0_50px_80px_rgba(0,0,0,0.6)] border border-white/20 animate-float group cursor-pointer"
              style={{ 
                transform: `rotateY(${mousePos.x * 0.008}deg) rotateX(${mousePos.y * -0.008}deg)` 
              }}
              onClick={() => setQuickViewHall(activeHall)}
            >
              <img 
                src={activeHall.image || DEFAULT_HALL_IMAGES[activeHall.id]} 
                alt={activeHall.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Dynamic Glare Overlay */}
              <div className="hall-glare" style={getGlareStyle()} />

              {/* Floating Glass Pill Badges */}
              <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg">
                  <Award size={14} className="text-amber-400" />
                  {activeHall.name}
                </span>
                <span className="bg-emerald-500/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full w-fit">
                  {activeHall.capacity} Seat Capacity
                </span>
              </div>

              <div className="absolute bottom-6 right-6 z-20">
                <span className="bg-white/90 backdrop-blur-md text-zinc-950 text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 group-hover:bg-white">
                  Inspect Venue Details <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Theme & Hall Swatches */}
          <div className="lg:col-span-2 order-3 flex flex-row lg:flex-col justify-center items-center lg:items-end gap-6 z-20">
            <div className="flex flex-row lg:flex-col gap-3.5">
              {HERO_THEMES.map((theme, idx) => {
                const hall = s.halls.find(h => h.id === theme.hallId) || s.halls[0];
                return (
                  <button
                    key={theme.hallId}
                    onClick={() => setActiveThemeIdx(idx)}
                    className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 flex items-center justify-center shadow-xl ${
                      activeThemeIdx === idx 
                        ? 'border-white scale-110 shadow-[0_0_25px_rgba(255,255,255,0.4)] ring-2 ring-emerald-400' 
                        : 'border-white/30 opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                    title={theme.name}
                  >
                    <img 
                      src={hall.image || DEFAULT_HALL_IMAGES[theme.hallId]} 
                      alt={theme.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </button>
                );
              })}
            </div>
            <p className="hidden lg:block text-xs font-bold uppercase tracking-widest text-white/60 transform rotate-90 origin-right translate-x-4 mt-16">
              {activeTheme.tagline}
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SCROLLING HIGH-CONTRAST MARQUEE (NIKE SIGNATURE TICKER)
          ========================================================================= */}
      <section className="bg-zinc-950 text-white py-5 overflow-hidden border-y border-zinc-800/80 relative z-20 shadow-2xl">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center whitespace-nowrap">
              <span className="text-3xl md:text-5xl font-black tracking-tighter uppercase px-8">
                ROYAL WEDDING HALLS
              </span>
              <Star className="text-amber-400 fill-amber-400 w-6 h-6" />
              <span className="text-3xl md:text-5xl font-black tracking-tighter uppercase px-8 text-outline-light">
                SOLEMN NIKAH
              </span>
              <Star className="text-emerald-400 fill-emerald-400 w-6 h-6" />
              <span className="text-3xl md:text-5xl font-black tracking-tighter uppercase px-8">
                THAALI DINING CONCOURSE
              </span>
              <Star className="text-amber-400 fill-amber-400 w-6 h-6" />
              <span className="text-3xl md:text-5xl font-black tracking-tighter uppercase px-8 text-outline-gold">
                INSTANT ITS VERIFICATION
              </span>
              <Star className="text-emerald-400 fill-emerald-400 w-6 h-6" />
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: VENUE COLLECTION & GRID (SHOP GRID BENCHMARK)
          ========================================================================= */}
      <section id="venues" className="py-24 px-6 md:px-12 max-w-[1720px] mx-auto">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-14 gap-8">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-800 mb-2 block">
              Curated Jamaat Venues
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.95] text-zinc-900">
              Explore Our <br />
              <span className="font-serif-luxury font-normal italic text-amber-600">Banquet Suites.</span>
            </h2>
          </div>

          {/* Interactive Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {['All', 'Grand (350+)', 'Intimate (<350)', 'Available'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                  activeCategory === cat 
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-white rounded-3xl p-4 md:p-6 mb-12 shadow-sm border border-zinc-200/80 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              placeholder="Search by hall name or amenities..." 
              value={q} 
              onChange={e => setQ(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:bg-white text-zinc-900 font-medium"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <select 
              value={capFilter} 
              onChange={e => setCapFilter(+e.target.value)}
              className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold uppercase tracking-wider text-zinc-700"
            >
              <option value={0}>Any Capacity</option>
              <option value={200}>200+ Guests</option>
              <option value={300}>300+ Guests</option>
              <option value={400}>400+ Guests</option>
            </select>

            <select 
              value={sort} 
              onChange={e => setSort(e.target.value)}
              className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold uppercase tracking-wider text-zinc-700"
            >
              <option value="name">Sort: Hall Name</option>
              <option value="price">Price: Low to High</option>
              <option value="cap">Capacity: Largest First</option>
            </select>
          </div>
        </div>

        {/* Hall Grid */}
        {!list.length ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-zinc-200/80 p-12">
            <Building2 size={48} className="mx-auto text-zinc-300 mb-4" />
            <h3 className="text-xl font-bold text-zinc-700">No halls match your current criteria</h3>
            <p className="text-sm text-zinc-400 mt-1">Try resetting the capacity filter or search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((h, i) => {
              const nextDate = nextAvailableDate(h);
              const minPrice = startPrice(h);
              return (
                <div 
                  key={h.id}
                  className="group bg-white rounded-[2rem] overflow-hidden border border-zinc-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col"
                >
                  {/* Photo Container with Nike Hover Effect */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-zinc-100 cursor-pointer" onClick={() => setQuickViewHall(h)}>
                    <img 
                      src={h.image || DEFAULT_HALL_IMAGES[h.id]} 
                      alt={h.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:-rotate-1"
                    />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {h.capacity >= 400 && (
                        <span className="bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                          Grand Venue
                        </span>
                      )}
                      {i === 0 && (
                        <span className="bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                          Most Booked
                        </span>
                      )}
                    </div>

                    {/* Quick View Button on Hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 backdrop-blur-[2px]">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setQuickViewHall(h); }}
                        className="bg-white/95 text-zinc-900 font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full shadow-xl hover:bg-black hover:text-white transition-all transform translate-y-3 group-hover:translate-y-0 flex items-center gap-2"
                      >
                        <Plus size={14} strokeWidth={3} /> Quick Specs
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif-luxury text-2xl font-bold text-zinc-900 group-hover:text-emerald-800 transition-colors">
                          {h.name}
                        </h3>
                        <span className="text-sm font-black text-emerald-800">
                          {fmt(minPrice)} <span className="text-[10px] text-zinc-400 font-normal">/ slot</span>
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
                        {h.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-semibold text-zinc-600 mb-6 py-3 border-y border-zinc-100">
                        <span className="flex items-center gap-1.5">
                          <Users size={15} className="text-emerald-700" />
                          Up to {h.capacity} guests
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5 text-zinc-500">
                          <CalendarIcon size={14} className="text-amber-600" />
                          {nextDate ? `Available ${nextDate}` : 'Fully booked'}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-3 pt-2">
                      <Link 
                        to={`/hall/${h.id}`} 
                        className="flex-1 text-center py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors"
                      >
                        Details
                      </Link>
                      <Link 
                        to={`/book/${h.id}`}
                        className="flex-1 text-center py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#123D32] hover:bg-[#1A5243] transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        Book Now <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 4: IMMERSIVE DARK BREAKOUT (NIKE ATHLETE / LAB SPOTLIGHT)
          ========================================================================= */}
      <section className="bg-[#081310] text-white py-28 rounded-[3rem] mx-4 md:mx-8 mb-24 overflow-hidden relative shadow-2xl border border-white/10">
        
        {/* Ambient radial lighting */}
        <div className="aspect-square rounded-full bg-emerald-500/20 absolute -top-[20%] -left-[10%] w-[60%] blur-[120px] pointer-events-none" />
        <div className="aspect-square rounded-full bg-amber-500/10 absolute -bottom-[20%] -right-[10%] w-[60%] blur-[120px] pointer-events-none" />

        <div className="max-w-[1720px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Spotlight Image with Glass Overlay */}
          <div className="relative group">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <img 
                src="/images/halls/burhani.jpg" 
                alt="Sacred Jamaat Venue" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl max-w-xs shadow-2xl hidden sm:block">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles size={14} /> Sacred Milestones
              </div>
              <p className="text-xs text-white/80 font-medium">
                Double-height acoustic domes engineered for sacred khutbahs, Quran recitation, and heartfelt celebrations.
              </p>
            </div>
          </div>

          {/* Manifesto & Highlights */}
          <div className="flex flex-col items-start">
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <ShieldCheck size={18} /> Verified Community Infrastructure
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9] text-white">
              Engineered for sacred milestones & timeless memories.
            </h2>
            <p className="text-lg text-zinc-300 font-normal max-w-lg mb-10 leading-relaxed">
              Every hall is crafted to serve the community with dignity: automated hold locking ensures zero schedule overlap, instant ITS verification protects community privacy, and dedicated Thaali dining corridors honor sacred traditions.
            </p>

            <div className="grid grid-cols-2 gap-6 w-full max-w-md mb-10 border-t border-white/10 pt-8">
              <div>
                <p className="text-3xl font-black text-amber-300">100%</p>
                <p className="text-xs uppercase font-bold text-zinc-400 mt-1">Zero Double-Booking Guarantee</p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-400">10-Min</p>
                <p className="text-xs uppercase font-bold text-zinc-400 mt-1">Active Checkout Slot Lock</p>
              </div>
            </div>

            <button 
              onClick={() => {
                const el = document.getElementById('venues');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-zinc-950 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-emerald-400 hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-2"
            >
              Explore Available Dates <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: QUICK VIEW MODAL (NIKE QUICK ADD BENCHMARK)
          ========================================================================= */}
      <AnimatePresence>
        {quickViewHall && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={() => setQuickViewHall(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="glass-modal w-full max-w-4xl bg-white/95 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-200"
            >
              {/* Left Photo & Highlights */}
              <div className="w-full md:w-1/2 bg-zinc-950 relative flex items-center justify-center overflow-hidden min-h-[300px]">
                <img 
                  src={quickViewHall.image || DEFAULT_HALL_IMAGES[quickViewHall.id]} 
                  alt={quickViewHall.name} 
                  className="w-full h-full object-cover opacity-90"
                />
                <button 
                  onClick={() => setQuickViewHall(null)} 
                  className="absolute top-6 left-6 md:hidden p-2.5 bg-black/60 text-white rounded-full backdrop-blur-md"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Capacity & Scale</p>
                  <p className="text-sm font-semibold">{quickViewHall.capacity} Guests with Thaali Dining Support</p>
                </div>
              </div>

              {/* Right Specs & Actions */}
              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between bg-white relative">
                <button 
                  onClick={() => setQuickViewHall(null)}
                  className="hidden md:block absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
                >
                  <X size={20} />
                </button>

                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1 block">
                    Venue Specification
                  </span>
                  <h2 className="font-serif-luxury text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
                    {quickViewHall.name}
                  </h2>
                  <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                    {quickViewHall.description}
                  </p>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3">Slot Pricing</h4>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {s.settings.slots.map(sl => (
                      <div key={sl.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-center">
                        <span className="text-[10px] font-bold uppercase text-zinc-500 block">{sl.name}</span>
                        <span className="text-xs font-black text-emerald-800">{fmt(quickViewHall.prices[sl.id])}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {quickViewHall.amenities.map(a => (
                      <span key={a} className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-100">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link 
                    to={`/hall/${quickViewHall.id}`}
                    onClick={() => setQuickViewHall(null)}
                    className="flex-1 text-center py-4 rounded-full border border-zinc-200 text-zinc-800 font-bold uppercase tracking-wider text-xs hover:bg-zinc-50 transition-colors"
                  >
                    Full Details
                  </Link>
                  <button 
                    onClick={() => {
                      const id = quickViewHall.id;
                      setQuickViewHall(null);
                      nav(`/book/${id}`);
                    }}
                    className="flex-1 bg-[#123D32] hover:bg-[#1A5243] text-white py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-colors shadow-lg flex items-center justify-center gap-1.5"
                  >
                    Book Venue <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- HALL DETAIL VIEW ---
function HallDetail() {
  const { id } = useParams();
  const s = useDB();
  const nav = useNavigate();
  const h = s.halls.find(x => x.id === id);

  if (!h) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <h2 className="text-2xl font-bold">Venue not found</h2>
        <Link to="/" className="text-emerald-800 underline mt-4 inline-block font-semibold">Back to Halls</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-zinc-200 shadow-xl">
        <div className="relative aspect-[21/9] min-h-[340px] overflow-hidden">
          <img 
            src={h.image || DEFAULT_HALL_IMAGES[h.id]} 
            alt={h.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 md:p-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-2 block">
                Dawoodi Bohra Community Hall
              </span>
              <h1 className="font-serif-luxury text-4xl md:text-6xl font-bold text-white mb-2">{h.name}</h1>
              <p className="text-sm text-zinc-200 font-medium">Capacity for up to {h.capacity} guests</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3">About this Venue</h3>
              <p className="text-base text-zinc-600 leading-relaxed">{h.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Included Amenities & Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {h.amenities.map(a => (
                  <div key={a} className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex items-center gap-2.5 text-sm font-semibold text-zinc-800">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Slot Tariff Matrix</h3>
              <div className="overflow-x-auto rounded-2xl border border-zinc-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase font-bold text-zinc-500">
                    <tr>
                      <th className="p-4">Slot</th>
                      <th className="p-4">Timings</th>
                      <th className="p-4">Tariff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 font-medium">
                    {s.settings.slots.map(sl => (
                      <tr key={sl.id}>
                        <td className="p-4 font-bold text-zinc-900">{sl.name}</td>
                        <td className="p-4 text-zinc-500">{sl.start} – {sl.end}</td>
                        <td className="p-4 font-black text-emerald-800">{fmt(h.prices[sl.id])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-200 h-fit space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Quick Booking</h3>
            <div>
              <span className="text-xs text-zinc-400 block mb-1">Starting from</span>
              <p className="text-3xl font-black text-emerald-900">{fmt(Math.min(...Object.values(h.prices)))}</p>
              <p className="text-xs text-zinc-500 mt-1">25% refundable advance required upon slot hold.</p>
            </div>

            <div className="pt-4 border-t border-zinc-200 space-y-3">
              {h.enabled ? (
                <button 
                  onClick={() => nav(`/book/${h.id}`)}
                  className="w-full bg-[#123D32] hover:bg-[#1A5243] text-white py-4 rounded-full font-bold uppercase tracking-wider text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  Choose Date & Slot <ArrowRight size={16} />
                </button>
              ) : (
                <div className="p-3 bg-zinc-200 text-zinc-600 rounded-xl text-center text-xs font-bold">
                  Currently Inactive for Bookings
                </div>
              )}
              <Link 
                to="/"
                className="w-full block text-center py-3 rounded-full border border-zinc-300 text-zinc-700 font-semibold text-xs hover:bg-zinc-100 transition-colors"
              >
                Return to Halls
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- INTERACTIVE CALENDAR COMPONENT ---
function Calendar({ s, hallId, value, onPick }) {
  const [m, setM] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const y = m.getFullYear();
  const mo = m.getMonth();
  const n = new Date(y, mo + 1, 0).getDate();
  const first = m.getDay();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/80 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <button 
          className="p-2.5 rounded-full hover:bg-zinc-100 transition-colors border border-zinc-200 text-zinc-700" 
          aria-label="Previous month" 
          onClick={() => setM(new Date(y, mo - 1, 1))}
        >
          <ChevronLeft size={18} />
        </button>
        <b className="font-serif-luxury text-2xl font-bold text-zinc-900">
          {m.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
        </b>
        <button 
          className="p-2.5 rounded-full hover:bg-zinc-100 transition-colors border border-zinc-200 text-zinc-700" 
          aria-label="Next month" 
          onClick={() => setM(new Date(y, mo + 1, 1))}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <motion.div 
        key={`${y}-${mo}`} 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="grid grid-cols-7 gap-2 mb-6"
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center font-bold text-[11px] uppercase tracking-wider text-zinc-400 py-1">
            {d}
          </div>
        ))}
        {Array.from({ length: first }).map((_, i) => (
          <div key={`e-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: n }, (_, i) => {
          const k = db.iso(new Date(y, mo, i + 1));
          const st = db.dayStatus(s, hallId, k);
          const isSelected = value === k;
          const isToday = k === db.today();

          const colorClasses = {
            green: 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold',
            yellow: 'bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold',
            red: 'bg-rose-500 text-white font-bold cursor-not-allowed opacity-80',
            grey: 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
          };

          return (
            <button 
              key={k} 
              disabled={st === 'grey' || st === 'red'} 
              onClick={() => onPick(k)} 
              className={`aspect-square rounded-2xl text-xs flex flex-col items-center justify-center transition-all duration-200 relative ${colorClasses[st]} ${
                isSelected ? 'ring-4 ring-zinc-900 scale-105 shadow-lg' : ''
              } ${isToday ? 'border-2 border-white' : ''}`}
            >
              <span>{i + 1}</span>
              {isToday && <span className="text-[9px] font-bold uppercase leading-none opacity-80">Today</span>}
            </button>
          );
        })}
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-zinc-500 pt-4 border-t border-zinc-100">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Partly booked</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Fully booked</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-zinc-300" /> Unavailable / Past</span>
      </div>
    </div>
  );
}

// --- BOOKING WIZARD ---
function Book() {
  const { id } = useParams();
  const s = useDB();
  const m = me(s);
  const nav = useNavigate();
  const h = s.halls.find(x => x.id === id);

  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [f, setF] = useState({ contact: m?.contactNumber || '', eventType: 'Wedding', guests: '', notes: '' });
  const [e, setE] = useState('');

  if (!h || !h.enabled) {
    return <div className="max-w-xl mx-auto py-24 text-center">This hall is not available for booking.</div>;
  }

  const price = slot ? h.prices[slot] : 0;
  const adv = Math.round(price * s.settings.advancePct / 100);
  const slots = s.settings.slots.filter(x => db.slotStatus(s, h.id, date, x.id) === 'free');

  const next = () => {
    setE('');
    if (step === 3) {
      if (!/^\d{10}$/.test(f.contact)) return setE('Enter a valid 10-digit mobile number.');
      const g = +f.guests;
      if (!g || g < 1 || g > h.capacity) return setE(`Guest count must be between 1 and ${h.capacity}.`);
    }
    setStep(step + 1);
  };

  const checkout = () => {
    try {
      const b = db.startCheckout(m.id, { 
        hallId: h.id, 
        date, 
        slotId: slot, 
        eventType: f.eventType, 
        guestCount: +f.guests, 
        contact: f.contact, 
        notes: f.notes 
      });
      nav('/pay/' + b.id);
    } catch (x) {
      setE(x.message);
      setStep(1);
      setSlot('');
    }
  };

  const sl = slot ? slotOf(s, slot) : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Wizard Flow */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 md:p-12 border border-zinc-200/80 shadow-sm">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-1 block">Step {step} of 4</span>
            <h1 className="font-serif-luxury text-3xl md:text-4xl font-bold text-zinc-900">
              Book {h.name}
            </h1>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            {['Choose Date', 'Select Slot', 'Event Details', 'Confirmation'].map((t, i) => (
              <div key={t} className="flex flex-col gap-1.5">
                <div className={`h-1.5 rounded-full transition-colors ${step >= i + 1 ? 'bg-[#123D32]' : 'bg-zinc-200'}`} />
                <span className={`text-[11px] font-bold truncate ${step === i + 1 ? 'text-emerald-900' : 'text-zinc-400'}`}>
                  {i + 1}. {t}
                </span>
              </div>
            ))}
          </div>

          <Err e={e} />

          {/* Step 1: Date */}
          {step === 1 && (
            <div>
              <p className="text-sm text-zinc-500 mb-6 font-medium">Select an available date on the calendar to reserve your preferred slot.</p>
              <Calendar 
                s={s} 
                hallId={h.id} 
                value={date} 
                onPick={d => { setDate(d); setSlot(''); setStep(2); }} 
              />
            </div>
          )}

          {/* Step 2: Slot */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs text-zinc-400 font-bold uppercase">Selected Date</span>
                  <p className="text-xl font-bold text-zinc-900">{date}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-xs font-bold text-emerald-800 underline">Change Date</button>
              </div>

              {!slots.length ? (
                <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm mb-6">
                  All slots are unavailable on this date. Please choose another date.
                </div>
              ) : (
                <div className="space-y-3 mb-8">
                  {slots.map(x => (
                    <button 
                      key={x.id}
                      onClick={() => setSlot(x.id)}
                      className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        slot === x.id 
                          ? 'border-[#123D32] bg-emerald-50/50 shadow-md ring-2 ring-emerald-700/20' 
                          : 'border-zinc-200 hover:border-zinc-400 bg-white'
                      }`}
                    >
                      <div>
                        <b className="text-base text-zinc-900 block">{x.name}</b>
                        <span className="text-xs text-zinc-500">{x.start} – {x.end}</span>
                      </div>
                      <span className="text-base font-black text-emerald-900">{fmt(h.prices[x.id])}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3.5 rounded-full border border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-700">Back</button>
                <button disabled={!slot} onClick={next} className="flex-1 bg-[#123D32] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1A5243] disabled:opacity-50 transition-colors">Continue to Event Details</button>
              </div>
            </div>
          )}

          {/* Step 3: Event Details */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-xs font-bold uppercase text-zinc-500">
                  Member Name
                  <input value={m.name} disabled className="mt-1 w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-700 font-semibold" />
                </label>
                <label className="block text-xs font-bold uppercase text-zinc-500">
                  ITS Number
                  <input value={m.itsNumber} disabled className="mt-1 w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-700 font-semibold" />
                </label>
              </div>

              <label className="block text-xs font-bold uppercase text-zinc-700">
                Contact Mobile (10 Digits)
                <input 
                  value={f.contact} 
                  onChange={x => setF({ ...f, contact: x.target.value })} 
                  className="mt-1 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-medium"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-xs font-bold uppercase text-zinc-700">
                  Event Type
                  <select 
                    value={f.eventType} 
                    onChange={x => setF({ ...f, eventType: x.target.value })}
                    className="mt-1 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-medium"
                  >
                    {['Wedding', 'Nikah', 'Reception', 'Engagement', 'Milad / Majlis', 'Other'].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-bold uppercase text-zinc-700">
                  Expected Guests (Max {h.capacity})
                  <input 
                    inputMode="numeric" 
                    value={f.guests} 
                    onChange={x => setF({ ...f, guests: x.target.value })} 
                    className="mt-1 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-medium"
                  />
                </label>
              </div>

              <label className="block text-xs font-bold uppercase text-zinc-700">
                Special Notes or Dietary Requirements (Optional)
                <textarea 
                  value={f.notes} 
                  onChange={x => setF({ ...f, notes: x.target.value })}
                  rows={3}
                  className="mt-1 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-medium"
                />
              </label>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(2)} className="px-6 py-3.5 rounded-full border border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-700">Back</button>
                <button onClick={next} className="flex-1 bg-[#123D32] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1A5243] transition-colors">Review Reservation</button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-3">
                <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-700" />
                  Instant Automated Slot Locking
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Upon proceeding, your selected slot will be locked exclusively for you for <b>{s.settings.holdMinutes} minutes</b> to complete the simulated advance payment.
                </p>
                <p className="text-[11px] text-emerald-700">
                  {s.settings.instructions}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(3)} className="px-6 py-3.5 rounded-full border border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-700">Back</button>
                <button onClick={checkout} className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 rounded-full text-xs font-bold uppercase tracking-wider hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg flex items-center justify-center gap-2">
                  Lock Slot & Pay Advance {fmt(adv)} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Aside Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-200/80 shadow-sm sticky top-28 space-y-6">
            <h3 className="font-serif-luxury text-2xl font-bold text-zinc-900 border-b border-zinc-100 pb-4">
              Booking Summary
            </h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs text-zinc-400 uppercase font-bold block">Venue</span>
                <span className="font-bold text-zinc-900 text-base">{h.name}</span>
              </div>
              <div>
                <span className="text-xs text-zinc-400 uppercase font-bold block">Selected Date</span>
                <span className="font-semibold text-zinc-800">{date || 'Not selected yet'}</span>
              </div>
              <div>
                <span className="text-xs text-zinc-400 uppercase font-bold block">Time Slot</span>
                <span className="font-semibold text-zinc-800">{sl ? `${sl.name} (${sl.start}–${sl.end})` : 'Not selected yet'}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 space-y-2.5 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Total Slot Tariff</span>
                <span className="font-bold text-zinc-900">{fmt(price)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                <span>Advance Required ({s.settings.advancePct}%)</span>
                <span>{fmt(adv)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 text-xs pt-1">
                <span>Balance at event day</span>
                <span>{fmt(price - adv)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SIMULATED PAYMENT & COUNTDOWN DRAWER ---
function useNow() {
  const [t, setT] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => {
      setT(Date.now());
      db.sweep();
    }, 1000);
    return () => clearInterval(i);
  }, []);
  return t;
}

const RZP_TEST_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TrKDuL0fKgUqom';

// Ensure Razorpay SDK is loaded
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Pay() {
  const { id } = useParams();
  const s = useDB();
  const nav = useNavigate();
  const t = useNow();
  const b = s.bookings.find(x => x.id === id);
  const m = me(s);
  const [busy, setBusy] = useState(false);
  const [e, setE] = useState('');
  const [copied, setCopied] = useState('');
  const [showSimulate, setShowSimulate] = useState(false);
  const [simMethod, setSimMethod] = useState('UPI');

  if (!b || b.memberId !== s.session.member) {
    return <div className="max-w-xl mx-auto py-24 text-center">Booking not found.</div>;
  }
  if (b.bookingStatus === 'Confirmed') {
    return <Navigate to={'/receipt/' + b.id} replace />;
  }

  const left = Math.max(0, Math.floor(((b.holdExpiresAt || 0) - t) / 1000));
  const h = hallOf(s, b.hallId);
  const sl = slotOf(s, b.slotId);

  if (b.bookingStatus !== 'Pending Payment' || left === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl space-y-4">
          <AlertCircle size={40} className="text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-zinc-900">Slot Hold Expired</h2>
          <p className="text-sm text-zinc-500">Your reservation window of 10 minutes has elapsed. Please select an available slot again.</p>
          <Link to={'/book/' + b.hallId} className="inline-block bg-[#123D32] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider">
            Re-select Venue Slot
          </Link>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2500);
  };

  // Launch Authentic Razorpay Modal
  const launchRazorpay = async () => {
    if (busy) return;
    setBusy(true);
    setE('');

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      setBusy(false);
      setE('Unable to load Razorpay payment gateway script. Please verify your internet connection or use simulation.');
      return;
    }

    try {
      const options = {
        key: RZP_TEST_KEY,
        amount: Math.round(b.advanceAmount * 100), // amount in paise
        currency: "INR",
        name: "Jamaat Khana Banquet Halls",
        description: `Advance Deposit · ${h.name} (${b.bookingDate})`,
        image: "https://cdn.razorpay.com/logos/GhRQcyean79PqE_medium.png",
        prefill: {
          name: m ? m.name : "Community Member",
          contact: b.contactNumber || (m ? m.contactNumber : "9876543210"),
          email: `${b.itsNumber}@jamaatkhana.org`
        },
        notes: {
          bookingReference: b.bookingReference,
          itsNumber: b.itsNumber,
          hallName: h.name,
          date: b.bookingDate,
          slot: sl.name
        },
        theme: {
          color: "#123D32" // Royal Emerald Jamaat brand color
        },
        handler: function (response) {
          // Razorpay returns razorpay_payment_id (e.g., pay_Hdf948kdh)
          try {
            db.pay(b.id, 'Razorpay Test Gateway', true, response.razorpay_payment_id);
            nav('/receipt/' + b.id);
          } catch (err) {
            setE(err.message);
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: function () {
            setBusy(false);
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (res) {
        setBusy(false);
        const reason = res.error ? res.error.description : 'Payment was declined or failed.';
        setE(`Razorpay: ${reason}`);
      });
      rzpInstance.open();
    } catch (err) {
      setBusy(false);
      setE(err.message || 'Error initializing Razorpay Checkout');
    }
  };

  // Fallback offline simulation
  const simulatePayment = (outcomeSuccess) => {
    if (busy) return;
    setBusy(true);
    setE('');
    setTimeout(() => {
      try {
        const dummyRef = 'PAY-TEST-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        db.pay(b.id, simMethod, outcomeSuccess, dummyRef);
        nav('/receipt/' + b.id);
      } catch (x) {
        setE(x.message);
      }
      setBusy(false);
    }, 800);
  };

  const minutes = Math.floor(left / 60);
  const seconds = String(left % 60).padStart(2, '0');

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-zinc-200 shadow-xl">
        
        {/* Hold Countdown Banner */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-5 py-3.5 rounded-2xl flex items-center justify-between mb-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Clock size={16} className="text-amber-600 animate-spin" />
            <span>Slot Hold Reserved:</span>
          </div>
          <span className="font-mono font-bold text-base text-amber-950 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200">
            {minutes}:{seconds}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif-luxury text-3xl font-bold text-zinc-900">Online Checkout</h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Razorpay Test Mode
          </span>
        </div>
        <p className="text-xs text-zinc-500 mb-6 font-medium">
          Official Community Hall Booking Portal · Secure Sandbox Payments
        </p>

        <Err e={e} />

        {/* Order Details Card */}
        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-2.5 text-xs mb-6">
          <div className="flex justify-between items-center"><span className="text-zinc-500">Hall Venue</span><b className="text-zinc-900 font-bold">{h.name}</b></div>
          <div className="flex justify-between items-center"><span className="text-zinc-500">Date & Slot</span><b className="text-zinc-800">{b.bookingDate} · {sl.name} ({sl.start}–{sl.end})</b></div>
          <div className="flex justify-between items-center"><span className="text-zinc-500">Occasion / Guests</span><b>{b.eventType} ({b.guestCount} Guests)</b></div>
          <div className="flex justify-between items-center"><span className="text-zinc-500">Booking Ref</span><span className="font-mono font-bold text-emerald-800">{b.bookingReference}</span></div>
          <div className="flex justify-between items-center pt-3 border-t border-zinc-200 text-sm">
            <span className="text-zinc-600 font-medium">Total Tariff</span>
            <span className="text-zinc-500 line-through text-xs">{fmt(b.totalAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold text-emerald-900 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100">
            <span>Advance Deposit Required</span>
            <span className="text-base text-emerald-800">{fmt(b.advanceAmount)}</span>
          </div>
        </div>

        {/* MAIN RAZORPAY ACTION */}
        <div className="space-y-4 mb-6">
          <button 
            disabled={busy} 
            onClick={launchRazorpay}
            className="w-full bg-gradient-to-r from-[#123D32] to-[#0A261F] hover:from-emerald-900 hover:to-emerald-800 text-white py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            {busy ? (
              <span className="flex items-center gap-2"><Clock size={16} className="animate-spin" /> Launching Razorpay...</span>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-emerald-400" />
                  <span>Pay {fmt(b.advanceAmount)} with Razorpay</span>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
            <Lock size={12} className="text-emerald-700" />
            <span>256-bit Encrypted · Razorpay Test Gateway (<span className="font-mono text-zinc-600 font-bold">{RZP_TEST_KEY.slice(0, 12)}...</span>)</span>
          </div>
        </div>

        {/* RAZORPAY TEST CREDENTIALS BOX */}
        <div className="bg-gradient-to-br from-emerald-50/60 to-zinc-50 p-5 rounded-2xl border border-emerald-100/80 space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-600" />
              Razorpay Test Credentials (Ready to use)
            </span>
            {copied && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-fade-in">
                Copied {copied}!
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            When the Razorpay modal opens, use any of these test credentials to simulate real transactions without real money:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs">
            {/* Test UPI */}
            <div className="p-3 bg-white rounded-xl border border-zinc-200/80 shadow-xs flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase block">Test UPI ID</span>
                <span className="font-mono font-bold text-zinc-800">success@razorpay</span>
              </div>
              <button 
                onClick={() => copyToClipboard('success@razorpay', 'UPI ID')}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
                title="Copy Test UPI"
              >
                <Copy size={14} />
              </button>
            </div>

            {/* Test Card */}
            <div className="p-3 bg-white rounded-xl border border-zinc-200/80 shadow-xs flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase block">Test Card (OTP: 123456)</span>
                <span className="font-mono font-bold text-zinc-800">4111 1111 1111 1111</span>
              </div>
              <button 
                onClick={() => copyToClipboard('4111111111111111', 'Card Number')}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
                title="Copy Test Card"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Optional Sandbox Fallback Accordion */}
        <div className="pt-2 border-t border-zinc-100">
          <button 
            type="button"
            onClick={() => setShowSimulate(!showSimulate)}
            className="text-[11px] font-bold text-zinc-400 hover:text-zinc-600 flex items-center justify-between w-full py-2"
          >
            <span>Need offline / fallback simulator without modal?</span>
            <span>{showSimulate ? 'Hide ▲' : 'Show ▼'}</span>
          </button>

          {showSimulate && (
            <div className="mt-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Offline Simulation Mode</span>
              <div className="flex gap-2">
                <button 
                  disabled={busy} 
                  onClick={() => simulatePayment(true)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Simulate Success
                </button>
                <button 
                  disabled={busy} 
                  onClick={() => simulatePayment(false)}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Simulate Failure
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// --- DIGITAL RECEIPT & PASS ---
function Receipt() {
  const { id } = useParams();
  const s = useDB();
  const b = s.bookings.find(x => x.id === id);

  if (!b) return <div className="max-w-xl mx-auto py-24 text-center">Receipt not found.</div>;
  const adm = s.session.admin;
  if (!adm && b.memberId !== s.session.member) return <div className="max-w-xl mx-auto py-24 text-center">Unauthorized.</div>;

  const p = s.payments.filter(x => x.bookingId === b.id && x.status === 'Paid');
  const m = s.members.find(x => x.id === b.memberId);
  const primaryPay = p[0];
  const isRzp = primaryPay?.reference?.startsWith('pay_');

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-zinc-200 shadow-xl receipt-container relative overflow-hidden">
        
        {/* Pass Top Branding */}
        <div className="flex justify-between items-start border-b border-zinc-200/80 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
                Official Booking Pass
              </span>
              {isRzp && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Razorpay Verified
                </span>
              )}
            </div>
            <h2 className="font-serif-luxury text-3xl font-bold text-zinc-900">Jamaat Khana Halls</h2>
            <p className="text-xs text-zinc-400">AMEROIDS TECH STUDIO · Digital Community Pass</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-zinc-400 uppercase block">Booking Reference</span>
            <span className="font-mono font-black text-lg text-emerald-900">{b.bookingReference}</span>
          </div>
        </div>

        {/* Status Chip */}
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl mb-6 text-emerald-800 text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>Status: Booking {b.bookingStatus} (Advance Paid)</span>
          </div>
          {primaryPay?.reference && (
            <span className="font-mono text-[11px] text-emerald-900 bg-white/80 px-2 py-0.5 rounded-lg border border-emerald-200">
              Ref: {primaryPay.reference}
            </span>
          )}
        </div>

        {/* Detailed Spec Table */}
        <div className="divide-y divide-zinc-100 text-sm mb-8">
          {[
            ['Member Name', m?.name || 'Member'],
            ['ITS Number', b.itsNumber],
            ['Venue', hallOf(s, b.hallId).name],
            ['Event Date & Slot', `${b.bookingDate} · ${slotOf(s, b.slotId).name} (${slotOf(s, b.slotId).start}–${slotOf(s, b.slotId).end})`],
            ['Event Type & Guests', `${b.eventType} · ${b.guestCount} Guests`],
            ['Total Amount', fmt(b.totalAmount)],
            ['Advance Amount Paid', fmt(b.paidAmount)],
            ['Remaining Balance Payable', fmt(b.remainingAmount)],
            [isRzp ? 'Razorpay Payment ID' : 'Payment Transaction Ref', p.map(x => x.reference).join(', ') || '—'],
            ['Payment Gateway', isRzp ? 'Razorpay Test Gateway (API)' : (primaryPay?.method || 'Direct')],
            ['Date of Transaction', primaryPay ? new Date(primaryPay.createdAt).toLocaleString() : '—'],
          ].map(([k, v]) => (
            <div key={k} className="py-2.5 flex justify-between">
              <span className="text-zinc-500 text-xs">{k}</span>
              <span className="font-semibold text-zinc-900 text-xs text-right">{v}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 noprint">
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-zinc-900 text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <Printer size={16} /> Print Official Pass
          </button>
          <Link 
            to={adm ? '/admin/bookings' : '/dashboard'}
            className="px-6 py-3.5 rounded-full border border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Done
          </Link>
        </div>

      </div>
    </div>
  );
}

// --- MEMBER PROFILE VIEW ---
function Profile() {
  const s = useDB();
  const m = me(s);
  const [c, setC] = useState(m?.contactNumber || '');
  const [msg, setMsg] = useState('');

  const save = () => {
    if (!/^\d{10}$/.test(c)) return setMsg('Enter a valid 10-digit mobile number.');
    db.updateContact(m.id, c);
    setMsg('Contact number updated successfully.');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-zinc-200 shadow-xl space-y-6">
        <h1 className="font-serif-luxury text-3xl font-bold text-zinc-900">ITS Member Profile</h1>
        <p className="text-xs text-zinc-500 font-medium">Verified Community Authentication Record</p>

        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase text-zinc-500">
            Full Name
            <input value={m.name} disabled className="mt-1 w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-800 font-bold" />
          </label>
          <label className="block text-xs font-bold uppercase text-zinc-500">
            ITS Number
            <input value={m.itsNumber} disabled className="mt-1 w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-800 font-bold" />
          </label>
          <label className="block text-xs font-bold uppercase text-zinc-700">
            Contact Number
            <input value={c} onChange={e => setC(e.target.value)} className="mt-1 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-medium" />
          </label>
        </div>

        <button onClick={save} className="w-full bg-[#123D32] hover:bg-[#1A5243] text-white py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-colors shadow-md">
          Save Contact
        </button>
        {msg && <p className="text-xs text-emerald-700 font-bold text-center">{msg}</p>}
      </div>
    </div>
  );
}

// --- MEMBER DASHBOARD ---
function Dashboard() {
  const s = useDB();
  const m = me(s);
  const nav = useNavigate();
  const mine = s.bookings.filter(b => b.memberId === m.id);
  const up = mine.filter(b => b.bookingStatus === 'Confirmed' && b.bookingDate >= db.today());
  const c = k => mine.filter(b => b.bookingStatus === k).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">Member Portal</span>
          <h1 className="font-serif-luxury text-4xl font-bold text-zinc-900">Welcome, {m.name}</h1>
          <p className="text-xs text-zinc-500 font-medium">ITS {m.itsNumber} · {m.contactNumber}</p>
        </div>
        <Link 
          to="/"
          className="bg-[#123D32] text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1A5243] transition-colors shadow-md flex items-center gap-2"
        >
          <Plus size={16} /> Reserve New Hall
        </Link>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          ['Upcoming Events', up.length, 'bg-emerald-50 text-emerald-900 border-emerald-200'],
          ['Pending Holds', c('Pending Payment'), 'bg-amber-50 text-amber-900 border-amber-200'],
          ['Confirmed', c('Confirmed'), 'bg-zinc-50 text-zinc-900 border-zinc-200'],
          ['Cancelled', c('Cancelled'), 'bg-rose-50 text-rose-900 border-rose-200'],
        ].map(([title, val, cls]) => (
          <div key={title} className={`p-6 rounded-3xl border shadow-sm ${cls}`}>
            <span className="text-3xl md:text-4xl font-black block mb-1">{val}</span>
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">{title}</span>
          </div>
        ))}
      </div>

      {/* Bookings History */}
      <h2 className="font-serif-luxury text-2xl font-bold text-zinc-900 mb-6">Reservation Ledger</h2>
      {!mine.length ? (
        <div className="bg-white p-12 rounded-3xl border border-zinc-200 text-center text-zinc-400">
          No bookings created yet.
        </div>
      ) : (
        <div className="space-y-4">
          {mine.map(b => (
            <div key={b.id} className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <b className="text-lg text-zinc-900">{hallOf(s, b.hallId).name}</b>
                  <Pill v={b.bookingStatus} />
                  <Pill v={b.paymentStatus} />
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                  {b.bookingDate} · {slotOf(s, b.slotId).name} · Ref: <span className="font-mono font-bold text-zinc-800">{b.bookingReference}</span> · Remaining Balance: <b>{fmt(b.remainingAmount)}</b>
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                {b.bookingStatus === 'Confirmed' && (
                  <Link to={'/receipt/' + b.id} className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-full text-xs font-bold text-zinc-800 transition-colors">
                    Pass Details
                  </Link>
                )}
                {b.bookingStatus === 'Pending Payment' && (
                  <Link to={'/pay/' + b.id} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-full text-xs font-bold text-zinc-950 transition-colors">
                    Pay Advance
                  </Link>
                )}
                {['Confirmed', 'Pending Payment'].includes(b.bookingStatus) && (
                  <button 
                    onClick={() => window.confirm('Cancel this booking? ' + s.settings.policy) && db.cancel(b.id)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- ADMIN LAYOUT ---
function AdminLayout() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-zinc-900/90 border-r border-zinc-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <span className="font-serif-luxury text-xl font-bold tracking-tight text-white">Office Admin</span>
          </div>

          <nav className="space-y-1 text-sm font-semibold">
            {[
              ['', 'Overview'],
              ['bookings', 'Bookings'],
              ['calendar', 'Master Calendar'],
              ['payments', 'Payments'],
              ['members', 'Members'],
              ['halls', 'Halls & Blocks'],
              ['settings', 'Settings'],
            ].map(([p, l]) => (
              <NavLink 
                end={!p} 
                key={p} 
                to={'/admin/' + p}
                className={({ isActive }) => `block px-4 py-2.5 rounded-xl transition-colors ${
                  isActive ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                {l}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-800 space-y-4">
          <button 
            onClick={() => { db.logout('admin'); nav('/admin/login'); }}
            className="flex items-center gap-2 text-rose-400 text-xs font-bold hover:text-rose-300 w-full"
          >
            <LogOut size={16} /> Exit Admin
          </button>
          <Brand />
        </div>
      </aside>

      <section className="flex-1 p-6 md:p-12 overflow-y-auto">
        <Outlet />
      </section>
    </div>
  );
}

// --- ADMIN CHARTS COMPONENT ---
function Bars({ data }) {
  const mx = Math.max(1, ...data.map(d => d[1]));
  return (
    <div className="space-y-3">
      {data.map(([k, v]) => (
        <div key={k} className="flex items-center gap-3 text-xs">
          <span className="w-28 font-medium text-zinc-400 truncate">{k}</span>
          <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
              style={{ width: `${(v / mx) * 100}%` }} 
            />
          </div>
          <b className="w-8 text-right font-mono text-zinc-200">{v}</b>
        </div>
      ))}
    </div>
  );
}

// --- ADMIN OVERVIEW ---
function Overview() {
  const s = useDB();
  const B = s.bookings;
  const c = k => B.filter(b => b.bookingStatus === k).length;
  const live = B.filter(b => b.bookingStatus === 'Confirmed');

  const stat = [
    ['Total Reservations', B.length],
    ['Confirmed Bookings', c('Confirmed')],
    ['Pending Holds', c('Pending Payment')],
    ['Cancelled', c('Cancelled')],
    ['Advance Collected', fmt(s.payments.filter(p => p.status === 'Paid').reduce((a, p) => a + p.amount, 0))],
    ['Remaining Balances', fmt(live.reduce((a, b) => a + b.remainingAmount, 0))],
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif-luxury text-4xl font-bold text-white mb-1">Executive Dashboard</h1>
        <p className="text-xs text-zinc-400 font-medium">Jamaat Khana Hall Booking System Performance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stat.map(([title, val]) => (
          <div key={title} className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-sm">
            <span className="text-2xl md:text-3xl font-black text-white block mb-1">{val}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{title}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-6">Bookings by Venue</h3>
          <Bars data={s.halls.map(h => [h.name, live.filter(b => b.hallId === h.id).length])} />
        </div>
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-6">Status Distribution</h3>
          <Bars data={['Confirmed', 'Pending Payment', 'Cancelled', 'Expired'].map(k => [k, c(k)])} />
        </div>
      </div>
    </div>
  );
}

// --- ADMIN BOOKINGS ---
function Bookings() {
  const s = useDB();
  const [q, setQ] = useState('');
  const [st, setSt] = useState('');
  const [hall, setHall] = useState('');
  const [pg, setPg] = useState(0);
  const [sel, setSel] = useState(null);

  const rows = s.bookings.filter(b => 
    (!st || b.bookingStatus === st) && 
    (!hall || b.hallId === hall) && 
    (b.itsNumber + b.bookingReference + b.bookingDate + (s.members.find(m => m.id === b.memberId)?.name || '')).toLowerCase().includes(q.toLowerCase())
  );
  const page = rows.slice(pg * 8, pg * 8 + 8);
  const b = sel && s.bookings.find(x => x.id === sel);

  const exp = () => db.download('bookings.csv', db.toCSV(rows.map(b => ({
    reference: b.bookingReference,
    its: b.itsNumber,
    hall: hallOf(s, b.hallId).name,
    date: b.bookingDate,
    slot: b.slotId,
    guests: b.guestCount,
    total: b.totalAmount,
    paid: b.paidAmount,
    remaining: b.remainingAmount,
    status: b.bookingStatus,
    payment: b.paymentStatus
  }))));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif-luxury text-4xl font-bold text-white mb-1">Bookings</h1>
          <p className="text-xs text-zinc-400">Total {rows.length} reservation records found</p>
        </div>
        <button onClick={exp} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input 
          placeholder="Search member, ITS, ref, date..." 
          value={q} 
          onChange={e => { setQ(e.target.value); setPg(0); }}
          className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 flex-1 min-w-[200px]"
        />
        <select 
          value={st} 
          onChange={e => setSt(e.target.value)}
          className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300"
        >
          <option value="">All Statuses</option>
          {['Pending Payment', 'Confirmed', 'Cancelled', 'Expired'].map(x => <option key={x}>{x}</option>)}
        </select>
        <select 
          value={hall} 
          onChange={e => setHall(e.target.value)}
          className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300"
        >
          <option value="">All Halls</option>
          {s.halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-800/80 text-zinc-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Ref</th>
                <th className="p-4">Member</th>
                <th className="p-4">ITS</th>
                <th className="p-4">Hall</th>
                <th className="p-4">Date</th>
                <th className="p-4">Slot</th>
                <th className="p-4">Total</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-200 font-medium">
              {page.map(b => (
                <tr key={b.id} className="hover:bg-zinc-800/40">
                  <td className="p-4 font-mono font-bold text-emerald-400">{b.bookingReference}</td>
                  <td className="p-4 font-semibold">{s.members.find(m => m.id === b.memberId)?.name}</td>
                  <td className="p-4 font-mono text-zinc-400">{b.itsNumber}</td>
                  <td className="p-4">{hallOf(s, b.hallId).name}</td>
                  <td className="p-4">{b.bookingDate}</td>
                  <td className="p-4 capitalize">{b.slotId}</td>
                  <td className="p-4 font-bold">{fmt(b.totalAmount)}</td>
                  <td className="p-4 font-bold text-emerald-400">{fmt(b.paidAmount)}</td>
                  <td className="p-4"><Pill v={b.bookingStatus} /></td>
                  <td className="p-4">
                    <button onClick={() => setSel(b.id)} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-2">
        <span>Showing Page {pg + 1} of {Math.max(1, Math.ceil(rows.length / 8))}</span>
        <div className="flex gap-2">
          <button disabled={!pg} onClick={() => setPg(pg - 1)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-40">Previous</button>
          <button disabled={(pg + 1) * 8 >= rows.length} onClick={() => setPg(pg + 1)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-40">Next</button>
        </div>
      </div>

      {b && <Manage key={b.id} b={b} s={s} close={() => setSel(null)} />}
    </div>
  );
}

// --- ADMIN MANAGE MODAL ---
function Manage({ b, s, close }) {
  const [amt, setAmt] = useState('');
  const [note, setNote] = useState(b.adminNotes);
  const [e, setE] = useState('');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={close}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full text-white shadow-2xl" onClick={x => x.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs text-emerald-400 font-mono font-bold block">{b.bookingReference}</span>
            <h3 className="font-serif-luxury text-2xl font-bold">Manage Booking</h3>
          </div>
          <button onClick={close} className="p-2 text-zinc-400 hover:text-white"><X size={18} /></button>
        </div>
        <p className="text-xs text-zinc-400 mb-4">Balance: {fmt(b.remainingAmount)} · Advance: {fmt(b.advanceAmount)}</p>
        <Err e={e} />

        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase text-zinc-400">
            Internal Notes
            <textarea value={note} onChange={x => setNote(x.target.value)} rows={2} className="mt-1 w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
          </label>
          <button onClick={() => db.setNote(b.id, note)} className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl text-zinc-200">
            Save Internal Note
          </button>

          <label className="block text-xs font-bold uppercase text-zinc-400 pt-2 border-t border-zinc-800">
            Record Offline Cash/Cheque Payment (₹)
            <input value={amt} onChange={x => setAmt(x.target.value)} placeholder="e.g. 5000" className="mt-1 w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white font-mono" />
          </label>
          <button 
            onClick={() => {
              try {
                db.offlinePay(b.id, amt);
                setAmt('');
              } catch (x) {
                setE(x.message);
              }
            }} 
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold rounded-xl text-white"
          >
            Record Offline Payment
          </button>

          <div className="flex gap-2 pt-4 border-t border-zinc-800">
            <Link to={'/receipt/' + b.id} className="flex-1 text-center py-2.5 bg-zinc-800 rounded-xl text-xs font-bold text-zinc-200">
              Receipt
            </Link>
            {['Confirmed', 'Pending Payment'].includes(b.bookingStatus) && (
              <button 
                onClick={() => window.confirm('Cancel booking?') && db.cancel(b.id, { by: 'admin', refund: b.paidAmount > 0 && window.confirm('Refund amount paid?') })}
                className="flex-1 py-2.5 bg-rose-900/60 hover:bg-rose-900 text-rose-200 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ADMIN CALENDAR ---
function AdminCalendar() {
  const s = useDB();
  const [hall, setHall] = useState('');
  const [slot, setSlot] = useState('');
  const [st, setSt] = useState('');
  const [m, setM] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [day, setDay] = useState(db.today());

  const y = m.getFullYear();
  const mo = m.getMonth();
  const n = new Date(y, mo + 1, 0).getDate();

  const items = k => [
    ...s.bookings.filter(b => b.bookingDate === k && (!hall || b.hallId === hall) && (!slot || b.slotId === slot) && (!st || b.bookingStatus === st)).map(b => ({
      t: b.bookingStatus === 'Pending Payment' && b.holdExpiresAt > Date.now() ? 'Hold' : b.bookingStatus,
      b
    })),
    ...(st ? [] : s.blocks.filter(x => x.date === k && (!hall || x.hallId === hall) && (!slot || !x.slotId || x.slotId === slot)).map(x => ({ t: 'Blocked', x })))
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-serif-luxury text-4xl font-bold text-white mb-1">Master Schedule Calendar</h1>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3">
        <select value={hall} onChange={e => setHall(e.target.value)} className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300">
          <option value="">All Halls</option>
          {s.halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        <select value={slot} onChange={e => setSlot(e.target.value)} className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300">
          <option value="">All Slots</option>
          {s.settings.slots.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
        <select value={st} onChange={e => setSt(e.target.value)} className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300">
          <option value="">All Statuses</option>
          {['Pending Payment', 'Confirmed', 'Cancelled', 'Expired'].map(x => <option key={x}>{x}</option>)}
        </select>
      </div>

      <div className="bg-zinc-900 p-6 md:p-8 rounded-3xl border border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <button className="p-2 text-zinc-400 hover:text-white" onClick={() => setM(new Date(y, mo - 1, 1))}><ChevronLeft size={20} /></button>
          <b className="font-serif-luxury text-2xl font-bold text-white">{m.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</b>
          <button className="p-2 text-zinc-400 hover:text-white" onClick={() => setM(new Date(y, mo + 1, 1))}><ChevronRight size={20} /></button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <i key={i} className="text-center text-xs font-bold text-zinc-500 py-1">{d}</i>)}
          {Array.from({ length: m.getDay() }).map((_, i) => <span key={'e' + i} />)}
          {Array.from({ length: n }, (_, i) => {
            const k = db.iso(new Date(y, mo, i + 1));
            const dayItems = items(k);
            return (
              <button 
                key={k} 
                onClick={() => setDay(k)}
                className={`min-h-[64px] p-2 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  day === k ? 'bg-zinc-800 border-emerald-500 shadow-lg' : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700'
                }`}
              >
                <span className="text-xs font-bold text-zinc-300">{i + 1}</span>
                <div className="flex flex-wrap gap-1">
                  {dayItems.map((x, j) => (
                    <span 
                      key={j} 
                      className={`w-2 h-2 rounded-full ${
                        x.t === 'Confirmed' ? 'bg-emerald-500' :
                        x.t === 'Pending Payment' ? 'bg-amber-400' :
                        x.t === 'Hold' ? 'bg-orange-500' :
                        x.t === 'Cancelled' ? 'bg-rose-500' : 'bg-zinc-600'
                      }`} 
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day View */}
      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
        <h3 className="font-bold text-base text-white mb-4">Agenda for {day}</h3>
        {!items(day).length ? (
          <p className="text-xs text-zinc-500">No events or blocks scheduled for this date.</p>
        ) : (
          <div className="space-y-3">
            {items(day).map((x, i) => (
              <div key={i} className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex justify-between items-center text-xs">
                {x.b ? (
                  <div>
                    <b className="text-white text-sm block">{hallOf(s, x.b.hallId).name}</b>
                    <span className="text-zinc-400">{slotOf(s, x.b.slotId).name} · ITS {x.b.itsNumber} · Ref: {x.b.bookingReference}</span>
                  </div>
                ) : (
                  <div>
                    <b className="text-white text-sm block">{hallOf(s, x.x.hallId).name}</b>
                    <span className="text-zinc-400">{x.x.slotId || 'Whole day'} · Block Reason: {x.x.reason}</span>
                  </div>
                )}
                <Pill v={x.t} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- ADMIN PAYMENTS ---
function Payments() {
  const s = useDB();
  const [q, setQ] = useState('');
  const rows = s.payments.filter(p => (p.reference + p.bookingReference + p.itsNumber + p.memberName).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif-luxury text-4xl font-bold text-white mb-1">Payments Ledger</h1>
          <p className="text-xs text-zinc-400">Total {rows.length} verified transactions</p>
        </div>
        <button onClick={() => db.download('payments.csv', db.toCSV(rows))} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <input 
        placeholder="Search payments by member, ITS, transaction ref..." 
        value={q} 
        onChange={e => setQ(e.target.value)}
        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-white"
      />

      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-800/80 text-zinc-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Ref</th>
                <th className="p-4">Booking</th>
                <th className="p-4">Member</th>
                <th className="p-4">ITS</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-200 font-medium">
              {rows.map(p => (
                <tr key={p.id} className="hover:bg-zinc-800/40">
                  <td className="p-4 font-mono font-bold text-emerald-400">{p.reference}</td>
                  <td className="p-4 font-mono text-zinc-400">{p.bookingReference}</td>
                  <td className="p-4 font-semibold">{p.memberName}</td>
                  <td className="p-4 font-mono text-zinc-400">{p.itsNumber}</td>
                  <td className="p-4 font-black text-white">{fmt(p.amount)}</td>
                  <td className="p-4">{p.method}</td>
                  <td className="p-4"><Pill v={p.status} /></td>
                  <td className="p-4 text-zinc-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- ADMIN MEMBERS ---
function Members() {
  const s = useDB();
  const [q, setQ] = useState('');
  const [ed, setEd] = useState(null);
  const [e, setE] = useState('');

  const save = () => {
    try {
      db.saveMember(ed);
      setEd(null);
      setE('');
    } catch (x) {
      setE(x.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif-luxury text-4xl font-bold text-white mb-1">Community Members</h1>
          <p className="text-xs text-zinc-400">Manage authenticated ITS profiles</p>
        </div>
        <button 
          onClick={() => setEd({ id: 'm' + Date.now(), itsNumber: '', name: '', contactNumber: '', accountStatus: 'Active' })}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
        >
          <Plus size={14} /> Add Member
        </button>
      </div>

      <input 
        placeholder="Search member by name or ITS number..." 
        value={q} 
        onChange={e => setQ(e.target.value)}
        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-white"
      />

      {ed && (
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
          <h3 className="font-bold text-white text-sm">Edit Member</h3>
          <Err e={e} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['itsNumber', 'name', 'contactNumber'].map(k => (
              <label key={k} className="text-xs text-zinc-400 font-bold uppercase">
                {k === 'itsNumber' ? 'ITS Number' : k === 'contactNumber' ? 'Mobile' : 'Full Name'}
                <input 
                  value={ed[k]} 
                  onChange={x => setEd({ ...ed, [k]: x.target.value })} 
                  className="mt-1 w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white"
                />
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Save Member</button>
            <button onClick={() => setEd(null)} className="px-5 py-2 bg-zinc-800 text-zinc-400 rounded-xl text-xs">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {s.members.filter(m => (m.name + m.itsNumber).toLowerCase().includes(q.toLowerCase())).map(m => (
          <div key={m.id} className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 flex justify-between items-center">
            <div>
              <b className="text-white text-sm block">{m.name}</b>
              <span className="text-xs text-zinc-400">ITS {m.itsNumber} · {m.contactNumber} · {s.bookings.filter(b => b.memberId === m.id).length} Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <Pill v={m.accountStatus} />
              <button onClick={() => setEd(m)} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-lg text-zinc-200">
                Edit
              </button>
              <button 
                onClick={() => db.saveMember({ ...m, accountStatus: m.accountStatus === 'Active' ? 'Inactive' : 'Active' })}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-lg text-zinc-200"
              >
                {m.accountStatus === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- ADMIN HALLS & BLOCKS ---
function Halls() {
  const s = useDB();
  const [ed, setEd] = useState(null);
  const [bl, setBl] = useState({ hallId: s.halls[0]?.id || 'h1', date: db.today(), slotId: '', reason: '' });

  const P = (k, v) => setEd({ ...ed, prices: { ...ed.prices, [k]: +v } });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif-luxury text-4xl font-bold text-white mb-1">Venues & Blocks</h1>
          <p className="text-xs text-zinc-400">Manage hall capacities, slot tariffs, and maintenance lockouts</p>
        </div>
        <button onClick={() => setEd(db.newHall())} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Plus size={14} /> Add New Hall
        </button>
      </div>

      {ed && (
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Edit Venue</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-xs text-zinc-400 font-bold uppercase">
              Hall Name
              <input value={ed.name} onChange={x => setEd({ ...ed, name: x.target.value })} className="mt-1 w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
            </label>
            <label className="text-xs text-zinc-400 font-bold uppercase">
              Capacity
              <input value={ed.capacity} onChange={x => setEd({ ...ed, capacity: +x.target.value || 0 })} className="mt-1 w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
            </label>
          </div>
          <label className="text-xs text-zinc-400 font-bold uppercase block">
            Image URL
            <input value={ed.image} onChange={x => setEd({ ...ed, image: x.target.value })} className="mt-1 w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
          </label>
          <label className="text-xs text-zinc-400 font-bold uppercase block">
            Description
            <textarea value={ed.description} onChange={x => setEd({ ...ed, description: x.target.value })} rows={2} className="mt-1 w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
          </label>
          <label className="text-xs text-zinc-400 font-bold uppercase block">
            Amenities (Comma Separated)
            <input value={ed.amenities.join(', ')} onChange={x => setEd({ ...ed, amenities: x.target.value.split(',').map(a => a.trim()).filter(Boolean) })} className="mt-1 w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
          </label>

          <div className="grid grid-cols-3 gap-3">
            {s.settings.slots.map(sl => (
              <label key={sl.id} className="text-xs text-zinc-400 font-bold uppercase">
                {sl.name} Tariff (₹)
                <input value={ed.prices[sl.id] || 0} onChange={x => P(sl.id, x.target.value)} className="mt-1 w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
              </label>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-zinc-300">
            <input type="checkbox" checked={ed.enabled} onChange={x => setEd({ ...ed, enabled: x.target.checked })} /> Enabled for new bookings
          </label>

          <div className="flex gap-2 pt-2">
            <button onClick={() => { db.saveHall(ed); setEd(null); }} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">Save Venue</button>
            <button onClick={() => setEd(null)} className="px-5 py-2.5 bg-zinc-800 text-zinc-400 rounded-xl text-xs font-bold">Cancel</button>
          </div>
        </div>
      )}

      {/* Hall Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {s.halls.map(h => (
          <div key={h.id} className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <b className="text-white text-base">{h.name}</b>
                {!h.enabled && <Pill v="Disabled" />}
              </div>
              <p className="text-xs text-zinc-400">{h.capacity} Guests · {fmt(h.prices.morning)} / {fmt(h.prices.afternoon)} / {fmt(h.prices.evening)}</p>
            </div>
            <button onClick={() => setEd(JSON.parse(JSON.stringify(h)))} className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-lg text-zinc-200">
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Maintenance Lockouts */}
      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-4">
        <h3 className="font-serif-luxury text-2xl font-bold text-white">Block Dates for Maintenance / Jamaat Majlis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <label className="text-xs text-zinc-400 font-bold uppercase">
            Hall
            <select value={bl.hallId} onChange={x => setBl({ ...bl, hallId: x.target.value })} className="mt-1 w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white">
              {s.halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </label>
          <label className="text-xs text-zinc-400 font-bold uppercase">
            Date
            <input type="date" value={bl.date} onChange={x => setBl({ ...bl, date: x.target.value })} className="mt-1 w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
          </label>
          <label className="text-xs text-zinc-400 font-bold uppercase">
            Slot
            <select value={bl.slotId} onChange={x => setBl({ ...bl, slotId: x.target.value })} className="mt-1 w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white">
              <option value="">Whole Day</option>
              {s.settings.slots.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </label>
          <label className="text-xs text-zinc-400 font-bold uppercase">
            Reason
            <input value={bl.reason} onChange={x => setBl({ ...bl, reason: x.target.value })} placeholder="e.g. Annual Maintenance" className="mt-1 w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
          </label>
        </div>
        <button onClick={() => bl.date && db.addBlock({ ...bl, slotId: bl.slotId || null })} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold">
          Add Lockout Block
        </button>

        <div className="space-y-2 pt-4">
          {s.blocks.map(b => (
            <div key={b.id} className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center text-xs text-zinc-300">
              <span>{hallOf(s, b.hallId).name} · {b.date} · {b.slotId || 'Whole day'} · {b.reason}</span>
              <button onClick={() => db.removeBlock(b.id)} className="text-rose-400 hover:text-rose-300 font-semibold">Unblock</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- ADMIN SETTINGS ---
function Settings() {
  const s = useDB();
  const [t, setT] = useState(() => JSON.parse(JSON.stringify(s.settings)));
  const [ok, setOk] = useState(false);

  const sl = (i, k, v) => setT({ ...t, slots: t.slots.map((x, j) => j === i ? { ...x, [k]: v } : x) });

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-serif-luxury text-4xl font-bold text-white mb-1">System Settings</h1>
        <p className="text-xs text-zinc-400">Configure advance percentages, hold duration, and policies</p>
      </div>

      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-xs text-zinc-400 font-bold uppercase">
            Advance Deposit Required (%)
            <input value={t.advancePct} onChange={x => setT({ ...t, advancePct: +x.target.value || 0 })} className="mt-1 w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white font-mono" />
          </label>
          <label className="text-xs text-zinc-400 font-bold uppercase">
            Active Checkout Hold (Minutes)
            <input value={t.holdMinutes} onChange={x => setT({ ...t, holdMinutes: +x.target.value || 1 })} className="mt-1 w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white font-mono" />
          </label>
        </div>

        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase text-zinc-400">Slot Timings</span>
          {t.slots.map((x, i) => (
            <div key={x.id} className="grid grid-cols-3 gap-3 items-center">
              <span className="text-xs font-semibold text-zinc-300">{x.name}</span>
              <input type="time" value={x.start} onChange={e => sl(i, 'start', e.target.value)} className="p-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
              <input type="time" value={x.end} onChange={e => sl(i, 'end', e.target.value)} className="p-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
            </div>
          ))}
        </div>

        <label className="text-xs text-zinc-400 font-bold uppercase block">
          Cancellation & Refund Policy
          <textarea value={t.policy} onChange={x => setT({ ...t, policy: x.target.value })} rows={2} className="mt-1 w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
        </label>
        <label className="text-xs text-zinc-400 font-bold uppercase block">
          Booking Instructions
          <textarea value={t.instructions} onChange={x => setT({ ...t, instructions: x.target.value })} rows={2} className="mt-1 w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
        </label>
        <label className="text-xs text-zinc-400 font-bold uppercase block">
          Office Contact Details
          <input value={t.contact} onChange={x => setT({ ...t, contact: x.target.value })} className="mt-1 w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white" />
        </label>

        <button onClick={() => { db.saveSettings(t); setOk(true); }} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-wider">
          Save Settings
        </button>
        {ok && <span className="text-xs text-emerald-400 font-bold ml-3">✓ Settings successfully saved</span>}
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-950/40 p-8 rounded-3xl border border-rose-900/60 space-y-3">
        <h3 className="font-bold text-rose-300 text-sm">Danger Zone</h3>
        <p className="text-xs text-rose-400">Reset all demo transactions, blocks, and reservations back to original seed data.</p>
        <button onClick={() => window.confirm('Reset ALL demo data?') && db.resetDemo()} className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold">
          Reset Demo Database
        </button>
      </div>
    </div>
  );
}

// --- MAIN ROUTER ---
export default function App() {
  useEffect(() => {
    db.sweep();
  }, []);

  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/hall/:id" element={<HallDetail />} />
        <Route path="/book/:id" element={<RequireMember><Book /></RequireMember>} />
        <Route path="/pay/:id" element={<RequireMember><Pay /></RequireMember>} />
        <Route path="/receipt/:id" element={<Receipt />} />
        <Route path="/profile" element={<RequireMember><Profile /></RequireMember>} />
        <Route path="/dashboard" element={<RequireMember><Dashboard /></RequireMember>} />
      </Route>

      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Overview />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="calendar" element={<AdminCalendar />} />
        <Route path="payments" element={<Payments />} />
        <Route path="members" element={<Members />} />
        <Route path="halls" element={<Halls />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
