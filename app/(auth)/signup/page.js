'use client';
// app/(auth)/signup/page.js

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { UserPlus } from 'lucide-react';

export default function SignupPage() {
  const router   = useRouter();
  const supabase = getSupabase();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const inputClass = `
    w-full px-4 py-3 rounded-sm text-sm font-light outline-none transition-all duration-200
    bg-aalim-surface border border-aalim-border text-aalim-text placeholder-aalim-muted
    focus:border-gold/50 focus:bg-aalim-card
  `;

  if (success) return (
    <div className="w-full max-w-sm text-center fade-up">
      <div className="text-4xl mb-4">✓</div>
      <h2 className="font-display text-2xl font-semibold text-gold mb-2">Check your inbox</h2>
      <p className="text-aalim-sub text-sm font-light leading-relaxed">
        We sent a confirmation link to <span className="text-aalim-text">{email}</span>.
        Click it to activate your account, then{' '}
        <Link href="/login" className="text-gold hover:text-gold-hi transition-colors">sign in</Link>.
      </p>
    </div>
  );

  return (
    <div className="w-full max-w-sm fade-up">
      <div className="text-center mb-8">
        <Link href="/" className="font-display text-3xl font-bold text-gold tracking-widest">AALIM</Link>
        <p className="text-aalim-sub text-sm font-light mt-2">Create your free account</p>
      </div>

      <div className="bg-aalim-card border border-aalim-border rounded-md p-8">
        {error && (
          <div className="mb-5 px-4 py-3 rounded-sm bg-red-900/20 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-aalim-muted uppercase tracking-[0.12em] font-semibold block mb-2">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="learner123" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-aalim-muted uppercase tracking-[0.12em] font-semibold block mb-2">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-aalim-muted uppercase tracking-[0.12em] font-semibold block mb-2">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" className={inputClass} />
          </div>

          <button
            type="submit" disabled={loading}
            className="mt-2 w-full py-3 rounded-sm font-semibold text-sm uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #e2c46a)', color: '#0a0a0a' }}
          >
            <UserPlus size={15} />
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      </div>

      <p className="text-center text-aalim-muted text-xs mt-5">
        Have an account?{' '}
        <Link href="/login" className="text-gold hover:text-gold-hi transition-colors">Sign in</Link>
      </p>
    </div>
  );
}
