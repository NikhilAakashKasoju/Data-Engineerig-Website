# EduFulness — Azure Data Engineering course landing page

Single-page marketing site for the Azure Data Engineering masterclass, plus a
small PHP backend for lead capture and editable content.

**Live:** https://edufulness.com/azure/
**Admin:** https://edufulness.com/masterclass/login.php

Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion. Exported as
static HTML and served from Hostinger shared hosting alongside the client's
existing PHP site.

## Getting started

```bash
npm install
npm run dev
```

Open **http://localhost:3000/azure/** — not the root. `basePath` is set, so the
dev server mounts the app under `/azure`.

Three things only work against the live server, because they need PHP: the
contact form, the live-class content fetch, and the admin login. Locally the
form fails and the live-class section falls back to its built-in values. That's
expected, not a bug.

## Structure

**Layout and shared**

- `app/layout.tsx` — root layout, fonts, background layers, theme bootstrap script
- `app/page.tsx` — section composition
- `lib/motion.ts` — shared Framer variants and viewport config
- `lib/site.ts` — external URLs, PHP endpoints, `asset()` basePath helper
- `lib/useActiveSection.ts` — IntersectionObserver scroll-spy hook

**Chrome**

- `components/Nav.tsx` — sticky nav (server component)
- `components/NavLinks.tsx` — desktop links + Live pill, with scroll-spy highlighting
- `components/MobileMenu.tsx` — hamburger panel, portalled to `body`
- `components/Logo.tsx` — shared wordmark (nav + footer)
- `components/Footer.tsx` — logo, link columns, copyright, admin link
- `components/ThemeToggle.tsx` — fixed bottom-right dark/light switch
- `components/MotionProvider.tsx` — root MotionConfig for `prefers-reduced-motion`

**Sections**

- `components/Hero.tsx` — copy column + layout
- `components/HeroViz.tsx` — isometric cuboids, dipole field loops, pointer parallax
- `components/Marquee.tsx` — infinite keyword band
- `components/Curriculum.tsx` — five alternating stage rows
- `components/StageArt.tsx` — SVG illustrations for those stages
- `components/Connector.tsx` — scroll-scrubbed arrow drawn between stages
- `components/Phases.tsx` — all 13 curriculum phases
- `components/Resources.tsx` — free YouTube playlist cards
- `components/ResourceArt.tsx` — per-topic cover art for those cards
- `components/LiveClass.tsx` — upcoming session, fetched from the backend
- `components/Pricing.tsx` — raised offer panel
- `components/Instructor.tsx` — bio, portrait, stats
- `components/Contact.tsx` — lead form + WhatsApp channel

**Backend** — see `masterclass-backend/README.md`

**Utilities**

- `scripts/extract-instructor-photo.py` — pulls the portrait out of the source PDF

## Build & deploy

The site builds to plain HTML/CSS/JS — no Node runtime on the server.

```bash
npm run build     # writes ./out
```

Upload the **contents** of `out/` (not the folder) to `public_html/azure/`.
Delete the existing contents first: `_next/` filenames are content-hashed, so
stale chunks are never overwritten and accumulate indefinitely.

`basePath` is `/azure`, defined once at the top of `next.config.mjs` and exposed
to the client as `NEXT_PUBLIC_BASE_PATH`. Change the folder → change that one
constant → rebuild.

Constraints of `output: "export"`:

- Route handlers under `app/api/**` are excluded from the export
- No image optimization (`images.unoptimized`)
- The footer copyright year is fixed at build time
- **`basePath` is not applied to `public/` files referenced by `next/image`** —
  they must go through `asset()` in `lib/site.ts` or they 404 in production

## Server layout

```
public_html/
├── index.html, api.php, …   ← client's existing site, untouched
├── azure/                   ← this app (static export)
└── masterclass/             ← PHP backend
```

Both live on the same origin, so the form posts same-origin and needs no CORS.

## Content the client can edit without a rebuild

Only the **Live Classes** section. `LiveClass.tsx` ships real values baked in,
then fetches `/masterclass/live-class.php` on mount and replaces them. The fetch
only ever replaces content, never creates it — so if the backend is unreachable
the built-in values stay and nothing breaks.

Everything else is build-time. Extending the pattern to pricing or the
instructor stats would follow the same shape.

## Theming

Dark and light are driven by `data-theme` on `<html>`. Both palettes live as CSS
variables in `app/globals.css`; Tailwind colours resolve through them, so no
component carries a `dark:` class.

- The inline script in `app/layout.tsx` applies the stored/system theme **before
  first paint** — remove it and you get a flash of the wrong theme on every load
- Adding a colour: add it to both blocks in `globals.css`, then reference it in
  `tailwind.config.ts`. Channel triplets (`13 7 20`) for anything needing
  `/opacity`; full rgba for `surface` / `line` / `chip` / `faint`
- Inline SVG uses the `--hex-*` duplicates via `style`, because `var()` is not
  valid in an SVG presentation attribute
- Curriculum stage panels and Resources cover tiles stay dark in **both** themes
  by design — they're media tiles, and their artwork would wash out on light

## Palette

Primary is `#0b4fdb`. Tokens are still named `purple`, `purple-2` and `magenta`
for historical reasons — read them as primary, primary-light, primary-accent:

| Token      | Value     | Role                                  |
| ---------- | --------- | ------------------------------------- |
| `purple`   | `#0b4fdb` | Primary — buttons, borders, glows     |
| `purple-2` | `#4b85ff` | Lighter blue — eyebrows, gradient end |
| `magenta`  | `#2bb8f5` | Cyan accent — gradient end, art       |
| `teal`     | `#5eead4` | Secondary accent                      |
| `lime`     | `#d4ff5c` | Highlight                             |

Gradient buttons run `purple → #2f74f0`. Bronze/silver/gold in `StageArt.tsx`
sit outside the palette on purpose (see the comment in that file).

## Known gaps

**Content**

- Student count contradicts itself: the marketing banner says 110,000+, the
  curriculum PDF and the Instructor section say 50,000+.
- `courses.json` on the client's site lists real pricing (₹19,999 live,
  ₹7,999 pre-recorded) and real enrolment links at `learn.edufulness.com`. The
  Pricing panel quotes no fee, and Enroll Now points at a cheaper, different
  Udemy course.

**Assets**

- No favicon. `public/efnlogo.png` is 3.9:1, too wide; a square export saved as
  `app/icon.png` is picked up automatically by Next.
- No OG image, though `twitter:card` is set to `summary_large_image` — shared
  links preview without one. Drop a 1200×630 into `app/opengraph-image.png`.
- `public/instructor.png` is 1.7 MB and ships unoptimized on every load.
  Re-export at ~900px wide as WebP or JPEG.

**Technical**

- Below `sm` the nav CTAs shorten to "Live" and "Enroll" so the bar fits a 375px
  viewport alongside the logo and hamburger. Lengthening either label overflows.
- Resource cards use drawn cover art, not real YouTube thumbnails — those need a
  video ID, which a playlist URL doesn't expose (YouTube Data API + a
  `remotePatterns` entry).
- Next.js 14.2.5 is flagged as outdated by the dev overlay.
- Notifications use PHP `mail()`. Delivery to same-domain addresses is reliable;
  Gmail may filter. The dashboard's "Ping failed" tile surfaces this.

**Outside this repo**

- `api.php` on the client's existing site derives its auth token from a constant
  written in the file, so anyone who can read it can compute a valid admin
  token. Unrelated to this project but live in production.
