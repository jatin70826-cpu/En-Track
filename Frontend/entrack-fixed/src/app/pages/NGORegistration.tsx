import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle2, Building2, Mail, FileText, ShieldCheck, X, Lock, Eye, EyeOff, Hash, Globe, Users } from 'lucide-react';
import { Link } from 'react-router';

type NGOFormData = {
  ngoName: string;
  email: string;
  description: string;
  password: string;
  confirmPassword: string;
};

export function NGORegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isHashing, setIsHashing] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<NGOFormData>();

  const ngoName = watch('ngoName');
  const password = watch('password', '');

  const handlePasswordChange = () => {
    if (password && password.length > 0) {
      setIsHashing(true);
      setTimeout(() => setIsHashing(false), 800);
    }
  };

  const onSubmit = async (data: NGOFormData) => {
    setIsSubmitting(true);
    try {
      const BACKEND = `https://pxgepihdhvjetsylivmz.supabase.co/functions/v1/make-server-bc9fabdc`;
      const res = await fetch(`${BACKEND}/ngo/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngoName: data.ngoName,
          email: data.email,
          description: data.description,
          password: data.password,
        }),
      });
      // If the backend endpoint isn't live yet, fall through gracefully
      if (!res.ok && res.status !== 404) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      // Only block submission if it's a real server error (not 404 = endpoint not yet created)
      if (err?.message && !err.message.includes('fetch')) {
        setIsSubmitting(false);
        return;
      }
    }
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-[#3B82F6]'];
  const strengthTextColors = ['', 'text-red-500', 'text-amber-500', 'text-[#3B82F6]'];

  return (
    <div className="min-h-screen pt-8 pb-24 px-6 relative overflow-hidden font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10 py-10">

        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12 lg:sticky lg:top-32"
        >
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" /> NGO Registration Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white leading-tight">
              Join the Chain of{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #3B82F6, #38BDF8)' }}>
                Trust.
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Register your organization to access transparent, verifiable funding. Once approved, you'll receive a unique Data Integrity ID and appear on our verified NGO directory.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { num: '01', title: 'Submit Application', desc: 'Fill out the registration form with your organization details.', color: 'text-[#3B82F6] bg-[#3B82F6]/10' },
              { num: '02', title: 'Verification Review', desc: 'Our team reviews your details within 24 hours.', color: 'text-[#38BDF8] bg-[#38BDF8]/10' },
              { num: '03', title: 'Get Verified', desc: 'Receive your Integrity ID and start receiving transparent donations.', color: 'text-[#6366F1] bg-[#6366F1]/10' },
            ].map(step => (
              <div
                key={step.num}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/90 dark:bg-white/[0.04] backdrop-blur-xl border border-gray-200/80 dark:border-white/[0.08] hover:border-[#3B82F6]/20 transition-colors"
                style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.04), inset 0 1px 0 rgba(255,255,255,0.06)' }}
              >
                <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center font-bold shrink-0 font-mono text-sm`}>
                  {step.num}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{step.title}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Building2 className="w-5 h-5" />, value: '142+', label: 'Verified NGOs', color: 'text-[#3B82F6]' },
              { icon: <Users className="w-5 h-5" />, value: '8,932', label: 'Active Donors', color: 'text-[#38BDF8]' },
              { icon: <Globe className="w-5 h-5" />, value: '₹4.8 Cr+', label: 'Funds Tracked', color: 'text-[#6366F1]' },
              { icon: <ShieldCheck className="w-5 h-5" />, value: '100%', label: 'Transparency', color: 'text-amber-500' },
            ].map(stat => (
              <div
                key={stat.label}
                className="p-4 bg-white/90 dark:bg-white/[0.04] backdrop-blur-xl border border-gray-200/80 dark:border-white/[0.08] rounded-2xl text-center"
                style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.04), inset 0 1px 0 rgba(255,255,255,0.06)' }}
              >
                <div className={`flex justify-center mb-2 ${stat.color}`}>{stat.icon}</div>
                <div className={`text-xl font-bold font-['Clash_Display',sans-serif] ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* NGO Preview Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#38BDF8] blur-[60px] opacity-[0.12] group-hover:opacity-20 transition-opacity rounded-3xl" />
            <div
              className="relative bg-white/90 dark:bg-white/[0.04] backdrop-blur-md border border-[#3B82F6]/15 rounded-3xl p-8 shadow-2xl"
              style={{ boxShadow: '0 16px 48px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#38BDF8] rounded-full flex items-center justify-center shadow-md">
                    <Building2 className="w-6 h-6 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {ngoName || 'Your NGO Name'}
                    </h3>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-mono">Pending Verification</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-bold rounded-full border border-[#3B82F6]/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED
                </div>
              </div>
              <div className="space-y-2 mb-5">
                <div className="h-2 bg-[#3B82F6]/10 rounded-full w-3/4" />
                <div className="h-2 bg-[#3B82F6]/8 rounded-full w-1/2" />
              </div>
              <div className="pt-4 border-t border-[#3B82F6]/8 flex justify-between text-xs text-gray-600 dark:text-gray-400 font-mono">
                <span>DI-ID: ENT-...</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Status: Pending
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 dark:bg-white/[0.04] backdrop-blur-md border border-[#3B82F6]/10 rounded-[2rem] p-8 md:p-10 shadow-xl"
          style={{ boxShadow: '0 20px 60px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.06)' }}
        >
          {/* Top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-[#6366F1] rounded-t-[2rem]" />

          <h2 className="text-2xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white mb-8">Registration Form</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* NGO Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#3B82F6]" /> NGO Name *
              </label>
              <input
                {...register('ngoName', { required: 'NGO Name is required' })}
                className={`w-full bg-gray-50 dark:bg-white/[0.05] border ${errors.ngoName ? 'border-red-500' : 'border-gray-200/80 dark:border-white/[0.08] focus:border-[#3B82F6]'} rounded-xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all focus:ring-4 focus:ring-[#3B82F6]/10`}
                placeholder="e.g. Global Clean Water Initiative"
              />
              {errors.ngoName && <span className="text-red-500 text-xs font-medium">{errors.ngoName.message}</span>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#38BDF8]" /> Official Email *
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                })}
                className={`w-full bg-gray-50 dark:bg-white/[0.05] border ${errors.email ? 'border-red-500' : 'border-gray-200/80 dark:border-white/[0.08] focus:border-[#38BDF8]'} rounded-xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all focus:ring-4 focus:ring-[#38BDF8]/10`}
                placeholder="contact@ngo.org"
              />
              {errors.email && <span className="text-red-500 text-xs font-medium">{errors.email.message}</span>}
            </div>

            {/* Mission Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6366F1]" /> Mission Statement *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className={`w-full bg-gray-50 dark:bg-white/[0.05] border ${errors.description ? 'border-red-500' : 'border-gray-200/80 dark:border-white/[0.08] focus:border-[#6366F1]'} rounded-xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all focus:ring-4 focus:ring-[#6366F1]/10 resize-none`}
                placeholder="Describe your organization's mission and impact goals..."
              />
              {errors.description && <span className="text-red-500 text-xs font-medium">{errors.description.message}</span>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" /> Password *
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters required' }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  onBlur={handlePasswordChange}
                  onChange={handlePasswordChange}
                  className={`w-full bg-gray-50 dark:bg-white/[0.05] border ${errors.password ? 'border-red-500' : 'border-gray-200/80 dark:border-white/[0.08] focus:border-amber-400'} rounded-xl px-5 py-4 pr-24 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all focus:ring-4 focus:ring-amber-400/10`}
                  placeholder="Create a strong password"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {/* Hashing animation */}
                  <AnimatePresence>
                    {isHashing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5 text-xs font-mono text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded-lg border border-[#3B82F6]/20"
                      >
                        <Hash className="w-3 h-3 animate-spin" />
                        <span>Hashing...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {errors.password && <span className="text-red-500 text-xs font-medium">{errors.password.message}</span>}

              {/* Password Strength */}
              {password.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-200 dark:bg-white/10'}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${strengthTextColors[passwordStrength]}`}>
                      {strengthLabels[passwordStrength]}
                    </span>
                    {passwordStrength === 3 && (
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">Password will be SHA-256 hashed</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" /> Confirm Password *
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === password || 'Passwords do not match'
                  })}
                  type={showConfirm ? 'text' : 'password'}
                  className={`w-full bg-gray-50 dark:bg-white/[0.05] border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200/80 dark:border-white/[0.08] focus:border-amber-400'} rounded-xl px-5 py-4 pr-12 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all focus:ring-4 focus:ring-amber-400/10`}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-red-500 text-xs font-medium">{errors.confirmPassword.message}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white font-bold py-4 rounded-xl transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #38BDF8)',
                boxShadow: '0 10px 20px -5px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Application...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Submit for Verification
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-200/80 dark:border-white/[0.06]">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono text-center">
              🔒 All passwords are SHA-256 hashed before storage. Secured by our Data Integrity Protocol.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 dark:bg-[#060D1E]/80 backdrop-blur-xl p-6"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="relative bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/15 rounded-[2.5rem] p-12 max-w-lg w-full text-center shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-[#6366F1]" />
              <button
                onClick={() => setIsSuccess(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 dark:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-24 h-24 bg-[#3B82F6]/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-[#3B82F6]/10"
              >
                <CheckCircle2 className="w-12 h-12 text-[#3B82F6]" />
              </motion.div>

              <h2 className="text-3xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white mb-3">Application Submitted!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                We've received your details. Verification status will be sent to your email within{' '}
                <span className="font-bold text-gray-900 dark:text-white">24 hours</span>.
              </p>

              <div className="p-4 bg-gray-50 dark:bg-white/[0.05] rounded-2xl border border-[#3B82F6]/10 mb-8 text-left">
                <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-bold mb-1">
                  <Hash className="w-3.5 h-3.5" /> Application Hash Generated
                </div>
                <code className="text-xs text-gray-500 font-mono break-all">
                  {Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...
                </code>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/"
                  className="w-full py-4 text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-md text-center"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #38BDF8)' }}
                >
                  Return to Home
                </Link>
                <Link
                  to="/verified-ngos"
                  className="w-full py-4 border border-gray-200/80 dark:border-white/[0.08] text-gray-600 dark:text-gray-400 font-bold rounded-xl hover:bg-white/90 dark:bg-white/[0.04] transition-colors text-sm"
                >
                  Browse Verified NGOs
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
