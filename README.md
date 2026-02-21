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
git clone <your-repo-url>
cd aalim
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Go to **SQL Editor** → New Query
3. Paste and run `supabase/schema.sql`
4. Then paste and run `supabase/seed.sql`
5. Go to **Settings → API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### 3. Set Up Google Gemini AI

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (no credit card required!)

### 4. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_API_KEY=your-google-api-key
GOOGLE_MODEL=gemini-2.0-flash-exp
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

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

| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| POST   | `/api/chat`       | Send message, get AI response        |
| GET    | `/api/profile`    | Fetch current user's preferences     |
| PATCH  | `/api/profile`    | Update user preferences              |
| POST   | `/api/progress`   | Increment topic progress + badges    |

All routes require a valid Supabase session cookie (set automatically on login).

---

## License

MIT — use freely for personal and commercial projects.
