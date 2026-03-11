import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Droplets, BookOpen, Shirt, Smartphone, TrendingUp, Heart, ChevronRight, Shield } from 'lucide-react';

const TYPES = [
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Money Donation',
    subtitle: 'Direct financial support',
    desc: 'Donate INR to verified NGOs. Every rupee tracked with SHA-256 integrity hashing — traced from your wallet to the beneficiary.',
    color: '#2563EB',
    glow: 'rgba(37,99,235,0.35)',
    border: 'rgba(37,99,235,0.3)',
    bg: 'rgba(37,99,235,0.08)',
    tag: '★ Most Popular',
    link: '/donate/money',
  },
  {
    icon: <Droplets className="w-8 h-8" />,
    title: 'Blood Donation',
    subtitle: 'Save lives directly',
    desc: 'Connect with blood banks and patients in critical need. Register your blood group and get matched with nearby recipients.',
    color: '#DC2626',
    glow: 'rgba(220,38,38,0.35)',
    border: 'rgba(220,38,38,0.3)',
    bg: 'rgba(220,38,38,0.06)',
    tag: 'Critical Need',
    link: '/donate/blood',
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Organ Donation',
    subtitle: 'One decision, eight lives',
    desc: 'Pledge your organs to save up to 8 lives. Get full information, eligibility details, and register your donor pledge securely.',
    color: '#E11D48',
    glow: 'rgba(225,29,72,0.35)',
    border: 'rgba(225,29,72,0.3)',
    bg: 'rgba(225,29,72,0.06)',
    tag: 'Life-Saving',
    link: '/donate/organ',
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: 'Old Stationery',
    subtitle: 'Educate the future',
    desc: 'Books, notebooks, pens and pencils you no longer need can transform the education of an underprivileged student.',
    color: '#D97706',
    glow: 'rgba(217,119,6,0.35)',
    border: 'rgba(217,119,6,0.3)',
    bg: 'rgba(217,119,6,0.06)',
    tag: 'High Demand',
    link: '/donate/stationery',
  },
  {
    icon: <Shirt className="w-8 h-8" />,
    title: 'Clothes',
    subtitle: 'Dignity through clothing',
    desc: 'Old school uniforms and household clothes in good, wearable condition — donated to families and children in need.',
    color: '#059669',
    glow: 'rgba(5,150,105,0.35)',
    border: 'rgba(5,150,105,0.3)',
    bg: 'rgba(5,150,105,0.06)',
    tag: 'Always Needed',
    link: '/donate/clothes',
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: 'Old Electronics',
    subtitle: 'Bridge the digital divide',
    desc: 'Phones, laptops, tablets you no longer use can unlock education and opportunity for underprivileged youth.',
    color: '#7C3AED',
    glow: 'rgba(124,58,237,0.35)',
    border: 'rgba(124,58,237,0.3)',
    bg: 'rgba(124,58,237,0.06)',
    tag: 'New Category',
    link: '/donate/electronics',
  },
];

export function DonatePage() {
  return (
    <div className="min-h-screen pb-24 px-6 pt-12 relative">

      {/* Bg glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)', color: '#60a5fa' }}>
            <Shield className="w-3.5 h-3.5" /> Choose Your Donation Type
          </div>
          <h1 className="font-['Syne',sans-serif] font-extrabold tracking-tight text-gray-900 dark:text-white" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            Give What You Can,{' '}
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Any Way You Can
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            En-Track supports 6 types of donations — all tracked transparently with our Data Integrity Protocol.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TYPES.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.01 }}
            >
              <Link
                to={t.link}
                className="block relative rounded-2xl p-7 h-full transition-all duration-300 group overflow-hidden bg-white/88 dark:bg-white/[0.04] border dark:border-white/[0.08]"
                style={{
                  borderColor: t.border,
                  backdropFilter: 'blur(24px) saturate(1.5)',
                  WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
                  boxShadow: `0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)`,
                }}
              >
                {/* Colored accent glow (bottom) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-t-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)`, boxShadow: `0 0 20px ${t.glow}` }} />
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at top, ${t.glow.replace('0.35', '0.12')} 0%, transparent 60%)` }} />
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }} />

                {/* Tag */}
                <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: `${t.bg}`, border: `1px solid ${t.border}`, color: t.color }}>
                  {t.tag}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)`, boxShadow: `0 8px 20px ${t.glow}` }}>
                  {t.icon}
                </div>

                <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: t.color }}>{t.subtitle}</div>
                <h3 className="font-['Syne',sans-serif] font-bold text-xl text-gray-900 dark:text-white mb-3">{t.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">{t.desc}</p>

                <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: t.color }}>
                  Donate Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          All donations are verified with SHA-256 integrity hashing and tracked in real-time on our dashboard.
        </motion.div>
      </div>
    </div>
  );
}
