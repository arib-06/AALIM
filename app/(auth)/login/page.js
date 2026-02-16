'use client';
// app/(auth)/login/page.js

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router   = useRouter();
  const supabase = getSupabase();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/home');
      router.refresh();
    }
  };

  const inputClass = `
    w-full px-4 py-3 rounded-sm text-sm font-light outline-none transition-all duration-200
    bg-aalim-surface border border-aalim-border text-aalim-text placeholder-aalim-muted
    focus:border-gold/50 focus:bg-aalim-card
  `;

  return (
    <div className="w-full max-w-sm fade-up">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="font-display text-3xl font-bold text-gold tracking-widest">AALIM</Link>
        <p className="text-aalim-sub text-sm font-light mt-2">Sign in to continue learning</p>
      </div>

      {/* Card */}
      <div className="bg-aalim-card border border-aalim-border rounded-md p-8">
        {error && (
          <div className="mb-5 px-4 py-3 rounded-sm bg-red-900/20 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-aalim-muted uppercase tracking-[0.12em] font-semibold block mb-2">Email</label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs text-aalim-muted uppercase tracking-[0.12em] font-semibold block mb-2">Password</label>
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="mt-2 w-full py-3 rounded-sm font-semibold text-sm uppercase tracking-[0.14em] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #e2c46a)', color: '#0a0a0a' }}
          >
            <LogIn size={15} />
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>

      <p className="text-center text-aalim-muted text-xs mt-5">
        No account?{' '}
        <Link href="/signup" className="text-gold hover:text-gold-hi transition-colors">Create one free</Link>
      </p>
    </div>
  );
}
