// app/(dashboard)/topics/page.js
import { ChevronRight, Calculator, FlaskConical, DollarSign, BarChart2, Brain, Code } from 'lucide-react';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabaseServer';
import { TOPICS } from '@/lib/constants';

const ICONS = { math: Calculator, science: FlaskConical, finance: DollarSign, dataScience: BarChart2, psychology: Brain, programming: Code };

export default async function TopicsPage() {
  // const supabase = createServerSupabase();
  // const { data: { user } } = await supabase.auth.getUser();

  // Mock user progress
  const progressRows = [
    { topic_key: 'math', progress: 5 },
    { topic_key: 'finance', progress: 2 },
  ];

  // const { data: progressRows } = await supabase
  //   .from('user_progress')
  //   .select('topic_key, progress')
  //   .eq('user_id', user.id);

  const progressMap = {};
  (progressRows || []).forEach(r => { progressMap[r.topic_key] = r.progress; });

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      {/* Header */}
      <p className="text-[0.7rem] text-gold font-semibold uppercase tracking-[0.16em] mb-2">Browse</p>
      <h1 className="font-display font-semibold text-aalim-text mb-2" style={{ fontSize: '2.2rem' }}>All Topics</h1>
      <p className="text-aalim-sub font-light text-sm mb-8">Select a subject to begin a lesson.</p>

      {/* Topic list */}
      <div
        className="flex flex-col overflow-hidden rounded-lg"
        style={{ border: '1px solid rgba(255,255,255,0.07)', gap: '1px', background: 'rgba(255,255,255,0.07)' }}
      >
        {TOPICS.map(({ key, label, sub, total }) => {
          const Ic = ICONS[key] || Code;
          const progress = progressMap[key] || 0;
          const pct = Math.round((progress / total) * 100);

          return (
            <Link
              key={key}
              href={`/learn?topic=${key}`}
              className="group flex items-center gap-4 px-6 py-5 bg-aalim-card transition-colors duration-150"
              style={{ background: '#181818' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1e1e14'}
              onMouseLeave={e => e.currentTarget.style.background = '#181818'}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-150"
                style={{
                  background: '#141414',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#7a6e54',
                }}
              >
                <Ic size={17} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-aalim-sub group-hover:text-aalim-text transition-colors">{label}</span>
                  <span className="text-[0.68rem] truncate" style={{ color: '#3a3428' }}>{sub}</span>
                </div>
                {/* Progress bar */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-0.5 rounded-full max-w-[140px]" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #c9a84c, #e2c46a)' }}
                    />
                  </div>
                  <span className="text-[0.65rem]" style={{ color: '#3a3428' }}>{progress}/{total}</span>
                </div>
              </div>

              <ChevronRight size={14} style={{ color: '#3a3428' }} className="flex-shrink-0 group-hover:text-gold transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
