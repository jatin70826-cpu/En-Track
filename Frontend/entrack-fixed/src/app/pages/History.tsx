import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Download, ChevronDown, CheckCircle2, AlertCircle, X, Hash, Shield, Calendar, Building2, IndianRupee } from 'lucide-react';
import { exportTransactionsPDF } from '../components/ExportPDF';

const TRANSACTIONS = [
  { id: 'TX-A3F29B1C', user: 'Donor#442', ngo: 'Global Clean Water', amount: 2500, date: '2025-03-01', hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', status: 'Verified' },
  { id: 'TX-B8E14D2A', user: 'Donor#105', ngo: 'Tech for Tomorrow', amount: 10000, date: '2025-02-28', hash: 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef', status: 'Verified' },
  { id: 'TX-C5D67F3E', user: 'Donor#889', ngo: 'Green Earth Alliance', amount: 1000, date: '2025-02-27', hash: 'f0e1d2c3b4a596871234567890abcdef1234567890abcdef1234567890abcdef', status: 'Pending' },
  { id: 'TX-D2A91C4F', user: 'Donor#332', ngo: 'Health Hope Foundation', amount: 7500, date: '2025-02-26', hash: '9876543210fedcba1234567890abcdef1234567890abcdef1234567890abcdef', status: 'Verified' },
  { id: 'TX-E7B36A5D', user: 'Donor#567', ngo: 'Ocean Cleanup Crew', amount: 1500, date: '2025-02-25', hash: '1357924680acebdf1234567890abcdef1234567890abcdef1234567890abcdef', status: 'Verified' },
  { id: 'TX-F9C82E1B', user: 'Donor#223', ngo: 'Future Scholars', amount: 5000, date: '2025-02-24', hash: '2468013579bdfeca1234567890abcdef1234567890abcdef1234567890abcdef', status: 'Verified' },
  { id: 'TX-G4D15F8C', user: 'Donor#781', ngo: 'Global Clean Water', amount: 25000, date: '2025-02-23', hash: 'deadbeef1234567890abcdef1234567890abcdef1234567890abcdef12345678', status: 'Verified' },
  { id: 'TX-H6A29C3E', user: 'Donor#94', ngo: 'Tech for Tomorrow', amount: 500, date: '2025-02-22', hash: 'cafebabe1234567890abcdef1234567890abcdef1234567890abcdef12345678', status: 'Pending' },
];

const NGO_OPTIONS = ['All NGOs', 'Global Clean Water', 'Tech for Tomorrow', 'Green Earth Alliance', 'Health Hope Foundation', 'Ocean Cleanup Crew', 'Future Scholars'];

export function History() {
  const [allTransactions, setAllTransactions] = useState(TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterNGO, setFilterNGO] = useState('All NGOs');
  const [filterAmount, setFilterAmount] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    const BACKEND = `https://pxgepihdhvjetsylivmz.supabase.co/functions/v1/make-server-bc9fabdc`;
    fetch(`${BACKEND}/transactions/history`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setAllTransactions(data); })
      .catch(() => {});
  }, []);

  const filteredTransactions = allTransactions.filter(tx => {
    const matchSearch = tx.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.ngo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.hash.includes(searchTerm) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || tx.status === filterStatus;
    const matchNGO = filterNGO === 'All NGOs' || tx.ngo === filterNGO;
    const matchAmount = filterAmount === 'All' ||
      (filterAmount === 'under1k' && tx.amount < 1000) ||
      (filterAmount === '1k-5k' && tx.amount >= 1000 && tx.amount <= 5000) ||
      (filterAmount === 'over5k' && tx.amount > 5000);
    return matchSearch && matchStatus && matchNGO && matchAmount;
  });

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const totalAmount = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="min-h-screen pt-8 pb-24 px-6 font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 pt-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
              <Shield className="w-3 h-3" /> Verified Transactions
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white">Transaction History</h1>
            <p className="text-gray-500 text-sm">Verify the integrity of every donation with SHA-256 cryptographic hashes.</p>
          </div>
          <button
            onClick={() => exportTransactionsPDF(filteredTransactions)}
            className="flex items-center gap-2 px-5 py-3 bg-white/90 dark:bg-white/[0.04] backdrop-blur-xl border border-gray-200/80 dark:border-white/[0.08] rounded-xl text-sm font-bold text-gray-900 dark:text-white hover:bg-white/[0.07] transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-[#3B82F6]" /> Export as PDF
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Showing', value: `${filteredTransactions.length} txns`, icon: <Filter className="w-4 h-4" /> },
            { label: 'Total Amount', value: `₹${totalAmount.toLocaleString()}`, icon: <IndianRupee className="w-4 h-4" /> },
            { label: 'Verified', value: `${filteredTransactions.filter(t => t.status === 'Verified').length}`, icon: <CheckCircle2 className="w-4 h-4" /> },
            { label: 'Pending', value: `${filteredTransactions.filter(t => t.status === 'Pending').length}`, icon: <AlertCircle className="w-4 h-4" /> },
          ].map(stat => (
            <div key={stat.label} className="bg-white/90 dark:bg-white/[0.04] backdrop-blur-xl border border-gray-200/80 dark:border-white/[0.08] rounded-2xl p-4 flex items-center gap-3">
              <div className="text-[#3B82F6]">{stat.icon}</div>
              <div>
                <div className="text-xs text-gray-500">{stat.label}</div>
                <div className="font-bold text-gray-900 dark:text-white text-sm">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-white/90 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search by Donor ID, NGO, TX ID, or Hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.08] rounded-xl pl-4 pr-8 py-3 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-[#3B82F6] cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 dark:text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filterNGO}
                  onChange={(e) => setFilterNGO(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.08] rounded-xl pl-4 pr-8 py-3 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-[#3B82F6] cursor-pointer max-w-[160px]"
                >
                  {NGO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 dark:text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filterAmount}
                  onChange={(e) => setFilterAmount(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.08] rounded-xl pl-4 pr-8 py-3 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-[#3B82F6] cursor-pointer"
                >
                  <option value="All">All Amounts</option>
                  <option value="under1k">Under ₹1,000</option>
                  <option value="1k-5k">₹1,000 – ₹5,000</option>
                  <option value="over5k">Above ₹5,000</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 dark:text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/90 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-[1.5rem] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/[0.05] border-b border-gray-200/80 dark:border-white/[0.06]">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">TX ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Donor ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">NGO Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Integrity Hash (SHA-256)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                {filteredTransactions.map((tx) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-[#38BDF8] font-bold">{tx.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white font-mono">{tx.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-600">{tx.ngo}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">₹{tx.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 shrink-0" /> {tx.date}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => copyHash(tx.hash)}
                        className="flex items-center gap-2 hover:text-[#3B82F6] transition-colors"
                        title={tx.hash}
                      >
                        <code className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-white/[0.06] px-2 py-1 rounded max-w-[130px] truncate block hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] transition-colors">
                          {tx.hash.slice(0, 20)}...
                        </code>
                        <span className={`text-[9px] font-bold transition-all ${copiedHash === tx.hash ? 'text-[#3B82F6]' : 'opacity-0 group-hover:opacity-100 text-gray-600 dark:text-gray-400'}`}>
                          {copiedHash === tx.hash ? '✓ COPIED' : 'COPY'}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        tx.status === 'Verified'
                          ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
                          : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                      }`}>
                        {tx.status === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {tx.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-white/[0.06] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No transactions match your filters.</p>
              <button onClick={() => { setSearchTerm(''); setFilterStatus('All'); setFilterNGO('All NGOs'); setFilterAmount('All'); }} className="mt-3 text-sm text-[#3B82F6] font-bold hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}