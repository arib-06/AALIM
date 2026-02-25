# AALIM — Adaptive Assistive Learning Interface Model

A premium, gold-and-charcoal AI-powered learning platform built with **Next.js 14**, **Tailwind CSS**, **Supabase**, and **Google Gemini AI (Free)**.

---

## Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Framework   | Next.js 14 (App Router)       |
| Styling     | Tailwind CSS + custom CSS     |
| Auth & DB   | Supabase (Postgres + Auth)    |
| AI Engine   | Google Gemini (Free)          |
| Icons       | Lucide React                  |
| Hosting     | Vercel (recommended)          |

---

## Features

✨ **AI-Powered Learning**
- Chat-based learning with Google Gemini AI
- Natural language explanations with step-by-step breakdowns
- Context-aware responses based on topic

🎯 **Smart Content Highlighting**
- AI highlights important sentences automatically
- Visual emphasis on critical concepts and definitions
- Better retention through structured emphasis

📖 **Interactive Learning**
- Multiple learning modes (chat, guided lessons)
- Progress tracking per topic
- Real-time feedback and explanations

🧪 **Built-In MCQ Tests**
- 5-question quizzes for each topic (Math, Science, Programming, Finance, Data Science, Psychology)
- **Dynamic question generation** using Google Gemini AI (adapts to current topic)
- Fallback to comprehensive static test bank if API unavailable
- Instant feedback with detailed explanations
- Score tracking and unlimited retries
- "Take Quiz" button on learning page for seamless access

🔊 **Text-to-Speech**
- Read lessons aloud using Web Speech API
- Adjustable speech speed (0.9x)
- Toggle on/off per response
- Perfect for multi-modal learning

🏆 **Achievement System**
- Earn badges for learning milestones
- Track progress across topics
- Streak tracking and quick learner rewards
- Rarity tiers: Common, Rare, Epic, Legendary

🎨 **Neurodivergent-Friendly UI**
- **Topic-Specific Color Themes:** Each topic has a calm, distinct color palette:
  - **Math:** Soft purple (calming, analytical)
  - **Science:** Soft teal (nature-inspired, grounding)
  - **Finance:** Soft blue (trust, stability)
  - **Data Science:** Soft indigo (focused, analytical)
  - **Psychology:** Soft coral (warm, welcoming)
  - **Programming:** Soft sage green (fresh, natural)
- Color-coded backgrounds and UI elements for better visual differentiation
- Reduces cognitive load and improves focus for neurodivergent learners
- Calm color palette designed to reduce eye strain and mental fatigue

---

## Project Structure

```
aalim/
├── app/
│   ├── (auth)/
│   │   ├── login/page.js          # Login page
│   │   └── signup/page.js         # Signup page
│   ├── (dashboard)/
│   │   ├── layout.js              # Dashboard shell (with sidebar)
│   │   ├── home/page.js           # AI chat home
│   │   ├── topics/page.js         # Browse all topics
│   │   ├── learn/page.js          # AI-powered learning chat
│   │   ├── quiz/page.js           # MCQ quiz & test mode
│   │   ├── badges/page.js         # Achievements (server)
│   │   │   └── BadgesClient.jsx   # Achievements (client)
│   │   └── settings/page.js       # User preferences
│   ├── api/
│   │   ├── chat/route.js          # POST — OpenAI chat
│   │   ├── profile/route.js       # GET/PATCH — user profile
│   │   └── progress/route.js      # POST — update topic progress
│   ├── globals.css                # Tailwind + custom animations
│   ├── layout.js                  # Root layout
│   └── page.js                    # Landing page
├── components/
│   ├── Sidebar.jsx                # ChatGPT-style left sidebar
│   ├── BadgeCard.jsx              # Badge with glow effects
│   ├── QuizCard.jsx               # MCQ question card with instant feedback
│   ├── Ring.jsx                   # SVG progress ring
│   └── Toggle.jsx                 # On/off toggle switch
├── hooks/
│   └── useProfile.js              # User preferences hook
├── lib/
│   ├── constants.js               # Topics, badges, rarity data
│   ├── supabase.js                # Browser Supabase client
│   ├── supabaseServer.js          # Server Supabase + admin client
│   └── utils.js                  # cn(), speak(), badgePct()
├── supabase/
│   ├── schema.sql                 # Full DB schema + RLS policies
│   └── seed.sql                   # Initial topics + badge data
├── middleware.js                   # Auth + session refresh
├── tailwind.config.js             # Custom AALIM color tokens
├── next.config.js
├── .env.local.example             # Environment variable template
└── README.md
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/arib-06/AALIM.git
cd AALIM
npm install
```

### 2. Set Up Supabase

**Option A: Use Your Own Supabase Project (Recommended for collaborators)**

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Go to **SQL Editor** → New Query
3. Paste and run `supabase/schema.sql`
4. Then paste and run `supabase/seed.sql`
5. Go to **Settings → API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

**Option B: Ask Project Owner for Credentials**

If you're collaborating, ask the project owner to share the Supabase credentials with you securely (NOT via GitHub).

### 3. Set Up Google Gemini AI

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (no credit card required!)

### 4. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your own API keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_API_KEY=your-google-api-key
GOOGLE_MODEL=gemini-2.5-flash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ IMPORTANT:** Never commit `.env.local` to Git! It's already in `.gitignore`.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

### Run Frontend Only

If you only want to run the Next.js frontend (no external services required), use the frontend scripts below. These run the Next dev server or a production server for just the frontend app.

```bash
# Development (hot-reload):
npm run dev:frontend

# Build for production:
npm run build:frontend

# Start production server:
npm run start:frontend

# Export a static site (no server-side APIs):
npm run export
```

Notes:
- `npm run export` produces a static site in `out/` but may not support server-side API routes or some App Router features.
- If your app depends on Supabase, set `NEXT_PUBLIC_SUPABASE_*` env vars to a hosted Supabase project before running.

## Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## Supabase Auth Setup

In your Supabase dashboard:
1. **Authentication → Settings** → Set Site URL to your domain
2. **Authentication → Email Templates** → Customise confirmation email (optional)
3. **Authentication → Providers** → Enable Google/GitHub OAuth (optional)

---

## Customising Colors

All brand colors are defined in `tailwind.config.js`:

```js
colors: {
  aalim: { bg, sidebar, surface, card, text, sub, muted },
  gold:  { DEFAULT, hi, lo, border, dim },
  rarity: { common, rare, epic, legendary }
}
```

---

## API Routes

| Method | Endpoint               | Description                                          |
|--------|------------------------|------------------------------------------------------|
| POST   | `/api/chat`            | Send message, get AI response                        |
| POST   | `/api/quiz-generator`  | Generate AI quiz questions for a topic (dynamic)     |
| GET    | `/api/profile`         | Fetch current user's preferences                     |
| PATCH  | `/api/profile`         | Update user preferences                              |
| POST   | `/api/progress`        | Increment topic progress + badges                    |

The `/api/quiz-generator` endpoint generates unique quiz questions using Google Gemini AI based on the topic, ensuring questions are relevant to the current learning content.

All routes require a valid Supabase session cookie (set automatically on login).

---

## Quiz & Assessment System

**MCQ Tests** are built into AALIM for self-assessment and content revision:

- **Location:** `app/(dashboard)/quiz/page.js`
- **Dynamic Generation:** Questions are generated using Google Gemini AI based on the topic (via `/api/quiz-generator`)
- **Fallback:** Comprehensive static TEST_BANK in `lib/constants.js` used if API is unavailable
- **Topics:** 6 topics (Math, Science, Programming, Finance, Data Science, Psychology)
- **Questions per Quiz:** 5 multiple-choice questions per topic
- **Instant Feedback:** Explanations provided for each answer
- **Score Tracking:** Visual progress bar + percentage score
- **Topic-Aligned:** Questions adapt to the topic the user is currently studying
- **Retry Logic:** Users can retake quizzes with newly generated questions for practice

**How to Access:**
- **From Learn Page:** Click the "Take Quiz" button in the learning header
- **From Sidebar:** Click **Quiz** and select a topic
- Complete all 5 questions to see results
- Review explanations and retake for practice

**How It Works:**
1. User selects a topic or clicks "Take Quiz" while learning
2. Quiz page requests dynamic questions from `/api/quiz-generator`
3. Gemini AI generates 5 unique questions based on the topic
4. If the API fails, fallback to pre-built questions in TEST_BANK
5. User completes quiz and gets instant feedback with explanations
6. AI-generated badge appears (✨ AI Generated) to indicate dynamic questions

**Adding New Quizzes:**
To add more questions, edit `lib/constants.js` and add to `TEST_BANK`:

```javascript
export const TEST_BANK = {
  'your-topic': [
    {
      question: 'Your question here?',
      options: ['A', 'B', 'C', 'D'],
      correct: 0, // index of correct answer
      explanation: 'Why this answer is correct...'
    },
    // More questions...
  ]
}
```

---

## License

MIT — use freely for personal and commercial projects.
