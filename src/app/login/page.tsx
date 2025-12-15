// app/login/page.tsx
'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-3 mb-4 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-3 mb-6 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <button 
          className="w-full bg-slate-900 text-white py-3 rounded font-bold disabled:bg-slate-500"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
