// hooks/useProfile.js
'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

const DEFAULT_PROFILE = {
  font_scale:    100,
  line_height:   1.6,
  tts_enabled:   true,
  reduce_motion: false,
  dyslexia_font: false,
  color_blind_mode: 'none',
  greyscale:     false,
  adhd_mode:     false,
  streak_days:   0,
};

export function useProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // User authenticated - try to load from database
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (data) {
            setProfile({ ...DEFAULT_PROFILE, ...data });
            // Sync localStorage
            localStorage.setItem('aalim_prefs', JSON.stringify(data));
          } else {
            // No database profile, check localStorage
            const stored = localStorage.getItem('aalim_prefs');
            if (stored) {
              setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(stored) });
            }
          }
        } else {
          // User not authenticated - load from localStorage
          const stored = localStorage.getItem('aalim_prefs');
          if (stored) {
            setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(stored) });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem('aalim_prefs');
        if (stored) {
          setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(stored) });
        }
      }
      setLoading(false);
    })();
  }, [supabase]);

  const updateProfile = async (updates) => {
    setProfile(p => ({ ...p, ...updates }));
    
    // Always save to localStorage
    localStorage.setItem('aalim_prefs', JSON.stringify({ ...profile, ...updates }));
    
    // Try to save to database if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', user.id);
    }
  };

  return { profile, loading, updateProfile };
}

