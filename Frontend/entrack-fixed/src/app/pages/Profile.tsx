import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Mail, Calendar, Shield, Bell, Lock, LogOut, Camera,
  ChevronRight, CheckCircle2, Activity, Heart, Hash,
  Moon, Sun, Smartphone, Globe, AlertCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../lib/AuthContext';

/* ─── Animated Toggle Switch ─────────────────────────────────── */
function ToggleSwitch({
  checked,
  onChange,
  color = '#3B82F6',
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative w-12 h-6 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060C1A] transition-colors duration-300 shrink-0"
      style={{ background: checked ? color : 'rgba(255,255,255,0.1)' }}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-2 h-2 rounded-full"
            style={{ background: color }}
          />
        )}
      </motion.div>
    </button>
  );
}

/* ─── Section Card ─────────────────────────────────────────── */
function Card({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-white/90 dark:bg-white/[0.04] border border-[#3B82F6]/10 rounded-[1.5rem] p-6 md:p-8 ${className}`}
      style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stat Tile ─────────────────────────────────────────────── */
function StatTile({ icon, label, value, color, delay }: { icon: React.ReactNode; label: string; value: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 24 }}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-gray-100 dark:border-white/5 hover:border-[#3B82F6]/30 hover:bg-[#3B82F6]/5 transition-all group"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
        style={{ background: `${color}18`, boxShadow: `0 0 12px ${color}30` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white font-['Clash_Display',sans-serif]">{value}</span>
      <span className="text-xs text-gray-500 text-center">{label}</span>
    </motion.div>
  );
}

/* ─── Main Profile Page ───────────────────────────────────────── */
export function Profile() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  /* ─── Notification toggles */
  const [notifications, setNotifications] = useState({
    donationAlerts: true,
    weeklyReport: true,
    ngoUpdates: false,
    securityAlerts: true,
    mobileNotifs: false,
    marketingEmails: false,
  });

  /* ─── Edit name UI state */
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous User'
  );
  const [nameInput, setNameInput] = useState(displayName);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggle = (key: keyof typeof notifications) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  const saveName = () => {
    if (nameInput.trim()) {
      setDisplayName(nameInput.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
    setEditingName(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  /* ─── Not logged in */
  if (!loading && !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-20 h-20 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center"
        >
          <Lock className="w-9 h-9 text-[#3B82F6]" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white mb-3">Profile is Private</h2>
          <p className="text-gray-500 max-w-sm">Please log in to view and manage your profile.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Link
            to="/login"
            className="px-8 py-3 rounded-xl text-white font-bold inline-block"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #38BDF8)', boxShadow: '0 8px 24px rgba(59,130,246,0.35)' }}
          >
            Login to Continue
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase();

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : 'Recently';

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-8">

      {/* ─── Header ────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-bold font-['Clash_Display',sans-serif] text-gray-900 dark:text-white mb-1">
          My Profile
        </h1>
        <p className="text-gray-500 text-sm">Manage your account, preferences, and notification settings.</p>
      </motion.div>

      {/* ─── Success toast ───────────────────────────────────── */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Profile updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Avatar + Identity Card ─────────────────────────── */}
      <Card delay={0.05}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
          {/* Avatar */}
          <div className="relative shrink-0 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center text-white font-bold text-3xl md:text-4xl select-none"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                boxShadow: '0 0 40px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                fontFamily: "'Clash Display', sans-serif",
              }}
            >
              {initials}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#3B82F6] border-2 border-[#060C1A] flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              title="Change avatar"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </motion.button>

            {/* Online dot */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#060C1A] animate-pulse" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            {/* Name */}
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
              {editingName ? (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  className="flex items-center gap-2"
                >
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                    className="bg-white/90 dark:bg-white/5 border border-[#3B82F6]/40 rounded-xl px-4 py-2 text-gray-900 dark:text-white text-xl font-bold outline-none focus:border-[#3B82F6] transition-colors w-56"
                  />
                  <button onClick={saveName} className="px-3 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-bold hover:bg-[#2563EB] transition-colors">Save</button>
                  <button onClick={() => { setEditingName(false); setNameInput(displayName); }} className="px-3 py-2 rounded-lg bg-white/90 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white transition-colors">Cancel</button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-['Clash_Display',sans-serif] truncate">{displayName}</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditingName(true)}
                    className="p-1.5 rounded-lg bg-white/90 dark:bg-white/5 hover:bg-[#3B82F6]/20 text-gray-500 hover:text-[#3B82F6] transition-all"
                    title="Edit name"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </motion.button>
                </>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
              <Mail className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-bold">
                <Shield className="w-3 h-3" /> Verified Donor
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-xs">
                <Calendar className="w-3 h-3" /> Member since {memberSince}
              </span>
            </div>
          </div>

          {/* Sign out */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSignOut}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </motion.button>
        </div>
      </Card>

      {/* ─── Stats row ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <StatTile icon={<Heart className="w-5 h-5" />} label="Total Donated" value="₹14,500" color="#3B82F6" delay={0.1} />
        <StatTile icon={<Activity className="w-5 h-5" />} label="Transactions" value="23" color="#38BDF8" delay={0.15} />
        <StatTile icon={<Shield className="w-5 h-5" />} label="NGOs Supported" value="7" color="#6366F1" delay={0.2} />
        <StatTile icon={<Hash className="w-5 h-5" />} label="Hashes Verified" value="23" color="#10B981" delay={0.25} />
      </div>

      {/* ─── Account Info ────────────────────────────────────── */}
      <Card delay={0.2}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-['Clash_Display',sans-serif] mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-[#3B82F6]" /> Account Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', value: displayName, icon: <User className="w-4 h-4" /> },
            { label: 'Email Address', value: user?.email || '—', icon: <Mail className="w-4 h-4" /> },
            { label: 'User ID', value: user?.id?.slice(0, 16) + '…', icon: <Hash className="w-4 h-4" /> },
            { label: 'Member Since', value: memberSince, icon: <Calendar className="w-4 h-4" /> },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-gray-100 dark:border-white/5 hover:border-[#3B82F6]/20 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── Notification Preferences ────────────────────────── */}
      <Card delay={0.3}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-['Clash_Display',sans-serif] mb-2 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#3B82F6]" /> Notification Preferences
        </h3>
        <p className="text-sm text-gray-500 mb-6">Choose what updates you want to receive.</p>

        <div className="space-y-1">
          {([
            {
              key: 'donationAlerts',
              label: 'Donation Confirmations',
              desc: 'Get notified when your donation is processed and verified.',
              icon: <CheckCircle2 className="w-4 h-4" />,
              color: '#3B82F6',
            },
            {
              key: 'weeklyReport',
              label: 'Weekly Impact Report',
              desc: 'Receive a summary of your contributions and their impact.',
              icon: <Activity className="w-4 h-4" />,
              color: '#38BDF8',
            },
            {
              key: 'ngoUpdates',
              label: 'NGO Activity Updates',
              desc: 'Stay informed about the NGOs you support.',
              icon: <Globe className="w-4 h-4" />,
              color: '#6366F1',
            },
            {
              key: 'securityAlerts',
              label: 'Security Alerts',
              desc: 'Get alerts for new sign-ins and suspicious activity.',
              icon: <Shield className="w-4 h-4" />,
              color: '#10B981',
            },
            {
              key: 'mobileNotifs',
              label: 'Mobile Push Notifications',
              desc: 'Real-time alerts on your mobile device.',
              icon: <Smartphone className="w-4 h-4" />,
              color: '#F59E0B',
            },
            {
              key: 'marketingEmails',
              label: 'Promotional Emails',
              desc: 'Campaigns, events, and fundraising updates.',
              icon: <Mail className="w-4 h-4" />,
              color: '#EC4899',
            },
          ] as const).map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-colors group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                style={{ background: `${item.color}15`, color: item.color }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{item.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
              <ToggleSwitch
                checked={notifications[item.key]}
                onChange={() => toggle(item.key)}
                color={item.color}
              />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── Security ──────────────────────────────────────────── */}
      <Card delay={0.4}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-['Clash_Display',sans-serif] mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#3B82F6]" /> Security
        </h3>
        <div className="space-y-3">
          {[
            {
              icon: <Lock className="w-4 h-4" />,
              label: 'Change Password',
              desc: 'Update your account password.',
              color: '#3B82F6',
              action: () => {},
            },
            {
              icon: <Shield className="w-4 h-4" />,
              label: 'Two-Factor Authentication',
              desc: 'Add an extra layer of security.',
              color: '#10B981',
              action: () => {},
            },
            {
              icon: <AlertCircle className="w-4 h-4" />,
              label: 'Delete Account',
              desc: 'Permanently remove your account and data.',
              color: '#EF4444',
              action: () => {},
            },
          ].map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.06 }}
              whileHover={{ x: 4 }}
              onClick={item.action}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:border-white/10 text-left transition-all group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                style={{ background: `${item.color}15`, color: item.color }}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
            </motion.button>
          ))}
        </div>
      </Card>

      {/* ─── Theme Preference ─────────────────────────────────── */}
      <Card delay={0.5}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-['Clash_Display',sans-serif] mb-6 flex items-center gap-2">
          <Sun className="w-5 h-5 text-[#3B82F6]" /> Appearance
        </h3>
        <ThemeSelector />
      </Card>

    </div>
  );
}

/* ─── Theme Selector (light / dark tiles) ─────────────────────── */
function ThemeSelector() {
  const [selected, setSelected] = useState<'dark' | 'light'>('dark');

  return (
    <div className="grid grid-cols-2 gap-4">
      {(['dark', 'light'] as const).map((mode) => (
        <motion.button
          key={mode}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelected(mode)}
          className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
            selected === mode
              ? 'border-[#3B82F6] bg-[#3B82F6]/10'
              : 'border-gray-200 dark:border-white/10 bg-white/[0.02] hover:border-gray-300 dark:border-white/20'
          }`}
        >
          {/* Preview swatch */}
          <div
            className="w-full h-16 rounded-xl mb-4 overflow-hidden flex items-center justify-center gap-2"
            style={{ background: mode === 'dark' ? '#060C1A' : '#F0F4FF' }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: mode === 'dark' ? '#3B82F6' : '#2563EB' }} />
            <div className="w-8 h-1.5 rounded" style={{ background: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
            <div className="w-4 h-1.5 rounded" style={{ background: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{mode} Mode</p>
              <p className="text-xs text-gray-500 mt-0.5">{mode === 'dark' ? 'Easier on the eyes at night' : 'High contrast for daylight'}</p>
            </div>
            {mode === 'dark' ? <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </div>

          {selected === mode && (
            <motion.div
              layoutId="theme-check"
              className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center"
            >
              <CheckCircle2 className="w-3 h-3 text-gray-900 dark:text-white" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
