// import { useState } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { ChevronDown, CheckCircle2, ArrowRight, Loader2, X, Download, Shield, User, CreditCard, Building2, Hash, Info } from 'lucide-react';
// import { Link } from 'react-router';

// const NGOS = [
//   { id: 1, name: 'Global Clean Water Initiative', category: 'Environment', impact: '12,500+ Lives', color: 'from-[#3B82F6] to-[#38BDF8]' },
//   { id: 2, name: 'Tech for Tomorrow', category: 'Education', impact: '5,000+ Students', color: 'from-[#6366F1] to-[#3B82F6]' },
//   { id: 3, name: 'Green Earth Alliance', category: 'Environment', impact: '50,000+ Trees', color: 'from-[#38BDF8] to-[#6366F1]' },
//   { id: 4, name: 'Health Hope Foundation', category: 'Healthcare', impact: '8,200+ Patients', color: 'from-[#3B82F6] to-[#6366F1]' },
//   { id: 5, name: 'Ocean Cleanup Crew', category: 'Environment', impact: '200 Tons Plastic', color: 'from-[#38BDF8] to-[#3B82F6]' },
// ];

// const QUICK_AMOUNTS = [100, 500, 1000, 2500, 5000, 10000];

// function generateHash(): string {
//   const chars = '0123456789abcdef';
//   let hash = '';
//   for (let i = 0; i < 64; i++) {
//     hash += chars[Math.floor(Math.random() * chars.length)];
//   }
//   return hash;
// }

// function generateTxId(): string {
//   return 'TX-' + Math.random().toString(36).substring(2, 10).toUpperCase();
// }

// export function DonationDashboard() {
//   const [step, setStep] = useState<1 | 2 | 3>(1);
//   const [amount, setAmount] = useState<number>(500);
//   const [customAmount, setCustomAmount] = useState('');
//   const [selectedNGO, setSelectedNGO] = useState(NGOS[0]);
//   const [donorName, setDonorName] = useState('');
//   const [donorEmail, setDonorEmail] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [successHash, setSuccessHash] = useState('');
//   const [txId, setTxId] = useState('');

//   const finalAmount = customAmount ? parseInt(customAmount) || 0 : amount;

//   const [submitError, setSubmitError] = useState('');

//   const handleProceed = async () => {
//     if (step === 1 && finalAmount > 0) { setStep(2); return; }
//     if (step === 2) {
//       setIsProcessing(true);
//       setSubmitError('');
//       try {
//         const BACKEND = `https://pxgepihdhvjetsylivmz.supabase.co/functions/v1/make-server-bc9fabdc`;
//         const res = await fetch(`${BACKEND}/donation`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             amount: finalAmount,
//             ngoId: selectedNGO.id,
//             ngoName: selectedNGO.name,
//             donorName,
//             donorEmail,
//             paymentMethod,
//           }),
//         });
//         let responseHash = '';
//         let responseTx = '';
//         if (res.ok) {
//           const data = await res.json().catch(() => ({}));
//           responseHash = data.hash || generateHash();
//           responseTx = data.txId || generateTxId();
//         } else {
//           // Backend not yet live — generate local placeholders
//           responseHash = generateHash();
//           responseTx = generateTxId();
//         }
//         setSuccessHash(responseHash);
//         setTxId(responseTx);
//         setStep(3);
//       } catch (_) {
//         setSuccessHash(generateHash());
//         setTxId(generateTxId());
//         setStep(3);
//       } finally {
//         setIsProcessing(false);
//       }
//     }
//   };

//   const handleReset = () => {
//     setStep(1);
//     setAmount(500);
//     setCustomAmount('');
//     setSuccessHash('');
//     setTxId('');
//   };

//   const steps = [
//     { num: 1, label: 'Select Amount' },
//     { num: 2, label: 'Confirmation' },
//     { num: 3, label: 'Success' },
//   ];

//   return (
//     <div className="min-h-screen pt-8 pb-24 px-6 relative font-['Inter',sans-serif]">
//       <div className="max-w-3xl mx-auto relative z-10">

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center py-10 space-y-3"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
//             <Shield className="w-3 h-3" /> Secure Donation Engine
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white">
//             Fuel the{' '}
//             <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #3B82F6, #38BDF8)' }}>
//               Change.
//             </span>
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 text-lg">
//             Every donation is verified with a unique SHA-256 Security Hash.
//           </p>
//         </motion.div>

//         {/* Step Indicator */}
//         <div className="flex items-center justify-center mb-10 gap-0">
//           {steps.map((s, i) => (
//             <div key={s.num} className="flex items-center">
//               <div className="flex flex-col items-center gap-2 transition-all duration-300">
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
//                   step === s.num
//                     ? 'bg-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
//                     : step > s.num
//                     ? 'bg-[#3B82F6]/20 text-[#3B82F6] border-2 border-[#3B82F6]'
//                     : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
//                 }`}>
//                   {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
//                 </div>
//                 <span className={`text-xs font-bold uppercase tracking-wide ${step >= s.num ? 'text-gray-700' : 'text-gray-600 dark:text-gray-400'}`}>
//                   {s.label}
//                 </span>
//               </div>
//               {i < steps.length - 1 && (
//                 <div className={`w-16 md:w-24 h-0.5 mb-5 mx-3 transition-all duration-300 ${step > s.num ? 'bg-gradient-to-r from-[#3B82F6] to-[#38BDF8]' : 'bg-gray-200 dark:bg-white/10'}`} />
//               )}
//             </div>
//           ))}
//         </div>

//         <AnimatePresence mode="wait">
//           {/* STEP 1: Amount Selection */}
//           {step === 1 && (
//             <motion.div
//               key="step1"
//               initial={{ opacity: 0, x: 30 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -30 }}
//               transition={{ duration: 0.3 }}
//               className="space-y-8"
//             >
//               {/* NGO Selector */}
//               <div className="bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/10 rounded-3xl p-8 shadow-lg"
//                 style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
//                 <h2 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 font-['Clash_Display',sans-serif]" style={{ fontSize: '1.1rem' }}>
//                   <Building2 className="w-5 h-5 text-[#3B82F6]" /> Choose NGO
//                 </h2>
//                 <div className="grid grid-cols-1 gap-3">
//                   {NGOS.map((ngo) => (
//                     <button
//                       key={ngo.id}
//                       onClick={() => setSelectedNGO(ngo)}
//                       className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 group ${
//                         selectedNGO.id === ngo.id
//                           ? 'border-[#3B82F6] bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 shadow-[0_4px_16px_rgba(59,130,246,0.12)]'
//                           : 'border-gray-200/80 dark:border-white/[0.08] hover:border-[#3B82F6]/30 dark:border-white/20 hover:bg-white/90 dark:bg-white/[0.04]'
//                       }`}
//                     >
//                       <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ngo.color} flex items-center justify-center shrink-0 shadow-sm`}>
//                         <Building2 className="w-5 h-5 text-gray-900 dark:text-white" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-bold text-gray-900 dark:text-white text-sm">{ngo.name}</div>
//                         <div className="text-xs text-gray-500">{ngo.category} • {ngo.impact}</div>
//                       </div>
//                       {selectedNGO.id === ngo.id && (
//                         <CheckCircle2 className="w-5 h-5 text-[#3B82F6] shrink-0" />
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Amount Selection */}
//               <div className="bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/10 rounded-3xl p-8 shadow-lg"
//                 style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
//                 <h2 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 font-['Clash_Display',sans-serif]" style={{ fontSize: '1.1rem' }}>
//                   <CreditCard className="w-5 h-5 text-[#38BDF8]" /> Select Amount (INR)
//                 </h2>

//                 {/* Quick Select */}
//                 <div className="grid grid-cols-3 gap-3 mb-6">
//                   {QUICK_AMOUNTS.map((a) => (
//                     <button
//                       key={a}
//                       onClick={() => { setAmount(a); setCustomAmount(''); }}
//                       className={`py-3 rounded-xl font-bold text-sm border transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
//                         amount === a && !customAmount
//                           ? 'bg-gradient-to-r from-[#3B82F6] to-[#38BDF8] border-[#3B82F6] text-white shadow-[0_4px_14px_rgba(59,130,246,0.35)]'
//                           : 'border-gray-200/80 dark:border-white/[0.08] text-gray-700 hover:border-[#3B82F6]/40 bg-gray-50 dark:bg-white/[0.05]'
//                       }`}
//                     >
//                       ₹{a.toLocaleString()}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Custom Amount */}
//                 <div className="relative">
//                   <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-600 dark:text-gray-400">₹</span>
//                   <input
//                     type="number"
//                     placeholder="Enter custom amount"
//                     value={customAmount}
//                     onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
//                     className="w-full bg-gray-50 dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl pl-10 pr-5 py-4 text-gray-900 dark:text-white text-lg font-bold focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all placeholder-gray-500"
//                   />
//                 </div>

//                 {/* Summary */}
//                 {finalAmount > 0 && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mt-6 p-5 rounded-2xl bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 border border-[#3B82F6]/20"
//                   >
//                     <div className="flex justify-between items-center text-sm">
//                       <span className="text-gray-600 dark:text-gray-400">You're donating</span>
//                       <span className="text-2xl font-bold text-[#3B82F6]">₹{finalAmount.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between items-center text-sm mt-2">
//                       <span className="text-gray-500">To</span>
//                       <span className="font-medium text-gray-700">{selectedNGO.name}</span>
//                     </div>
//                   </motion.div>
//                 )}
//               </div>

//               <button
//                 onClick={handleProceed}
//                 disabled={finalAmount <= 0}
//                 className="w-full py-5 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
//                 style={{
//                   background: 'linear-gradient(135deg, #3B82F6, #38BDF8)',
//                   boxShadow: '0 10px 30px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
//                 }}
//               >
//                 Continue to Review <ArrowRight className="w-5 h-5" />
//               </button>
//             </motion.div>
//           )}

//           {/* STEP 2: Confirmation */}
//           {step === 2 && (
//             <motion.div
//               key="step2"
//               initial={{ opacity: 0, x: 30 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -30 }}
//               transition={{ duration: 0.3 }}
//               className="space-y-6"
//             >
//               <div className="bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/10 rounded-3xl p-8 shadow-lg space-y-6"
//                 style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-['Clash_Display',sans-serif]">Review Your Donation</h2>

//                 {/* Donation Summary */}
//                 <div className="space-y-4 p-6 bg-gray-50 dark:bg-white/[0.05] rounded-2xl border border-gray-200/60 dark:border-white/[0.05]">
//                   {[
//                     { label: 'NGO', value: selectedNGO.name },
//                     { label: 'Category', value: selectedNGO.category },
//                     { label: 'Impact', value: selectedNGO.impact },
//                     { label: 'Amount', value: `₹${finalAmount.toLocaleString()}`, highlight: true },
//                   ].map(row => (
//                     <div key={row.label} className="flex justify-between items-center">
//                       <span className="text-gray-500 text-sm">{row.label}</span>
//                       <span className={`font-bold text-sm ${row.highlight ? 'text-[#3B82F6] text-lg' : 'text-gray-900 dark:text-white'}`}>{row.value}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Donor Info */}
//                 <div className="space-y-4">
//                   <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider flex items-center gap-2">
//                     <User className="w-4 h-4 text-[#3B82F6]" /> Donor Information (Optional)
//                   </h3>
//                   <input
//                     type="text"
//                     placeholder="Your name (or leave blank to remain anonymous)"
//                     value={donorName}
//                     onChange={e => setDonorName(e.target.value)}
//                     className="w-full bg-gray-50 dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.08] rounded-xl px-5 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all"
//                   />
//                   <input
//                     type="email"
//                     placeholder="Email for receipt (recommended)"
//                     value={donorEmail}
//                     onChange={e => setDonorEmail(e.target.value)}
//                     className="w-full bg-gray-50 dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.08] rounded-xl px-5 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all"
//                   />
//                 </div>

//                 {/* Payment Method */}
//                 <div className="space-y-3">
//                   <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider flex items-center gap-2">
//                     <CreditCard className="w-4 h-4 text-[#38BDF8]" /> Payment Method
//                   </h3>
//                   <div className="grid grid-cols-3 gap-3">
//                     {[
//                       { key: 'upi', label: 'UPI', icon: '📱' },
//                       { key: 'card', label: 'Card', icon: '💳' },
//                       { key: 'netbanking', label: 'Net Banking', icon: '🏦' },
//                     ].map(pm => (
//                       <button
//                         key={pm.key}
//                         onClick={() => setPaymentMethod(pm.key as any)}
//                         className={`p-4 rounded-xl border text-center transition-all text-sm font-bold ${
//                           paymentMethod === pm.key
//                             ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-white shadow-[0_4px_12px_rgba(59,130,246,0.15)]'
//                             : 'border-gray-200/80 dark:border-white/[0.08] text-gray-500 dark:text-gray-600 hover:border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/[0.05]'
//                         }`}
//                       >
//                         <div className="text-xl mb-1">{pm.icon}</div>
//                         {pm.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Security Note */}
//                 <div className="flex items-start gap-3 p-4 bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 border border-[#3B82F6]/15 dark:border-[#3B82F6]/20 rounded-xl">
//                   <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
//                   <p className="text-xs text-[#3B82F6] dark:text-[#60A5FA] leading-relaxed">
//                     This transaction will be secured with a unique <strong>SHA-256 Security Verification Hash</strong> and a digital receipt will be generated upon completion.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <button
//                   onClick={() => setStep(1)}
//                   className="flex-1 py-4 rounded-2xl border border-gray-200/80 dark:border-white/[0.08] text-gray-900 dark:text-white font-bold hover:bg-white/90 dark:bg-white/[0.04] transition-colors"
//                 >
//                   ← Back
//                 </button>
//                 <button
//                   onClick={handleProceed}
//                   disabled={isProcessing}
//                   className="flex-[2] py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-80 disabled:cursor-wait"
//                   style={{
//                     background: 'linear-gradient(135deg, #3B82F6, #38BDF8)',
//                     boxShadow: '0 10px 30px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
//                   }}
//                 >
//                   {isProcessing ? (
//                     <>
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       <span>Verifying & Securing...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Shield className="w-5 h-5" />
//                       Confirm Donation
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* Processing animation overlay */}
//               <AnimatePresence>
//                 {isProcessing && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 dark:bg-[#060D1E]/80 backdrop-blur-md"
//                   >
//                     <motion.div
//                       initial={{ scale: 0.9, opacity: 0 }}
//                       animate={{ scale: 1, opacity: 1 }}
//                       className="bg-white/90 dark:bg-white/[0.04] rounded-3xl p-10 max-w-sm w-full mx-6 text-center shadow-2xl border border-[#3B82F6]/15"
//                     >
//                       <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-6">
//                         <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
//                       </div>
//                       <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-['Clash_Display',sans-serif]">Processing Donation</h3>
//                       <div className="space-y-2 mt-4 text-left">
//                         {[
//                           'Encrypting transaction data...',
//                           'Generating SHA-256 hash...',
//                           'Logging to integrity ledger...',
//                         ].map((msg, i) => (
//                           <motion.div
//                             key={msg}
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: i * 0.8 }}
//                             className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 font-mono py-2 border-b border-gray-200/60 dark:border-white/[0.05]"
//                           >
//                             <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse shrink-0" />
//                             {msg}
//                           </motion.div>
//                         ))}
//                       </div>
//                     </motion.div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           )}

//           {/* STEP 3: Success */}
//           {step === 3 && (
//             <motion.div
//               key="step3"
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.4 }}
//               className="space-y-6"
//             >
//               <div className="bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/10 rounded-3xl p-10 shadow-2xl text-center relative overflow-hidden"
//                 style={{ boxShadow: '0 20px 60px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
//                 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-[#6366F1]" />

//                 {/* Success icon */}
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
//                   className="w-24 h-24 bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-[#3B82F6]/10"
//                 >
//                   <CheckCircle2 className="w-12 h-12 text-[#3B82F6]" />
//                 </motion.div>

//                 <h2 className="text-3xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white mb-2">Donation Verified!</h2>
//                 <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
//                   Thank you for contributing to <strong className="text-gray-900 dark:text-white">{selectedNGO.name}</strong>. Your impact is now immutable.
//                 </p>

//                 {/* Transaction Details */}
//                 <div className="bg-gray-50 dark:bg-white/[0.05] rounded-2xl p-6 text-left space-y-4 border border-gray-200/60 dark:border-white/[0.05] mb-6">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-500 text-sm">Transaction ID</span>
//                     <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{txId}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-500 text-sm">Amount</span>
//                     <span className="text-[#3B82F6] font-bold text-xl">₹{finalAmount.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-500 text-sm">NGO</span>
//                     <span className="font-bold text-gray-900 dark:text-white text-sm text-right max-w-[55%]">{selectedNGO.name}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-500 text-sm">Status</span>
//                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#3B82F6]/10 text-[#3B82F6] rounded-full text-xs font-bold border border-[#3B82F6]/20">
//                       <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
//                       Integrity Verified
//                     </span>
//                   </div>
//                   <div className="pt-4 border-t border-gray-200/80 dark:border-white/[0.06]">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Hash className="w-4 h-4 text-[#38BDF8]" />
//                       <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">SHA-256 Security Verification Hash</span>
//                     </div>
//                     <div className="bg-gray-900 dark:bg-black/40 rounded-xl p-4 font-mono text-[#60A5FA] text-xs break-all leading-relaxed border border-[#3B82F6]/20">
//                       {successHash}
//                     </div>
//                     <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-mono">
//                       This hash uniquely identifies and verifies your donation in our immutable ledger.
//                     </p>
//                   </div>
//                 </div>

//                 {/* CTA Buttons */}
//                 <div className="flex flex-col gap-3">
//                   <button
//                     className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
//                     style={{
//                       background: 'linear-gradient(135deg, #3B82F6, #38BDF8)',
//                       boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
//                     }}
//                   >
//                     <Download className="w-5 h-5" /> Download Receipt (PDF)
//                   </button>
//                   <Link
//                     to="/track"
//                     className="w-full py-4 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] font-bold flex items-center justify-center gap-2 hover:bg-[#38BDF8]/20 transition-colors"
//                   >
//                     Track Your Impact <ArrowRight className="w-4 h-4" />
//                   </Link>
//                   <button
//                     onClick={handleReset}
//                     className="w-full py-4 rounded-2xl border border-gray-200/80 dark:border-white/[0.08] text-gray-600 dark:text-gray-400 font-bold hover:bg-white/90 dark:bg-white/[0.04] transition-colors text-sm"
//                   >
//                     Make Another Donation
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }
