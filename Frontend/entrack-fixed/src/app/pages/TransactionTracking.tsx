import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Database, Server, User, ArrowRight, ExternalLink, Clock, CheckCircle2, CircleDashed, Download, Shield, Hash } from 'lucide-react';
import { exportTransactionsPDF } from '../components/ExportPDF';

const TRANSACTIONS = [
  {
    id: 'tx-001',
    txId: 'TX-A3F29B1C',
    donor: 'Donor#442',
    amount: '₹2,500',
    ngo: 'Global Clean Water Initiative',
    timestamp: '2 mins ago',
    hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    status: 'Completed',
    milestones: [
      { step: 'Payment Received', status: 'completed', time: '10:00 AM', desc: 'Donor payment processed via UPI gateway.' },
      { step: 'Data Integrity Log', status: 'completed', time: '10:00 AM', desc: 'Transaction logged in immutable ledger.' },
      { step: 'SHA-256 Hash Generated', status: 'completed', time: '10:01 AM', desc: 'Unique verification hash created.' },
      { step: 'NGO Fund Transfer', status: 'completed', time: '10:05 AM', desc: 'Funds released to NGO verified account.' },
      { step: 'Beneficiary Confirmed', status: 'completed', time: '10:30 AM', desc: 'Impact confirmed by NGO field report.' },
    ]
  },
  {
    id: 'tx-002',
    txId: 'TX-B8E14D2A',
    donor: 'Donor#105',
    amount: '₹10,000',
    ngo: 'Tech for Tomorrow',
    timestamp: '15 mins ago',
    hash: 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'Processing',
    milestones: [
      { step: 'Payment Received', status: 'completed', time: '09:45 AM', desc: 'Donor payment processed via Net Banking.' },
      { step: 'Data Integrity Log', status: 'completed', time: '09:46 AM', desc: 'Transaction logged in immutable ledger.' },
      { step: 'SHA-256 Hash Generated', status: 'processing', time: '---', desc: 'Generating cryptographic hash...' },
      { step: 'NGO Fund Transfer', status: 'pending', time: '---', desc: 'Awaiting hash verification.' },
      { step: 'Beneficiary Confirmed', status: 'pending', time: '---', desc: 'Pending fund transfer.' },
    ]
  },
  {
    id: 'tx-003',
    txId: 'TX-C5D67F3E',
    donor: 'Donor#889',
    amount: '₹500',
    ngo: 'Green Earth Alliance',
    timestamp: '1 hour ago',
    hash: 'f0e1d2c3b4a596871234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'Completed',
    milestones: [
      { step: 'Payment Received', status: 'completed', time: '08:30 AM', desc: 'Donor payment processed via UPI.' },
      { step: 'Data Integrity Log', status: 'completed', time: '08:30 AM', desc: 'Transaction logged in immutable ledger.' },
      { step: 'SHA-256 Hash Generated', status: 'completed', time: '08:31 AM', desc: 'Hash: f0e1d2c3...' },
      { step: 'NGO Fund Transfer', status: 'completed', time: '08:45 AM', desc: 'Funds released to NGO.' },
      { step: 'Beneficiary Confirmed', status: 'completed', time: '09:00 AM', desc: 'Impact verified.' },
    ]
  },
  {
    id: 'tx-004',
    txId: 'TX-D2A91C4F',
    donor: 'Donor#332',
    amount: '₹7,500',
    ngo: 'Health Hope Foundation',
    timestamp: '3 hours ago',
    hash: '9876543210fedcba1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'Completed',
    milestones: [
      { step: 'Payment Received', status: 'completed', time: '07:00 AM', desc: 'Payment via Card.' },
      { step: 'Data Integrity Log', status: 'completed', time: '07:01 AM', desc: 'Logged to ledger.' },
      { step: 'SHA-256 Hash Generated', status: 'completed', time: '07:01 AM', desc: 'Hash generated.' },
      { step: 'NGO Fund Transfer', status: 'completed', time: '07:15 AM', desc: 'Funds transferred.' },
      { step: 'Beneficiary Confirmed', status: 'completed', time: '07:45 AM', desc: 'Confirmed.' },
    ]
  },
];

// Map to exportable format
const EXPORT_TRANSACTIONS = TRANSACTIONS.map(tx => ({
  id: tx.txId,
  user: tx.donor,
  ngo: tx.ngo,
  amount: parseInt(tx.amount.replace(/[^0-9]/g, '')),
  date: new Date().toISOString().split('T')[0],
  hash: tx.hash,
  status: tx.status === 'Completed' ? 'Verified' : 'Pending',
}));

export function TransactionTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [selectedTx, setSelectedTx] = useState<typeof TRANSACTIONS[0] | null>(null);
  const [loadingStep, setLoadingStep] = useState(-1);

  // Fetch live transactions from backend; fall back to mock data
  useEffect(() => {
    const BACKEND = `https://pxgepihdhvjetsylivmz.supabase.co/functions/v1/make-server-bc9fabdc`;
    fetch(`${BACKEND}/transactions`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setTransactions(data); })
      .catch(() => {}); // silently keep mock data
  }, []);

  const filteredTransactions = transactions.filter(tx =>
    tx.txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.ngo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.hash.includes(searchTerm)
  );

  useEffect(() => {
    if (selectedTx) {
      setLoadingStep(-1);
      let step = 0;
      const interval = setInterval(() => {
        setLoadingStep(step);
        step++;
        if (step > selectedTx.milestones.length) clearInterval(interval);
      }, 250);
      return () => clearInterval(interval);
    }
  }, [selectedTx]);

  return (
    <div className="min-h-screen pt-8 pb-24 px-6 font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center space-y-6 py-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
            <Shield className="w-3 h-3" /> Data Integrity Tracking
          </div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white"
          >
            Track Your{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #3B82F6, #38BDF8)' }}>
              Impact
            </span>
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Every donation generates a unique SHA-256 Integrity Hash. Enter your Transaction ID, Donor ID, or Hash to trace the full journey.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto group"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400 group-focus-within:text-[#3B82F6] transition-colors" />
            <input
              type="text"
              placeholder="Enter TX ID, Donor ID, or Integrity Hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/90 dark:bg-white/[0.04] backdrop-blur-md border border-[#3B82F6]/15 rounded-full py-5 pl-14 pr-6 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all shadow-lg hover:shadow-xl"
              style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.08)' }}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Transaction List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 bg-white/90 dark:bg-white/[0.04] backdrop-blur-md border border-[#3B82F6]/10 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-xl"
            style={{ boxShadow: '0 20px 60px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' }}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white" style={{ fontSize: '1.1rem' }}>Recent Transactions</h2>
              <div className="flex gap-2 items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Data</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-white/[0.05]">
                  <tr>
                    {['TX ID', 'Donor', 'NGO', 'Amount', 'Status', ''].map(h => (
                      <th key={h} className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className={`cursor-pointer hover:bg-white/90 dark:bg-white/[0.04] transition-colors group border-l-4 ${
                        selectedTx?.id === tx.id
                          ? 'bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 border-[#3B82F6]'
                          : 'border-transparent'
                      }`}
                    >
                      <td className="px-5 py-4 font-mono text-[#3B82F6] dark:text-[#60A5FA] text-sm font-bold group-hover:underline">
                        {tx.txId}
                      </td>
                      <td className="px-5 py-4 font-mono text-gray-500 dark:text-gray-600 text-sm">{tx.donor}</td>
                      <td className="px-5 py-4 text-gray-700 text-sm max-w-[140px] truncate">{tx.ngo}</td>
                      <td className="px-5 py-4 font-bold text-gray-900 dark:text-white text-sm">{tx.amount}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          tx.status === 'Completed'
                            ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20'
                            : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                        }`}>
                          {tx.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <CircleDashed className="w-3 h-3 animate-spin" />}
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <ArrowRight className={`w-4 h-4 text-gray-700 dark:text-gray-300 transition-all ${
                          selectedTx?.id === tx.id
                            ? 'translate-x-1 text-[#3B82F6]'
                            : 'group-hover:translate-x-1 group-hover:text-gray-500'
                        }`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="p-12 text-center text-gray-600 dark:text-gray-400">
                <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-[#3B82F6]" />
                </div>
                No transactions found matching "{searchTerm}"
              </div>
            )}

            {/* Export button */}
            <div className="p-5 border-t border-gray-200/60 dark:border-white/[0.05]">
              <button
                onClick={() => exportTransactionsPDF(EXPORT_TRANSACTIONS)}
                className="flex items-center gap-2 text-sm font-bold text-[#3B82F6] dark:text-[#60A5FA] hover:underline transition-colors"
              >
                <Download className="w-4 h-4" /> Export as PDF
              </button>
            </div>
          </motion.div>

          {/* Timeline / Journey Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/10 rounded-[2rem] p-7 min-h-[500px] shadow-xl flex flex-col"
            style={{ boxShadow: '0 20px 60px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' }}
          >
            <h2 className="font-bold font-['Clash_Display',sans-serif] mb-1 text-gray-900 dark:text-white flex items-center gap-2" style={{ fontSize: '1.1rem' }}>
              <MapPin className="w-5 h-5 text-[#3B82F6]" /> Integrity Journey Map
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-6 font-mono">Data Integrity Protocol Trace</p>

            <AnimatePresence mode="wait">
              {selectedTx ? (
                <motion.div
                  key={selectedTx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 space-y-1"
                >
                  {/* Hash display */}
                  <div className="p-3 bg-gray-50 dark:bg-white/[0.05] rounded-xl border border-gray-200/60 dark:border-white/[0.05] mb-5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Hash className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">SHA-256 Hash</span>
                    </div>
                    <code className="text-xs font-mono text-[#3B82F6] dark:text-[#60A5FA] break-all leading-relaxed">
                      {selectedTx.hash.slice(0, 40)}...
                    </code>
                  </div>

                  {/* Timeline */}
                  <div className="relative pl-6 border-l-2 border-dashed border-[#3B82F6]/20 space-y-6 ml-3">
                    {selectedTx.milestones.map((milestone, index) => {
                      const isActive = index <= loadingStep;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: isActive ? 1 : 0.35, x: isActive ? 0 : -4 }}
                          transition={{ duration: 0.4 }}
                          className="relative group"
                        >
                          <div className={`absolute -left-[31px] w-5 h-5 rounded-full border-4 border-white dark:border-[#111827] transition-all duration-500 z-10 ${
                            isActive
                              ? milestone.status === 'completed'
                                ? 'bg-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                                : milestone.status === 'processing'
                                ? 'bg-amber-400 animate-pulse'
                                : 'bg-gray-300 dark:bg-gray-600'
                              : 'bg-gray-200 dark:bg-gray-800'
                          }`} />

                          <div className={`bg-gray-50 dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.08] rounded-xl p-4 transition-all ${isActive ? '' : 'grayscale'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-bold text-xs ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                {milestone.step}
                              </h4>
                              {isActive && milestone.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />}
                              {isActive && milestone.status === 'processing' && <CircleDashed className="w-4 h-4 text-amber-400 animate-spin" />}
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{milestone.desc}</p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-mono">
                              <Clock className="w-3 h-3" />
                              {milestone.time}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center flex-1 text-center text-gray-600 dark:text-gray-400 space-y-5 opacity-60"
                >
                  <div className="w-16 h-16 bg-[#3B82F6]/10 rounded-full flex items-center justify-center">
                    <Search className="w-7 h-7 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 mb-1">Select a transaction</p>
                    <p className="text-sm max-w-[200px] text-gray-600 dark:text-gray-400">Click any row to trace its complete Data Integrity journey.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
