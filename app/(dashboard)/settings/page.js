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
    color_blind_mode: 'none',
    greyscale:     false,
    adhd_mode:     false,
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // User is authenticated - try to load from database
          const { data, error } = await supabase
            .from('profiles')
          .select('font_scale, line_height, tts_enabled, reduce_motion, dyslexia_font, eye_tracking, color_blind_mode, greyscale')
          
          if (error) {
            // Profile doesn't exist, check localStorage
            const stored = localStorage.getItem('aalim_prefs');
            if (stored) {
              setPrefs(JSON.parse(stored));
            }
          } else if (data) {
            setPrefs(data);
            // Sync localStorage with database
            localStorage.setItem('aalim_prefs', JSON.stringify(data));
          }
        } else {
          // User not authenticated - load from localStorage
          const stored = localStorage.getItem('aalim_prefs');
          if (stored) {
            setPrefs(JSON.parse(stored));
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading settings:', error);
        // Try localStorage as final fallback
        const stored = localStorage.getItem('aalim_prefs');
        if (stored) {
          setPrefs(JSON.parse(stored));
        }
        setLoading(false);
      }
    })();
  }, [supabase]);

  const update = (key, val) => setPrefs(p => ({ ...p, [key]: val }));

  const savePrefs = async () => {
    setSaving(true);
    try {
      // Always save to localStorage first (works without account)
      localStorage.setItem('aalim_prefs', JSON.stringify(prefs));
      
      // Try to save to database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const response = await fetch('/api/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prefs),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error saving preferences to database:', errorData);
          // Still consider it a success since localStorage saved
        }
      }
      
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Even if there's an error, localStorage should have saved
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
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
        { label: 'Dyslexia-Friendly Font', sub: 'OpenDyslexic with enhanced letter recognition', ctrl: <Toggle checked={!!prefs.dyslexia_font} onChange={v => update('dyslexia_font', v)} /> },
      ],
    },
    {
      title: 'Vision & Color',
      rows: [
        {
          label: 'Color Blind Mode',
          sub: 'Adjust colors for color vision deficiency',
          ctrl: (
            <select
              value={prefs.color_blind_mode}
              onChange={e => update('color_blind_mode', e.target.value)}
              className="px-3 py-1.5 rounded text-sm bg-white/10 border border-white/20 text-aalim-text"
            >
              <option value="none">None</option>
              <option value="protanopia">Red-blind (Protanopia)</option>
              <option value="deuteranopia">Green-blind (Deuteranopia)</option>
              <option value="tritanopia">Blue-yellow (Tritanopia)</option>
              <option value="monochromacy">Monochromacy</option>
            </select>
          ),
        },
        { label: 'Greyscale Mode', sub: 'Convert all colors to greyscale', ctrl: <Toggle checked={!!prefs.greyscale} onChange={v => update('greyscale', v)} /> },
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
      title: 'Learning Support',
      rows: [
        { label: 'ADHD-Friendly Mode', sub: 'Break content into smaller chunks to reduce overwhelm', ctrl: <Toggle checked={!!prefs.adhd_mode} onChange={v => update('adhd_mode', v)} /> },
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
