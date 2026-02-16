'use client';
// app/(dashboard)/badges/BadgesClient.jsx

import { Calculator, FlaskConical, DollarSign, BarChart2, Brain, Code, Zap, TrendingUp, Star } from 'lucide-react';
import { RARITY } from '@/lib/constants';
import BadgeCard from '@/components/BadgeCard';

const ICON_MAP = {
  first: Star, streak: Zap, math: Calculator, science: FlaskConical,
  code: Code, data: BarChart2, psych: Brain, finance: DollarSign, speed: TrendingUp,
};

export default function BadgesClient({ badges, unlockedCount, totalCount }) {
  const badgesWithIcons = badges.map(b => ({ ...b, Icon: ICON_MAP[b.key] || Star }));

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="text-[0.7rem] text-gold font-semibold uppercase tracking-[0.16em] mb-2">Hall of Fame</p>
          <h1 className="font-display font-semibold text-aalim-text leading-none" style={{ fontSize: '2.4rem' }}>
            Achievements
          </h1>
          <p className="text-aalim-sub font-light mt-2 text-sm">
            {unlockedCount} of {totalCount} badges unlocked
          </p>
        </div>

        {/* Rarity legend */}
        <div className="flex items-center gap-5">
          {Object.entries(RARITY).map(([key, { color, label }]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
              <span className="text-[0.65rem] uppercase tracking-[0.08em]" style={{ color: '#7a6e54' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
        {badgesWithIcons.map((badge, idx) => (
          <BadgeCard key={badge.key} badge={badge} index={idx} />
        ))}
      </div>
    </div>
  );
}
