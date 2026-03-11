import { motion } from 'motion/react';
import { Database, Lock, Server, Mail, ShieldCheck, FileCheck, Key, ArrowRight, CheckCircle2, Users, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const TEAM_IMAGE = 'https://images.unsplash.com/photo-1728933102332-a4f1a281a621?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZSUyMG1vZGVybiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcyNjIyODUzfDA&ixlib=rb-4.1.0&q=80&w=1080';

export function About() {
  return (
    <div className="min-h-screen pt-8 pb-24 px-6 font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto space-y-24">

        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6 pt-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full text-xs font-bold text-[#3B82F6] uppercase tracking-wider"
          >
            <ShieldCheck className="w-3 h-3" /> Data Integrity Protocol
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white leading-tight"
          >
            Engineered for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#38BDF8]">Absolute Transparency</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light max-w-3xl mx-auto"
          >
            We don't just facilitate donations — we prove them. Every transaction is secured by advanced cryptographic protocols, ensuring your impact is undeniable and permanent.
          </motion.p>
        </div>

        {/* Mission Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '₹4.8 Cr+', label: 'Funds Tracked', icon: <Zap className="w-5 h-5" />, color: 'text-[#3B82F6]' },
            { value: '100%', label: 'Transparency Rate', icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-[#38BDF8]' },
            { value: '142', label: 'Verified NGOs', icon: <Globe className="w-5 h-5" />, color: 'text-[#6366F1]' },
            { value: '14,203', label: 'Integrity Hashes', icon: <Users className="w-5 h-5" />, color: 'text-amber-500' },
          ].map((stat) => (
            <div key={stat.label} className="p-6 bg-white/90 dark:bg-white/[0.04] backdrop-blur-xl border border-[#3B82F6]/10 rounded-2xl text-center hover:border-[#3B82F6]/30 transition-all group hover:shadow-[0_8px_32px_rgba(59,130,246,0.1)]"
              style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
              <div className={`flex justify-center mb-3 ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              <div className={`text-3xl font-bold font-['Clash_Display',sans-serif] ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Team Image Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 24px 80px rgba(59,130,246,0.2), 0 8px 32px rgba(59,130,246,0.1)' }}
        >
          <ImageWithFallback
            src={TEAM_IMAGE}
            alt="En-Track team collaborating"
            className="w-full h-64 md:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D4ED8]/85 via-[#3B82F6]/60 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 md:px-14">
            <div className="max-w-lg">
              <div className="text-xs font-bold text-[#93C5FD] uppercase tracking-widest mb-3">Our Team</div>
              <h2 className="font-['Clash_Display',sans-serif] font-bold text-gray-900 dark:text-white mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                Built by Engineers Who Care
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Our team of fintech and data engineers built En-Track with one goal: make every donation provably transparent.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Data Integrity Protocol Flowchart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/12 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden"
          style={{ boxShadow: '0 20px 80px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.06)' }}
        >
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#3B82F610_1px,transparent_1px),linear-gradient(to_bottom,#3B82F610_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)]" />
          {/* Blue glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/8 rounded-bl-full pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-14">
              <div className="p-3 bg-[#3B82F6]/10 rounded-xl border border-[#3B82F6]/20">
                <Lock className="w-7 h-7 text-[#3B82F6]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white">The Data Integrity Protocol</h2>
                <p className="text-gray-500 text-sm mt-0.5">SHA-256 Cryptographic Verification Standard</p>
              </div>
            </div>

            {/* Flowchart Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Connector (desktop) */}
              <div className="hidden md:block absolute top-11 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-[#6366F1] dark:from-[#3B82F6]/30 dark:via-[#38BDF8]/50 dark:to-[#6366F1]/30 z-0" />

              <ProtocolStep
                icon={<Database className="w-6 h-6 text-[#3B82F6]" />}
                title="Donor Payment"
                description="Secure bank-grade payment gateway processing with AES-256 encryption."
                step="01"
                bg="bg-[#3B82F6]/5 dark:bg-blue-500/10 border-[#3B82F6]/20 dark:border-blue-500/20"
              />
              <ProtocolStep
                icon={<Server className="w-6 h-6 text-[#6366F1]" />}
                title="Database Entry"
                description="Transaction logged immutably in our append-only secure ledger."
                step="02"
                bg="bg-[#6366F1]/5 dark:bg-purple-500/10 border-[#6366F1]/20 dark:border-purple-500/20"
              />
              <ProtocolStep
                icon={<Key className="w-6 h-6 text-[#38BDF8]" />}
                title="SHA-256 Hashing"
                description="A unique 64-character cryptographic hash is generated to seal the record."
                step="03"
                highlight
                bg="bg-[#38BDF8]/5 border-[#38BDF8]"
              />
              <ProtocolStep
                icon={<Mail className="w-6 h-6 text-amber-500" />}
                title="Verification"
                description="Digital receipt with the Integrity Hash is sent to the donor's email."
                step="04"
                bg="bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
              />
            </div>

            {/* Hash Example */}
            <div className="mt-12 p-6 bg-gray-900 dark:bg-black/40 rounded-2xl border border-[#3B82F6]/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse shadow-[0_0_6px_#3B82F6]" />
                <span className="text-xs font-bold text-[#60A5FA] uppercase tracking-wider font-mono">Sample SHA-256 Hash Output</span>
              </div>
              <code className="text-[#60A5FA] font-mono text-sm break-all leading-relaxed">
                5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
              </code>
              <p className="text-gray-600 dark:text-gray-400 text-xs font-mono mt-3">
                Every donation generates a unique 256-bit hash — mathematically impossible to forge or reverse.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Technical Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TechCard
            title="Immutable Records"
            description="Once a donation is logged, it cannot be altered. Our append-only database structure ensures permanent historical accuracy for full auditability."
            icon={<FileCheck className="w-8 h-8 text-[#3B82F6]" />}
            accent="border-[#3B82F6]/20 hover:border-[#3B82F6]/40"
          />
          <TechCard
            title="Real-Time Auditing"
            description="Anyone can verify the flow of funds using the unique transaction hash provided in their digital receipt. Transparency is public by default."
            icon={<ShieldCheck className="w-8 h-8 text-[#38BDF8]" />}
            accent="border-[#38BDF8]/20 hover:border-[#38BDF8]/40"
          />
          <TechCard
            title="Bank-Grade Security"
            description="We utilize AES-256 encryption for all sensitive data and comply with global financial data standards. Your information is always protected."
            icon={<Lock className="w-8 h-8 text-[#6366F1]" />}
            accent="border-[#6366F1]/20 hover:border-[#6366F1]/40"
          />
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-6 py-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white">
            Why <span className="text-[#3B82F6]">En-Track</span>?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Traditional charity platforms are black boxes. Donors give money and hope it reaches the right hands. En-Track was built on the belief that trust is earned through radical transparency — not assumed. Every rupee you donate creates an immutable trail of evidence that we publish openly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/donate" className="px-8 py-4 rounded-full text-white font-bold hover:brightness-110 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #38BDF8)', boxShadow: '0 8px 24px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
              Start Donating <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/verified-ngos" className="px-8 py-4 border border-[#3B82F6]/30 dark:border-white/20 rounded-full text-white font-bold hover:bg-[#3B82F6]/5 transition-all">
              Explore NGOs
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProtocolStep({ icon, title, description, step, highlight, bg }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: string;
  highlight?: boolean;
  bg: string;
}) {
  return (
    <div className={`relative z-10 flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-300 ${bg} ${highlight ? 'shadow-[0_0_30px_rgba(56,189,248,0.25)] transform scale-105' : 'shadow-md'}`}>
      <div className="w-14 h-14 rounded-2xl bg-white/90 dark:bg-white/[0.04] flex items-center justify-center mb-4 shadow-inner border border-gray-200/80 dark:border-white/[0.06]">
        {icon}
      </div>
      <div className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 font-mono">STEP {step}</div>
      <h3 className="text-base font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function TechCard({ title, description, icon, accent }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-8 bg-white/90 dark:bg-white/[0.04] backdrop-blur-xl border ${accent} border rounded-2xl transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(59,130,246,0.12)]`}
      style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.06)' }}
    >
      <div className="mb-6 p-3 w-fit rounded-xl bg-gray-50 dark:bg-white/[0.05] group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}