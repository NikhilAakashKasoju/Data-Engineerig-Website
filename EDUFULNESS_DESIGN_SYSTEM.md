# EduFulness course-site design system

A self-contained specification for building course landing pages that look and
behave like a single family. Everything needed is in this file — no other repo
required.

**How to use it:** save as `CLAUDE.md` in the root of a new repo. Claude reads
it automatically at the start of every session.

**Sites built on it:** Azure Data Engineering (`edufulness.com/data-engineering/`).
Planned: Data Structures & Algorithms, Machine Learning.

---

## 1. Stack and hard constraints

- **Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion**
- No other animation library without asking. GSAP-level timeline control is the
  only justification.
- **Static export.** Deploy target is Hostinger *shared* hosting — PHP only, no
  Node runtime. `output: "export"`.
- Each site lives in a subfolder of `edufulness.com`, so **`basePath` matters**
  (see §10).
- Anything server-side (forms, editable content) is a small PHP endpoint in its
  own folder, not a Next route handler.

---

## 2. Colour

Colours resolve through **CSS variables**, so `data-theme` on `<html>` re-themes
the whole site. **No component ever carries a `dark:` class.**

The channel-triplet format (`13 7 20`, not `#0d0714`) is what keeps Tailwind's
opacity modifiers working — `bg-bg/70` compiles to `rgb(var(--c-bg) / 0.7)`. A
variable holding a hex would silently break every `/xx` on the site.

`surface` / `line` / `chip` / `faint` hold **complete rgba values** instead,
because their alpha differs per theme (white at 2% on dark, white at 72% on
light) and can't be expressed as one triplet plus a fixed modifier.

### `app/globals.css` — theme block

```css
:root {
  color-scheme: dark;

  --c-bg: 13 7 20;
  --c-text: 244 244 246;
  --c-muted: 138 138 150;
  --c-primary: 11 79 219;
  --c-primary-2: 75 133 255;
  --c-accent: 43 184 245;
  --c-teal: 94 234 212;
  --c-lime: 212 255 92;
  --c-ring: 58 58 68;

  /* Duplicates for inline SVG: var() is invalid in a presentation attribute,
     so SVG uses these through style={{ fill: "var(--hex-teal)" }}. */
  --hex-primary: #0b4fdb;
  --hex-primary-2: #4b85ff;
  --hex-accent: #2bb8f5;
  --hex-teal: #5eead4;
  --hex-lime: #d4ff5c;
  --hex-ring: #3a3a44;

  --surface: rgba(255, 255, 255, 0.02);
  --surface-2: rgba(255, 255, 255, 0.055);
  --line: rgba(255, 255, 255, 0.08);
  --line-strong: rgba(255, 255, 255, 0.18);
  --chip: rgba(0, 0, 0, 0.55);
  --faint: rgba(255, 255, 255, 0.15);

  --bg-base: #0d0714;
  --bg-glow:
    radial-gradient(1100px 650px at 50% 8%, rgba(20, 44, 110, 0.6), transparent 62%),
    radial-gradient(800px 500px at 15% 55%, rgba(11, 79, 219, 0.12), transparent 60%),
    radial-gradient(700px 450px at 88% 70%, rgba(94, 234, 212, 0.05), transparent 60%);
  --bg-dot: rgba(168, 190, 224, 0.16);
  --bg-fade: linear-gradient(180deg, rgba(13,7,20,.85) 0%, transparent 14%,
                             transparent 86%, rgba(13,7,20,.9) 100%);
  --btn-sheen: #fff;
}

/* Light is NOT an inversion. Teal and lime at their dark values are far too
   pale to read as text on a light field, so they are re-darkened. The primary
   blue is dark enough to survive unchanged — which is why the brand colour is
   identical in both themes. */
[data-theme="light"] {
  color-scheme: light;

  --c-bg: 247 248 252;
  --c-text: 14 20 38;
  --c-muted: 88 97 122;
  --c-primary: 11 79 219;
  --c-primary-2: 29 78 216;
  --c-accent: 3 128 178;
  --c-teal: 13 148 136;
  --c-lime: 101 133 10;
  --c-ring: 197 205 222;

  --hex-primary: #0b4fdb;
  --hex-primary-2: #1d4ed8;
  --hex-accent: #0380b2;
  --hex-teal: #0d9488;
  --hex-lime: #65850a;
  --hex-ring: #c5cdde;

  --surface: rgba(255, 255, 255, 0.72);
  --surface-2: rgba(255, 255, 255, 0.95);
  --line: rgba(14, 20, 38, 0.1);
  --line-strong: rgba(14, 20, 38, 0.24);
  --chip: rgba(255, 255, 255, 0.82);
  --faint: rgba(14, 20, 38, 0.14);

  --bg-base: #f7f8fc;
  --bg-glow:
    radial-gradient(1100px 650px at 50% 8%, rgba(11, 79, 219, 0.1), transparent 62%),
    radial-gradient(800px 500px at 15% 55%, rgba(11, 79, 219, 0.06), transparent 60%),
    radial-gradient(700px 450px at 88% 70%, rgba(13, 148, 136, 0.06), transparent 60%);
  --bg-dot: rgba(30, 52, 100, 0.14);
  --bg-fade: linear-gradient(180deg, rgba(247,248,252,.85) 0%, transparent 14%,
                             transparent 86%, rgba(247,248,252,.9) 100%);
  --btn-sheen: rgba(255, 255, 255, 0.9);
}

/* Without this the two palettes cross-fade limb by limb and look broken. */
body, .bg-glow, .bg-grid, .bg-fade {
  transition: background-color .25s ease, background-image .25s ease;
}
```

### Token meaning

| Token | Dark | Light | Role |
| --- | --- | --- | --- |
| `bg` | `#0d0714` | `#f7f8fc` | Page base |
| `text` | `#f4f4f6` | `#0e1426` | Body copy |
| `muted` | `#8a8a96` | `#58617a` | Secondary copy, eyebrow labels |
| `purple` | `#0b4fdb` | `#0b4fdb` | **Primary** — buttons, borders, glows |
| `purple-2` | `#4b85ff` | `#1d4ed8` | Primary light — eyebrows, gradient ends |
| `magenta` | `#2bb8f5` | `#0380b2` | Cyan accent |
| `teal` | `#5eead4` | `#0d9488` | Secondary accent — eyebrows, connectors |
| `lime` | `#d4ff5c` | `#65850a` | Highlight, live indicators, ticks |

Token names are historical. **Read them as primary / primary-light /
primary-accent.** Renaming would touch every component for no visual gain.

Gradient buttons run `from-purple to-[#2f74f0]`.

**Never use `purple` (#0b4fdb) as small text on the dark theme** — it fails
contrast. Use `purple-2`.

---

## 3. `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        text: "rgb(var(--c-text) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        purple: "rgb(var(--c-primary) / <alpha-value>)",
        "purple-2": "rgb(var(--c-primary-2) / <alpha-value>)",
        magenta: "rgb(var(--c-accent) / <alpha-value>)",
        teal: "rgb(var(--c-teal) / <alpha-value>)",
        lime: "rgb(var(--c-lime) / <alpha-value>)",
        ring: "rgb(var(--c-ring) / <alpha-value>)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        chip: "var(--chip)",
        faint: "var(--faint)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fieldFlow: {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-240" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease forwards",
        floaty: "floaty 5s ease-in-out infinite",
        marquee: "marquee 42s linear infinite",
        field: "fieldFlow 7s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
```

---

## 4. Typography

| Family | Variable | Used for |
| --- | --- | --- |
| **Space Grotesk** | `font-display` | Headlines, stat numbers, card titles |
| **Inter** | `font-body` | Body copy |
| **JetBrains Mono** | `font-mono` | Eyebrows, labels, chips, counts |

Loaded via `next/font/google` in `layout.tsx`, weights 500–700 / 400–600 / 500.

**Scale**

```
h1        text-[clamp(40px,5vw,72px)]   leading-[1.04] tracking-tight
h2        text-[clamp(30px,3.8vw,46px)] leading-[1.12] tracking-tight
h3 (card) text-[19px] – text-[34px]     leading-snug
body      text-[15.5px] – text-[16.5px] leading-relaxed text-muted
eyebrow   font-mono text-[11.5px] uppercase tracking-[0.12em] text-teal
label     font-mono text-[11px]  uppercase tracking-[0.09em] text-muted
```

**Eyebrow convention:** every section opens with a mono eyebrow prefixed by a
slash — `/ What you'll learn`, `/ The path`, `/ Your instructor`.

---

## 5. Layout

**Section shell** — every section uses this exact pattern:

```tsx
<section id="…" className="relative z-10 mx-auto max-w-[1300px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
```

Never a flat `px-12`. On a 375px phone that leaves 279px for content.

**Breakpoints:** `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280.
`lg` is where the nav switches from hamburger to full links.

**Background:** one fixed vignette + dot texture, mounted once in `layout.tsx`
as three divs (`bg-glow`, `bg-grid`, `bg-fade`). **Sections are transparent.**
Only a raised panel gets its own surface — and then as a translucent
`bg-surface` wash, never a solid fill, so the page gradient reads through.

**Anchor offset:** `section[id] { scroll-margin-top: 92px }` in `globals.css`,
because the nav is sticky.

---

## 6. Component patterns

**Primary button**
```
btn-primary inline-flex items-center justify-center gap-2 rounded-full
bg-gradient-to-br from-purple to-[#2f74f0] px-5 py-3 text-[14px]
font-semibold text-white sm:py-2.5
```

**Secondary button**
```
inline-flex items-center justify-center rounded-full border border-line
bg-surface px-5 py-3 text-[14px] font-semibold transition-colors
hover:border-line-strong hover:bg-surface-2 sm:py-2.5
```

**Card**
```
rounded-2xl border border-line bg-surface p-6 transition-colors
hover:border-purple/35 hover:bg-surface-2
```

**Raised panel** — `rounded-3xl border border-line bg-surface p-6 backdrop-blur-sm sm:p-10 md:p-12`,
with a blurred sibling div for the halo. **Not a `box-shadow`** — a shadow that
large and diffuse renders with visible colour banding on dark backgrounds.

**Stat pair** — always a `<dl>` with a visually-hidden `<dt>` label and the
number in the `<dd>`. Plain divs make a screen reader read
"33 Modules 13 Phases" as one undifferentiated run.

**One filled CTA per surface.** Two gradient buttons side by side means neither
is primary.

---

## 7. Motion

### 7.1 Principles

1. **Reduced motion needs three separate layers.** Each covers what the others
   can't:
   - the `prefers-reduced-motion` block in `globals.css` → CSS animations and
     transitions
   - `<MotionConfig reducedMotion="user">` at the root → Framer's JS-driven
     transforms, which CSS cannot touch
   - `svgRef.current.pauseAnimations()` → SVG SMIL (`<animateMotion>`), which
     neither of the above reaches

2. **CSS over JS** for anything that runs forever and doesn't respond to state.
   A marquee is a CSS animation on the compositor; doing it in Framer means a
   rAF loop writing inline styles for the life of the page.

3. **One parent observer with `staggerChildren`**, never one `whileInView` per
   card. Independent triggers make a grid pop in raggedly, and N observers is
   wasteful.

4. **`once: true` on viewport animations.** Otherwise every section re-runs its
   entrance each time it scrolls back into view.

5. **Springs, not linear**, for anything following the pointer. A direct binding
   feels twitchy and stops dead when the cursor does.

6. **`tabular-nums` on any animating number**, or the label beneath jitters as
   digit widths change.

### 7.2 Primitive library

**`lib/motion.ts`** — shared entrance timing. Defining it once is what makes the
page feel like one document rather than N separately-animated pages.

```ts
import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

export const viewportOnce = { once: true, amount: 0.3 } as const;
```

| Primitive | Mechanism | Use for |
| --- | --- | --- |
| **fadeUp / stagger** | Framer variants | Every section entrance |
| **Scroll-spy** | `IntersectionObserver`, `rootMargin: "-96px 0px -70% 0px"` | Nav active state |
| **Count-up** | `requestAnimationFrame` against a real timestamp, `easeOutExpo` | Hero stats |
| **Scroll-scrubbed draw** | `useScroll` + `motion.path` `pathLength` | A line that draws as you scroll |
| **Marquee** | CSS `translateX(-50%)` on a `w-max` track holding two copies | Infinite keyword band |
| **Pointer parallax** | `useMotionValue` → `useSpring` → `rotateX/rotateY`, clamped ±7° | Hero artwork |
| **Dash-flow** | `animate-field` — animated `stroke-dashoffset` | Energy travelling along any path |
| **Float** | `animate-floaty` | Gentle idle motion on shapes |
| **Live pulse** | `animate-ping` ring behind a static core | "Live" indicators |

**Two traps worth memorising:**

- **A CSS `transform` from a keyframe replaces an SVG `transform` attribute
  rather than composing with it.** Put placement on an outer `<g>` and animation
  on an inner `<g>`, or shapes collapse onto the origin.
- **Seamless marquee requires exactly two copies and `w-max`.** Then `-50%` is
  always exactly one copy wide, at any viewport width and after fonts load.

### 7.3 Requesting a subject illustration

Hero artwork and section illustrations are **hand-drawn SVG**, not stock
photography. Stock decorates; a diagram explains. It also themes correctly,
weighs nothing, and has no licensing.

**Prompt template:**

> Build a `<hero visual | section illustration | card cover>` for **`<SUBJECT>`**.
> Core metaphor: **`<METAPHOR>`**. It should read as `<what a viewer should
> instantly understand>`.
> Use the motion primitives in §7.2 — I'd suggest `<primitive(s)>`.
> SVG only, colours through `--hex-*` variables, one shared viewBox if it's a set,
> and respect reduced motion.

**Rules that apply to any subject illustration**

- Pick **one** metaphor and commit. Two competing ideas read as neither.
- Depict the literal meaning of the word. "Ingest" got a funnel with many
  sources converging — not an abstract swirl.
- A set of illustrations shares one viewBox so they crop identically.
- Accent colour is passed in as a prop, so one drawing serves many tints.
- Media tiles may stay dark in **both** themes. Re-colouring detailed artwork
  per theme is a lot of work for a worse result; dark diagram tiles on a light
  page read as intentional.
- Only draw shapes that mean something. No decorative particles.

### 7.4 Metaphor bank

Reference for what "appropriate" looks like per subject.

| Subject | Hero metaphor | Section illustrations | Motion |
| --- | --- | --- | --- |
| **Data Engineering** *(built)* | Isometric cuboids on a pipeline path, dipole field loops orbiting each | Funnel (ingest) · medallion slabs (store) · chaos→grid (transform) · DAG (orchestrate) · dashboard (serve) | Dash-flow along the pipe, SMIL dots travelling it, float, pointer parallax |
| **DSA** | A linked list or binary tree assembling itself node by node; pointers as arrows | Array cells with an index cursor · linked-list node+pointer · tree with a highlighted traversal path · sorting bars mid-swap · graph BFS ripple · stack push/pop · hash buckets | Scroll-scrubbed draw for traversal order; stagger for array cells; dash-flow along edges |
| **Machine Learning** | A small neural net with weighted edges lighting up, or points resolving into a decision boundary | Scatter + fitted line (regression) · confusion matrix · loss curve descending · train/test split · neuron layers | Count-up for accuracy figures; scrubbed draw for the loss curve; dash-flow along edges |
| **Cloud / DevOps** | Layered isometric planes (network → compute → storage) with traffic flowing between | Pipeline stages with pass/fail branches · container grid scaling · blue/green swap | Dash-flow, branch reveal, float |
| **Web Development** | A browser frame assembling from wireframe boxes into a rendered page | Component tree · request/response arc · responsive frames resizing | Stagger, scrubbed draw |

**A worked example of the difference:** for Data Engineering, "Store" isn't a
generic database icon — it's three isometric slabs coloured bronze, silver and
gold, with data descending through them. That deliberately breaks the palette,
because those are the literal names of the medallion tiers and drawing "bronze"
in blue would work against the illustration's job. Meaning beats consistency
when they conflict — but say so in a comment.

---

## 8. Accessibility — non-negotiable

- Every animation respects `prefers-reduced-motion` (all three layers).
- `aria-label` on icon-only links; **remember `aria-label` replaces all inner
  content** for screen readers, so don't hide visible text behind one.
- Stat pairs use `<dl>` / `<dt>` / `<dd>`.
- Alternating layouts keep source order fixed; swap visually with `order` at
  `md:+` only.
- Decorative SVG gets `aria-hidden`; meaningful SVG gets `role="img"` +
  `aria-label`.
- Explicit `:focus-visible` ring — the browser default is invisible on `#0d0714`.
- `aria-current` on the active nav item; colour alone says nothing.
- Form status messages use `role="status"` + `aria-live="polite"`.
- Touch targets ≥ 44px.
- Links that navigate are `<a>`, not `<button>`.
- `target="_blank"` always with `rel="noopener noreferrer"`.

---

## 9. Content integrity

**Never invent** prices, dates, durations, student counts, module counts,
ratings, testimonials, or technology names.

- If a fact is needed and hasn't been supplied, **ask** — or mark it clearly as
  a placeholder and list it under Known Gaps in the README.
- Only claim a technology is taught if it appears in the source syllabus.
- Flag contradictions between sources rather than silently picking one.
- Real contact details and checkout links only.

This is the rule most worth enforcing. On the first build, a full pass was spent
removing invented pricing, fabricated class dates, a made-up certificate claim
and three technologies the course doesn't cover.

---

## 10. Build and deploy

```ts
// next.config.mjs
const basePath = "/dsa";          // "" for a domain root or subdomain

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
export default nextConfig;
```

```ts
// lib/site.ts
export const asset = (path: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
```

**The trap:** `basePath` is applied to Next's own bundles but **not** to
`public/` files referenced by `next/image`. Every such path must go through
`asset()` or it 404s in production while working perfectly in dev.

**Constraints of `output: "export"`**

- No route handlers (`app/api/**`)
- No image optimization
- Footer copyright year is fixed at build time
- `robots.txt` generated here is ignored — crawlers only read it at the domain
  root

**Deploying:** `npm run build`, then upload the **contents** of `out/` to
`public_html/<folder>/`. Delete the existing contents first — `_next/`
filenames are content-hashed, so stale chunks accumulate forever.

**Icons** — Next detects these by filename in `app/`, no code needed:
`icon.png` (512×512), `apple-icon.png` (180×180),
`opengraph-image.png` (1200×630, PNG or JPEG — not WebP).

**Set `metadataBase`** to the real origin including the subfolder, with a
trailing slash, or relative OG URLs resolve against the domain root.

---

## 11. Working style

- **One section at a time.** Never the whole page in one pass.
- After each section: explain **why**, not just what. Flag anything approximate
  vs. pixel-matched, and note Safari or mobile risk before finalising.
- I need to defend every decision in a technical interview.
- **Provide a commit message after each section** — conventional commits
  (`feat:` / `fix:` / `chore:`) with a short bulleted body.
- I run the build and push to GitHub myself. Don't run git commands.
- Mobile is designed from the start, not retrofitted. Check 375px before calling
  anything done.

### Definition of done, per section

- [ ] Renders correctly at 375px, 768px, 1440px
- [ ] Correct in both themes
- [ ] Respects `prefers-reduced-motion`
- [ ] No invented facts; placeholders flagged in the README
- [ ] Server component unless a hook or Framer genuinely requires the client
- [ ] Commit message provided

---

## 12. Standard page skeleton

Sections in order, adapt per course:

```
Nav            sticky, scroll-spy, hamburger below lg
Hero           eyebrow · headline · copy · CTAs · count-up stats · subject visual
Marquee        infinite keyword band
Curriculum     alternating rows, illustration per stage, scrubbed connectors
Phases         card grid, last card spans full width
Resources      free-content cards with drawn cover art
LiveClass      time-sensitive panel with a "nothing scheduled" state
Program        raised pricing panel, one filled CTA
Instructor     portrait with scrim caption, stats, links
Contact        form or channel hand-off
Footer         logo, link columns, copyright
ThemeToggle    fixed bottom-right
```
