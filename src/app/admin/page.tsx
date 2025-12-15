// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, onSnapshot, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { TrainingSlot } from '../types';
import { Trash2, Plus, Loader } from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [slots, setSlots] = useState<TrainingSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const router = useRouter();

  // Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [price, setPrice] = useState(100);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      
      if (user && user.email === adminEmail) {
        setAuthorized(true);
        fetchSlots();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchSlots = () => {
    setSlotsLoading(true);
    const q = query(collection(db, "training_slots"), orderBy("date"));
    return onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as TrainingSlot));
        setSlots(data);
        setSlotsLoading(false);
      },
      (error) => {
        console.error("Error fetching slots: ", error);
        setSlotsLoading(false);
      }
    );
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!date || !startTime) {
      setFormError('Date and time cannot be empty.');
      return;
    }
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "training_slots"), {
        date,
        startTime,
        price,
        status: 'available',
        createdAt: new Date().toISOString()
      });
      setDate('');
      setStartTime('');
      setPrice(100);
    } catch (error) {
      console.error(error);
      setFormError("Failed to add slot. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      try {
        await deleteDoc(doc(db, "training_slots", id));
      } catch (error) {
        console.error("Error deleting slot: ", error);
        alert("Failed to delete slot. Please try again.");
      }
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (loading) return <div className="p-10 text-center"><Loader className="animate-spin inline-block" /> Checking Permissions...</div>;
  if (!authorized) return null;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <button 
          onClick={() => { auth.signOut(); router.push('/login'); }}
          className="text-sm text-red-600 underline"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus className="text-red-500" /> Add New Session</h2>
        <form onSubmit={handleAddSlot} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-slate-400 mb-1">Date</label>
            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-red-500 outline-none" disabled={isSubmitting} />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm text-slate-400 mb-1">Start Time</label>
            <input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-red-500 outline-none" disabled={isSubmitting} />
          </div>
          <div className="w-24">
            <label className="block text-sm text-slate-400 mb-1">Price ($)</label>
            <input type="number" required value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-red-500 outline-none" disabled={isSubmitting} />
          </div>
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition disabled:bg-red-400" disabled={isSubmitting}>
            {isSubmitting ? <Loader className="animate-spin inline-block" size={20} /> : 'Create Slot'}
          </button>
        </form>
        {formError && <p className="text-red-400 text-sm mt-4">{formError}</p>}
      </div>

      <h3 className="text-xl font-bold mb-4">All Training Slots</h3>
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Time</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Customer Details</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {slotsLoading ? (
              <tr><td colSpan={5} className="text-center p-8"><Loader className="animate-spin inline-block" /> Loading slots...</td></tr>
            ) : slots.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-8 text-slate-500">No training slots available.</td></tr>
            ) : (
              slots.map(slot => (
                <tr key={slot.id} className="hover:bg-slate-50">
                  <td className="p-4">{new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  <td className="p-4">{formatTime(slot.startTime)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${slot.status === 'booked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {slot.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    {slot.customerName ? (
                      <div>
                        <div className="font-bold text-slate-900">{slot.customerName}</div>
                        <div className="text-xs text-slate-500">{slot.customerEmail}</div>
                      </div>
                    ) : <span className="text-slate-400">-</span>}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(slot.id)} className="text-slate-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
