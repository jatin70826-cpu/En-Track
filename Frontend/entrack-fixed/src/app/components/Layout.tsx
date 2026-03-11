import { Outlet, useLocation, useOutlet, useNavigate, Link } from 'react-router';
import { Menu, X, Shield, Send, ChevronRight, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { exportFullReportPDF } from '../components/ExportPDF';
import { ThemeToggle } from './ThemeToggle';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TICKER_ITEMS = [
  { donor: 'Donor#88', amount: '₹2,500', ngo: 'Global Clean Water', hash: '5e88...3e8' },
  { donor: 'Donor#142', amount: '₹10,000', ngo: 'Tech for Tomorrow', hash: 'a1b2...4f6' },
  { donor: 'Donor#305', amount: '₹500', ngo: 'Green Earth Alliance', hash: 'f0e1...def' },
  { donor: 'Donor#71', amount: '₹7,500', ngo: 'Health Hope Foundation', hash: '9876...abc' },
  { donor: 'Donor#219', amount: '₹1,000', ngo: 'Ocean Cleanup Crew', hash: '1357...bdf' },
  { donor: 'Donor#490', amount: '₹5,000', ngo: 'Future Scholars', hash: '2468...ace' },
  { donor: 'Donor#33', amount: '₹25,000', ngo: 'Rural Health Initiative', hash: 'c3d4...e5f' },
  { donor: 'Donor#678', amount: '₹750', ngo: 'Child Safety Net', hash: '7890...bca' },
];

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const outlet = useOutlet();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'NGOs', path: '/verified-ngos' },
    { name: 'Donate', path: '/donate' },
    { name: 'History', path: '/track' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Contact', path: '/contact' },
  ];

  const getHashPath = (path: string) => `#${path === '/' ? '' : path}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060C1A] text-gray-900 dark:text-white font-['DM_Sans',sans-serif] selection:bg-blue-500/40 selection:text-white overflow-x-hidden transition-colors duration-300">

      {/* Scroll to top on route change */}

      {/* Global bg grid */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'radial-gradient(rgba(37,99,235,0.06) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* ─── NAVBAR ───────────────────────────────────────────────── */}
      <nav className="glass-nav relative z-50 flex items-center justify-between h-[68px] px-4 md:px-8 transition-colors duration-300">
        <a href={getHashPath('/')} className="flex items-center gap-3 z-50 group shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg" style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 0 16px rgba(37,99,235,0.5)' }}>
            <Shield className="text-white w-4 h-4" />
          </div>
          <span className="font-['Syne',sans-serif] font-bold tracking-tight text-gray-900 dark:text-white text-xl">
            En-Track
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={getHashPath(link.path)}
              className={cn(
                'text-sm font-medium transition-all relative group whitespace-nowrap',
                location.pathname === link.path
                  ? 'text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {link.name}
              <span className={cn(
                'absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100 rounded-full',
                location.pathname === link.path && 'scale-x-100'
              )} />
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-sm text-gray-900 dark:text-white hover:bg-[#3B82F6]/20 transition-all"
              >
                <User className="w-4 h-4 text-blue-400" />
                {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </>
          ) : (
            <a
              href={getHashPath('/login')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-bold transition-all"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 0 20px rgba(37,99,235,0.3)' }}
            >
              Login
            </a>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="z-50 text-gray-600 dark:text-gray-300 p-2 focus:outline-none hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Live Ticker Strip */}
      <div className="relative z-40 border-b border-gray-200/50 dark:border-white/[0.05] overflow-hidden py-2 bg-blue-500/[0.04] dark:bg-[rgba(37,99,235,0.05)]">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs font-mono px-6 text-gray-500 shrink-0">
              <span className="text-blue-400 font-bold">{item.donor}</span>
              <span>donated</span>
              <span className="text-gray-700 dark:text-gray-200 font-bold">{item.amount}</span>
              <span>to</span>
              <span className="text-gray-500 dark:text-gray-400">{item.ngo}</span>
              <span className="text-emerald-500">• Verified ✓</span>
              <span className="text-gray-600 dark:text-gray-600">• Hash: {item.hash}</span>
              <span className="text-gray-300/30 dark:text-white/10 mx-2">|</span>
            </span>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 pt-[68px] px-6 lg:hidden flex flex-col overflow-y-auto bg-white dark:bg-[#060C1A] transition-colors duration-300"
          >
            <div className="py-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={getHashPath(link.path)}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/5',
                    location.pathname === link.path ? 'text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  )}
                >
                  <span className="text-xl font-bold font-['Syne',sans-serif]">{link.name}</span>
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </a>
              ))}
            </div>
            <div className="mt-auto pb-12 flex flex-col gap-4">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                  >
                    <User className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-900 dark:text-white font-bold text-sm">{user.user_metadata?.full_name?.split(' ')[0] || user.email}</span>
                  </Link>
                  <button
                    onClick={() => { setIsMenuOpen(false); handleSignOut(); }}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-red-500/20 text-red-400 font-bold"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <a
                  href={getHashPath('/login')}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full py-4 rounded-2xl text-white font-bold"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)' }}
                >
                  Login
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 w-full min-h-[calc(100vh-105px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-white/[0.06] py-16 px-6 md:px-12 mt-16 bg-gray-100/50 dark:bg-[rgba(255,255,255,0.01)]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[80px]" style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)' }} />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {/* Col 1 */}
          <div className="lg:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
                <Shield className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white font-['Syne',sans-serif]">En-Track</span>
            </div>
            <p className="text-gray-600 dark:text-gray-500 leading-relaxed text-sm">
              A Secure & Transparent Digital Donation System. Every rupee tracked from your payment to the final beneficiary using our Data Integrity Protocol.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              System Operational
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-5 uppercase text-xs tracking-widest font-['Syne',sans-serif]">Platform</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Verified NGOs', path: '/verified-ngos' },
                { label: 'Donate Now', path: '/donate' },
                { label: 'Transaction History', path: '/track' },
                { label: 'Live Dashboard', path: '/dashboard' },
                { label: 'Contact', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <a
                    href={getHashPath(link.path)}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-gray-600 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-blue-400" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-5 uppercase text-xs tracking-widest font-['Syne',sans-serif]">Resources</h3>
            <ul className="space-y-3 text-sm">
              {[
                'Security Whitepaper', 'Data Integrity FAQ',
                'SHA-256 Verification', 'NGO Verification Process',
                'Privacy Policy', 'Terms of Service',
              ].map(label => (
                <li key={label}>
                  <a href="#" className="text-gray-600 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-blue-400" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-5 uppercase text-xs tracking-widest font-['Syne',sans-serif]">Stay Updated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-500 mb-4 leading-relaxed">
              Get monthly transparency reports and NGO impact updates delivered to your inbox.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors min-w-0"
                />
                <button className="p-3 rounded-xl text-white hover:opacity-90 transition-opacity shrink-0" style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 0 16px rgba(37,99,235,0.3)' }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => exportFullReportPDF()}
                className="w-full py-3 rounded-xl border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <span>📄</span> Export Full Report (PDF)
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 dark:text-gray-600 text-xs font-mono relative z-10">
          <span>© 2025 En-Track. Engineered for Absolute Transparency.</span>
          <div className="flex gap-6">
            {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
              <a key={s} href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-ticker { animation: ticker 45s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
