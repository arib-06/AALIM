'use client';

import Link from 'next/link';

export default function LandingButton() {
  return (
    <Link
      href="/home"
      className="inline-block px-10 py-4 font-semibold uppercase tracking-widest text-sm rounded-sm transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, #c9a84c, #e2c46a)',
        color: '#0a0a0a',
        boxShadow: '0 8px 32px rgba(201,168,76,0.22)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 48px rgba(201,168,76,0.4)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,168,76,0.22)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      Begin Learning
    </Link>
  );
}
