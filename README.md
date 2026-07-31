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
- `components/Logo.tsx` — shared wordmark (nav + footer)
- `components/Hero.tsx` — hero section with the animated pipeline SVG
- `components/Marquee.tsx` — infinite keyword band
- `components/Curriculum.tsx` — five alternating module rows
- `components/Connector.tsx` — scroll-scrubbed teal arrow drawn between modules
- `components/Pricing.tsx` — raised offer panel
- `components/Instructor.tsx` — bio, portrait card and stats
- `components/Contact.tsx` — syllabus request form
- `components/Footer.tsx` — logo, link columns, copyright
- `app/api/subscribe/route.ts` — form endpoint (validates; email provider not yet wired)
- `app/globals.css` — Tailwind entry + bespoke effects (animated gradient button border, background vignette)
- `tailwind.config.ts` — design tokens (colors, fonts, keyframes)

## Status

- [x] Hero section
- [x] Marquee keyword band
- [x] Curriculum cards (Ingest / Store / Transform / Orchestrate / Serve)
- [x] Pricing section
- [x] Instructor section
- [x] Contact form
- [x] Footer

## Known gaps

- No images yet. Curriculum panels and the instructor portrait render gradient
  placeholders — see the `image` field in `MODULES` (`Curriculum.tsx`) and the
  `PORTRAIT` constant (`Instructor.tsx`).
- `/api/subscribe` validates but does not send. Wire an email provider and add
  spam protection (honeypot + rate limiting) before going live.
- Hero SVG uses a fixed 1200×520 viewBox positioned over the headline; it needs
  a mobile treatment.
- Social links in `Instructor.tsx` and the "Go to course" CTA point at `#`.
