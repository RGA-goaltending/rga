// app/book/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { TrainingSlot } from '../types';
import { Loader, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BookSession() {
  const [slots, setSlots] = useState<TrainingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TrainingSlot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  // Handle booking status from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('session_id')) {
      setBookingStatus('success');
    } else if (queryParams.get('canceled')) {
      setBookingStatus('error');
    }
  }, []);

  const [bookingStatus, setBookingStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const q = query(collection(db, "training_slots"), where("status", "==", "available"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const slotsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingSlot));
      slotsData.sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime());
      setSlots(slotsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching slots: ", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedSlot && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedSlot]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !name || !email) {
      setFormError('Please fill out all fields.');
      return;
    }
    setFormError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          slotId: selectedSlot.id,
          customerName: name,
          customerEmail: email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create Stripe session.");
      }

      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe

    } catch (error: any) {
      console.error("Frontend booking error:", error);
      setFormError(error.message);
      setBookingStatus('error');
      setIsSubmitting(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return <div className="text-center py-20 flex justify-center items-center gap-2"><Loader className="animate-spin" /> Loading available sessions...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Book a Session</h1>

      {bookingStatus === 'success' && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-8 flex items-center gap-3">
          <CheckCircle />
          <div>
            <p className="font-bold">Booking Confirmed!</p>
            <p className="text-sm">Your session is booked. A confirmation email has been sent.</p>
          </div>
        </div>
      )}
      {bookingStatus === 'error' && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 flex items-center gap-3">
          <AlertCircle />
          <div>
            <p className="font-bold">Booking Issue</p>
            <p className="text-sm">There was a problem with your booking. The selected slot may no longer be available. Please try again.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">1. Select an Available Time</h2>
          {slots.length === 0 ? (
            <p className="text-slate-500 italic bg-slate-50 p-6 rounded-lg">No available slots at the moment. Please check back soon!</p>
          ) : (
            slots.map(slot => (
              <button key={slot.id} onClick={() => setSelectedSlot(slot)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedSlot?.id === slot.id ? 'border-red-600 bg-red-50 ring-2 ring-red-200' : 'border-slate-200 bg-white hover:border-red-300 hover:shadow-md'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">${slot.price}</span>
                </div>
                <div className="text-slate-500 mt-1">Time: {formatTime(slot.startTime)}</div>
              </button>
            ))
          )}
        </div>

        <div className="relative" ref={formRef}>
          <div className={`sticky top-24 bg-white p-8 rounded-2xl shadow-xl border transition-opacity ${selectedSlot ? 'border-slate-200' : 'border-slate-100'}`}>
            <h2 className="text-xl font-semibold text-slate-700 mb-4">2. Enter Your Details</h2>
            {!selectedSlot ? (
              <div className="text-center py-10 text-slate-400 select-none">
                <p>Please select a time slot to continue.</p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-5">
                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600">
                  Booking for: <br/>
                  <strong className="text-slate-900 text-base">{new Date(selectedSlot.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {formatTime(selectedSlot.startTime)}</strong>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" disabled={isSubmitting}/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" disabled={isSubmitting}/>
                </div>
                {formError && <p className="text-red-500 text-sm">{formError}</p>}

                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 disabled:bg-red-400 disabled:cursor-not-allowed flex justify-center items-center gap-2" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader className="animate-spin" size={20} /> Processing...</> : <><Lock size={16}/> Securely Pay ${selectedSlot.price}</>}
                </button>
                <p className="text-xs text-center text-slate-400 mt-2">Powered by Stripe</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
