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
  streak_days:   0,
};

export function useProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile({ ...DEFAULT_PROFILE, ...data });
      setLoading(false);
    })();
  }, []);

  const updateProfile = async (updates) => {
    setProfile(p => ({ ...p, ...updates }));
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', user.id);
    }
  };

  return { profile, loading, updateProfile };
}
