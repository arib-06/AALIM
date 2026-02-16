// app/page.js  — Landing Page
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LandingButton from '@/components/LandingButton';

export default function LandingPage() {
  // redirect('/home');
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-8 py-12"
      style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(201,168,76,0.1) 0%, transparent 60%)',
      }}
    >
      {/* Vertical gold line top */}
      <div className="w-px h-20 mb-10" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.5))' }} />

      <div className="text-center max-w-lg fade-up">
        {/* Logo */}
        <h1 className="gold-shimmer font-display font-bold leading-none" style={{ fontSize: 'clamp(4rem, 12vw, 6rem)' }}>
          AALIM
        </h1>

        {/* Full name */}
        <p className="font-display italic text-aalim-sub mt-2 tracking-widest" style={{ fontSize: '1.1rem' }}>
          Adaptive Assistive Learning Interface Model
        </p>

        {/* Letter breakdown */}
        <div className="flex items-center justify-center gap-3 mt-1">
          {['A', 'A', 'L', 'I', 'M'].map((l, i) => (
            <span key={i} className="text-xs text-aalim-muted tracking-[0.2em] font-medium">{l}</span>
          ))}
        </div>

        {/* Divider */}
        <div className="w-9 h-px mx-auto mt-8 mb-8 opacity-40" style={{ background: '#c9a84c' }} />

        {/* Tagline */}
        <p className="text-aalim-sub font-light leading-relaxed mb-10" style={{ fontSize: '0.95rem' }}>
          Intelligent, adaptive education built around you.
          No labels. No diagnosis. Just learning, your way.
        </p>

        {/* CTA */}
        <LandingButton />

        <p className="text-aalim-muted text-xs mt-5">
          No account?{' '}
          <Link href="/signup" className="text-gold hover:text-gold-hi transition-colors">
            Sign up free
          </Link>
        </p>
      </div>

      {/* Vertical gold line bottom */}
      <div className="w-px h-20 mt-10" style={{ background: 'linear-gradient(to top, transparent, rgba(201,168,76,0.5))' }} />
    </main>
  );
}
