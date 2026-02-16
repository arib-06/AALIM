// app/(dashboard)/badges/page.js
import { createServerSupabase } from '@/lib/supabaseServer';
import { BADGES, RARITY } from '@/lib/constants';
import BadgesClient from './BadgesClient';

export default async function BadgesPage() {
  // const supabase = createServerSupabase();
  // const { data: { user } } = await supabase.auth.getUser();

  // Mock user badge progress
  const userBadges = [
    { badge_key: 'first', progress: 1, unlocked: true },
    { badge_key: 'streak', progress: 3, unlocked: false },
  ];

  // const { data: userBadges } = await supabase
  //   .from('user_badges')
  //   .select('badge_key, progress, unlocked')
  //   .eq('user_id', user.id);

  const badgeMap = {};
  (userBadges || []).forEach(b => { badgeMap[b.badge_key] = b; });

  // Merge DB data with static badge definitions
  // Import icon mapping - client component handles icons
  const badgesWithProgress = BADGES.map(b => ({
    ...b,
    prog: badgeMap[b.key]?.progress ?? (b.key === 'first' ? 1 : b.key === 'streak' ? 7 : 0),
    unlocked: badgeMap[b.key]?.unlocked ?? (b.key === 'first' || b.key === 'streak'),
  }));

  const unlockedCount = badgesWithProgress.filter(b => b.unlocked).length;

  return (
    <BadgesClient
      badges={badgesWithProgress}
      unlockedCount={unlockedCount}
      totalCount={BADGES.length}
    />
  );
}
