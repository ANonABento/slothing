# Columbus - Production Setup Checklist

Complete these steps to get Columbus running in production.

---

## 1. Clerk Authentication (Required)

- [ ] Create account at https://clerk.com
- [ ] Create new application (name: "Columbus")
- [ ] Go to **API Keys** in Clerk dashboard
- [ ] Copy keys to `.env.local`:
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
  CLERK_SECRET_KEY=sk_test_...
  ```
- [ ] Configure sign-in/sign-up URLs (already set in code):
  ```
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
  ```
- [ ] (Optional) Customize appearance in Clerk dashboard

**Free tier:** 10,000 monthly active users

---

## 2. Neon PostgreSQL Database (Required)

- [ ] Create account at https://console.neon.tech
- [ ] Create new project (name: "columbus")
- [ ] Copy connection string from dashboard
- [ ] Add to `.env.local`:
  ```
  DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/columbus?sslmode=require
  ```
- [ ] Run database migrations:
  ```bash
  npm run db:push
  ```
- [ ] (Optional) View database with Drizzle Studio:
  ```bash
  npm run db:studio
  ```

**Free tier:** 0.5 GB storage, 190 compute hours/month

---

## 3. LLM Provider (At least one required)

### Option A: OpenAI (Recommended)
- [ ] Create account at https://platform.openai.com
- [ ] Go to API Keys
- [ ] Create new secret key
- [ ] Add to `.env.local`:
  ```
  OPENAI_API_KEY=sk-...
  ```

### Option B: Anthropic Claude
- [ ] Create account at https://console.anthropic.com
- [ ] Go to API Keys
- [ ] Create new key
- [ ] Add to `.env.local`:
  ```
  ANTHROPIC_API_KEY=sk-ant-...
  ```

### Option C: OpenRouter (Multiple models)
- [ ] Create account at https://openrouter.ai
- [ ] Go to Keys
- [ ] Create new key
- [ ] Add to `.env.local`:
  ```
  OPENROUTER_API_KEY=sk-or-...
  ```

### Option D: Ollama (Local, free)
- [ ] Install Ollama from https://ollama.ai
- [ ] Pull a model: `ollama pull llama3.2`
- [ ] Add to `.env.local`:
  ```
  OLLAMA_BASE_URL=http://localhost:11434
  ```

---

## 4. Deployment (Choose one)

### Option A: Vercel (Recommended)
- [ ] Create account at https://vercel.com
- [ ] Connect GitHub repository
- [ ] Import project
- [ ] Add environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `DATABASE_URL`
  - `OPENAI_API_KEY` (or your LLM provider)
- [ ] Deploy

**Free tier:** Unlimited personal projects, 100GB bandwidth

### Option B: Cloudflare Pages
- [ ] Create account at https://dash.cloudflare.com
- [ ] Go to Workers & Pages
- [ ] Create application > Pages
- [ ] Connect GitHub repository
- [ ] Add environment variables
- [ ] Deploy

**Free tier:** Unlimited requests, 500 builds/month

### Option C: Railway
- [ ] Create account at https://railway.app
- [ ] Create new project from GitHub
- [ ] Add environment variables
- [ ] Deploy

**Free tier:** $5 credit/month

---

## 5. Domain (Optional)

- [ ] Purchase domain (Namecheap, Cloudflare, Google Domains)
- [ ] Configure DNS to point to your deployment
- [ ] Add custom domain in Vercel/Cloudflare dashboard
- [ ] Update Clerk production instance with domain

---

## 6. Monitoring (Optional but recommended)

### Sentry (Error tracking)
- [ ] Create account at https://sentry.io
- [ ] Create new project (Next.js)
- [ ] Install SDK: `npm install @sentry/nextjs`
- [ ] Add to `.env.local`:
  ```
  SENTRY_DSN=https://...@sentry.io/...
  ```

### PostHog (Analytics)
- [ ] Create account at https://posthog.com
- [ ] Create new project
- [ ] Add to `.env.local`:
  ```
  NEXT_PUBLIC_POSTHOG_KEY=phc_...
  NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
  ```

---

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Fill in your API keys in .env.local

# 4. Push database schema to Neon
npm run db:push

# 5. Start development server
npm run dev

# 6. Build for production
npm run build

# 7. Start production server
npm start
```

---

## Environment Variables Summary

```env
# Required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...

# Auth URLs (already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# LLM (at least one)
OPENAI_API_KEY=sk-...
# or ANTHROPIC_API_KEY=sk-ant-...
# or OPENROUTER_API_KEY=sk-or-...
# or OLLAMA_BASE_URL=http://localhost:11434

# Optional
SENTRY_DSN=https://...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

---

## Verification Checklist

After setup, verify:

- [ ] Can sign up with new account
- [ ] Can sign in with existing account
- [ ] Profile data saves correctly
- [ ] Jobs can be created/updated/deleted
- [ ] AI features work (resume generation, interview prep)
- [ ] Different users see different data
- [ ] Production deployment accessible

---

## Cost Estimate (Free Tiers)

| Service | Free Tier | Paid Starts |
|---------|-----------|-------------|
| Clerk | 10k MAUs | $25/mo |
| Neon | 0.5GB, 190 hrs | $19/mo |
| Vercel | Unlimited | $20/mo |
| OpenAI | $5 credit | Pay-as-you-go |
| Sentry | 5k errors | $26/mo |
| PostHog | 1M events | $0 (generous) |

**You can run Columbus for free** with these limits for a personal job search.

---

*Last updated: February 2026*
