// lib/constants.js
// Central data store for topics, badges, and rarity tiers

export const TOPICS = [
  { key: 'math',        label: 'Mathematics',  sub: 'Algebra · Calculus · Geometry',     total: 10 },
  { key: 'science',     label: 'Science',       sub: 'Physics · Chemistry · Biology',     total: 8  },
  { key: 'finance',     label: 'Finance',       sub: 'Investing · Budgeting · Markets',   total: 12 },
  { key: 'dataScience', label: 'Data Science',  sub: 'Statistics · ML · Analysis',       total: 15 },
  { key: 'psychology',  label: 'Psychology',    sub: 'Behavior · Cognition · Mind',      total: 8  },
  { key: 'programming', label: 'Programming',   sub: 'Algorithms · Web Dev · Languages', total: 10 },
];

export const BADGES = [
  { key: 'first',    label: 'First Step',       desc: 'Completed your first lesson',           xp: 50,   rarity: 'common',    goal: 1  },
  { key: 'streak',   label: 'On Fire',          desc: '7-day learning streak',                 xp: 200,  rarity: 'rare',      goal: 7  },
  { key: 'math',     label: 'Math Scholar',     desc: 'Complete 10 math concepts',             xp: 500,  rarity: 'epic',      goal: 10 },
  { key: 'science',  label: 'Science Curious',  desc: 'Complete 8 science concepts',           xp: 400,  rarity: 'rare',      goal: 8  },
  { key: 'code',     label: 'Code Wizard',      desc: 'Complete 10 programming concepts',      xp: 600,  rarity: 'epic',      goal: 10 },
  { key: 'data',     label: 'Data Scientist',   desc: 'Complete 15 data science concepts',     xp: 800,  rarity: 'legendary', goal: 15 },
  { key: 'psych',    label: 'Mind Reader',      desc: 'Complete all psychology modules',       xp: 700,  rarity: 'legendary', goal: 8  },
  { key: 'finance',  label: 'Market Maestro',   desc: 'Master all finance topics',             xp: 750,  rarity: 'epic',      goal: 12 },
  { key: 'speed',    label: 'Quick Learner',    desc: 'Complete 5 lessons under 5 mins',       xp: 300,  rarity: 'rare',      goal: 5  },
];

export const RARITY = {
  common:    { color: '#7aad7a', glow: 'rgba(122,173,122,0.5)',  label: 'Common'    },
  rare:      { color: '#5ba3e8', glow: 'rgba(91,163,232,0.55)',  label: 'Rare'      },
  epic:      { color: '#c084fc', glow: 'rgba(192,132,252,0.55)', label: 'Epic'      },
  legendary: { color: '#c9a84c', glow: 'rgba(201,168,76,0.6)',   label: 'Legendary' },
};

export const SUGGESTIONS = [
  { label: 'Explain variables in Python',       topic: 'programming' },
  { label: 'How does compound interest work?',  topic: 'finance'     },
  { label: "What is Newton's 2nd law?",         topic: 'science'     },
  { label: 'Teach me statistics basics',        topic: 'dataScience' },
];

export const SAMPLE_CHATS = [
  'What is a function in Python?',
  'Explain photosynthesis simply',
  'How does compound interest work?',
  "Newton's laws of motion",
  'What is machine learning?',
];
