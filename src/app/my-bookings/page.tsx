'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Check path ../../ or ../ depending on folder structure
import { db } from '../lib/firebase';
import { collectionGroup, query, where, getDocs, orderBy, getDoc, doc } from 'firebase/firestore'; 
import { useRouter } from 'next/navigation';
import { Loader, Clock, Package, CheckCircle, History, Shield } from 'lucide-react';
import Footer from '../section/Footer'; // Added Footer for consistency

// Define a type that combines the Booking info with the parent Slot info
interface MyBooking {
  id: string; // Booking ID
  slotId: string; // Parent Slot ID
  bookedAt: string;
  packageName: string;
  date: string;
  startTime: string;
  price: number;
  status: string;
}

export default function MyBookings() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Auth Check
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // 2. Fetch Bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        try {
          // NOTE: This query requires a Firestore Index. 
          // If it fails, check your browser console for a link to create it instantly.
          const q = query(
            collectionGroup(db, 'bookings'),
            where('userId', '==', user.uid),
            orderBy('bookedAt', 'desc')
          );

          const querySnapshot = await getDocs(q);
          
          const bookingPromises = querySnapshot.docs.map(async (bookingDoc) => {
            const bookingData = bookingDoc.data();
            const parentSlotId = bookingDoc.ref.parent.parent?.id; 
            
            if (!parentSlotId) return null;

            const slotSnap = await getDoc(doc(db, 'training_slots', parentSlotId));
            if (!slotSnap.exists()) return null;

            const slotData = slotSnap.data();

            return {
              id: bookingDoc.id,
              slotId: parentSlotId,
              bookedAt: bookingData.bookedAt,
              packageName: slotData.packageName,
              date: slotData.date,
              startTime: slotData.startTime,
              price: slotData.price,
              status: bookingData.status || 'confirmed'
            } as MyBooking;
          });

          const results = await Promise.all(bookingPromises);
          setBookings(results.filter((b): b is MyBooking => b !== null));

        } catch (error) {
          console.error("Error fetching bookings: ", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) fetchBookings();
  }, [user]);

  // --- UTILS ---
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (loading || isLoading) {
    return (
        <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center text-white gap-4">
            <Loader className="animate-spin text-[#D52B1E]" size={32} />
            <span className="text-xs uppercase tracking-widest font-mono">Retrieving Mission Data...</span>
        </div>
    );
  }

  if (!user) return null;

  const now = new Date();
  const upcomingBookings = bookings.filter(b => new Date(b.date + 'T' + b.startTime) >= now);
  const pastBookings = bookings.filter(b => new Date(b.date + 'T' + b.startTime) < now);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D52B1E] selection:text-white flex flex-col">
      
      {/* MAIN CONTENT WRAPPER 
          - pt-32 adds padding to top on mobile
          - md:pt-40 adds more padding on desktop to clear navbar
          - flex-grow pushes the footer down
      */}
      <div className="flex-grow max-w-4xl mx-auto w-full px-6 md:px-12 pt-32 md:pt-40 pb-20">
        
        {/* HEADER */}
        <div className="mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 mb-2">
             <Shield size={12} className="text-[#D52B1E]" />
             <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Operative Profile</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
            My <span className="text-[#D52B1E]">Bookings</span>
          </h1>
        </div>

        <div className="space-y-16">
          
          {/* UPCOMING SECTION */}
          <div>
            <h2 className="text-lg font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" /> Active Deployments
            </h2>
            
            {upcomingBookings.length > 0 ? (
              <div className="grid gap-4">
                {upcomingBookings.map(slot => (
                  <div key={slot.id} className="group bg-white/5 border border-white/10 p-6 relative overflow-hidden transition-all hover:bg-white/10 hover:border-white/20 rounded-lg">
                    <div className="absolute left-0 top-0 h-full w-[3px] bg-green-500 group-hover:w-[6px] transition-all" />
                    
                    <div className="flex flex-wrap justify-between items-center relative z-10 pl-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl font-black uppercase tracking-tight text-white">
                              {new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                            </span>
                            <span className="text-[10px] font-bold font-mono bg-green-500/10 text-green-500 px-2 py-1 border border-green-500/20 uppercase rounded">
                              Confirmed
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400 font-mono uppercase tracking-widest mt-2">
                            <span className="flex items-center gap-1"><Package size={12} /> {slot.packageName}</span>
                            <span className="flex items-center gap-1 text-white"><Clock size={12} className="text-[#D52B1E]" /> {formatTime(slot.startTime)}</span>
                        </div>
                      </div>

                      <div className="text-right mt-4 sm:mt-0">
                         <div className="text-xl font-bold font-mono text-gray-500 group-hover:text-white transition-colors">
                           ${slot.price}
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-white/5 border-dashed bg-white/5 text-center text-gray-500 text-xs uppercase tracking-widest rounded-lg">
                No active missions detected.
              </div>
            )}
          </div>

          {/* PAST SECTION */}
          {pastBookings.length > 0 && (
            <div className="opacity-60 hover:opacity-100 transition-opacity duration-500">
                <h2 className="text-lg font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                <History size={18} /> Mission History
                </h2>
                
                <div className="grid gap-4">
                {pastBookings.map(slot => (
                    <div key={slot.id} className="bg-black/40 border border-white/5 p-5 flex flex-wrap justify-between items-center grayscale hover:grayscale-0 transition-all rounded-lg">
                        <div>
                        <div className="text-lg font-bold uppercase text-gray-400 mb-1">
                            {new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                            {slot.packageName} • {formatTime(slot.startTime)}
                        </div>
                        </div>
                        <div className="text-xs font-bold font-mono text-gray-600 uppercase border border-gray-800 px-2 py-1 rounded">
                           Completed
                        </div>
                    </div>
                ))}
                </div>
            </div>
          )}
          
        </div>
      </div>

      <Footer />
    </div>
  );
}