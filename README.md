# DataForge — Azure Data Engineering course landing page

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Structure

- `app/layout.tsx` — root layout, font loading, global background layers
- `app/page.tsx` — page composition
- `components/MotionProvider.tsx` — root MotionConfig so Framer respects prefers-reduced-motion
- `components/Hero.tsx` — hero section with the animated pipeline SVG
- `components/Marquee.tsx` — infinite keyword band
- `components/Curriculum.tsx` — five alternating module rows
- `components/Connector.tsx` — scroll-scrubbed teal arrow drawn between modules
- `app/globals.css` — Tailwind entry + bespoke effects (animated gradient button border, background vignette)
- `tailwind.config.ts` — design tokens (colors, fonts, keyframes)

## Status

- [x] Hero section
- [x] Marquee keyword band
- [x] Curriculum cards (Ingest / Store / Transform / Orchestrate / Serve)
- [ ] Pricing section
- [ ] Contact form
- [ ] Footer
