'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/ui/AuthProvider';
import { useToast } from '@/components/ui/toast';
import { Building2, LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      addToast({ type: 'error', title: 'Error', description: 'Please fill in all fields' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);

        login({
          userId: data.user.id,
          email: data.user.email,
          name: data.user.name,
          expiresAt: expiresAt.toISOString()
        });
        addToast({ type: 'success', title: 'Welcome Back!', description: `Logged in as ${data.user.name}` });
      } else {
        addToast({ type: 'error', title: 'Login Failed', description: data.error || 'Invalid credentials' });
      }
    } catch (err) {
      addToast({ type: 'error', title: 'Network Error', description: 'Failed to connect to the server' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#185FA4] p-8 text-center text-white">
          <img src="/logo.png" alt="ADL UPVC Logo" className="w-16 h-16 mx-auto mb-4 rounded-xl shadow-md object-contain bg-white p-1" />
          <h1 className="text-2xl font-black tracking-tight">ADL UPVC</h1>
          <p className="text-sky-200 text-sm mt-1">Admin Portal Login</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#185FA4]/40 focus:border-[#185FA4] outline-none transition-all dark:text-white"
                  placeholder="admin@adlupvc.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#185FA4]/40 focus:border-[#185FA4] outline-none transition-all dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#185FA4] hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-sky-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an admin account?{' '}
            <Link href="/signup" className="text-[#185FA4] font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
