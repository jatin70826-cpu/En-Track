import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, ArrowLeft, ArrowRight, CheckCircle2, Loader2, Shield, Phone,
  User, FileText, ChevronDown, ChevronUp, AlertCircle, Info, BookOpen,
  Clock, Users, Building2, Star, ExternalLink, Stethoscope, Activity,
  MapPin, Mail,
} from 'lucide-react';
import { Link } from 'react-router';
import API from "../../api/api";

// ─── Data ─────────────────────────────────────────────────────────────

const ORGANS = [
  { name: 'Kidneys', icon: '🫘', waitlist: '2,17,000+', fact: 'Kidneys are the most needed organ. One person can donate both kidneys and save two lives.', color: '#2563EB', glow: 'rgba(37,99,235,0.25)' },
  { name: 'Liver', icon: '🫁', waitlist: '55,000+', fact: 'A liver can be split to benefit two recipients. Living donation of a lobe is also possible.', color: '#7C3AED', glow: 'rgba(124,58,237,0.25)' },
  { name: 'Heart', icon: '❤️', waitlist: '3,500+', fact: 'A donated heart can sustain a patient with end-stage heart failure and restore a full life.', color: '#E11D48', glow: 'rgba(225,29,72,0.25)' },
  { name: 'Lungs', icon: '🫁', waitlist: '1,900+', fact: 'Both lungs or a single lobe can be transplanted, helping patients with cystic fibrosis and more.', color: '#0891B2', glow: 'rgba(8,145,178,0.25)' },
  { name: 'Pancreas', icon: '🧬', waitlist: '2,300+', fact: 'A donated pancreas can free a Type 1 diabetes patient from daily insulin injections.', color: '#059669', glow: 'rgba(5,150,105,0.25)' },
  { name: 'Intestine', icon: '🔬', waitlist: '250+', fact: 'Intestine donation helps patients who have lost intestinal function due to disease or injury.', color: '#D97706', glow: 'rgba(217,119,6,0.25)' },
  { name: 'Corneas', icon: '👁️', waitlist: '1,20,000+', fact: 'Cornea donation restores sight. One donor can give the gift of vision to two people.', color: '#6366F1', glow: 'rgba(99,102,241,0.25)' },
];

const ELIGIBILITY = [
  { title: 'Minimum Age', desc: 'Anyone above 18 can pledge. Minors require parental/guardian consent. There is no upper age limit for donation.', icon: <Users className="w-5 h-5" />, ok: true },
  { title: 'Medical Condition', desc: 'Most people can donate. Doctors determine eligibility at the time of death. HIV, active cancer, or severe systemic infection may disqualify specific organs.', icon: <Stethoscope className="w-5 h-5" />, ok: true },
  { title: 'Religion & Faith', desc: 'All major religions in India — Hinduism, Islam, Christianity, Sikhism, Buddhism and Jainism — support organ donation as an act of compassion.', icon: <Star className="w-5 h-5" />, ok: true },
  { title: 'Chronic Illness', desc: 'Having diabetes, hypertension, or heart disease does not automatically disqualify you. Each organ is evaluated independently.', icon: <Activity className="w-5 h-5" />, ok: true },
  { title: 'Family Consent', desc: 'Even with a pledge, family consent is required at the time of donation in India. It is crucial to inform your family of your wish.', icon: <AlertCircle className="w-5 h-5" />, ok: false },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Pledge Online', desc: 'Register your wish to donate on NOTTO (National Organ & Tissue Transplant Organisation) or through this form.', icon: <FileText className="w-6 h-6 text-blue-500" /> },
  { step: '02', title: 'Receive Donor Card', desc: 'You get a digital and physical donor card confirming your pledge. Carry it with you or note it on your driving licence.', icon: <Shield className="w-6 h-6 text-green-500" /> },
  { step: '03', title: 'Inform Your Family', desc: 'This is the most important step. Tell your family your decision so they can honour your wish when the time comes.', icon: <Users className="w-6 h-6 text-purple-500" /> },
  { step: '04', title: 'Medical Assessment', desc: 'Upon brain-stem death, a certified medical team evaluates which organs are suitable for donation.', icon: <Stethoscope className="w-6 h-6 text-red-500" /> },
  { step: '05', title: 'Transplant & Impact', desc: 'Organs are matched to recipients on the national waitlist and transplanted within hours, giving them a second chance at life.', icon: <Heart className="w-6 h-6 text-rose-500" /> },
];

const MYTHS = [
  { myth: "Doctors won't try to save me if I'm a donor.", fact: "Doctors always make every effort to save a patient's life. Organ donation only begins after all life-saving efforts have been exhausted and brain-stem death is certified by a separate independent team." },
  { myth: "My religion doesn't allow organ donation.", fact: 'All major religions in India permit organ donation. Many religious leaders actively encourage it as the highest form of charity — giving the gift of life.' },
  { myth: "I'm too old to donate.", fact: 'There is no age limit. Babies, children, and people in their 90s have been donors. Each organ is medically evaluated at the time of death.' },
  { myth: "Organ donation disfigures the body.", fact: 'Donation is a surgical procedure. The body is treated with dignity and respect, and clothing covers any incisions — the family can still have an open-casket funeral.' },
  { myth: "Rich or VIP patients get organs first.", fact: "Organs are allocated strictly by NOTTO/ROTTO using a transparent point-based system considering blood type, medical urgency, time on the waitlist, and geographic proximity — not wealth or status." },
];

const KEY_ORGS = [
  { name: 'NOTTO', full: 'National Organ & Tissue Transplant Organisation', phone: '1800-103-7100', url: 'notto.abdm.gov.in', role: 'National nodal body for all organ donation and transplant activities.' },
  { name: 'MOHAN Foundation', full: 'Multi Organ Harvesting Aid Network', phone: '044-28193800', url: 'mohanfoundation.org', role: "India's largest NGO in organ donation, providing education and donor registration." },
  { name: 'Zonal Transplant Coordination Centres', full: 'ZTCC / ROTTO', phone: 'Varies by state', url: 'notto.abdm.gov.in/rotto', role: 'Regional coordinating bodies managing organ allocation within zones.' },
];

function generateDonorId() {
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(4)), b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return 'ORG-' + hex;
}

// ─── FAQ Accordion ────────────────────────────────────────────────────

function FAQItem({ myth, fact, index }: { myth: string; fact: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/[0.08] transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 p-5 text-left bg-white/80 dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </span>
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{myth}</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 bg-white/60 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/[0.04]">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{fact}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────

export function DonateOrgan() {
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: '', phone: '', email: '', age: '', city: '', state: '', organs: [] as string[], consent: false });
  const [isLoading, setIsLoading] = useState(false);
  const [donorId, setDonorId] = useState('');

  const set = (k: keyof typeof form, v: string | boolean | string[]) =>
    setForm(f => ({ ...f, [k]: v }));

  const toggleOrgan = (organ: string) =>
    set('organs', form.organs.includes(organ)
      ? form.organs.filter(o => o !== organ)
      : [...form.organs, organ]);

  const canSubmit = form.name && form.phone && form.age && form.city && form.state && form.organs.length > 0 && form.consent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);

    try {
    await API.post("/organ-donation", {
      full_name: form.name,
      phone: form.phone,
      email: form.email,
      age: form.age,
      state: form.state,
      city: form.city,
      organ_to_donate: form.organs.join(", ")
    });
  } catch (error) {
    console.log(error);
    alert('Failed to submit organ donation request');
  }
    await new Promise(r => setTimeout(r, 2000));
    setDonorId(generateDonorId());
    setIsLoading(false);
    setFormStep(2);
  };

  return (
    <div className="min-h-screen pb-24 font-['DM_Sans',sans-serif]">

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 via-pink-600/10 to-transparent dark:from-rose-900/40 dark:via-pink-900/20 dark:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(244,63,94,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-16 text-center">
          <Link to="/donate" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to donation types
          </Link>
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700/40 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-6">
            <Heart className="w-3.5 h-3.5" aria-hidden="true" /> Life-Saving Act
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-['Syne',sans-serif] font-extrabold text-4xl md:text-6xl text-gray-900 dark:text-white mb-5 leading-tight"
          >
            Organ Donation —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
              One Decision, Eight Lives
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8"
          >
            A single organ donor can save up to <strong className="text-gray-900 dark:text-white">8 lives</strong>. Pledge today — it costs nothing, but means everything.
          </motion.p>
          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { value: '5 Lakh+', label: 'Patients on India Waitlist' },
              { value: '8 Lives', label: 'Saved per Donor' },
              { value: '7 Organs', label: 'Can Be Transplanted' },
              { value: '<1%', label: 'Donor Pledge Rate in India' },
            ].map(stat => (
              <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-['Syne',sans-serif]">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 leading-tight">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-20">

        {/* ── What Can Be Donated ──────────────────────────────── */}
        <section>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> Transplantable Organs
            </div>
            <h2 className="font-['Syne',sans-serif] font-bold text-3xl text-gray-900 dark:text-white mb-3">What Can Be Donated?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">These are the major organs that can be transplanted to save lives after brain-stem death.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ORGANS.map((organ, i) => (
              <motion.div
                key={organ.name}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative rounded-2xl p-6 overflow-hidden transition-all group cursor-pointer"
                style={{
                  background: `linear-gradient(145deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))`,
                  border: `1px solid ${organ.color}20`,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: `0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)`,
                }}
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at top left, ${organ.glow} 0%, transparent 70%)` }} />
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${organ.color}, transparent)` }} />

                {/* Dark mode background override */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none hidden dark:block" style={{
                  background: `linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
                  border: `1px solid ${organ.color}25`,
                }} />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${organ.color}15`, boxShadow: `0 4px 12px ${organ.glow}` }}>
                      <span aria-hidden="true">{organ.icon}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{organ.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-3.5 h-3.5" style={{ color: organ.color }} aria-hidden="true" />
                    <span className="text-xs font-semibold" style={{ color: organ.color }}>Waitlist: {organ.waitlist}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-500 leading-relaxed">{organ.fact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────── */}
        <section>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-4">
              <Activity className="w-3.5 h-3.5" aria-hidden="true" /> The Process
            </div>
            <h2 className="font-['Syne',sans-serif] font-bold text-3xl text-gray-900 dark:text-white mb-3">How Organ Donation Works</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">From pledge to transplant — a transparent, medically supervised journey.</p>
          </motion.div>
          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-200 via-rose-300 to-pink-200 dark:from-blue-900/40 dark:via-rose-900/40 dark:to-pink-900/40 z-0" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10">
              {PROCESS_STEPS.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl p-5 text-center flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] flex items-center justify-center mb-3">
                    {s.icon}
                  </div>
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 font-mono mb-1">STEP {s.step}</div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-500 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Eligibility ──────────────────────────────────────── */}
        <section>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/30 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-4">
              <Shield className="w-3.5 h-3.5" aria-hidden="true" /> Eligibility
            </div>
            <h2 className="font-['Syne',sans-serif] font-bold text-3xl text-gray-900 dark:text-white mb-3">Who Can Donate?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">Almost anyone can be an organ donor. Here's what you need to know.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ELIGIBILITY.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`glass rounded-2xl p-6 border-l-4 ${item.ok ? 'border-l-green-500' : 'border-l-amber-500'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`${item.ok ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>{item.icon}</span>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h3>
                  {item.ok
                    ? <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" aria-label="Eligible" />
                    : <AlertCircle className="w-4 h-4 text-amber-500 ml-auto shrink-0" aria-label="Note" />}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Myths & Facts ────────────────────────────────────── */}
        <section>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4">
              <Info className="w-3.5 h-3.5" aria-hidden="true" /> Myths vs Facts
            </div>
            <h2 className="font-['Syne',sans-serif] font-bold text-3xl text-gray-900 dark:text-white mb-3">Clearing the Misconceptions</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">Many people hesitate due to myths. Here are the facts.</p>
          </motion.div>
          <div className="space-y-3 max-w-3xl mx-auto">
            {MYTHS.map((item, i) => (
              <FAQItem key={i} myth={item.myth} fact={item.fact} index={i} />
            ))}
          </div>
        </section>

        {/* ── Key Organisations ────────────────────────────────── */}
        <section>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
              <Building2 className="w-3.5 h-3.5" aria-hidden="true" /> Key Organisations
            </div>
            <h2 className="font-['Syne',sans-serif] font-bold text-3xl text-gray-900 dark:text-white mb-3">Who Manages Organ Donation in India?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">These organisations coordinate the entire organ donation and transplant ecosystem.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {KEY_ORGS.map((org, i) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 flex flex-col gap-4"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">{org.name}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{org.full}</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-500 leading-relaxed flex-1">{org.role}</p>
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-white/[0.06]">
                  <a href={`tel:${org.phone}`} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" /> {org.phone}
                  </a>
                  <a href={`https://${org.url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> {org.url}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Pledge Form ──────────────────────────────────────── */}
        <section id="pledge">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700/30 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-4">
              <Heart className="w-3.5 h-3.5" aria-hidden="true" /> Pledge Now
            </div>
            <h2 className="font-['Syne',sans-serif] font-bold text-3xl text-gray-900 dark:text-white mb-3">Register as an Organ Donor</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">Fill in the form below to pledge your organs. You will receive a unique donor ID and a digital donor card.</p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {formStep === 1 && (
                <motion.form
                  key="pledge-form"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="glass rounded-3xl p-8 space-y-6"
                >
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <User className="inline w-4 h-4 mr-1 text-rose-500" aria-hidden="true" /> Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input value={form.name} onChange={e => set('name', e.target.value)} required
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-rose-500/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Age <span className="text-rose-500">*</span>
                      </label>
                      <input value={form.age} onChange={e => set('age', e.target.value)} required type="number" min="18" max="120"
                        placeholder="e.g. 28"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-rose-500/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="inline w-4 h-4 mr-1 text-blue-500" aria-hidden="true" /> Phone <span className="text-rose-500">*</span>
                      </label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} required
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-rose-500/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="inline w-4 h-4 mr-1 text-blue-500" aria-hidden="true" /> Email (optional)
                      </label>
                      <input value={form.email} onChange={e => set('email', e.target.value)} type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-rose-500/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <MapPin className="inline w-4 h-4 mr-1 text-blue-500" aria-hidden="true" /> City <span className="text-rose-500">*</span>
                      </label>
                      <input value={form.city} onChange={e => set('city', e.target.value)} required
                        placeholder="Your city"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-rose-500/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <input value={form.state} onChange={e => set('state', e.target.value)} required
                        placeholder="Your state"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-rose-500/50" />
                    </div>
                  </div>

                  {/* Organ Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Organs to Donate <span className="text-rose-500">*</span>
                      <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-500">(select all that apply)</span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {ORGANS.map(organ => {
                        const selected = form.organs.includes(organ.name);
                        return (
                          <button
                            key={organ.name} type="button"
                            onClick={() => toggleOrgan(organ.name)}
                            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-semibold border transition-all ${
                              selected
                                ? 'text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700'
                            }`}
                            style={selected ? {
                              background: `linear-gradient(135deg, ${organ.color}, ${organ.color}cc)`,
                              borderColor: organ.color,
                              boxShadow: `0 4px 16px ${organ.glow}`,
                            } : {}}
                          >
                            <span className="text-base" aria-hidden="true">{organ.icon}</span>
                            {organ.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Consent */}
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-2xl">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={e => set('consent', e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-amber-400 text-rose-500 focus:ring-rose-500"
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        I <strong>voluntarily pledge</strong> to donate the selected organs after my death. I understand that this pledge is not legally binding until family consent is obtained, and I commit to informing my family of this decision.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit" disabled={!canSubmit || isLoading}
                    className="w-full py-5 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #E11D48, #BE123C)', boxShadow: '0 8px 28px rgba(225,29,72,0.35)' }}
                  >
                    {isLoading
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Registering...</>
                      : <>Pledge My Organs <Heart className="w-5 h-5" /></>}
                  </button>

                  <p className="text-center text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" aria-hidden="true" />
                    Your data is secured. This pledge is stored with a SHA-256 integrity hash.
                  </p>
                </motion.form>
              )}

              {formStep === 2 && (
                <motion.div
                  key="pledge-success"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-3xl p-10 text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: 'linear-gradient(90deg, #E11D48, #F43F5E, #FB7185)' }} />
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'rgba(225,29,72,0.12)', boxShadow: '0 0 40px rgba(225,29,72,0.2), 0 0 0 16px rgba(225,29,72,0.06)' }}
                  >
                    <Heart className="w-12 h-12 text-rose-500 dark:text-rose-400" />
                  </motion.div>
                  <h2 className="font-['Syne',sans-serif] font-extrabold text-3xl text-gray-900 dark:text-white mb-3">Thank You, {form.name.split(' ')[0]}!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                    You've taken one of the most generous decisions a person can make. Your pledge has the potential to save up to <strong className="text-gray-900 dark:text-white">8 lives</strong>.
                  </p>

                  {/* Donor Card */}
                  <div className="rounded-2xl p-6 mb-8 text-left space-y-3 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/[0.06]">
                    <div className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5" aria-hidden="true" /> Digital Donor Card
                    </div>
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-500 text-sm">Donor ID</span><span className="font-mono font-bold text-gray-900 dark:text-white text-sm">{donorId}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-500 text-sm">Name</span><span className="font-bold text-gray-900 dark:text-white text-sm">{form.name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-500 text-sm">Location</span><span className="text-gray-700 dark:text-gray-300 text-sm">{form.city}, {form.state}</span></div>
                    <div className="pt-3 border-t border-gray-200 dark:border-white/[0.05]">
                      <span className="text-gray-500 dark:text-gray-500 text-xs block mb-2">Pledged Organs</span>
                      <div className="flex flex-wrap gap-2">
                        {form.organs.map(o => (
                          <span key={o} className="text-xs px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 font-semibold border border-rose-200 dark:border-rose-700/40">{o}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-700/30 mb-8">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>Important next step:</strong> Tell your family about this pledge. Family consent is required for donation to proceed in India.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <a
                      href="https://notto.abdm.gov.in"
                      target="_blank" rel="noopener noreferrer"
                      className="py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #E11D48, #BE123C)', boxShadow: '0 4px 16px rgba(225,29,72,0.3)' }}
                    >
                      Register on NOTTO (Official) <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </a>
                    <Link to="/donate" className="py-4 rounded-2xl font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm flex items-center justify-center">
                      Back to Donate
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </div>
    </div>
  );
}
