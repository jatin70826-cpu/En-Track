// Generic physical item donation page (Stationery, Clothes, Electronics)
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Shirt, Smartphone, ArrowLeft, ArrowRight, CheckCircle2, Loader2, MapPin, Package } from 'lucide-react';
import { Link, useParams } from 'react-router';
import API from "../../api/api";

type DonationType = 'stationery' | 'clothes' | 'electronics';

const TYPE_CONFIG: Record<DonationType, {
  icon: React.ReactNode;
  title: string;
  color: string;
  glow: string;
  tag: string;
  fields: { label: string; key: string; type: string; placeholder: string; options?: string[] }[];
}> = {
  stationery: {
    icon: <BookOpen className="w-7 h-7" />,
    title: 'Old Stationery Donation',
    color: '#D97706',
    glow: 'rgba(217,119,6,0.4)',
    tag: 'High Demand',
    fields: [
      { label: 'Items (books, notebooks, pens…)', key: 'items', type: 'text', placeholder: 'e.g. 10 textbooks, 5 notebooks, 20 pens' },
      { label: 'Approximate Quantity', key: 'quantity', type: 'number', placeholder: 'e.g. 35' },
      { label: 'Condition', key: 'condition', type: 'select', placeholder: '', options: ['Good', 'Very Good', 'Like New'] },
      { label: 'Preferred NGO / School (optional)', key: 'target', type: 'text', placeholder: 'Leave blank for auto-match' },
    ],
  },
  clothes: {
    icon: <Shirt className="w-7 h-7" />,
    title: 'Clothes Donation',
    color: '#059669',
    glow: 'rgba(5,150,105,0.4)',
    tag: 'Always Needed',
    fields: [
      { label: 'Clothing Type', key: 'clothType', type: 'select', placeholder: '', options: ['School Uniform', 'Household Clothes', 'Both'] },
      { label: 'Approximate Items', key: 'quantity', type: 'number', placeholder: 'e.g. 15' },
      { label: 'Size Range', key: 'size', type: 'text', placeholder: 'e.g. Kids S-M, Adults M-L' },
      { label: 'Condition', key: 'condition', type: 'select', placeholder: '', options: ['Good', 'Very Good', 'Like New'] },
    ],
  },
  electronics: {
    icon: <Smartphone className="w-7 h-7" />,
    title: 'Old Electronics Donation',
    color: '#7C3AED',
    glow: 'rgba(124,58,237,0.4)',
    tag: 'New Category',
    fields: [
      { label: 'Device Type', key: 'device', type: 'select', placeholder: '', options: ['Smartphone', 'Laptop', 'Tablet', 'Desktop', 'Other'] },
      { label: 'Brand / Model', key: 'model', type: 'text', placeholder: 'e.g. Samsung Galaxy A10' },
      { label: 'Condition', key: 'condition', type: 'select', placeholder: '', options: ['Working', 'Minor Issues', 'Needs Repair'] },
      { label: 'Still Working?', key: 'working', type: 'select', placeholder: '', options: ['Yes — fully functional', 'Partially working', 'No — needs repair'] },
    ],
  },
};

function generateRequestId(prefix: string) {
  return prefix + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}
export function DonatePhysical() {
  const { type } = useParams<{ type: DonationType }>();
  const cfg = TYPE_CONFIG[type as DonationType] || TYPE_CONFIG.stationery;

  const [form, setForm] = useState<Record<string, string>>({});
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ id: string } | null>(null);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const prefix = { stationery: 'STN', clothes: 'CLT', electronics: 'ELC' }[type as DonationType] || 'PHY';

const handleSubmit = async () => {
  console.log("Submit Clicked");
  if (!address || !phone) return;
  setIsLoading(true);
  try {
    const donationType = type?.toLowerCase();
    if (type === "stationery") {
      await API.post("/stationary-donation", {
        items: form.items,
        quantity: form.quantity,
        condition_type: form.condition,
        preferred_school: form.target,
        pickup_address: address,
        name: name,
        contact: phone
      });
    }
    else if (donationType === "clothes") {
      await API.post("/clothes-donation", {
        clothing_type: form.clothType,
        approx_items: form.quantity,
        size_range: form.size,
        condition_type: form.condition,
        pickup_address: address,
        name: name,
        contact: phone
      });
    }
    else if (donationType === "electronics") {
      await API.post("/electronics-donation", {
        device_type: form.device,
        brand_model: form.model,
        condition_type: form.condition,
        working_status: form.working,
        pickup_address: address,
        name: name,
        contact: phone
      });
    }
    setResult({ id: generateRequestId(prefix) });
  } catch (error) {
    console.log(error);
    alert('Donation Request Failed!');
  }
  setIsLoading(false);
};

  const canSubmit = address && phone;

  return (
    <div className="min-h-screen pb-24 px-6 pt-12">
      <div className="max-w-2xl mx-auto">
        <Link to="/donate" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to donation types
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
              style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`, boxShadow: `0 8px 24px ${cfg.glow}` }}>
              {cfg.icon}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: cfg.color }}>{cfg.tag}</div>
              <h1 className="font-['Syne',sans-serif] font-extrabold text-3xl text-gray-900 dark:text-white">{cfg.title}</h1>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass rounded-2xl p-8 space-y-6">
                {/* Type-specific fields */}
                {cfg.fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{f.label}</label>
                    {f.type === 'select' ? (
                      <select value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl text-sm text-gray-900 dark:text-white outline-none bg-white dark:bg-[#0a1628] border border-gray-200/80 dark:border-white/[0.08] transition-colors">
                        <option value="" className="bg-white dark:bg-[#0a1628] text-gray-500 dark:text-gray-400">Select…</option>
                        {f.options?.map(o => <option key={o} value={o} className="bg-white dark:bg-[#0a1628] text-gray-900 dark:text-white">{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3.5 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none bg-white/90 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08]" />
                    )}
                  </div>
                ))}

                {/* Divider */}
                <div className="border-t border-gray-200/60 dark:border-white/8 pt-2">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Pickup Details</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" style={{ color: cfg.color }} />
                    Pickup Address <span style={{ color: cfg.color }}>*</span>
                  </label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)}
                    placeholder="Full address for item pickup..."
                    rows={3} className="w-full px-4 py-3.5 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none resize-none bg-white/90 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Name (optional)"
                      className="w-full px-4 py-3.5 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none bg-white/90 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Contact <span style={{ color: cfg.color }}>*</span></label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3.5 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none bg-white/90 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08]" />
                  </div>
                </div>
              </div>

              <button onClick={handleSubmit} // disabled={!canSubmit || isLoading}
                className="mt-6 w-full py-5 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-3 transition-all" // disabled:opacity-40
                style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`, boxShadow: `0 8px 28px ${cfg.glow}` }}>
                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>Submit Donation Request <ArrowRight className="w-5 h-5" /></>}
              </button>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="glass rounded-2xl p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}aa)` }} />
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: `${cfg.color}1a`, boxShadow: `0 0 30px ${cfg.glow}, 0 0 0 12px ${cfg.color}0d` }}>
                  <CheckCircle2 className="w-10 h-10" style={{ color: cfg.color }} />
                </motion.div>
                <h2 className="font-['Syne',sans-serif] font-extrabold text-2xl text-gray-900 dark:text-white mb-2">Request Submitted!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Our team will contact you at <strong className="text-white">{phone}</strong> to coordinate pickup.</p>
                <div className="rounded-xl p-5 text-left space-y-3 mb-6" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Request ID</span><span className="font-mono text-white font-bold text-sm">{result.id}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Status</span><span className="text-green-400 font-bold text-sm">⏳ Awaiting Pickup</span></div>
                </div>
                <div className="flex flex-col gap-3">
                  <Link to="/track" className="py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`, boxShadow: `0 4px 16px ${cfg.glow}` }}>
                    <Package className="w-5 h-5" /> Track My Donation
                  </Link>
                  <Link to="/donate" className="py-4 rounded-2xl font-bold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-white/90 dark:bg-white/5 transition-colors text-sm flex items-center justify-center">
                    Back to Donate
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
