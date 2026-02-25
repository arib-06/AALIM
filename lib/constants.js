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

// Calm, accessible colors for neurodivergent learners
// Each topic has its own color palette for better visual differentiation
export const TOPIC_COLORS = {
  math: {
    primary:   '#9b7fb8',      // Soft purple
    light:     '#c9b3d9',      // Light purple
    lighter:   'rgba(155,127,184,0.1)',
    accent:    '#d4a5f5',      // Lavender accent
    bg:        '#1a141f',      // Dark purple-tinted bg
  },
  science: {
    primary:   '#6eb5a6',      // Soft teal
    light:     '#9dd1c5',      // Light teal
    lighter:   'rgba(110,181,166,0.1)',
    accent:    '#a8e6da',      // Mint accent
    bg:        '#0f1a19',      // Dark teal-tinted bg
  },
  finance: {
    primary:   '#6b9fc8',      // Soft blue
    light:     '#9bc3dd',      // Light blue
    lighter:   'rgba(107,159,200,0.1)',
    accent:    '#a5d3f0',      // Sky blue accent
    bg:        '#0f1620',      // Dark blue-tinted bg
  },
  dataScience: {
    primary:   '#8b7fb5',      // Soft indigo
    light:     '#b8a8d6',      // Light indigo
    lighter:   'rgba(139,127,181,0.1)',
    accent:    '#d0c6e8',      // Periwinkle accent
    bg:        '#16131f',      // Dark indigo-tinted bg
  },
  psychology: {
    primary:   '#d68584',      // Soft coral
    light:     '#e5a9a3',      // Light rose
    lighter:   'rgba(214,133,132,0.1)',
    accent:    '#f0b8b5',      // Rose accent
    bg:        '#1f131a',      // Dark rose-tinted bg
  },
  programming: {
    primary:   '#a8b56f',      // Soft sage green
    light:     '#c8d896',      // Light sage
    lighter:   'rgba(168,181,111,0.1)',
    accent:    '#d9e6b3',      // Light green accent
    bg:        '#141812',      // Dark green-tinted bg
  },
};

export const SUGGESTIONS = [
  { label: 'Explain variables in Python',       topic: 'programming' },
  { label: 'How does compound interest work?',  topic: 'finance'     },
  { label: "What is Newton's 2nd law?",         topic: 'science'     },
  { label: 'Teach me statistics basics',        topic: 'dataScience' },
];

export const SAMPLE_CHATS = [
  // Removed - will be loaded from Supabase
];

export const TEST_BANK = {
  programming: [
    {
      question: 'What does the "const" keyword do in JavaScript?',
      options: [
        'Declares a variable that cannot be reassigned',
        'Declares a variable that must be a constant number',
        'Declares a global variable',
        'Declares a function constant'
      ],
      correct: 0,
      explanation: '"const" declares a block-scoped variable that cannot be reassigned or redeclared. It does not make the variable immutable, just prevents reassignment.'
    },
    {
      question: 'What is the time complexity of binary search?',
      options: [
        'O(n)',
        'O(n log n)',
        'O(log n)',
        'O(n²)'
      ],
      correct: 2,
      explanation: 'Binary search divides the search space in half with each step, resulting in O(log n) time complexity. It requires the data to be sorted.'
    },
    {
      question: 'Which method removes the last element from an array in JavaScript?',
      options: [
        'shift()',
        'pop()',
        'splice()',
        'slice()'
      ],
      correct: 1,
      explanation: 'The pop() method removes the last element from an array and returns it. shift() removes the first element.'
    },
    {
      question: 'What is a REST API?',
      options: [
        'A way to make computers rest',
        'An architectural style using HTTP for CRUD operations',
        'A database management system',
        'A programming language'
      ],
      correct: 1,
      explanation: 'REST (Representational State Transfer) uses standard HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URLs.'
    },
    {
      question: 'What does JSON stand for?',
      options: [
        'JavaScript Object Notation',
        'Java Standard Object Notation',
        'JavaScript Operating Node',
        'Joint Standard Object Network'
      ],
      correct: 0,
      explanation: 'JSON (JavaScript Object Notation) is a lightweight data format used for data exchange, independent of language.'
    },
  ],
  math: [
    {
      question: 'What is the derivative of x²?',
      options: [
        'x',
        '2x',
        '2x²',
        '½x'
      ],
      correct: 1,
      explanation: 'Using the power rule: d/dx(x²) = 2x. The power rule states that d/dx(xⁿ) = n·xⁿ⁻¹.'
    },
    {
      question: 'What is 15% of 200?',
      options: [
        '20',
        '30',
        '35',
        '40'
      ],
      correct: 1,
      explanation: '15% of 200 = 0.15 × 200 = 30. To find a percentage: (percentage/100) × number.'
    },
    {
      question: 'Solve: 2x + 5 = 13',
      options: [
        'x = 3',
        'x = 4',
        'x = 5',
        'x = 6'
      ],
      correct: 1,
      explanation: '2x + 5 = 13 → 2x = 8 → x = 4. Subtract 5 from both sides, then divide by 2.'
    },
    {
      question: 'What is the slope of the line y = 3x + 2?',
      options: [
        '2',
        '3',
        '5',
        'undefined'
      ],
      correct: 1,
      explanation: 'In the equation y = mx + b, m is the slope. Here, the slope is 3 (the coefficient of x).'
    },
    {
      question: 'What is log₁₀(1000)?',
      options: [
        '1',
        '2',
        '3',
        '4'
      ],
      correct: 2,
      explanation: 'log₁₀(1000) = 3 because 10³ = 1000. Logarithms are the inverse of exponents.'
    },
  ],
  science: [
    {
      question: 'What is the SI unit of force?',
      options: [
        'Kilogram',
        'Joule',
        'Newton',
        'Watt'
      ],
      correct: 2,
      explanation: 'The Newton (N) is the SI unit of force. It is defined as kg·m/s². Named after Isaac Newton.'
    },
    {
      question: 'Which gas do plants primarily use for photosynthesis?',
      options: [
        'Oxygen',
        'Carbon dioxide',
        'Nitrogen',
        'Hydrogen'
      ],
      correct: 1,
      explanation: 'Plants absorb CO₂ from the air during photosynthesis. They use it along with water and sunlight to produce glucose and oxygen.'
    },
    {
      question: 'What is the atomic number of Carbon?',
      options: [
        '4',
        '6',
        '8',
        '12'
      ],
      correct: 1,
      explanation: 'Carbon has atomic number 6, meaning it has 6 protons. Its atomic mass is approximately 12.'
    },
    {
      question: 'Which principle explains why objects fall at the same rate in a vacuum?',
      options: [
        'Archimedes Principle',
        'Newton\'s First Law',
        'Newton\'s Second Law',
        'Galileo\'s Principle of Equivalence'
      ],
      correct: 3,
      explanation: 'Galileo\'s principle states that in a vacuum, all objects fall at the same acceleration regardless of mass (about 9.8 m/s² on Earth).'
    },
    {
      question: 'What is the pH of pure water at 25°C?',
      options: [
        '5',
        '6',
        '7',
        '8'
      ],
      correct: 2,
      explanation: 'Pure water at 25°C has a pH of 7, which is neutral. It contains equal concentrations of H⁺ and OH⁻ ions.'
    },
  ],
  finance: [
    {
      question: 'What is compound interest?',
      options: [
        'Interest paid only once per year',
        'Interest earned on interest',
        'A fixed interest rate',
        'Interest paid monthly'
      ],
      correct: 1,
      explanation: 'Compound interest is calculated on the principal plus previously earned interest, causing exponential growth over time.'
    },
    {
      question: 'What does CAGR stand for?',
      options: [
        'Compound Annual Growth Rate',
        'Capital Asset Growth Ratio',
        'Cumulative Annual Gain Ratio',
        'Compound Account Generation Rate'
      ],
      correct: 0,
      explanation: 'CAGR measures the mean annual growth rate of an investment over a specified period longer than one year.'
    },
    {
      question: 'What is a stock dividend?',
      options: [
        'A fee paid to buy stocks',
        'A percentage gain in stock price',
        'A share of company profits paid to shareholders',
        'A loan provided by the company'
      ],
      correct: 2,
      explanation: 'A dividend is a distribution of company earnings to shareholders, usually paid quarterly or annually.'
    },
    {
      question: 'What does diversification in investing mean?',
      options: [
        'Investing all money in one stock',
        'Spreading investments across different assets to reduce risk',
        'Buying and selling quickly',
        'Borrowing money to invest'
      ],
      correct: 1,
      explanation: 'Diversification reduces risk by spreading investments across multiple asset types, industries, and geographies.'
    },
    {
      question: 'What is the difference between a bond and a stock?',
      options: [
        'Bonds are riskier than stocks',
        'Stocks represent ownership; bonds represent debt',
        'Bonds are only for companies',
        'There is no difference'
      ],
      correct: 1,
      explanation: 'Stocks represent partial ownership in a company, while bonds represent a loan to a company or government with fixed interest payments.'
    },
  ],
  dataScience: [
    {
      question: 'What does ML stand for?',
      options: [
        'Machine Learning',
        'Massive Language',
        'Multi-Layer',
        'Memory Logic'
      ],
      correct: 0,
      explanation: 'Machine Learning (ML) is a subset of AI that allows systems to learn and improve from data without being explicitly programmed.'
    },
    {
      question: 'What is the primary purpose of data normalization?',
      options: [
        'To delete unnecessary data',
        'To scale features to a similar range',
        'To increase memory usage',
        'To create more data'
      ],
      correct: 1,
      explanation: 'Normalization scales features to a similar range, which helps machine learning models train faster and perform better.'
    },
    {
      question: 'Which algorithm is used for unsupervised learning?',
      options: [
        'Linear Regression',
        'Decision Trees',
        'K-Means Clustering',
        'Logistic Regression'
      ],
      correct: 2,
      explanation: 'K-Means is an unsupervised learning algorithm that groups data into clusters without labeled training data.'
    },
    {
      question: 'What is the difference between accuracy and precision?',
      options: [
        'They are the same thing',
        'Accuracy: correct predictions; Precision: correct positive predictions',
        'Accuracy is more important',
        'Precision is for regression only'
      ],
      correct: 1,
      explanation: 'Accuracy is the ratio of correct predictions to all predictions. Precision is the ratio of correct positive predictions to all positive predictions.'
    },
    {
      question: 'Which data structure is best for storing time-series data?',
      options: [
        'Hash Table',
        'Linked List',
        'Time Series Database or DataFrame',
        'Boolean Array'
      ],
      correct: 2,
      explanation: 'Time Series Databases and DataFrames (like pandas) are optimized for storing and analyzing sequential time-stamped data.'
    },
  ],
  psychology: [
    {
      question: 'What is cognitive bias?',
      options: [
        'A type of mental illness',
        'A systematic error in thinking',
        'A sign of intelligence',
        'A medical condition'
      ],
      correct: 1,
      explanation: 'Cognitive bias is a systematic deviation from rational thinking, where we process information in a way that affects our decision-making.'
    },
    {
      question: 'Which neurotransmitter is associated with mood and happiness?',
      options: [
        'Dopamine',
        'Serotonin',
        'Acetylcholine',
        'Glutamate'
      ],
      correct: 1,
      explanation: 'Serotonin is a neurotransmitter that regulates mood, emotions, and sleep. Low serotonin is linked to depression.'
    },
    {
      question: 'What is Maslow\'s hierarchy of needs\' top level?',
      options: [
        'Safety',
        'Love and belonging',
        'Self-actualization',
        'Esteem'
      ],
      correct: 2,
      explanation: 'Self-actualization is at the top of Maslow\'s hierarchy, representing the realization of personal potential and self-fulfillment.'
    },
    {
      question: 'What is operant conditioning?',
      options: [
        'Conditioning based on involuntary responses',
        'Learning based on consequences of behavior',
        'A type of phobia',
        'A sleep disorder'
      ],
      correct: 1,
      explanation: 'Operant conditioning is learning based on consequences—behavior followed by rewards is more likely to be repeated.'
    },
    {
      question: 'What does IQ stand for?',
      options: [
        'Intelligence Quotient',
        'Information Quality',
        'Intelligent Quantity',
        'Intellective Quotient'
      ],
      correct: 0,
      explanation: 'IQ (Intelligence Quotient) is a measure of cognitive ability, typically assessed through standardized tests.'
    },
  ],
};
