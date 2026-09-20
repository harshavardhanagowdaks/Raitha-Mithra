# Raitha Mithra (ರೈತ ಮಿತ್ರ)

**Raitha Mithra (ರೈತ ಮಿತ್ರ)** is a full-stack, installable, bilingual (Kannada + English) agricultural platform designed specifically for Indian farmers. It operates entirely on free-tier infrastructure.

---

## Key Features & Stack

- **Frontend & PWA**: Built with React, Vite, Tailwind CSS, Lucide Icons, and `vite-plugin-pwa` for offline app shell caching and PWA installation.
- **Backend**: Vercel Serverless Functions (Node.js API routes) & daily Vercel Cron scraper.
- **Database & Storage**: Supabase (PostgreSQL with RLS, Storage bucket `crop_photos` for leaf scans).
- **Authentication**: Supabase Auth with Google OAuth ("Sign in with Google") and Magic Link Gmail SMTP fallback.
- **AI & RAG Grounding**: Powered by **Gemini 2.5 Flash / 2.0 Flash Lite API** via `@google/genai` SDK, grounded with database content for verified agronomic advice.
- **Weather Context**: Open-Meteo API (free, no API key required) joined by district.
- **Market Prices**: Daily scheduled scraping of Karnataka AgMarknet (KRAMA), Coffee Board of India, and Coconut Development Board.
- **5-Stage Disease/Pest Vision Pipeline**: Python microservice script for Hugging Face Spaces free tier (YOLOv8 + EfficientNet classifiers) + Gemini 2.5 Flash Vision fallback.
- **Bilingual Voice Assistance**: Free browser-native Web Speech API for Speech-to-Text (STT) and Text-to-Speech (TTS) in Kannada (`kn-IN`) and English (`en-IN`).

---

## Directory Overview

```
Raitha Mithra/
├── api/                       # Vercel Serverless API functions & Crons
│   ├── cron/
│   │   └── scrape-prices.js   # Daily Vercel cron scraper for AgMarknet/Coffee/Coconut
│   ├── recommend-crop.js      # ML crop recommendation + Gemini explanation
│   ├── diagnose-crop.js       # 5-stage disease detection + Gemini vision fallback
│   ├── assistant.js           # Gemini RAG chatbot endpoint
│   ├── news.js                # Agri news fetcher
│   └── youtube.js             # Curated farming video list
├── hf_space/                  # Hugging Face Space microservice code
│   ├── app.py                 # FastAPI 5-stage model server
│   └── requirements.txt
├── src/                       # React frontend PWA app
│   ├── components/            # Header, Navbar, VoiceButton, DisclaimerModal
│   ├── config/                # Supabase client setup
│   ├── context/               # AuthContext & LanguageContext
│   ├── i18n/                  # en.json & kn.json bilingual translations
│   ├── pages/                 # Home, Market, Schemes, CropGuide, DiseaseScan, Calculator, Assistant, News, Settings
│   └── services/              # SpeechService & WeatherService
├── supabase/                  # Database migration & seed SQL scripts
│   ├── schema.sql
│   ├── seed_schemes.sql
│   ├── seed_crop_guides.sql
│   └── seed_market_prices.sql
├── vercel.json                # Vercel deployment & cron config
├── vite.config.js             # Vite PWA setup
├── package.json
└── README.md
```

---

## Setup & Deployment Guide

### 1. Supabase Setup
1. Create a new project at [Supabase](https://supabase.com/).
2. Open the SQL Editor and run `supabase/schema.sql`.
3. Seed the tables by executing `seed_schemes.sql`, `seed_crop_guides.sql`, and `seed_market_prices.sql`.
4. Go to **Storage**, create a new public bucket named `crop_photos`.

### 2. Google OAuth & Supabase Auth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create an OAuth 2.0 Client ID for Web Application.
3. Set the **Authorized Redirect URI** to: `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
4. Copy the Client ID & Secret to your Supabase Auth Dashboard -> Providers -> Google, and enable the provider.

### 3. Gemini API Key
1. Obtain a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Set `GEMINI_API_KEY` in your environment variables.

### 4. Deploying to Vercel
1. Install Vercel CLI or connect your GitHub repository to Vercel.
2. Add the environment variables from `.env.example` in Vercel project settings.
3. Deploy:
```bash
vercel --prod
```
The Vercel Cron daily schedule in `vercel.json` will automatically run `/api/cron/scrape-prices` every day at 02:00 UTC.

### 5. Deploying Hugging Face Space (5-Stage Vision Microservice)
1. Create a new Space on [Hugging Face Spaces](https://huggingface.co/spaces) selecting **Docker** or **FastAPI/Gradio** SDK (Free CPU tier).
2. Upload the files inside `hf_space/` (`app.py` & `requirements.txt`).
3. Set `HUGGINGFACE_MODEL_ENDPOINT` in your Vercel env vars to `https://<your-space-name>.hf.space/predict`.

---

## Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build production bundle
npm run build
```

---

## License & Credits

Built with ❤️ for Indian Farmers. Powered by Supabase, Vercel, Open-Meteo, Google Gemini API, and Hugging Face.
