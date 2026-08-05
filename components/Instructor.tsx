"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

/** Served from public/instructor.png — paths in /public resolve from the site root. */
const PORTRAIT = "/instructor.png";

const STATS = [
  ["15+", "Years experience"],
  ["50k+", "Students mentored"],
  ["99.97", "GATE percentile"],
] as const;

const EXPERTISE = [
  ["Data Engineering", "9+ years of hands-on data integration, transformation and schema design."],
  ["GATE CS/IT Faculty", "7+ years teaching GATE aspirants, with a track record of top ranks."],
  ["Algorithms", "Competitive programming, optimisation and problem-solving technique."],
] as const;

// LinkedIn / Twitter / GitHub were placeholders pointing at "#". Replaced with
// the three channels the curriculum PDF actually lists.
const SOCIALS = [
  {
    label: "YouTube — EduFulness",
    href: "https://youtube.com/@EduFulnessEFN",
    path: "M21.6 7.2a2.5 2.5 0 0 0-1.75-1.77C18.3 5 12 5 12 5s-6.3 0-7.85.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.75 1.77C5.7 19 12 19 12 19s6.3 0 7.85-.43a2.5 2.5 0 0 0 1.75-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z",
  },
  {
    label: "edufulness.com",
    href: "https://www.edufulness.com",
    path: "M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm6.9 8.6h-3.05a14.7 14.7 0 0 0-1.36-5.52 7.53 7.53 0 0 1 4.41 5.52ZM12 4.6c.83 1.2 1.6 3.4 1.75 6.5h-3.5C10.4 8 11.17 5.8 12 4.6ZM4.6 12.9h3.05a14.7 14.7 0 0 0 1.36 5.52A7.53 7.53 0 0 1 4.6 12.9Zm3.05-1.8H4.6a7.53 7.53 0 0 1 4.41-5.52A14.7 14.7 0 0 0 7.65 11.1ZM12 19.4c-.83-1.2-1.6-3.4-1.75-6.5h3.5c-.15 3.1-.92 5.3-1.75 6.5Zm2.49-.98a14.7 14.7 0 0 0 1.36-5.52h3.05a7.53 7.53 0 0 1-4.41 5.52Z",
  },
  {
    label: "WhatsApp 9567034641",
    href: "https://wa.me/919567034641",
    path: "M12 2.7a9.2 9.2 0 0 0-7.9 13.9L2.7 21.3l4.9-1.3A9.2 9.2 0 1 0 12 2.7Zm0 16.7a7.5 7.5 0 0 1-3.8-1l-.27-.16-2.9.76.77-2.83-.18-.29A7.5 7.5 0 1 1 12 19.4Zm4.2-5.5c-.23-.12-1.36-.67-1.57-.74s-.36-.12-.52.11-.6.74-.73.9-.27.17-.5.06a6.1 6.1 0 0 1-1.8-1.11 6.8 6.8 0 0 1-1.25-1.56c-.13-.23 0-.35.1-.46l.35-.4a1.6 1.6 0 0 0 .23-.39.42.42 0 0 0 0-.4c0-.11-.52-1.25-.71-1.71s-.38-.39-.52-.4h-.44a.85.85 0 0 0-.62.29 2.59 2.59 0 0 0-.8 1.92 4.48 4.48 0 0 0 .94 2.39 10.3 10.3 0 0 0 3.95 3.48 4.53 4.53 0 0 0 2.78.58 2.36 2.36 0 0 0 1.55-1.1 1.92 1.92 0 0 0 .13-1.09c-.05-.1-.2-.16-.43-.27Z",
  },
];

export default function Instructor() {
  return (
    <section id="instructor" className="relative z-10 mx-auto max-w-[1300px] px-12 py-28">
      <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:gap-20">
        {/* -------------------------------------------------------- portrait -- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative"
        >
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[2rem] bg-purple/15 blur-[70px]"
          />
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-purple/25 via-[#0e1730] to-teal/10">
            {/* `fill` + `sizes` lets Next pick a sensible source width per
                breakpoint and serve WebP/AVIF. The parent is already
                `relative`, which fill requires. */}
            <Image
              src={PORTRAIT}
              alt="Atchyut Kumar, lead instructor"
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-top"
            />

            {/* The source photo has a dark green studio backdrop that fights the
                violet page. A low-opacity violet wash pulls it toward the
                palette without visibly recolouring skin tones. Delete this div
                to see the untinted original. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-purple/20 mix-blend-soft-light"
            />

            {/* The caption sits on a gradient scrim rather than directly on the
                photo — a portrait's lower third is unpredictable, and white text
                on an unknown background is the classic contrast failure. */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6 pt-16">
              <p className="font-display text-[23px] font-bold tracking-tight">Atchyut Kumar</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.11em] text-teal">
                Lead Instructor · M.Tech, NIT Calicut
              </p>
            </div>
          </div>
        </motion.div>

        {/* ------------------------------------------------------------ copy -- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-teal">
            / Your instructor
          </p>

          <h2 className="mt-4 max-w-[560px] font-display text-[clamp(28px,3.5vw,43px)] font-bold leading-[1.13] tracking-tight">
            Learn from someone who has mentored 50,000 students.
          </h2>

          <p className="mt-5 max-w-[560px] text-[15.5px] leading-relaxed text-muted">
            Atchyut Kumar holds an M.Tech from NIT Calicut and placed in the 99.97 percentile of
            GATE CS/IT (AIR 440). Across 15+ years in teaching, research and industry he has
            mentored students into roles at Amazon, Google, Oracle, Samsung and Adobe — and brings
            9+ years of hands-on data engineering to every module.
          </p>

          <ul className="mt-8 list-none space-y-4">
            {EXPERTISE.map(([title, detail]) => (
              <li key={title} className="flex gap-3.5">
                <span
                  aria-hidden
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-purple-2"
                />
                <p className="text-[14.5px] leading-relaxed text-muted">
                  <b className="font-semibold text-text">{title}</b> — {detail}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-10 flex flex-wrap gap-x-14 gap-y-6">
            {STATS.map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <b className="block font-display text-[32px] font-bold leading-none tracking-tight">
                    {value}
                  </b>
                  <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.09em] text-muted">
                    {label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-9 flex list-none gap-3">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-muted transition-colors hover:border-line-strong hover:bg-surface-2 hover:text-text"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
