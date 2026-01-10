'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Calendar, ArrowRight, MapPin, AlertCircle, Megaphone } from 'lucide-react';

interface EventCamp {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  bookedCount: number;
}

export default function HomeAnnouncements() {
  const [events, setEvents] = useState<EventCamp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(
          collection(db, 'events'),
          where('status', '==', 'active'),
          limit(2) // Only show the top 2 camps on home
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventCamp));
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (!loading && events.length === 0) return null; // Hide section if no camps

  return (
    <section className="w-full bg-[#D52B1E] text-white py-12 md:py-16 relative overflow-hidden border-t border-b border-black">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-multiply"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-6">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-black rounded-full border border-white/20">
                <Megaphone className="text-white" size={24} />
             </div>
             <div>
                <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">
                   Incoming <span className="text-black">Brief</span>
                </h2>
                <p className="text-xs font-mono uppercase tracking-[0.2em] opacity-80">Active Operations & Camps</p>
             </div>
          </div>
          
          <Link href="/camps" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black px-6 py-3 rounded hover:bg-white hover:text-[#D52B1E] transition-all">
             View All Intel <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="group bg-black border border-black/20 p-8 relative overflow-hidden hover:bg-white hover:text-black transition-all duration-300 shadow-2xl">
               
               {/* Hover Accent */}
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-[100px] transition-all group-hover:bg-[#D52B1E] group-hover:scale-150"></div>

               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                     <span className="inline-block px-3 py-1 bg-[#D52B1E] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        Open For Enrollment
                     </span>
                     <span className="font-mono text-xl font-black">${event.price}</span>
                  </div>

                  <h3 className="text-2xl font-black uppercase mb-4 leading-tight group-hover:text-[#D52B1E] transition-colors">
                     {event.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-xs font-mono opacity-70 mb-8 uppercase">
                     <div className="flex items-center gap-2">
                        <Calendar size={14} /> 
                        {new Date(event.startDate).toLocaleDateString('en-US', {month:'short', day:'numeric'})} - 
                        {new Date(event.endDate).toLocaleDateString('en-US', {month:'short', day:'numeric'})}
                     </div>
                     <div className="flex items-center gap-2">
                         <AlertCircle size={14} /> {event.capacity - event.bookedCount} Spots Left
                     </div>
                  </div>

                  <Link href="/camps" className="inline-flex items-center gap-2 font-bold uppercase text-sm border-b-2 border-[#D52B1E] pb-1 group-hover:border-black transition-colors">
                     Secure Your Spot <ArrowRight size={16} />
                  </Link>
               </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}