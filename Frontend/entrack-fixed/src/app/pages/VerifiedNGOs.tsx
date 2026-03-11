import { motion } from 'motion/react';
import { Search, ShieldCheck, MapPin, ArrowRight, Users, Filter } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

const NGOS = [
  {
    id: 1,
    name: 'Global Clean Water Initiative',
    category: 'Environment',
    location: 'Kenya',
    impact: '12,500+ Lives',
    verified: true,
    description: 'Providing sustainable clean water solutions to rural communities using advanced filtration and distribution systems.',
    image: 'https://images.unsplash.com/photo-1541976844346-f18aeac57230?auto=format&fit=crop&q=80&w=800',
    totalReceived: '₹12,50,000',
    txCount: 842,
  },
  {
    id: 2,
    name: 'Tech for Tomorrow',
    category: 'Education',
    location: 'India',
    impact: '5,000+ Students',
    verified: true,
    description: 'Empowering underprivileged youth with coding skills, digital literacy, and career-ready training programs.',
    image: 'https://images.unsplash.com/photo-1720160644902-d447e3313b95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBjaGlsZHJlbiUyMHNjaG9vbCUyMGJvb2tzJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzcyNjIyODUwfDA&ixlib=rb-4.1.0&q=80&w=800',
    totalReceived: '₹9,80,000',
    txCount: 613,
  },
  {
    id: 3,
    name: 'Green Earth Alliance',
    category: 'Environment',
    location: 'Brazil',
    impact: '50,000+ Trees',
    verified: true,
    description: 'Leading reforestation projects in the Amazon rainforest to combat climate change and restore biodiversity.',
    image: 'https://images.unsplash.com/photo-1648198724908-067347a1a72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGVudmlyb25tZW50JTIwdHJlZXMlMjBwbGFudGluZyUyMHN1c3RhaW5hYmlsaXR5fGVufDF8fHx8MTc3MjYyMjg1NXww&ixlib=rb-4.1.0&q=80&w=800',
    totalReceived: '₹8,40,000',
    txCount: 519,
  },
  {
    id: 4,
    name: 'Health Hope Foundation',
    category: 'Healthcare',
    location: 'India',
    impact: '8,200+ Patients',
    verified: true,
    description: 'Delivering emergency medical aid, surgical care, and essential medicines to conflict-affected communities.',
    image: 'https://images.unsplash.com/photo-1765994898026-4fa84ade4a61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMGRvY3RvciUyMHJ1cmFsJTIwY29tbXVuaXR5fGVufDF8fHx8MTc3MjYyMjg1M3ww&ixlib=rb-4.1.0&q=80&w=800',
    totalReceived: '₹6,20,000',
    txCount: 387,
  },
  {
    id: 5,
    name: 'Ocean Cleanup Crew',
    category: 'Environment',
    location: 'Pacific Ocean',
    impact: '200 Tons Plastic',
    verified: true,
    description: 'Removing plastic pollution from our oceans using cutting-edge autonomous collection systems and marine technology.',
    image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=800',
    totalReceived: '₹4,80,000',
    txCount: 294,
  },
  {
    id: 6,
    name: 'Future Scholars',
    category: 'Education',
    location: 'India',
    impact: '1,200 Scholarships',
    verified: true,
    description: 'Funding higher education scholarships for talented students from low-income households to unlock their potential.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    totalReceived: '₹3,60,000',
    txCount: 241,
  },
];

const CATEGORIES = ['All', 'Environment', 'Education', 'Healthcare'];

export function VerifiedNGOs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredNGOs = NGOS.filter(ngo =>
    (activeCategory === 'All' || ngo.category === activeCategory) &&
    (ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-8 pb-24 px-6 font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-6 py-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" /> Verified NGO Network
          </div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white"
          >
            Trusted <span className="text-[#3B82F6]">NGO Network</span>
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Every organization below has passed our rigorous due diligence process and holds a unique Data Integrity ID. All donations are tracked with 100% transparency.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { label: 'Verified NGOs', value: `${NGOS.length}` },
              { label: 'Total Raised', value: '₹45,30,000+' },
              { label: 'Lives Impacted', value: '80,000+' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[#3B82F6] font-['Clash_Display',sans-serif]">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative flex-1 group w-full"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400 group-focus-within:text-[#3B82F6] transition-colors" />
            <input
              type="text"
              placeholder="Search NGOs by name, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/90 dark:bg-white/[0.04] backdrop-blur-md border border-[#3B82F6]/15 rounded-2xl py-4 pl-12 pr-5 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all shadow-md hover:shadow-lg"
              style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.06)' }}
            />
          </motion.div>
          <div className="flex gap-2 shrink-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-4 rounded-2xl text-sm font-bold transition-all border ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#3B82F6] to-[#38BDF8] text-white border-[#3B82F6] shadow-[0_4px_14px_rgba(59,130,246,0.4)]'
                    : 'bg-white/90 dark:bg-white/[0.04] backdrop-blur-xl border-[#3B82F6]/15 text-gray-500 dark:text-gray-600 hover:border-[#3B82F6]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* NGO Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredNGOs.map((ngo, index) => (
            <motion.div
              key={ngo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white/90 dark:bg-white/[0.04] backdrop-blur-md border border-[#3B82F6]/10 rounded-[2rem] overflow-hidden group hover:-translate-y-2 transition-all duration-300 flex flex-col"
              style={{ boxShadow: '0 4px 24px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' }}
              whileHover={{ boxShadow: '0 20px 60px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.06)' } as any}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={ngo.image}
                  alt={ngo.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D4ED8]/60 via-black/10 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/60 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-[#3B82F6] border border-[#3B82F6]/30 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </div>
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#3B82F6]/80 text-white border border-gray-300 dark:border-white/20 backdrop-blur-sm mb-1">{ngo.category}</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 flex flex-col flex-1">
                <h3 className="text-lg font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white group-hover:text-[#3B82F6] transition-colors leading-tight mb-3">
                  {ngo.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed mb-5 flex-1">
                  {ngo.description}
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-[#3B82F6]/5 rounded-xl p-3 text-center border border-[#3B82F6]/10">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Total Raised</div>
                    <div className="font-bold text-[#3B82F6] text-sm">{ngo.totalReceived}</div>
                  </div>
                  <div className="bg-[#3B82F6]/5 rounded-xl p-3 text-center border border-[#3B82F6]/10">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Transactions</div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm">{ngo.txCount}</div>
                  </div>
                </div>

                {/* Location + Impact */}
                <div className="flex items-center justify-between text-sm mb-5 pb-5 border-b border-[#3B82F6]/8">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" /> {ngo.location}
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-3 py-1 rounded-full text-xs">
                    <Users className="w-3 h-3" /> {ngo.impact}
                  </div>
                </div>

                {/* Donate Button */}
                <Link
                  to="/donate"
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #38BDF8)', boxShadow: '0 4px 14px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)' }}
                >
                  Donate Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredNGOs.length === 0 && (
          <div className="text-center py-20 text-gray-500 space-y-4">
            <div className="w-16 h-16 bg-[#3B82F6]/10 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-7 h-7 text-[#3B82F6]" />
            </div>
            <p>No NGOs found matching your search.</p>
            <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }} className="text-[#3B82F6] font-bold text-sm hover:underline">
              Clear filters
            </button>
          </div>
        )}

        {/* CTA to Register */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-10 border border-[#3B82F6]/20 rounded-[2rem] text-center space-y-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(56,189,248,0.04) 100%)', boxShadow: '0 8px 32px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.06)' }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent" />
          </div>
          <h3 className="text-2xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white">Are you an NGO?</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Join our network of verified organizations. Register your NGO to receive transparent, tracked donations from thousands of donors.
          </p>
          <Link
            to="/ngo-registration"
            className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-full hover:scale-[1.03] active:scale-[0.97] transition-all"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #38BDF8)', boxShadow: '0 8px 24px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' }}
          >
            Register Your NGO <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}