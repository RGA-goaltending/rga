'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Removed orderBy import
import { Loader, Calendar, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

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

export default function CampsPage() {
  const [events, setEvents] = useState<EventCamp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // 1. Simple Query (No OrderBy to avoid Index errors)
        const q = query(
            collection(db, 'events'), 
            where('status', '==', 'active')
        );
        
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventCamp));

        // 2. Sort manually in Javascript
        data.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        setEvents(data);
      } catch (err) {
        console.error("Error fetching camps:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D52B1E] selection:text-white">
      
      {/* HEADER HERO */}
      <div className="relative pt-40 pb-20 px-6 border-b border-white/10 overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D52B1E] opacity-10 blur-[150px] rounded-full"></div>
         
         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1 rounded-full border border-[#D52B1E]/30 bg-[#D52B1E]/10">
                <span className="w-2 h-2 bg-[#D52B1E] rounded-full animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#D52B1E]">Live Operations</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6">
               Special <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D52B1E] to-white">Camps</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
               Intensive, multi-day training deployments designed to accelerate development. Secure your position on the roster.
            </p>
         </div>
      </div>

      {/* EVENTS GRID */}
      <div className="max-w-7xl mx-auto px-6 py-20">
         {loading ? (
             <div className="flex justify-center items-center h-60">
                 <Loader className="animate-spin text-[#D52B1E]" size={40} />
             </div>
         ) : events.length === 0 ? (
             <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
                 <h3 className="text-2xl font-bold uppercase text-gray-500 mb-2">No Active Camps</h3>
                 <p className="text-gray-400">Check back later for new deployment announcements.</p>
             </div>
         ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {events.map(event => (
                     <div key={event.id} className="group bg-[#111] border border-white/10 rounded-2xl p-8 hover:border-[#D52B1E] transition-all duration-300 relative overflow-hidden flex flex-col h-full">
                         
                         {/* Card Background Glow */}
                         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                         <div className="relative z-10 flex flex-col h-full">
                             {/* Top Row: Dates & Price */}
                             <div className="flex justify-between items-start mb-6">
                                 <div className="flex items-center gap-3 text-[#D52B1E] font-mono text-sm uppercase tracking-widest bg-[#D52B1E]/10 px-3 py-1 rounded">
                                     <Calendar size={14} />
                                     {new Date(event.startDate).toLocaleDateString('en-US', {month: 'short', day:'numeric'})} — 
                                     {new Date(event.endDate).toLocaleDateString('en-US', {month: 'short', day:'numeric'})}
                                 </div>
                                 <div className="text-3xl font-black text-white">${event.price}</div>
                             </div>

                             {/* Title & Desc */}
                             <h3 className="text-3xl font-black uppercase mb-4 leading-none group-hover:text-[#D52B1E] transition-colors">{event.title}</h3>
                             <p className="text-gray-400 font-light leading-relaxed mb-8 flex-grow">
                                 {event.description}
                             </p>

                             {/* Stats Row */}
                             <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-white/10">
                                 <div>
                                     <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Availability</span>
                                     <div className="flex items-center gap-2 text-white font-mono">
                                         <Users size={16} className="text-[#0039A6]" />
                                         {event.bookedCount} / {event.capacity} Filled
                                     </div>
                                 </div>
                                 <div>
                                     <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Status</span>
                                     <div className="flex items-center gap-2 text-[#D52B1E] font-mono uppercase">
                                         <ShieldCheck size={16} />
                                         Registration Open
                                     </div>
                                 </div>
                             </div>

                             {/* Action Button */}
                             <Link 
                                href="/book" 
                                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-center hover:bg-[#D52B1E] hover:text-white transition-all rounded"
                             >
                                Register Now
                             </Link>
                         </div>
                     </div>
                 ))}
             </div>
         )}
      </div>

    </div>
  );
}