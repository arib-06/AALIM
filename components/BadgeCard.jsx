'use client';
// components/BadgeCard.jsx

import { useState } from 'react';
import { Check, Lock } from 'lucide-react';
import Ring from './Ring';
import { RARITY } from '@/lib/constants';
import { badgePct } from '@/lib/utils';

export default function BadgeCard({ badge, index = 0 }) {
  const [hov, setHov] = useState(false);
  const { key, label, desc, Icon, unlocked, xp, rarity, prog, goal } = badge;
  const R   = RARITY[rarity];
  const pct = badgePct(prog, goal, unlocked);

  return (
    <div
      onClick={() => typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${label}. ${desc}`))}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative rounded-xl p-6 cursor-pointer overflow-hidden fade-up"
      style={{
        animationDelay: `${index * 0.055}s`,
        animationFillMode: 'backwards',
        background: '#181818',
        border: `1px solid ${hov ? R.color + '60' : unlocked ? R.color + '35' : 'rgba(255,255,255,0.07)'}`,
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
        boxShadow: hov
          ? `0 20px 60px ${R.glow}, 0 0 0 1px ${R.color}30`
          : unlocked
            ? `0 6px 30px ${R.glow}70`
            : `0 4px 20px ${R.glow}30`,
      }}
    >
      {/* Ambient glow blob */}
      <div
        className={unlocked ? 'badge-glow-pulse' : ''}
        style={{
          position: 'absolute', top: -35, left: '50%',
          transform: 'translateX(-50%)',
          width: 100, height: 70,
          background: R.glow,
          borderRadius: '50%',
          filter: 'blur(28px)',
          pointerEvents: 'none',
          opacity: unlocked ? 0.8 : hov ? 0.5 : 0.25,
          transition: 'opacity 0.3s',
        }}
      />

      {/* Top rarity strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${R.color}, transparent)`,
        opacity: unlocked ? 1 : hov ? 0.7 : 0.3,
        transition: 'opacity 0.3s',
      }} />

      {/* Lock / Check corner */}
      <div className="absolute top-3 right-3" style={{ color: unlocked ? R.color : '#3a3428', opacity: unlocked ? 1 : 0.5 }}>
        {unlocked ? <Check size={13} /> : <Lock size={12} />}
      </div>

      {/* Icon ring */}
      <div className="relative w-[60px] h-[60px] mb-4">
        <Ring pct={pct} color={R.color} size={60} stroke={2.5} />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            color: R.color,
            opacity: unlocked ? 1 : 0.65,
            filter: (hov || unlocked) ? `drop-shadow(0 0 8px ${R.color}90)` : `drop-shadow(0 0 4px ${R.color}40)`,
            transition: 'all 0.25s',
          }}
        >
          <Icon size={22} />
        </div>
      </div>

      {/* Rarity pill */}
      <div
        className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.58rem] font-bold uppercase tracking-[0.1em] mb-2"
        style={{
          background: `${R.color}18`,
          color: R.color,
          border: `1px solid ${R.color}30`,
          boxShadow: `0 0 8px ${R.color}30`,
        }}
      >
        {R.label}
      </div>

      {/* Title */}
      <div
        className="font-display font-semibold leading-tight mb-1 transition-colors duration-200"
        style={{ fontSize: '1.1rem', color: unlocked ? '#f0e8d0' : '#7a6e54' }}
      >
        {label}
      </div>

      <p className="text-[0.7rem] font-light leading-relaxed mb-4" style={{ color: '#3a3428' }}>
        {desc}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {unlocked ? (
          <div
            className="flex items-center gap-1 text-[0.68rem] font-bold tracking-[0.08em]"
            style={{ color: R.color, textShadow: `0 0 8px ${R.color}` }}
          >
            <Check size={11} /> Unlocked
          </div>
        ) : (
          <div className="text-[0.67rem]" style={{ color: '#7a6e54' }}>
            {prog !== undefined ? `${prog} / ${goal}` : 'Locked'}
          </div>
        )}
        <div
          className="text-[0.67rem] font-semibold tracking-[0.05em]"
          style={{
            color: unlocked ? R.color : '#7a6e54',
            textShadow: unlocked ? `0 0 8px ${R.color}` : 'none',
          }}
        >
          +{xp} XP
        </div>
      </div>
    </div>
  );
}
