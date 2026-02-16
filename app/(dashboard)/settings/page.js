'use client';
// app/(dashboard)/settings/page.js

import { useState, useEffect } from 'react';
import Toggle from '@/components/Toggle';
import { getSupabase } from '@/lib/supabase';
import { Check, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const supabase = getSupabase();
  const [prefs, setPrefs] = useState({
    font_scale:    100,
    line_height:   1.6,
    tts_enabled:   true,
    reduce_motion: false,
    dyslexia_font: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('font_scale, line_height, tts_enabled, reduce_motion, dyslexia_font')
        .eq('id', user.id)
        .single();
      if (data) setPrefs(data);
      setLoading(false);
    })();
  }, []);

  const update = (key, val) => setPrefs(p => ({ ...p, [key]: val }));

  const savePrefs = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').update(prefs).eq('id', user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const labelClass = 'text-[0.65rem] uppercase tracking-[0.15em] font-semibold mb-1.5 block px-0.5';
  const rowClass   = 'flex items-center justify-between px-5 py-4 gap-4';
  const divClass   = 'my-0 h-px mx-0' ;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={20} className="animate-spin text-gold" />
    </div>
  );

  const sections = [
    {
      title: 'Display',
      rows: [
        {
          label: 'Font Size',
          sub: `${prefs.font_scale}%`,
          ctrl: (
            <input
              type="range" min={75} max={200} step={10} value={prefs.font_scale}
              onChange={e => update('font_scale', +e.target.value)}
              className="w-36"
            />
          ),
        },
        {
          label: 'Line Spacing',
          sub: `${Number(prefs.line_height).toFixed(1)}×`,
          ctrl: (
            <input
              type="range" min={1} max={2.5} step={0.25} value={prefs.line_height}
              onChange={e => update('line_height', +e.target.value)}
              className="w-36"
            />
          ),
        },
      ],
    },
    {
      title: 'Readability',
      rows: [
        { label: 'Dyslexia-Friendly Font', sub: 'Lexend with enhanced spacing', ctrl: <Toggle checked={!!prefs.dyslexia_font} onChange={v => update('dyslexia_font', v)} /> },
      ],
    },
    {
      title: 'Audio & Motion',
      rows: [
        { label: 'Text-to-Speech',  sub: 'Click any text to hear it read aloud', ctrl: <Toggle checked={!!prefs.tts_enabled}   onChange={v => update('tts_enabled',   v)} /> },
        { label: 'Reduce Motion',   sub: 'Disable animations and transitions',   ctrl: <Toggle checked={!!prefs.reduce_motion} onChange={v => update('reduce_motion', v)} /> },
      ],
    },
    {
      title: 'Ethics & Privacy',
      rows: [
        { label: 'No Diagnoses',       sub: 'All settings are personal preferences only'    },
        { label: 'Not Medical Advice', sub: 'AALIM is a learning tool, not healthcare'      },
        { label: 'Session Data',       sub: 'Chat history is private and tied to your account' },
      ],
    },
  ];

  return (
    <div className="max-w-[580px] mx-auto px-8 py-12">
      <p className="text-[0.7rem] text-gold font-semibold uppercase tracking-[0.16em] mb-2">Preferences</p>
      <h1 className="font-display font-semibold text-aalim-text mb-8" style={{ fontSize: '2.2rem' }}>Settings</h1>

      {sections.map(({ title, rows }) => (
        <div key={title} className="mb-4">
          <span className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold px-0.5 mb-1.5 block" style={{ color: '#3a3428' }}>
            {title}
          </span>
          <div className="overflow-hidden rounded-lg" style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.07)' }}>
            {rows.map(({ label, sub, ctrl }, i) => (
              <div
                key={label}
                className="flex items-center justify-between px-5 py-4 gap-4"
                style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              >
                <div>
                  <div className="text-sm text-aalim-text font-normal">{label}</div>
                  {sub && <div className="text-[0.7rem] font-light mt-0.5" style={{ color: '#3a3428' }}>{sub}</div>}
                </div>
                {ctrl && <div className="flex-shrink-0">{ctrl}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save button */}
      <button
        onClick={savePrefs} disabled={saving}
        className="mt-4 w-full py-3 rounded-sm font-semibold text-sm uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #c9a84c, #e2c46a)', color: '#0a0a0a' }}
      >
        {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : null}
        {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Preferences'}
      </button>
    </div>
  );
}
