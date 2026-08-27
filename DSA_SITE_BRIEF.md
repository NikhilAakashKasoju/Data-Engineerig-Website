# Project brief — EduFulness DSA course landing page

> Save this as `CLAUDE.md` in the root of the new repo. Claude reads it
> automatically at the start of every session, so you never have to re-paste it.

---

## What we're building

A single-page landing site for **EduFulness — Data Structures & Algorithms
(C Programming)**, taught by Atchyut Kumar. It is the second in a family of
course sites; the first is the Azure Data Engineering page already live at
`edufulness.com/data-engineering/`.

It must look and feel like a sibling of that page — same palette, same
typography, same motion language — while presenting different content.

**Deploy target:** `edufulness.com/dsa/` — Hostinger **shared hosting**, PHP
only, no Node runtime. Therefore a **static export**.

**Known links**

- Udemy course: `https://www.udemy.com/course/mastering-data-structures-and-algorithms-using-c-programming/?couponCode=KEEPLEARNING`
- Parent site: `https://edufulness.com/`
- WhatsApp channel: `https://whatsapp.com/channel/0029Val125n2UPBNAPAprU1G`

---

## Step 1 — copy the foundation, don't rebuild it

Copy these files **verbatim** from the Azure repo. They are the shared design
system, and re-deriving them would guarantee drift:

```
app/globals.css              theme variables, both palettes, bespoke effects
tailwind.config.ts           tokens, keyframes, animations
lib/motion.ts                fadeUp / stagger / viewportOnce
lib/useActiveSection.ts      scroll-spy hook
components/MotionProvider.tsx
components/ThemeToggle.tsx
components/CountUp.tsx
components/Logo.tsx
components/Nav.tsx           then edit the LINKS array
components/NavLinks.tsx
components/MobileMenu.tsx
components/Footer.tsx        then edit the link columns
public/efnlogo.png
app/icon.png, app/apple-icon.png
```

Then adapt, rather than starting from a blank file.

---

## Design tokens — already decided, do not re-derive

Colours resolve through CSS variables so `data-theme` on `<html>` switches the
whole site. **No component carries a `dark:` class.**

| Token      | Dark      | Light     | Role                            |
| ---------- | --------- | --------- | ------------------------------- |
| `bg`       | `#0d0714` | `#f7f8fc` | Page base                       |
| `text`     | `#f4f4f6` | `#0e1426` | Body copy                       |
| `muted`    | `#8a8a96` | `#58617a` | Secondary copy                  |
| `purple`   | `#0b4fdb` | `#0b4fdb` | **Primary** — buttons, borders  |
| `purple-2` | `#4b85ff` | `#1d4ed8` | Primary light — eyebrows        |
| `magenta`  | `#2bb8f5` | `#0380b2` | Cyan accent                     |
| `teal`     | `#5eead4` | `#0d9488` | Secondary accent                |
| `lime`     | `#d4ff5c` | `#65850a` | Highlight, live indicators      |

Token names are historical — read them as primary / primary-light /
primary-accent. Gradient buttons run `purple → #2f74f0`.

Surfaces use `surface`, `surface-2`, `line`, `line-strong`, `chip`, `faint` —
complete rgba values, because their alpha differs per theme.

**Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (eyebrows and
labels), all via `next/font/google`.

**Background:** a fixed vignette + dot texture defined once in `globals.css` and
mounted in `layout.tsx`. Sections are transparent. Only raised panels get their
own surface.

---

## Non-negotiable conventions

These were each learned the hard way on the Azure build.

1. **`basePath` is a single constant** at the top of `next.config.mjs`, also
   exported as `NEXT_PUBLIC_BASE_PATH`. Every `public/` file referenced by
   `next/image` **must** go through the `asset()` helper — Next does *not* apply
   basePath to those, and they silently 404 in production.

2. **Server components by default.** Only add `"use client"` where a hook or
   Framer is genuinely needed. Nav, Footer, Logo and Marquee ship zero JS.

3. **Reduced motion needs three separate layers:**
   - the `prefers-reduced-motion` block in `globals.css` (CSS animations)
   - `MotionConfig reducedMotion="user"` (Framer's JS-driven transforms)
   - `svg.pauseAnimations()` (SVG SMIL — unreachable by CSS)

4. **Tailwind utilities only.** Drop into `globals.css` solely for what Tailwind
   can't express — the conic-gradient button border, the background layers, the
   marquee mask.

5. **One component per section**, composed in `app/page.tsx`.

6. **Alternating layouts** keep source order fixed and swap visually with
   `order` at `md:+`, so screen-reader and tab order stay logical.

7. **SVG can't use `var()` in presentation attributes** — use `style={{ fill: "var(--hex-teal)" }}`
   or `currentColor` + a Tailwind text class.

---

## Motion vocabulary to reuse

Pick what suits the content; don't use all of it.

| Pattern | Where it came from | Good for |
| --- | --- | --- |
| `fadeUp` + `stagger` | `lib/motion.ts` | Every section entrance |
| Scroll-spy nav highlight | `useActiveSection` | Nav |
| Count-up numbers | `CountUp.tsx` | Hero stats |
| Scroll-scrubbed SVG draw | `Connector.tsx` | Step-to-step flow |
| Infinite marquee | `Marquee.tsx` | Keyword band |
| Pointer parallax | `HeroViz.tsx` | Hero artwork |
| Dash-flow (`animate-field`) | `tailwind.config.ts` | Anything showing movement along a path |

**One parent observer with `staggerChildren`**, never one `whileInView` per card
— independent triggers make grids pop in raggedly.

---

## Content rules — the most important section

The Azure build wasted a full pass stripping invented copy. Don't repeat it.

- **Never invent** prices, dates, durations, student counts, module counts,
  ratings, testimonials, or technology names.
- If a fact is needed and hasn't been given, **ask** or mark it clearly as a
  placeholder and list it in the README's Known Gaps.
- Only claim a technology is taught if it's in the source syllabus.
- Flag contradictions between sources rather than silently picking one.

For DSA specifically, ask me for the syllabus before writing curriculum copy.

---

## Working style

- **One section at a time.** Don't build the whole page in one pass.
- After each section, briefly explain **why** the implementation choices were
  made — not just what — and flag anything approximate vs. pixel-matched.
- **Flag cross-browser risk** (Safari especially) and mobile behaviour for any
  new animation before finalising it.
- I need to defend every part of this in a technical interview. Make the
  reasoning clear.
- **After each section, give me a commit message** in conventional-commits form
  (`feat:`, `fix:`, `chore:`) with a short bulleted body.
- I test locally with `npm run dev` and push to GitHub myself.
- Don't run git commands for me.

---

## Mobile is not a later pass

Design mobile-first from the start. On the Azure build this was deferred and
cost a whole rework.

- Section padding: `px-5 sm:px-8 lg:px-12`. Never a flat `px-12`.
- Hero CTAs stack full-width below `sm`.
- Touch targets ≥ 44px.
- Nav collapses to a hamburger below `lg`; the panel **must** be portalled to
  `document.body`, because the nav's `backdrop-blur` creates a containing block
  that traps `position: fixed` children.
- Check every section at **375px** before calling it done.

---

## Build & deploy

```bash
npm run build     # writes ./out
```

Upload the **contents** of `out/` to `public_html/dsa/`. Delete the existing
contents first — `_next/` filenames are content-hashed, so stale chunks
accumulate forever otherwise.

Constraints of `output: "export"`:

- No route handlers (`app/api/**`)
- No image optimization — `images.unoptimized: true`
- The footer copyright year is fixed at build time

If the page later needs a contact form or editable content, it follows the Azure
pattern: a small PHP endpoint in its own folder, with the section shipping real
values baked in and fetching to replace them.

---

## Definition of done, per section

- [ ] Renders correctly at 375px, 768px and 1440px
- [ ] Works in both themes
- [ ] Respects `prefers-reduced-motion`
- [ ] No invented facts; placeholders flagged
- [ ] Server component unless it genuinely needs the client
- [ ] Commit message provided
