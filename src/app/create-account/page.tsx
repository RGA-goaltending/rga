'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CreateAccount() {
  const [name, setName] = useState(''); // Added Name State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update Profile with Name (Critical for bookings)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
            displayName: name
        });
      }

      router.push('/book');
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Friendly error messages
        if (error.message.includes('email-already-in-use')) {
            setError('This email is already registered.');
        } else if (error.message.includes('weak-password')) {
            setError('Password should be at least 6 characters.');
        } else {
            setError(error.message);
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col justify-center items-center p-6">
      
      {/* BACKGROUND (Matches Login/Hero) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-[#050505] z-10" />
        {/* Optional: Add the video background here if you want it identical to login */}
      </div>

      {/* CARD */}
      <div className="relative z-20 w-full max-w-md">
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <ShieldCheck size={12} className="text-[#D52B1E]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">New Recruit</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Join The <span className="text-[#D52B1E]">Ranks</span></h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Create your operative profile</p>
        </div>

        <form onSubmit={handleSignUp} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 space-y-5 relative overflow-hidden group shadow-2xl">
          
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D52B1E] to-transparent opacity-50" />

          {error && (
            <div className="bg-[#D52B1E]/10 border border-[#D52B1E]/50 p-3 flex items-start gap-3">
                <div className="w-1 h-full bg-[#D52B1E]" />
                <p className="text-xs text-[#D52B1E] font-mono uppercase tracking-wide">{error}</p>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-[#D52B1E] focus:outline-none transition-colors font-mono text-sm placeholder:text-gray-700"
              placeholder="JOHN DOE"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-[#D52B1E] focus:outline-none transition-colors font-mono text-sm placeholder:text-gray-700"
              placeholder="OPERATIVE@EMAIL.COM"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-[#D52B1E] focus:outline-none transition-colors font-mono text-sm placeholder:text-gray-700"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-[#D52B1E] hover:text-white transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : (
                <>
                    Initialize Account <UserPlus size={16} />
                </>
            )}
          </button>

          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500 mb-2">Already have clearance?</p>
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#D52B1E] transition-colors flex items-center justify-center gap-1">
                Access Login <ArrowRight size={12} />
            </Link>
          </div>

        </form>
      </div>
    </section>
  );
}