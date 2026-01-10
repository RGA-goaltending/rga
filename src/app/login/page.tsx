'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, ArrowRight, ShieldAlert, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if Admin (Matches your Env Variable)
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      
      if (user.email === adminEmail) {
        router.push('/admin'); // Redirect Admin to Command Center
      } else {
        router.push('/book'); // Redirect Users to Booking
      }

    } catch (err: unknown) {
      // 1. Cast the error to a type that has a 'code' property
      const firebaseError = err as { code?: string }; 

      // Friendly Error Handling
      if (firebaseError.code === 'auth/invalid-credential') {
        setError('ACCESS DENIED: Incorrect credentials.');
      } else if (firebaseError.code === 'auth/too-many-requests') {
        setError('SYSTEM LOCKOUT: Too many failed attempts. Try again later.');
      } else {
        setError('Login Failed: Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col justify-center items-center p-6">
      
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-[#050505] z-10" />
        {/* Optional: You can add the video background here if you want */}
      </div>

      {/* LOGIN CARD */}
      <div className="relative z-20 w-full max-w-md">
        
        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <Lock size={12} className="text-[#D52B1E]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Secure Access</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">System <span className="text-[#D52B1E]">Login</span></h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Identify yourself, operative.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 space-y-6 relative overflow-hidden group shadow-2xl">
          
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D52B1E] to-transparent opacity-50" />

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-[#D52B1E]/10 border border-[#D52B1E]/50 p-3 flex items-start gap-3 animate-pulse">
                <ShieldAlert size={16} className="text-[#D52B1E] mt-0.5" />
                <p className="text-xs text-[#D52B1E] font-mono uppercase tracking-wide leading-relaxed">{error}</p>
            </div>
          )}

          {/* EMAIL INPUT */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Command ID (Email)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-[#D52B1E] focus:outline-none transition-colors font-mono text-sm placeholder:text-gray-700"
              placeholder="admin@rga.com"
              required
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Security Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-[#D52B1E] focus:outline-none transition-colors font-mono text-sm placeholder:text-gray-700"
              placeholder="••••••••"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-[#D52B1E] hover:text-white transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : (
                <>
                    <LogIn size={16} className="group-hover:translate-x-1 transition-transform"/> Authenticate
                </>
            )}
          </button>

          {/* FOOTER LINK */}
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500 mb-2">No clearance level?</p>
            <Link href="/create-account" className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#D52B1E] transition-colors flex items-center justify-center gap-1">
                Request Access <ArrowRight size={12} />
            </Link>
          </div>

        </form>
      </div>
    </section>
  );
}