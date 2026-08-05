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
- `components/Nav.tsx` — sticky site nav (server component)
- `lib/motion.ts` — shared Framer variants and viewport config
- `components/Hero.tsx` — hero copy column + layout
- `components/HeroViz.tsx` — isometric cuboids, dipole field loops, pointer parallax
- `components/Marquee.tsx` — infinite keyword band
- `components/Curriculum.tsx` — five alternating module rows
- `components/StageArt.tsx` — SVG illustrations for the five pipeline stages
- `scripts/extract-instructor-photo.py` — pulls the portrait out of the source PDF
- `components/Connector.tsx` — scroll-scrubbed teal arrow drawn between modules
- `components/Phases.tsx` — all 13 curriculum phases
- `components/Resources.tsx` — free YouTube playlist cards
- `components/ResourceArt.tsx` — per-topic cover art for those cards
- `components/LiveClass.tsx` — upcoming live session (placeholder data)
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

## Theming

Dark and light are driven by `data-theme` on `<html>`. Both palettes live as CSS
variables in `app/globals.css`; Tailwind colours resolve through them, so no
component carries a `dark:` class.

- `components/ThemeToggle.tsx` — fixed bottom-right switch, persists to `localStorage`
- The inline script in `app/layout.tsx` applies the stored/system theme **before
  first paint** — remove it and you get a flash of the wrong theme on every load
- Adding a colour: add it to both blocks in `globals.css`, then reference it in
  `tailwind.config.ts`. Channel triplets (`13 7 20`) for anything needing
  `/opacity`; full rgba for `surface` / `line` / `chip` / `faint`
- Inline SVG uses the `--hex-*` duplicates via `style`, because `var()` is not
  valid in an SVG presentation attribute
- Curriculum stage panels and Resources cover tiles stay dark in **both** themes
  by design — they're media tiles, and their artwork would wash out on a light field

## Palette

Primary is `#0b4fdb`. The Tailwind tokens are still named `purple`, `purple-2`
and `magenta` for historical reasons — read them as primary, primary-light and
primary-accent:

| Token      | Value     | Role                                  |
| ---------- | --------- | ------------------------------------- |
| `purple`   | `#0b4fdb` | Primary — buttons, borders, glows     |
| `purple-2` | `#4b85ff` | Lighter blue — eyebrows, gradient end |
| `magenta`  | `#2bb8f5` | Cyan accent — gradient end, art       |
| `teal`     | `#5eead4` | Unchanged                             |
| `lime`     | `#d4ff5c` | Unchanged                             |

Gradient buttons run `purple → #2f74f0`. Bronze/silver/gold in `StageArt.tsx`
sit outside the palette on purpose (see the comment in that file).

## Contact form email

`POST /api/subscribe` delivers enquiries via Resend. To enable it:

1. Create a free key at https://resend.com (100 emails/day, no card).
2. `cp .env.example .env.local` and paste the key into `RESEND_API_KEY`.
3. Restart `npm run dev`.

Without a key the route logs the submission and returns success in development,
and returns HTTP 503 in production — deliberately loud, so a misconfigured
deploy can't quietly swallow leads.

The default sender `onboarding@resend.dev` needs no DNS setup but only delivers
to the address that owns the Resend account. Verify a domain and set
`CONTACT_FROM` to send anywhere.

## Known gaps

- `public/instructor.png` is low resolution (~188px wide) for a panel that
  renders around 450px. Re-extract at source resolution with
  `python scripts/extract-instructor-photo.py <curriculum.pdf>` if it looks soft.
- `/api/subscribe` validates but does not send. Wire an email provider and add
  spam protection (honeypot + rate limiting) before going live.
- Hero art now sits in its own grid column (no longer overlaps the headline),
  but the rest of the page still needs a mobile pass.
- Source PDF gives two different durations: "60–70 Total Hours" on the cover vs
  "180–220 Hours | 4–5 Months (Weekend Batch)" on the curriculum page. The site
  currently uses 180–220 / 4–5 months. Confirm which is right.
- No course fee appears anywhere in the PDF, so the pricing panel leads with
  duration and routes to contact instead of quoting a number.
- Site is branded "DataForge" while the course is Edufulness / Atchyut Kumar.
  Deliberate for now — confirm before launch.
- Resource cards use drawn cover art, not real YouTube thumbnails. Thumbnails
  need a video ID (`i.ytimg.com/vi/<id>/hqdefault.jpg`) which a playlist URL
  doesn't expose — that needs the YouTube Data API plus a `remotePatterns`
  entry in `next.config.mjs`.
- Live class details are PLACEHOLDER. Edit the `UPCOMING` object at the top of
  `components/LiveClass.tsx` (topic, month, day, date, time, duration, blurb,
  highlights) and set `LIVE_CLASS_REGISTER_URL` in `lib/site.ts` — it currently
  falls back to WhatsApp.
