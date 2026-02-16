'use client';
// app/(dashboard)/home/page.js

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Calculator, DollarSign, FlaskConical, BarChart2 } from 'lucide-react';
import { SUGGESTIONS } from '@/lib/constants';

const ICONS = { Calculator, DollarSign, FlaskConical, BarChart2 };
const CHIP_ICONS = [Calculator, DollarSign, FlaskConical, BarChart2];

const STATS = [
  { label: 'Concepts Learned', value: '10',     sub: 'across 3 subjects' },
  { label: 'Current Streak',   value: '3 days', sub: 'keep it going'     },
  { label: 'Badges Earned',    value: '2',      sub: 'of 9 total'        },
];

export default function HomePage() {
  const router         = useRouter();
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim()) return;
    router.push(`/learn?q=${encodeURIComponent(input)}`);
  };

  return (
    <div className="max-w-[680px] mx-auto px-8 flex flex-col items-center" style={{ paddingTop: '8vh', paddingBottom: '3rem' }}>
      <div className="w-full text-center fade-up">

        {/* Heading */}
        <h1 className="font-display font-semibold text-aalim-text leading-tight mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
          What would you like to learn?
        </h1>
        <p className="text-aalim-sub font-light mb-9" style={{ fontSize: '0.88rem' }}>
          Ask anything, or pick a suggestion below
        </p>

        {/* Input box */}
        <div
          className="flex items-end gap-3 rounded-xl px-4 py-4 mb-4 transition-all duration-200"
          style={{
            background: '#181818',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
          onFocusCapture={e  => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'}
          onBlurCapture={e   => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
        >
          <Sparkles size={16} className="mb-1 flex-shrink-0" style={{ color: '#3a3428' }} />
          <input
            value={input}
            onChange={e  => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Ask me anything…"
            className="flex-1 bg-transparent border-none outline-none text-aalim-text font-light leading-relaxed resize-none"
            style={{ fontSize: '0.92rem', color: '#f0e8d0' }}
          />
          <button
            onClick={handleSubmit}
            className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200"
            style={{
              background: input.trim() ? 'linear-gradient(135deg,#c9a84c,#e2c46a)' : 'rgba(255,255,255,0.06)',
              color: input.trim() ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
              cursor: input.trim() ? 'pointer' : 'default',
            }}
          >
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-16">
          {SUGGESTIONS.map(({ label }, i) => {
            const Ic = CHIP_ICONS[i];
            return (
              <button
                key={label}
                onClick={() => { setInput(label); router.push(`/learn?q=${encodeURIComponent(label)}`); }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-aalim-sub font-light transition-all duration-150 text-sm"
                style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', fontSize: '0.78rem' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.color = '#f0e8d0'; e.currentTarget.style.background = '#181818'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#7a6e54'; e.currentTarget.style.background = '#141414'; }}
              >
                {Ic && <Ic size={12} style={{ color: '#c9a84c' }} />}
                {label}
              </button>
            );
          })}
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-3 overflow-hidden rounded-lg"
          style={{ border: '1px solid rgba(255,255,255,0.07)', gap: '1px', background: 'rgba(255,255,255,0.07)' }}
        >
          {STATS.map(({ label, value, sub }) => (
            <div key={label} className="bg-aalim-card text-center px-4 py-5">
              <div className="font-display font-semibold text-gold leading-none" style={{ fontSize: '1.7rem' }}>{value}</div>
              <div className="text-xs text-aalim-text font-medium mt-1.5">{label}</div>
              <div className="text-[0.65rem] mt-0.5" style={{ color: '#3a3428' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
