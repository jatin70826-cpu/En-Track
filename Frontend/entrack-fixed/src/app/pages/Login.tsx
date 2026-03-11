import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, ShieldCheck, Lock, ArrowRight, Fingerprint, Activity, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const navigate = useNavigate();
  

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const form = e.target as HTMLFormElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const passwordInput = form.elements.namedItem("password") as HTMLInputElement;

    if (!isLogin) { // Registration
      const nameInput = form.elements.namedItem("name") as HTMLInputElement;

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput.value,
          email: emailInput.value,
          password: passwordInput.value
        })
      });

      const data = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        console.log("User registered with ID:", data.userId);
        localStorage.setItem('userId', data.userId.toString());
        form.reset();
      } else {
        alert(data.error || "Registration failed");
      }
    } else { // Login
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value
        })
      });

      const data = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        console.log("User logged in:", data.userId);
        setLoggedInUserId(data.userId);
        localStorage.setItem('userId', data.userId.toString());
        // TODO: redirect to dashboard / home
        navigate('/donation-dashboard', { state: { userId: data.userId } });
      } else {
        alert(data.error || "Login failed");
      }
    }

  } catch (err) {
    console.log(err);
    alert("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#3B82F6] rounded-full blur-[120px] opacity-10 dark:opacity-[0.05] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-[#38BDF8] rounded-full blur-[120px] opacity-10 dark:opacity-[0.05] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#3B82F6]/6 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="relative">
          {/* Glass Card */}
          <div
            className="relative z-10 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-2xl border border-[#3B82F6]/15 dark:border-white/[0.08] rounded-3xl p-8 md:p-10 overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.9)' }}
          >
            {/* Decorative top border gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-[#6366F1]" />

            {/* Success notification */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-[#3B82F6]/10 border border-[#3B82F6]/25 rounded-2xl flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#3B82F6] shrink-0" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {isLogin ? 'Logged in successfully!' : 'Account created successfully!'}
                </span>
              </motion.div>
            )}

            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3B82F6]/10 to-[#38BDF8]/10 border border-[#3B82F6]/15 mb-6">
                <ShieldCheck className="w-7 h-7 text-[#3B82F6]" />
              </div>
              <h1 className="font-['Clash_Display',sans-serif] font-bold text-3xl text-gray-900 dark:text-white mb-3 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Join En-Track'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {isLogin
                  ? 'Access your donor profile and track your impact.'
                  : 'Create an account to start your secure giving journey.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Aditi Sharma"
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-[#0B0E14]/50 border border-gray-200 dark:border-white/[0.08] rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#3B82F6] dark:focus:border-[#60A5FA] focus:ring-4 focus:ring-[#3B82F6]/10 outline-none transition-all"
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3B82F6] transition-colors">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-[#0B0E14]/50 border border-gray-200 dark:border-white/[0.08] rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#3B82F6] dark:focus:border-[#60A5FA] focus:ring-4 focus:ring-[#3B82F6]/10 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-[#0B0E14]/50 border border-gray-200 dark:border-white/[0.08] rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#3B82F6] dark:focus:border-[#60A5FA] focus:ring-4 focus:ring-[#3B82F6]/10 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3B82F6] dark:hover:text-[#60A5FA] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-[#3B82F6] dark:text-[#60A5FA] font-bold hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full py-4 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #38BDF8)',
                    boxShadow: '0 8px 24px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  <span className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    {isLogin ? 'Secure Login' : 'Create Verified Account'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>

                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 justify-center mt-4 text-[10px] md:text-xs text-gray-400 dark:text-gray-500 font-mono text-center">
                <Lock className="w-3 h-3" />
                Passwords and data are SHA-256 hashed in the backend for maximum security.
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/[0.05] text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-bold text-[#3B82F6] dark:text-[#60A5FA] hover:underline"
                >
                  {isLogin ? 'Register here' : 'Login'}
                </button>
              </p>
            </div>
          </div>

          {/* Floating Security Badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -right-20 top-20 hidden md:flex flex-col gap-3 pointer-events-none"
          >
            <div className="bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md p-3 rounded-xl border border-[#3B82F6]/20 shadow-lg flex items-center gap-3 w-48">
              <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Status</span>
                <span className="text-xs font-bold text-gray-800 dark:text-white">AES-256 Encrypted</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="absolute -left-20 bottom-32 hidden md:flex flex-col gap-3 pointer-events-none"
          >
            <div className="bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md p-3 rounded-xl border border-[#38BDF8]/20 shadow-lg flex items-center gap-3 w-48">
              <div className="w-8 h-8 rounded-full bg-[#38BDF8]/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Security</span>
                <span className="text-xs font-bold text-gray-800 dark:text-white">SHA-256 Hash</span>
              </div>
            </div>
          </motion.div>

          {/* NGO Registration link */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="absolute -left-20 top-20 hidden md:flex flex-col gap-3 pointer-events-none"
          >
            <div className="bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md p-3 rounded-xl border border-[#6366F1]/20 shadow-lg flex items-center gap-3 w-48">
              <div className="w-8 h-8 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#6366F1]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Protocol</span>
                <span className="text-xs font-bold text-gray-800 dark:text-white">Data Integrity</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* NGO Register link below the card */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you an NGO?{' '}
            <Link to="/ngo-registration" className="font-bold text-[#3B82F6] dark:text-[#60A5FA] hover:underline">
              Register your organization →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
