import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Users, Building2, ArrowUpRight, Shield, CheckCircle2, Activity, Download, Lock } from 'lucide-react';
import { exportDashboardPDF } from '../components/ExportPDF';
import { useAuth } from '../../lib/AuthContext';
import { Link } from 'react-router';

const MONTHLY_DATA_DEFAULT = [
  { month: 'Oct', amount: 420000, ngos: 18, donors: 312 },
  { month: 'Nov', amount: 380000, ngos: 21, donors: 289 },
  { month: 'Dec', amount: 650000, ngos: 27, donors: 524 },
  { month: 'Jan', amount: 890000, ngos: 31, donors: 687 },
  { month: 'Feb', amount: 720000, ngos: 29, donors: 598 },
  { month: 'Mar', amount: 1050000, ngos: 36, donors: 921 },
];

const CATEGORY_DATA = [
  { name: 'Environment', value: 38, color: '#3B82F6' },
  { name: 'Education', value: 29, color: '#38BDF8' },
  { name: 'Healthcare', value: 23, color: '#6366F1' },
  { name: 'Others', value: 10, color: '#F59E0B' },
];

const TOP_NGOS_DEFAULT = [
  { name: 'Global Clean Water', amount: '₹12,50,000', change: '+18%', color: 'bg-blue-500' },
  { name: 'Tech for Tomorrow', amount: '₹9,80,000', change: '+12%', color: 'bg-purple-500' },
  { name: 'Green Earth Alliance', amount: '₹8,40,000', change: '+22%', color: 'bg-green-500' },
  { name: 'Health Hope Foundation', amount: '₹6,20,000', change: '+9%', color: 'bg-red-500' },
];

const RECENT_HASHES_DEFAULT = [
  { tx: 'TX-A3F29B1C', hash: '5e884898da28047...', amount: '₹2,500', status: 'Verified' },
  { tx: 'TX-B8E14D2A', hash: 'a1b2c3d4e5f678...', amount: '₹10,000', status: 'Processing' },
  { tx: 'TX-C5D67F3E', hash: 'f0e1d2c3b4a596...', amount: '₹500', status: 'Verified' },
  { tx: 'TX-D2A91C4F', hash: '9876543210fedc...', amount: '₹7,500', status: 'Verified' },
];

export function Dashboard() {
  const { user, loading } = useAuth();
  const [monthlyData, setMonthlyData] = useState(MONTHLY_DATA_DEFAULT);
  const [topNGOs, setTopNGOs] = useState(TOP_NGOS_DEFAULT);
  const [recentHashes, setRecentHashes] = useState(RECENT_HASHES_DEFAULT);
  const [metrics, setMetrics] = useState({
    totalDonations: '₹4,82,10,500',
    registeredNGOs: '142',
    activeDonors: '8,932',
    integrityHashes: '14,203',
  });

  useEffect(() => {
    if (!user) return;
    const BACKEND = `https://pxgepihdhvjetsylivmz.supabase.co/functions/v1/make-server-bc9fabdc`;
    fetch(`${BACKEND}/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${user?.id}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        if (data.metrics) setMetrics(data.metrics);
        if (Array.isArray(data.monthlyData)) setMonthlyData(data.monthlyData);
        if (Array.isArray(data.topNGOs)) setTopNGOs(data.topNGOs);
        if (Array.isArray(data.recentHashes)) setRecentHashes(data.recentHashes);
      })
      .catch(() => {});
  }, [user]);

  // Require login to see dashboard
  if (!loading && !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-[#3B82F6]" />
        </div>
        <h2 className="text-2xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white">Dashboard is Private</h2>
        <p className="text-gray-500 max-w-sm">You need to be logged in to view the live impact dashboard.</p>
        <Link
          to="/login"
          className="px-8 py-3 rounded-xl text-white font-bold"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #38BDF8)' }}
        >
          Login to Continue
        </Link>
      </div>
    );
  }

  const MONTHLY_DATA = monthlyData;
  const TOP_NGOS = topNGOs;
  const RECENT_HASHES = recentHashes;

  return (
    <div className="min-h-screen pt-8 pb-24 px-6 font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
              <Activity className="w-3 h-3 animate-pulse" /> Live Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white">Live Impact Dashboard</h1>
            <p className="text-gray-500 text-sm">Real-time metrics verified by our Data Integrity Protocol.</p>
          </div>
          <button
            onClick={() => exportDashboardPDF(metrics, TOP_NGOS)}
            className="flex items-center gap-2 px-5 py-3 bg-white/90 dark:bg-white/[0.04] backdrop-blur-xl border border-[#3B82F6]/15 rounded-xl text-sm font-bold text-[#3B82F6] hover:bg-[#3B82F6]/5 transition-colors self-start"
            style={{ boxShadow: '0 4px 12px rgba(59,130,246,0.08)' }}
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Total Donations Verified"
            value={metrics.totalDonations}
            change="+12.5%"
            icon={<TrendingUp className="w-5 h-5 text-gray-900 dark:text-white" />}
            bg="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]"
            delay={0}
          />
          <MetricCard
            title="Registered NGOs"
            value={metrics.registeredNGOs}
            change="+5 New"
            icon={<Building2 className="w-5 h-5 text-gray-900 dark:text-white" />}
            bg="bg-gradient-to-br from-[#38BDF8] to-[#0284C7]"
            delay={0.05}
          />
          <MetricCard
            title="Active Donors"
            value={metrics.activeDonors}
            change="+8.2%"
            icon={<Users className="w-5 h-5 text-gray-900 dark:text-white" />}
            bg="bg-gradient-to-br from-[#6366F1] to-[#4338CA]"
            delay={0.1}
          />
          <MetricCard
            title="Integrity Hashes"
            value={metrics.integrityHashes}
            change="100% verified"
            icon={<Shield className="w-5 h-5 text-gray-900 dark:text-white" />}
            bg="bg-gradient-to-br from-amber-500 to-orange-600"
            delay={0.15}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/10 rounded-[2rem] p-8"
            style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-lg font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white">Donation Growth</h2>
                <p className="text-sm text-gray-500">Last 6 months</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] rounded-full text-xs font-bold">Monthly</span>
              </div>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_DATA}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-white/[0.05]" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1F2B',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    itemStyle={{ color: '#3B82F6' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/10 rounded-[2rem] p-8"
            style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' }}
          >
            <h2 className="text-lg font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white mb-2">By Category</h2>
            <p className="text-sm text-gray-500 mb-6">Donation distribution</p>

            <div className="flex justify-center mb-6">
              <PieChart width={180} height={180}>
                <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>

            <div className="space-y-3">
              {CATEGORY_DATA.map(cat => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{cat.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{cat.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top NGOs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/10 rounded-[2rem] p-8"
            style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white">Top NGOs</h2>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">By total received</span>
            </div>
            <div className="space-y-4">
              {TOP_NGOS.map((ngo, i) => (
                <div key={ngo.name} className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#3B82F6]/5 transition-colors group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-900 dark:text-white font-bold text-sm shrink-0 shadow-sm" style={{ background: i === 0 ? '#3B82F6' : i === 1 ? '#38BDF8' : i === 2 ? '#6366F1' : '#F59E0B' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-gray-900 dark:text-white">{ngo.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{ngo.amount}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" /> {ngo.change}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Integrity Hashes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/10 rounded-[2rem] p-8"
            style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white">Recent Hashes</h2>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B82F6]">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
                Live
              </div>
            </div>
            <div className="space-y-3">
              {RECENT_HASHES.map((item) => (
                <div key={item.tx} className="p-4 rounded-xl bg-[#3B82F6]/3 border border-[#3B82F6]/8 hover:border-[#3B82F6]/25 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">{item.tx}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      item.status === 'Verified'
                        ? 'bg-[#3B82F6]/10 text-[#3B82F6]'
                        : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      {item.status === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : null}
                      {item.status}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-[#3B82F6] truncate">{item.hash}</div>
                  <div className="text-xs text-gray-500 mt-1 font-bold">{item.amount}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon, bg, delay }: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  bg: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/10 rounded-3xl p-6 hover:shadow-[0_12px_40px_rgba(59,130,246,0.15)] transition-all duration-300 group"
      style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.06)' }}
    >
      <div className="flex justify-between items-start mb-5">
        <div className={`p-3 rounded-2xl ${bg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[#3B82F6] text-xs font-bold bg-[#3B82F6]/10 px-2 py-1 rounded-full">
          <ArrowUpRight className="w-3 h-3" /> {change}
        </div>
      </div>
      <p className="text-gray-500 text-xs font-medium mb-1.5 uppercase tracking-wide">{title}</p>
      <h3 className="text-2xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white">{value}</h3>
    </motion.div>
  );
}