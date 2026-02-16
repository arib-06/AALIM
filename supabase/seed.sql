-- ============================================================
--  AALIM — Seed Data
--  Run AFTER schema.sql
-- ============================================================

-- Topics
insert into public.topics (key, label, description, total, sort_order) values
  ('math',        'Mathematics',  'Algebra, Geometry, and Calculus',        10, 1),
  ('science',     'Science',      'Physics, Chemistry, and Biology',         8, 2),
  ('finance',     'Finance',      'Investing, Budgeting, and Markets',      12, 3),
  ('dataScience', 'Data Science', 'Statistics, ML, and Analysis',           15, 4),
  ('psychology',  'Psychology',   'Behavior, Cognition, and the Mind',       8, 5),
  ('programming', 'Programming',  'Algorithms, Web Dev, and Languages',     10, 6)
on conflict (key) do nothing;

-- Badge definitions
insert into public.badges (key, label, description, xp, rarity, goal) values
  ('first',    'First Step',       'Complete your first lesson',             50,   'common',    1 ),
  ('streak',   'On Fire',          '7-day learning streak',                  200,  'rare',      7 ),
  ('math',     'Math Scholar',     'Complete 10 math concepts',              500,  'epic',      10),
  ('science',  'Science Curious',  'Complete 8 science concepts',            400,  'rare',      8 ),
  ('code',     'Code Wizard',      'Complete 10 programming concepts',       600,  'epic',      10),
  ('data',     'Data Scientist',   'Complete 15 data science concepts',      800,  'legendary', 15),
  ('psych',    'Mind Reader',      'Complete all psychology modules',        700,  'legendary', 8 ),
  ('finance',  'Market Maestro',   'Master all finance topics',              750,  'epic',      12),
  ('speed',    'Quick Learner',    'Complete 5 lessons under 5 mins',        300,  'rare',      5 )
on conflict (key) do nothing;
