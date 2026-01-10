'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, query, onSnapshot, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { 
  Trash2, Plus, Loader, Calendar, Clock, Users, LogOut, 
  Activity, Layers, Settings, DollarSign, ShoppingBag, Megaphone, 
  Info, CheckCircle, User, Users as UsersIcon, Infinity 
} from 'lucide-react';

// --- TYPES ---
interface TrainingSlot {
  id: string;
  date: string;
  startTime: string;
  packageName: string;
  price: number;
  capacity: number;
  bookedCount: number;
  status: 'available' | 'sold_out' | 'pending';
}

interface PackageTier {
  id: string;
  name: string;
  price: number;
  price5: number;
  price10: number;
  peopleCount: number;
  maxQuantity: number;
  order: number;
}

interface EventCamp {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  bookedCount: number;
  status: 'active' | 'full' | 'ended';
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  
  // --- TABS STATE ---
  const [activeTab, setActiveTab] = useState<'schedule' | 'packages' | 'events'>('schedule');

  // --- DATA STATE ---
  const [slots, setSlots] = useState<TrainingSlot[]>([]);
  const [packages, setPackages] = useState<PackageTier[]>([]);
  const [events, setEvents] = useState<EventCamp[]>([]); 
  const [slotsLoading, setSlotsLoading] = useState(true);

  // --- FORMS STATE ---
  const [slotForm, setSlotForm] = useState({
    date: '',
    startTime: '',
    packageName: '', 
    price: 0,
    capacity: 10,
  });

  // Package Form (Enhanced for UX)
  const [pkgForm, setPkgForm] = useState({
    name: '',
    price: 0,
    price5: 0,
    price10: 0,
    peopleCount: 1,
    maxQuantity: 0,
  });
  // UX State helpers for toggles
  const [isLimited, setIsLimited] = useState(false);
  const [isGroup, setIsGroup] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    price: 0,
    capacity: 20
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // --- FETCHERS ---
  const fetchSlots = () => {
    const q = query(collection(db, "training_slots"), orderBy("date"));
    onSnapshot(q, (snap) => {
        setSlots(snap.docs.map(d => ({ id: d.id, ...d.data() } as TrainingSlot)));
        setSlotsLoading(false);
    });
  };

  const fetchPackages = () => {
    const q = query(collection(db, "packages"), orderBy("order"));
    onSnapshot(q, (snap) => {
        const pkgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as PackageTier));
        setPackages(pkgs);
        if (pkgs.length > 0 && !slotForm.packageName) {
            setSlotForm(prev => ({ ...prev, packageName: pkgs[0].name, price: pkgs[0].price }));
        }
    });
  };

  const fetchEvents = () => {
    const q = query(collection(db, "events"), orderBy("startDate"));
    onSnapshot(q, (snap) => {
        setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() } as EventCamp)));
    });
  };

  // --- AUTH ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (user && user.email === adminEmail) {
        setAuthorized(true);
        fetchSlots();
        fetchPackages();
        fetchEvents();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // --- HANDLERS ---
  const handleSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "training_slots"), {
        ...slotForm,
        price: Number(slotForm.price),
        capacity: Number(slotForm.capacity),
        bookedCount: 0,
        status: 'available',
        createdAt: new Date().toISOString()
      });
      setSuccessMsg('Session Deployed');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { console.error(err); alert("Error creating slot"); }
    setIsSubmitting(false);
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "packages"), {
        name: pkgForm.name,
        price: Number(pkgForm.price),
        price5: Number(pkgForm.price5),
        price10: Number(pkgForm.price10),
        peopleCount: isGroup ? Number(pkgForm.peopleCount) : 1,
        maxQuantity: isLimited ? Number(pkgForm.maxQuantity) : 0,
        order: packages.length + 1
      });
      // Reset
      setPkgForm({ name: '', price: 0, price5: 0, price10: 0, peopleCount: 1, maxQuantity: 0 }); 
      setIsGroup(false);
      setIsLimited(false);
      
      setSuccessMsg('Package Created');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { console.error(err); alert("Error creating package"); }
    setIsSubmitting(false);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "events"), {
        ...eventForm,
        price: Number(eventForm.price),
        capacity: Number(eventForm.capacity),
        bookedCount: 0,
        status: 'active',
        createdAt: new Date().toISOString()
      });
      setEventForm({ title: '', description: '', startDate: '', endDate: '', price: 0, capacity: 20 });
      setSuccessMsg('Camp Announced');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { console.error(err); alert("Error posting event"); }
    setIsSubmitting(false);
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (confirm("Permanently delete this item?")) {
        await deleteDoc(doc(db, collectionName, id));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center"><Loader className="animate-spin" /></div>;
  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-12 px-6 md:px-12 font-sans selection:bg-[#D52B1E] selection:text-white">
      
      {/* HEADER & TABS */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Command <span className="text-[#D52B1E]">Center</span></h1>
          
          <div className="flex gap-4 mt-6">
            <button 
                onClick={() => setActiveTab('schedule')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'schedule' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
            >
                <Calendar size={14} /> Schedule
            </button>
            <button 
                onClick={() => setActiveTab('packages')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'packages' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
            >
                <Layers size={14} /> Packages
            </button>
            <button 
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-[#D52B1E] text-white' : 'text-gray-500 hover:text-white'}`}
            >
                <Megaphone size={14} /> Camps
            </button>
          </div>
        </div>
        
        <button onClick={handleLogout} className="text-gray-500 hover:text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <LogOut size={14} /> Abort Session
        </button>
      </header>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto">
        
        {/* ========================== */}
        {/* TAB 1: SCHEDULE MANAGEMENT */}
        {/* ========================== */}
        {activeTab === 'schedule' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                    <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                        <h2 className="text-xl font-bold uppercase tracking-wide mb-6 flex items-center gap-2">
                            <Plus className="text-[#D52B1E]" size={20} /> Deploy Session
                        </h2>
                        <form onSubmit={handleSlotSubmit} className="space-y-4">
                            {/* Standard Form... (No changes to logic here) */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-gray-500 font-bold">Package Type</label>
                                <select 
                                    className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs uppercase"
                                    value={slotForm.packageName}
                                    onChange={(e) => {
                                        const pkg = packages.find(p => p.name === e.target.value);
                                        setSlotForm({ ...slotForm, packageName: e.target.value, price: pkg ? pkg.price : 0 });
                                    }}
                                >
                                    {packages.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase text-gray-500 font-bold">Date</label>
                                    <input type="date" required className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs" value={slotForm.date} onChange={e => setSlotForm({...slotForm, date: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-gray-500 font-bold">Time</label>
                                    <input type="time" required className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs" value={slotForm.startTime} onChange={e => setSlotForm({...slotForm, startTime: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase text-gray-500 font-bold">Price ($)</label>
                                    <input type="number" required className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs" value={slotForm.price} onChange={e => setSlotForm({...slotForm, price: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-gray-500 font-bold">Capacity</label>
                                    <input type="number" required className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs" value={slotForm.capacity} onChange={e => setSlotForm({...slotForm, capacity: Number(e.target.value)})} />
                                </div>
                            </div>
                            <button disabled={isSubmitting} className="w-full bg-white text-black py-3 font-bold uppercase text-xs hover:bg-[#D52B1E] hover:text-white transition-colors">
                                {isSubmitting ? 'Deploying...' : 'Deploy'}
                            </button>
                            {successMsg && <p className="text-green-500 text-xs text-center">{successMsg}</p>}
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white/5 border border-white/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Date</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Package</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Booked</th>
                                    <th className="p-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {slots.map(s => (
                                    <tr key={s.id} className="hover:bg-white/5">
                                        <td className="p-4">{s.date} @ {s.startTime}</td>
                                        <td className="p-4 uppercase">{s.packageName}</td>
                                        <td className="p-4">{s.bookedCount} / {s.capacity}</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleDelete('training_slots', s.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* ======================================= */}
        {/* TAB 2: PACKAGE CONFIGURATOR (REDESIGNED) */}
        {/* ======================================= */}
        {activeTab === 'packages' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* CREATE PACKAGE FORM */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-sm relative">
                        <h2 className="text-xl font-bold uppercase tracking-wide mb-6 flex items-center gap-2">
                            <Settings className="text-[#0039A6]" size={20} /> Configure Package
                        </h2>
                        
                        <form onSubmit={handlePackageSubmit} className="space-y-6">
                            
                            {/* --- SECTION 1: IDENTITY --- */}
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-gray-500 font-bold flex justify-between">
                                        <span>Display Name</span>
                                        <Info size={10} className="text-gray-600" />
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. ELITE 1-ON-1"
                                        required 
                                        className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs uppercase focus:border-[#0039A6] outline-none transition-colors"
                                        value={pkgForm.name}
                                        onChange={e => setPkgForm({...pkgForm, name: e.target.value})}
                                    />
                                    <p className="text-[9px] text-gray-600">This name will appear on the Booking Page cards.</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-gray-500 font-bold">Session Format</label>
                                    <div className="flex bg-black/50 border border-white/20 p-1 rounded-md">
                                        <button
                                            type="button"
                                            onClick={() => setIsGroup(false)}
                                            className={`flex-1 py-2 flex items-center justify-center gap-2 text-[10px] uppercase font-bold transition-all ${!isGroup ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            <User size={12} /> Private (1)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsGroup(true)}
                                            className={`flex-1 py-2 flex items-center justify-center gap-2 text-[10px] uppercase font-bold transition-all ${isGroup ? 'bg-[#0039A6] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            <UsersIcon size={12} /> Group
                                        </button>
                                    </div>
                                    
                                    {/* Conditional Input for Group Size */}
                                    {isGroup && (
                                        <div className="pt-2 animate-in fade-in slide-in-from-top-1">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="number" 
                                                    min="2" 
                                                    className="w-20 bg-black/50 border border-[#0039A6] p-2 text-white text-xs font-mono text-center"
                                                    value={pkgForm.peopleCount}
                                                    onChange={e => setPkgForm({...pkgForm, peopleCount: Number(e.target.value)})}
                                                />
                                                <span className="text-[10px] text-[#0039A6] font-bold uppercase">People per booking</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            {/* --- SECTION 2: FINANCIALS --- */}
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-[#D52B1E] font-bold">Base Price (1 Session)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 text-[#D52B1E] w-3 h-3" />
                                        <input 
                                            type="number" 
                                            required 
                                            className="w-full bg-black/50 border border-[#D52B1E]/30 p-3 pl-8 text-white text-xs font-mono focus:border-[#D52B1E] outline-none"
                                            value={pkgForm.price}
                                            onChange={e => setPkgForm({...pkgForm, price: Number(e.target.value)})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-gray-500 font-bold">5-Pack Deal ($)</label>
                                        <input 
                                            type="number" 
                                            className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs font-mono placeholder:text-gray-700"
                                            placeholder="0 = None"
                                            value={pkgForm.price5 || ''}
                                            onChange={e => setPkgForm({...pkgForm, price5: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-gray-500 font-bold">10-Pack Deal ($)</label>
                                        <input 
                                            type="number" 
                                            className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs font-mono placeholder:text-gray-700"
                                            placeholder="0 = None"
                                            value={pkgForm.price10 || ''}
                                            onChange={e => setPkgForm({...pkgForm, price10: Number(e.target.value)})}
                                        />
                                    </div>
                                </div>
                                <p className="text-[9px] text-gray-600 italic">Leave bundle prices as 0 to disable multi-pack options.</p>
                            </div>

                            <hr className="border-white/10" />

                            {/* --- SECTION 3: INVENTORY --- */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-gray-500 font-bold">Availability Limit</label>
                                <div className="flex bg-black/50 border border-white/20 p-1 rounded-md mb-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsLimited(false)}
                                        className={`flex-1 py-2 flex items-center justify-center gap-2 text-[10px] uppercase font-bold transition-all ${!isLimited ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <Infinity size={12} /> Unlimited
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsLimited(true)}
                                        className={`flex-1 py-2 flex items-center justify-center gap-2 text-[10px] uppercase font-bold transition-all ${isLimited ? 'bg-[#D52B1E] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <ShoppingBag size={12} /> Capped
                                    </button>
                                </div>
                                {isLimited && (
                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                        <span className="text-[10px] text-[#D52B1E] font-bold uppercase">Max Sales:</span>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            className="w-20 bg-black/50 border border-[#D52B1E] p-2 text-white text-xs font-mono text-center"
                                            value={pkgForm.maxQuantity}
                                            onChange={e => setPkgForm({...pkgForm, maxQuantity: Number(e.target.value)})}
                                        />
                                    </div>
                                )}
                            </div>

                            <button disabled={isSubmitting} className="w-full bg-white text-black py-4 font-bold uppercase text-xs tracking-widest hover:bg-[#0039A6] hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                                {isSubmitting ? <Loader className="animate-spin" size={14} /> : (
                                    <> <CheckCircle size={14} /> Save Configuration </>
                                )}
                            </button>
                            {successMsg && <p className="text-green-500 text-xs text-center font-mono">{successMsg}</p>}
                        </form>
                    </div>
                </div>

                {/* LIST PACKAGES */}
                <div className="lg:col-span-2">
                    <div className="bg-white/5 border border-white/10 overflow-hidden shadow-xl">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Package Name</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Format</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Pricing</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Availability</th>
                                    <th className="p-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {packages.map(p => (
                                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-bold uppercase text-white">{p.name}</td>
                                        <td className="p-4 text-xs text-gray-400">
                                            {p.peopleCount === 1 ? (
                                                <span className="flex items-center gap-1"><User size={12}/> Private</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[#0039A6]"><UsersIcon size={12}/> Group ({p.peopleCount})</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-mono text-white">${p.price}</div>
                                            <div className="text-[10px] text-gray-500 mt-1">
                                                {p.price5 > 0 && <span className="mr-2">5x: ${p.price5}</span>}
                                                {p.price10 > 0 && <span>10x: ${p.price10}</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-mono">
                                            {p.maxQuantity === 0 ? (
                                                <span className="text-green-500">∞ Unlimited</span>
                                            ) : (
                                                <span className="text-[#D52B1E]">{p.maxQuantity} Left</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleDelete('packages', p.id)} className="text-gray-600 hover:text-[#D52B1E] transition-colors p-2"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                                {packages.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-600 text-xs uppercase tracking-widest">
                                            System Empty. Initialize package protocols above.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* ========================== */}
        {/* TAB 3: CAMPS & EVENTS      */}
        {/* ========================== */}
        {activeTab === 'events' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                    <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                        <h2 className="text-xl font-bold uppercase tracking-wide mb-6 flex items-center gap-2">
                            <Megaphone className="text-[#D52B1E]" size={20} /> Announce Camp
                        </h2>
                        <form onSubmit={handleEventSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-gray-500 font-bold">Camp Title</label>
                                <input type="text" placeholder="e.g. March Break Elite Camp" required className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs uppercase" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-gray-500 font-bold">Description</label>
                                <textarea placeholder="Details about the camp..." required className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs h-24" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-gray-500 font-bold">Start Date</label>
                                    <input type="date" required className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs" value={eventForm.startDate} onChange={e => setEventForm({...eventForm, startDate: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-gray-500 font-bold">End Date</label>
                                    <input type="date" required className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs" value={eventForm.endDate} onChange={e => setEventForm({...eventForm, endDate: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-gray-500 font-bold">Price ($)</label>
                                    <input type="number" required className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs" value={eventForm.price} onChange={e => setEventForm({...eventForm, price: Number(e.target.value)})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-gray-500 font-bold">Capacity</label>
                                    <input type="number" required className="w-full bg-black/50 border border-white/20 p-3 text-white text-xs" value={eventForm.capacity} onChange={e => setEventForm({...eventForm, capacity: Number(e.target.value)})} />
                                </div>
                            </div>
                            <button disabled={isSubmitting} className="w-full bg-white text-black py-3 font-bold uppercase text-xs hover:bg-[#D52B1E] hover:text-white transition-colors">
                                {isSubmitting ? 'Posting...' : 'Announce Camp'}
                            </button>
                            {successMsg && <p className="text-green-500 text-xs text-center">{successMsg}</p>}
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white/5 border border-white/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Camp Name</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Dates</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Price</th>
                                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Booked</th>
                                    <th className="p-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {events.map(e => (
                                    <tr key={e.id} className="hover:bg-white/5">
                                        <td className="p-4 font-bold uppercase">{e.title}</td>
                                        <td className="p-4 font-mono text-xs">{e.startDate} to {e.endDate}</td>
                                        <td className="p-4 font-mono">${e.price}</td>
                                        <td className="p-4">{e.bookedCount} / {e.capacity}</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleDelete('events', e.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                                {events.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500 text-xs uppercase">
                                            No active camps. Post one to see it here.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}