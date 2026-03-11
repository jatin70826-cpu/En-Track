import { Link } from 'react-router';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import {
  ShieldCheck, ArrowRight, Activity, Users,
  Building2, Hash, Zap, Droplets,
  Star, Globe, Lock, ChevronRight, Sparkles
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

// ─── Animated Counter ──────────────────────────────────────────────
function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2 }: {
  target: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 60;
    const increment = target / steps;
    const interval = (duration * 1000) / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, interval);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

// ─── Particle field ────────────────────────────────────────────────
function ParticleField() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 4 + 3,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-400/30"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ─── Glowing orb ──────────────────────────────────────────────────
function GlowOrb({ className, color }: { className: string; color: string }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none blur-[120px] ${className}`}
      style={{ background: color }}
    />
  );
}

// ─── Live feed ─────────────────────────────────────────────────────
const LIVE_FEED = [
  { donor: 'Donor#88', amount: '₹2,500', ngo: 'Global Clean Water', time: '2m ago', type: 'Money' },
  { donor: 'Anon#441', amount: '3 units', ngo: 'City Blood Bank', time: '5m ago', type: 'Blood' },
  { donor: 'Donor#305', amount: '12 books', ngo: 'Future Scholars', time: '9m ago', type: 'Books' },
  { donor: 'Donor#71', amount: '₹7,500', ngo: 'Health Hope', time: '14m ago', type: 'Money' },
  { donor: 'Anon#889', amount: '5 items', ngo: 'Child Safety Net', time: '18m ago', type: 'Clothes' },
];

const TYPE_COLORS: Record<string, string> = {
  Money: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Blood: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  Books: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Clothes: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Electronics: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
};

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-[#060C1A] text-gray-900 dark:text-white font-['DM_Sans',sans-serif] overflow-x-hidden">

      {/* ── Global gradient bg ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(109,40,217,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(59,130,246,0.1) 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(37,99,235,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* ────────────────────────────────────────────────────── HERO */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center overflow-hidden z-10">
        <ParticleField />
        <GlowOrb className="w-[700px] h-[700px] -top-60 left-1/2 -translate-x-1/2 opacity-40" color="radial-gradient(circle, rgba(37,99,235,0.6) 0%, transparent 70%)" />
        <GlowOrb className="w-96 h-96 top-1/2 -right-48 opacity-30" color="radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)" />

        <motion.div style={{ y: heroY }} className="relative z-10 max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">Secure & Transparent Digital Donation</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="space-y-2">
            <h1 className="font-['Syne',sans-serif] font-extrabold leading-[1.0] tracking-[-0.04em]" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}>
              Don't Just Give,
            </h1>
            <h1
              className="font-['Syne',sans-serif] font-extrabold leading-[1.0] tracking-[-0.04em]"
              style={{
                fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                background: 'linear-gradient(135deg, #60a5fa 0%, #60a5fa 50%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Witness the Change.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed text-lg"
          >
            Experience absolute transparency through our SHA-256 data integrity system.{' '}
            <span className="text-gray-900 dark:text-white font-semibold">Trace every rupee</span>{' '}
            from your contribution to the final beneficiary.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              to="/donate"
              className="group relative px-10 py-4 rounded-full font-bold text-white text-lg overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #2563EB, #1d4ed8)',
                boxShadow: '0 0 40px rgba(37,99,235,0.5), 0 4px 16px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Donate Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563EB)' }}
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <Link
              to="/track"
              className="px-10 py-4 rounded-full font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-blue-500/40 hover:text-white hover:bg-blue-500/5 transition-all text-lg backdrop-blur-sm"
            >
              Track Donation
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-6 pt-4"
          >
            {[
              { icon: <ShieldCheck className="w-4 h-4 text-blue-400" />, text: 'Bank-Grade Encryption' },
              { icon: <Hash className="w-4 h-4 text-blue-400" />, text: 'SHA-256 Verified' },
              { icon: <Zap className="w-4 h-4 text-emerald-400" />, text: 'Real-Time Tracking' },
              { icon: <Lock className="w-4 h-4 text-amber-400" />, text: 'Data Integrity Protocol' },
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-500"
              >
                {b.icon} {b.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating preview cards */}
        <motion.div
          initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0, duration: 0.8 }}
          className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3"
        >
          {[
            { label: 'Verified', color: 'text-blue-400', icon: '✓' },
            { label: 'Tracked', color: 'text-blue-400', icon: '◉' },
            { label: 'Secured', color: 'text-emerald-400', icon: '⬡' },
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <span className={item.color}>{item.icon}</span> {item.label}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3"
        >
          {[
            { label: 'Integrity Hash', color: 'text-amber-400' },
            { label: 'Live Sync', color: 'text-blue-400' },
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 3.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <span className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-amber-400' : 'bg-blue-400'} animate-pulse`} />
              {item.label}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───────────────────────────────────────────────── STATS STRIP */}
      <section className="relative z-10 py-16 border-y border-gray-100 dark:border-white/5 glass">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { target: 482, prefix: '₹', suffix: ' L+', label: 'Total Donated', color: 'text-blue-400' },
            { target: 142, suffix: '+', label: 'Verified NGOs', color: 'text-blue-400' },
            { target: 8932, suffix: '+', label: 'Active Donors', color: 'text-emerald-400' },
            { target: 14203, label: 'Integrity Hashes', color: 'text-amber-400' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-1"
            >
              <div className={`text-3xl md:text-4xl font-bold font-['Syne',sans-serif] ${s.color}`}>
                <AnimatedCounter target={s.target} prefix={s.prefix || ''} suffix={s.suffix || ''} />
              </div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────── HOW IT WORKS */}
      <section className="relative z-10 py-28 px-6 border-t border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-bold uppercase tracking-widest">
              How It Works
            </div>
            <h2 className="font-['Syne',sans-serif] font-extrabold tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              The Transparency Engine
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">We eliminated the black box of charity. Every rupee tracked with cryptographic precision.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-blue-500/30 via-blue-500/30 to-emerald-500/30 hidden md:block" />

            {[
              { step: '01', icon: <Users className="w-7 h-7" />, title: 'You Donate', desc: 'Submit your donation securely. A unique SHA-256 hash is instantly generated for your transaction.', color: 'from-blue-500 to-purple-600', glow: 'rgba(37,99,235,0.4)' },
              { step: '02', icon: <Hash className="w-7 h-7" />, title: 'Hash Locked', desc: 'Your data is hashed and locked with our Data Integrity Protocol — tamper-proof and fully auditable.', color: 'from-blue-500 to-cyan-500', glow: 'rgba(59,130,246,0.4)' },
              { step: '03', icon: <ShieldCheck className="w-7 h-7" />, title: 'Impact Delivered', desc: 'Funds reach the verified NGO. Every step is logged with an immutable hash you can verify anytime.', color: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.4)' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className="relative p-8 rounded-2xl overflow-hidden group glass cursor-pointer"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top, ${item.glow}15 0%, transparent 70%)` }} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-lg`}
                  style={{ boxShadow: `0 8px 20px ${item.glow}` }}>
                  {item.icon}
                </div>
                <span className="absolute top-6 right-6 font-['Syne',sans-serif] font-extrabold text-5xl text-gray-900 dark:text-white/5">{item.step}</span>
                <h3 className="font-['Syne',sans-serif] font-bold text-xl text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────── LIVE ACTIVITY + STATS */}
      <section className="relative z-10 py-28 px-6 border-t border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Live feed */}
          <div>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-5">
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" /> Live Feed
              </div>
              <h2 className="font-['Syne',sans-serif] font-extrabold tracking-tight mb-3" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
                Real-Time <span className="text-blue-400">Impact</span> Stream
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Transparency isn't just a promise — it's a live stream. See donations happening right now.</p>

              <div className="space-y-3">
                {LIVE_FEED.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl glass hover:border-blue-500/20 transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Activity className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{item.donor}</span>
                        <span className="text-blue-300 font-bold text-sm">{item.amount}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-gray-500 truncate">→ {item.ngo}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-600 shrink-0 ml-2">{item.time}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${TYPE_COLORS[item.type]}`}>{item.type}</span>
                  </motion.div>
                ))}
              </div>

              <Link to="/track" className="mt-6 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors">
                View All Transactions <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Impact card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-2xl blur-[60px] opacity-20" style={{ background: 'linear-gradient(135deg, #2563EB, #3b82f6)' }} />
            <div
              className="relative rounded-2xl p-8 border border-blue-500/20 overflow-hidden"
              style={{ background: 'linear-gradient(145deg, rgba(37,99,235,0.12), rgba(59,130,246,0.06))' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.5), transparent)' }} />

              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-400" />
                  <h3 className="font-['Syne',sans-serif] font-bold text-gray-900 dark:text-white text-xl">Global Impact</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs font-mono text-blue-400 font-bold">LIVE</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { label: 'Total Donated', value: '₹4.82 Cr', color: 'text-blue-400' },
                  { label: 'Lives Impacted', value: '12,500+', color: 'text-blue-400' },
                  { label: 'Active NGOs', value: '142', color: 'text-emerald-400' },
                  { label: 'Verified Tx', value: '14,203', color: 'text-amber-400' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{s.label}</div>
                    <div className={`font-['Syne',sans-serif] font-extrabold text-2xl ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-end gap-1.5 h-16">
                  {[35, 55, 42, 78, 58, 88, 72, 65, 82, 94, 76, 90].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{ background: `linear-gradient(to top, #2563EB, #60a5fa)`, opacity: 0.4 + h / 250 }}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.6, ease: 'easeOut' }}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-600 font-mono mt-2 text-right">↑ Weekly trend</div>
              </div>

              {/* Hash display */}
              <div className="mt-6 p-4 rounded-xl bg-gray-100/80 dark:bg-black/30 border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-400 font-bold">LATEST INTEGRITY HASH</span>
                </div>
                <code className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                  SHA256: <span className="text-blue-400">8b2f3a9d1e4c7b0f5e2a8d3c6b9f2e5a</span><span className="text-gray-500 dark:text-gray-600">1d4b7e0a3f6c9b2d</span>
                </code>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── TRUSTED BY / LOGOS */}
      <section className="relative z-10 py-16 px-6 border-t border-gray-100 dark:border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 dark:text-gray-600 text-sm uppercase tracking-widest font-semibold mb-8">Trusted & Supported By</p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-30">
            {['NGO India', 'GiveIndia', 'NASSCOM', 'Startup India', 'Digital India', 'PaySecure'].map((name, i) => (
              <span key={i} className="text-gray-900 dark:text-white font-bold text-lg tracking-tight">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────── FEATURES */}
      <section className="relative z-10 py-28 px-6 border-t border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Star className="w-3 h-3" /> Features
            </div>
            <h2 className="font-['Syne',sans-serif] font-extrabold tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              Powerful features to simplify giving
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <ShieldCheck className="w-6 h-6" />, title: 'Verified NGOs Only', desc: 'Every NGO is rigorously vetted with document verification and mission validation before receiving funds.', color: 'text-blue-400', bg: 'rgba(37,99,235,0.1)', border: 'rgba(37,99,235,0.2)' },
              { icon: <Hash className="w-6 h-6" />, title: 'SHA-256 Hash Tracking', desc: 'Every transaction generates a cryptographic hash stored in an immutable ledger you can verify anytime.', color: 'text-blue-400', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
              { icon: <Activity className="w-6 h-6" />, title: 'Real-Time Dashboard', desc: 'Live metrics showing total donations, active NGOs, and impact in real-time, verified by our protocol.', color: 'text-emerald-400', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
              { icon: <Droplets className="w-6 h-6" />, title: 'Multi-Type Donations', desc: 'Support goes beyond money — donate blood, stationery, clothes, or electronics all in one platform.', color: 'text-rose-400', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.2)' },
              { icon: <Globe className="w-6 h-6" />, title: 'PDF Export & Reports', desc: 'Download transparent reports of your donations, complete with integrity hashes and impact metrics.', color: 'text-amber-400', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
              { icon: <Building2 className="w-6 h-6" />, title: 'NGO Registration Portal', desc: 'Organizations can register, get verified, and start receiving transparent donations in under 24 hours.', color: 'text-cyan-400', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl glass transition-all duration-300 cursor-pointer group"
              >
                <div className={`${f.color} mb-4 group-hover:scale-110 transition-transform duration-300 inline-block`}>{f.icon}</div>
                <h3 className="font-['Syne',sans-serif] font-bold text-gray-900 dark:text-white text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── CTA */}
      <section className="relative z-10 py-32 px-6 overflow-hidden">
        <GlowOrb className="w-[600px] h-[400px] -bottom-32 left-1/2 -translate-x-1/2 opacity-30" color="radial-gradient(circle, rgba(37,99,235,0.5) 0%, transparent 70%)" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-semibold">
              Step into the future of giving
            </div>
            <h2 className="font-['Syne',sans-serif] font-extrabold tracking-tight leading-[1.0]" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              Ready to make a{' '}
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa, #60a5fa, #34d399)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                real impact?
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Join thousands of donors who trust En-Track's Data Integrity Protocol to ensure every contribution reaches its destination.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/donate"
                className="px-12 py-5 rounded-full font-bold text-white text-lg hover:scale-105 active:scale-95 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #2563EB, #1d4ed8)',
                  boxShadow: '0 0 50px rgba(37,99,235,0.5), 0 4px 16px rgba(37,99,235,0.3)',
                }}
              >
                Start Donating Today
              </Link>
              <Link
                to="/verified-ngos"
                className="px-12 py-5 rounded-full font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-blue-500/40 hover:text-gray-900 dark:text-white transition-all text-lg"
              >
                Explore NGOs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
