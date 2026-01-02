'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { TrainingSlot } from '../types';
import { useRouter } from 'next/navigation';
import { Loader, Calendar, Clock, Tag, Package } from 'lucide-react';

export default function MyBookings() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<TrainingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, 'training_slots'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const userBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingSlot));
          setBookings(userBookings);
        } catch (error) {
          console.error("Error fetching bookings: ", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (loading || isLoading) {
    return <div className="p-10 text-center flex items-center justify-center"><Loader className="animate-spin mr-2" /> Loading your bookings...</div>;
  }

  if (!user) {
    return null; // or a redirect component
  }

  const now = new Date();
  const upcomingBookings = bookings.filter(b => new Date(b.date + 'T' + b.startTime) >= now);
  const pastBookings = bookings.filter(b => new Date(b.date + 'T' + b.startTime) < now);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Bookings</h1>
      
      <div className="space-y-10">
        <div>
          <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">Upcoming Sessions</h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map(slot => (
                <div key={slot.id} className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="mb-3 md:mb-0">
                      <p className="font-bold text-lg text-slate-800">{new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-slate-600 flex items-center"><Package size={14} className="mr-2"/> {slot.packageName}</p>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                        <p className="text-slate-600 flex items-center"><Clock size={14} className="mr-1.5"/> {formatTime(slot.startTime)}</p>
                        <p className="font-bold text-lg text-green-600 flex items-center"><Tag size={14} className="mr-1.5"/> ${slot.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic bg-slate-50 p-6 rounded-lg">You have no upcoming training sessions.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">Past Sessions</h2>
          {pastBookings.length > 0 ? (
            <div className="space-y-4">
              {pastBookings.map(slot => (
                <div key={slot.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 opacity-70">
                   <div className="flex flex-wrap justify-between items-center">
                    <div className="mb-2 md:mb-0">
                      <p className="font-semibold text-slate-700">{new Date(slot.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                       <p className="text-slate-500 text-sm flex items-center"><Package size={14} className="mr-2"/> {slot.packageName}</p>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                        <p className="text-slate-500 flex items-center"><Clock size={14} className="mr-1.5"/> {formatTime(slot.startTime)}</p>
                        <p className="font-semibold text-slate-600 flex items-center"><Tag size={14} className="mr-1.5"/> ${slot.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic bg-slate-50 p-6 rounded-lg">You have no past training sessions.</p>
          )}
        </div>
      </div>
    </div>
  );
}
