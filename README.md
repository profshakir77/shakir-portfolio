# shakir-portfolio

Portfolio of Shakir Hussain, full-stack web developer. Live: https://shakir-portfolio-azure.vercel.app

## Stack
- **Next.js 15 (App Router)** for the new pages: `/`, `/work`, `/prototyping`, `/full-stack` (all prerendered as static HTML).
- **Three.js** 3D hero scene (`components/Hero3D.jsx`), loaded after the page, paused off-screen, still frame for reduced motion.
- **API routes** in `pages/api/*` (thin wrappers) with the real handlers in `lib/handlers/*`. Redis (Upstash/KV), Resend email, Vercel Blob uploads, JWT student auth. Setup: see `BACKEND_SETUP.md`.
- **Legacy static pages** (services, about, blog and articles, contact, mentorship, testimonials, student portal, admin) live in `public/` and keep their URLs.

## Keeping Vercel usage low
- No Image Optimization (`images.unoptimized`), static prerendering for every page, API functions capped at 10s, long cache headers for assets.

## Develop
```
npm install
npm run dev
```
