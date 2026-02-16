// app/api/progress/route.js
// Updates topic progress and checks badge unlock conditions

import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseServer';
import { BADGES } from '@/lib/constants';

// POST /api/progress — increment progress for a topic
export async function POST(request) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { topic_key } = await request.json();
  if (!topic_key) return NextResponse.json({ error: 'topic_key required' }, { status: 400 });

  // Upsert progress
  const { data: existing } = await supabase
    .from('user_progress')
    .select('progress')
    .eq('user_id', user.id)
    .eq('topic_key', topic_key)
    .single();

  const newProgress = (existing?.progress || 0) + 1;
  await supabase.from('user_progress').upsert({
    user_id:   user.id,
    topic_key,
    progress:  newProgress,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,topic_key' });

  // Check and update badge progress
  const unlockedBadges = [];
  for (const badge of BADGES) {
    if (badge.key !== topic_key && badge.key !== 'first' && badge.key !== 'streak') continue;

    const badgeProgress = badge.key === 'first' ? 1 : newProgress;
    const unlocked      = badgeProgress >= badge.goal;

    const { data: existing } = await supabase
      .from('user_badges')
      .select('unlocked')
      .eq('user_id', user.id)
      .eq('badge_key', badge.key)
      .single();

    if (!existing?.unlocked) {
      await supabase.from('user_badges').upsert({
        user_id:    user.id,
        badge_key:  badge.key,
        progress:   badgeProgress,
        unlocked,
        unlocked_at: unlocked ? new Date().toISOString() : null,
      }, { onConflict: 'user_id,badge_key' });

      if (unlocked) unlockedBadges.push(badge.key);
    }
  }

  return NextResponse.json({
    progress:       newProgress,
    unlockedBadges,
  });
}
