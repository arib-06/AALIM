# ✨ AALIM — Adaptive Assistive Learning Interface Model

<div align="center">
  <img src="https://raw.githubusercontent.com/arib-06/AALIM/main/public/logo.png" alt="AALIM Logo" width="120" />
  <h3>Intelligent, adaptive education built around you.</h3>
  <p><i>No labels. No diagnosis. Just learning, your way.</i></p>
</div>

---

## 🌟 The Vision: AI for Social Good

AALIM is more than just a learning platform; it's a commitment to **educational equity**. Built on the principle that every mind works differently, AALIM leverages cutting-edge AI to break down barriers for neurodivergent learners. Whether you are navigating dyslexia, ADHD, or visual sensitivities, AALIM adapts its very DNA—from UI layout to content delivery—to match your unique cognitive profile.

---

## 🛠️ Neurodivergent-Friendly Features

### 🧠 Cognitive Support
- **ADHD-Focused Mode:** Dynamically breaks down complex topics into "bite-sized" chunks to prevent cognitive overwhelm and maintain focus.
- **OpenDyslexic Integration:** One-click activation of specialized typography designed to increase readability for users with dyslexia.
- **Smart Content Highlighting:** AI-driven emphasis on critical concepts, ensuring key takeaways are never missed.

### 🎨 Sensory & Visual Adaptation
- **Topic-Specific Color Psychology:** Calm, distinct palettes for every subject (e.g., calming Purple for Math, grounding Teal for Science) to reduce eye strain and provide visual anchoring.
- **High Contrast & Color Blind Modes:** Comprehensive support for Protanopia, Deuteranopia, Tritanopia, and Monochromacy.
- **Reduce Motion:** Toggle to disable animations for users sensitive to motion or seeking a distraction-free experience.

### 🔊 Multimodal Learning
- **Text-to-Speech (TTS):** Integrated Web Speech API with adjustable speeds (0.9x optimized for comprehension) to support auditory learners.
- **Interactive AI Chat:** Powered by **Google Gemini**, providing conversational, step-by-step explanations for any topic.

---

## 🚀 Core Functionalities

- 🧪 **AI-Generated Quizzes:** Dynamic MCQ assessments that adapt to your current learning progress using Gemini AI.
- 🏆 **Achievement System:** Earn tiered badges (Common to Legendary) for milestones, encouraging consistent learning habits.
- 📊 **Progress Tracking:** Visualized growth across 6 core domains: Math, Science, Programming, Finance, Data Science, and Psychology.

---

## 💻 Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| **Frontend** | Next.js 14 (App Router)       |
| **Styling**  | Tailwind CSS + Custom CSS     |
| **Backend**  | Supabase (Postgres + Auth)    |
| **AI Engine**| Google Gemini AI              |
| **Icons**    | Lucide React                  |

---

## 🛠️ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/arib-06/AALIM.git
cd AALIM
npm install
```

### 2. Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` and `supabase/seed.sql` in the **SQL Editor**.
3. Copy your API keys from **Settings → API**.

### 3. Set Up Gemini AI
1. Get an API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### 4. Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_API_KEY=your-google-api-key
GOOGLE_MODEL=gemini-2.0-flash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run it!
```bash
npm run dev
```

---

## 📁 Project Structure

```text
aalim/
├── app/                  # Next.js App Router (Dashboard, Auth, API)
├── components/           # Reusable UI (BadgeCard, QuizCard, Sidebar, etc.)
├── hooks/                # Custom React hooks (useProfile)
├── lib/                  # Utilities, Constants, & Supabase Clients
├── supabase/             # Database Schemas & Seed Data
└── public/               # Static Assets
```

---

## 📡 API Endpoints

- `POST /api/chat`: AI interaction entry point.
- `POST /api/quiz-generator`: Dynamic question generation.
- `PATCH /api/profile`: Update accessibility preferences.
- `POST /api/progress`: Track milestones and award badges.

---

## 📜 License
MIT — Empowering learners everywhere.
