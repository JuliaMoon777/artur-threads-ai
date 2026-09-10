# Artur Threads AI — Text-First MVP

A Next.js 16 App Router prototype focused on:

- PL + RU lead discovery on Threads
- USA trend radar
- Polish-only **text** content generation (3–4 posts/day)
- optional GPT Image 2.5 visuals
- approval-first publishing workflow

**Video generation and video scripting are intentionally removed.**

## 1. Run locally

Install Node.js 20+ (Node 22 recommended), then:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## 2. Current routes

- `/` — Overview
- `/leads` — Lead Radar
- `/trends` — USA Trend Radar
- `/content` — Polish Text Engine
- `/images` — GPT Image 2.5 generator
- `/settings` — Product configuration
- `/api/leads` — mock lead JSON
- `/api/trends` — mock trend JSON
- `/api/content/generate` — mock Polish text endpoint
- `/api/threads/search?q=...&type=TOP` — Threads keyword search once configured
- `/api/threads/publish` — publish a text post/reply once configured
- `/api/ai/lead-score` — live OpenAI lead scoring once configured
- `/api/ai/content` — live US-trend → Polish text generation
- `/api/ai/image` — live GPT Image 2.5 generation

## 3. Environment variables

```env
OPENAI_API_KEY=
OPENAI_MODEL=
OPENAI_IMAGE_MODEL=gpt-image-2.5-sunburst
THREADS_ACCESS_TOKEN=
THREADS_USER_ID=
DATABASE_URL=
```

Image models supported by the MVP:

- `gpt-image-2.5-sunburst` — premium/default, highest precision
- `gpt-image-2.5-flare` — faster everyday generation

Do not commit `.env.local`.

## 4. Product rules

- Trend source: USA
- Lead market: Poland + Russian-speaking businesses in Poland
- Published content: Polish text only for now
- Target cadence: 3 strong posts/day + optional 4th if quality is high
- Images are optional and generated on demand
- No video module
- Start with approval mode, not blind autopilot
- Prefer simple marketing websites over heavy custom booking systems

## 5. Next implementation phase

1. Connect Postgres/Supabase.
2. Connect the live OpenAI text generation flow to UI buttons.
3. Connect Threads OAuth + keyword search.
4. Build USA trend ingestion/scoring.
5. Add approval → Threads publishing.
6. Add Vercel Cron for 3–4 daily text content runs and trend/lead scans.
