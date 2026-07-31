"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

/** Drop a real portrait in /public and set this to e.g. "/instructor.jpg". */
const PORTRAIT: string | undefined = undefined;

const STATS = [
  ["9+", "Years in data"],
  ["12k", "Students taught"],
  ["4.9", "Avg. rating"],
] as const;

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "#",
    path: "M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3.2 9h3.6v11.5H3.2V9Zm6 0h3.45v1.6h.05a3.8 3.8 0 0 1 3.4-1.85c3.63 0 4.3 2.35 4.3 5.4v6.35h-3.6v-5.63c0-1.34-.02-3.07-1.9-3.07-1.9 0-2.2 1.47-2.2 2.98v5.72H9.2V9Z",
  },
  {
    label: "Twitter",
    href: "#",
    path: "M21 5.9c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.75.44-1.57.76-2.44.93a3.84 3.84 0 0 0-6.6 3.5A10.9 10.9 0 0 1 3.5 4.8a3.84 3.84 0 0 0 1.2 5.13c-.63-.02-1.22-.2-1.74-.48v.05a3.84 3.84 0 0 0 3.08 3.77c-.57.15-1.17.18-1.74.07a3.85 3.85 0 0 0 3.59 2.67A7.72 7.72 0 0 1 2.5 17.6a10.87 10.87 0 0 0 5.89 1.73c7.07 0 10.94-5.86 10.94-10.94l-.01-.5c.75-.54 1.4-1.22 1.92-2Z",
  },
  {
    label: "GitHub",
    href: "#",
    path: "M12 2.5a9.5 9.5 0 0 0-3 18.52c.47.09.65-.21.65-.46l-.01-1.61c-2.64.58-3.2-1.27-3.2-1.27-.43-1.1-1.05-1.39-1.05-1.39-.86-.59.07-.58.07-.58.95.07 1.45.98 1.45.98.85 1.45 2.22 1.03 2.76.79.09-.61.33-1.03.6-1.27-2.11-.24-4.33-1.06-4.33-4.7 0-1.04.37-1.89.98-2.55-.1-.24-.43-1.2.09-2.51 0 0 .8-.26 2.62.98a9.1 9.1 0 0 1 4.77 0c1.82-1.24 2.62-.98 2.62-.98.52 1.31.19 2.27.1 2.51.61.66.98 1.51.98 2.55 0 3.65-2.23 4.45-4.35 4.69.34.3.65.87.65 1.76l-.01 2.61c0 .25.17.55.66.46A9.5 9.5 0 0 0 12 2.5Z",
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
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-purple/25 via-[#1a1030] to-teal/10">
            {PORTRAIT && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={PORTRAIT}
                alt="John Doe, lead data engineer and instructor"
                className="h-full w-full object-cover"
              />
            )}

            {/* The caption sits on a gradient scrim rather than directly on the
                photo — a portrait's lower third is unpredictable, and white text
                on an unknown background is the classic contrast failure. */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6 pt-16">
              <p className="font-display text-[23px] font-bold tracking-tight">John Doe</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.11em] text-teal">
                Lead Data Engineer &amp; Instructor
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
            Learn from someone who ships pipelines for a living.
          </h2>

          <p className="mt-5 max-w-[560px] text-[15.5px] leading-relaxed text-muted">
            John Doe has spent nearly a decade designing petabyte-scale data platforms on Azure
            for fintech and retail. This course distills those hard-won patterns into a clear,
            buildable path — no fluff, just the workflow real teams use.
          </p>

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
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.02] text-muted transition-colors hover:border-white/[0.2] hover:bg-white/[0.06] hover:text-text"
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
