import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, ArrowLeft, ArrowRight, CheckCircle2, Loader2, Shield, MapPin, Phone, User, Search, ChevronDown, X, Building2 } from 'lucide-react';
import { Link } from 'react-router';
import { State, City } from 'country-state-city';
import API from "../../api/api";

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function generateRequestId() {
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(4)), b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return 'BLD-' + hex;
}

// Mock blood bank data
function generateBloodBanks(city: string, bloodGroup: string) {
  const banks = [
    { name: `${city} Central Blood Bank`, address: `Near District Hospital, ${city}`, distance: '1.2 km', phone: '+91 98765 43210', availability: 'High' },
    { name: `Red Cross Blood Centre`, address: `MG Road, ${city}`, distance: '2.8 km', phone: '+91 98765 43211', availability: 'Medium' },
    { name: `${city} Medical College Blood Bank`, address: `Medical College Campus, ${city}`, distance: '4.5 km', phone: '+91 98765 43212', availability: 'High' },
  ];
  return banks.map(b => ({ ...b, bloodGroup }));
}

// Searchable City Dropdown
function CitySearch({ cities, value, onChange, disabled }: {
  cities: string[];
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const lowerQuery = query.toLowerCase();
  const filtered = useMemo(() =>
    query.length < 1 ? cities.slice(0, 50) :
    cities.filter(c => c.toLowerCase().includes(lowerQuery)).slice(0, 50),
    [query, cities, lowerQuery]
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setQuery(value); }, [value]);

  const handleSelect = (city: string) => {
    onChange(city);
    setQuery(city);
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); if (!e.target.value) onChange(''); }}
          onFocus={() => setOpen(true)}
          placeholder={disabled ? 'Select a state first' : 'Search city...'}
          disabled={disabled}
          className="w-full pl-9 pr-9 py-3.5 rounded-xl text-sm outline-none transition-all bg-white/90 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-red-500/50 dark:focus:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {query && !disabled && (
          <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
        {!query && !disabled && (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        )}
      </div>
      <AnimatePresence>
        {open && !disabled && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl bg-white dark:bg-[#0a1628] border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-blue-900/20"
          >
            {filtered.map(city => (
              <button
                key={city}
                onMouseDown={e => { e.preventDefault(); handleSelect(city); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  city === value
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {city}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DonateBlood() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedState, setSelectedState] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', bloodGroup: '',state: '', city: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ id: string } | null>(null);
  const [bloodBanks, setBloodBanks] = useState<ReturnType<typeof generateBloodBanks>>([]);

  const indianStates = useMemo(() => State.getStatesOfCountry('IN'), []);
  const cities = useMemo(() => {
    if (!selectedState) return [];
    return City.getCitiesOfState('IN', selectedState).map(c => c.name);
  }, [selectedState]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const canProceed = form.bloodGroup && selectedState && form.city && form.phone;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await API.post("/blood-donation", {
        name: form.name,
        contact: form.phone,
        blood_group: form.bloodGroup,
        state: form.state,
        city: form.city,
        message: form.message
    });
    } catch (error) {
      console.log(error);
    }
    await new Promise(r => setTimeout(r, 2200));
    const id = generateRequestId();
    setResult({ id });
    setBloodBanks(generateBloodBanks(form.city, form.bloodGroup));
    setIsLoading(false);
    setStep(2);
  };

  const stateName = indianStates.find(s => s.isoCode === selectedState)?.name || '';

  return (
    <div className="min-h-screen pb-24 px-6 pt-12">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link to="/donate" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to donation types
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)', boxShadow: '0 8px 24px rgba(220,38,38,0.4)' }}>
              <Droplets className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-red-500 dark:text-red-400 mb-1">Critical Need</div>
              <h1 className="font-['Syne',sans-serif] font-extrabold text-3xl text-gray-900 dark:text-white">Blood Donation</h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Register as a blood donor and get matched with patients and blood banks near you.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Form card */}
              <div className="rounded-2xl p-8 space-y-6 glass">

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Blood Group <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {BLOOD_GROUPS.map(bg => (
                      <button key={bg} onClick={() => set('bloodGroup', bg)}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                          form.bloodGroup === bg
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400 shadow-[0_0_16px_rgba(220,38,38,0.2)]'
                            : 'bg-gray-100 dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-gray-400 hover:border-red-300 dark:hover:border-red-800'
                        }`}>
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* State Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <MapPin aria-hidden="true" className="inline w-4 h-4 mr-1 text-red-500 dark:text-red-400" /> State <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedState}
                      onChange={e => {
                        setSelectedState(e.target.value);
                        set('city', '');
                      }}
                      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all appearance-none bg-white dark:bg-[#0a1628] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-red-500/50"
                    >
            <option value="" className="bg-white dark:bg-[#0a1628] text-gray-500">Select your state</option>
                      {indianStates.map(s => (
                        <option key={s.isoCode} value={s.isoCode} className="bg-white dark:bg-[#0a1628] text-gray-900 dark:text-white">{s.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* City Searchable Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <Search aria-hidden="true" className="inline w-4 h-4 mr-1 text-red-500 dark:text-red-400" /> City <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <CitySearch
                    cities={cities}
                    value={form.city}
                    onChange={v => set('city', v)}
                    disabled={!selectedState}
                  />
                  {selectedState && cities.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">No cities found for this state.</p>
                  )}
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <User className="inline w-4 h-4 mr-1 text-blue-500 dark:text-blue-400" /> Your Name
                    </label>
                    <input value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="Donor name (optional)"
                      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all bg-white/90 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-blue-500/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="inline w-4 h-4 mr-1 text-blue-500 dark:text-blue-400" /> Contact <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all bg-white/90 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-blue-500/50" />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message (optional)</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)}
                    placeholder="Any additional information for the blood bank or recipient..."
                    rows={3}
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none resize-none transition-all bg-white/90 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-blue-500/50" />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit} disabled={!canProceed || isLoading}
                className="mt-6 w-full py-5 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)', boxShadow: '0 8px 28px rgba(220,38,38,0.35)' }}
              >
                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>Find Nearby Blood Banks <ArrowRight className="w-5 h-5" /></>}
              </button>
            </motion.div>
          )}

          {step === 2 && result && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              {/* Registration Card */}
              <div className="relative rounded-2xl p-8 text-center glass overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #DC2626, #EF4444)' }} />
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'rgba(220,38,38,0.15)', boxShadow: '0 0 30px rgba(220,38,38,0.25), 0 0 0 12px rgba(220,38,38,0.08)' }}>
                  <CheckCircle2 className="w-10 h-10 text-red-500 dark:text-red-400" />
                </motion.div>
                <h2 className="font-['Syne',sans-serif] font-extrabold text-2xl text-gray-900 dark:text-white mb-2">Registered Successfully!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Blood group <strong className="text-red-500 dark:text-red-400">{form.bloodGroup}</strong> • {form.city}, {stateName}
                </p>
                <div className="rounded-xl p-5 text-left space-y-3 mb-4 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/[0.06]">
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Request ID</span><span className="font-mono text-gray-900 dark:text-white font-bold text-sm">{result.id}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Status</span><span className="text-red-500 dark:text-red-400 font-bold text-sm">Active — Matching...</span></div>
                </div>
              </div>

              {/* Nearby Blood Banks */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-red-500 dark:text-red-400" />
                  <h3 className="font-['Syne',sans-serif] font-bold text-lg text-gray-900 dark:text-white">Nearby Blood Banks in {form.city}</h3>
                </div>
                <div className="space-y-4">
                  {bloodBanks.map((bank, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="rounded-2xl p-6 glass"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{bank.name}</h4>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{bank.address}
                          </p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bank.availability === 'High' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                          {bank.availability} Stock
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1"><Shield className="w-3 h-3 text-blue-500 dark:text-blue-400" />{bank.distance} away</span>
                        <span className="text-red-500 dark:text-red-400 font-bold">{bank.bloodGroup} Available</span>
                        <a href={`tel:${bank.phone}`} className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
                          <Phone className="w-3 h-3" />{bank.phone}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Link to="/track" className="py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)', boxShadow: '0 4px 16px rgba(220,38,38,0.3)' }}>
                  Track Request <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/donate" className="py-4 rounded-2xl font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm flex items-center justify-center">
                  Back to Donate
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
