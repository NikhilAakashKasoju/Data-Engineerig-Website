"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { LIVE_CLASS_REGISTER_URL } from "@/lib/site";

/**
 * PLACEHOLDER DATA — every field below needs replacing with the real session.
 * The topic is a genuine curriculum item (Module 10) so it reads plausibly, but
 * the date, time and duration are invented. Keeping it all in one object means
 * updating a session is editing five strings, not hunting through markup.
 *
 * `month` / `day` drive the calendar tile; `date` is the full human-readable
 * string. They are separate fields rather than a parsed Date because a real
 * Date would need timezone handling and would render differently on server and
 * client — a hydration mismatch for zero benefit on a value that is typed by
 * hand anyway.
 */
const UPCOMING = {
  topic: "Building a Metadata-Driven Ingestion Framework in ADF",
  month: "Aug",
  day: "22",
  date: "Saturday, 22 August 2026",
  time: "10:00 AM IST",
  duration: "90 minutes",
  blurb:
    "A working session on the pattern that separates senior data engineers from everyone else: one pipeline, driven by metadata tables, handling full and incremental loads across any number of sources.",
  highlights: [
    "Design the source and target metadata tables",
    "Drive a single pipeline with ForEach and dynamic content",
    "Live Q&A with Atchyut at the end",
  ],
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[17px] w-[17px]",
};

const DETAILS = [
  {
    label: UPCOMING.date,
    icon: (
      <svg {...iconProps}>
        <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
        <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
      </svg>
    ),
  },
  {
    label: `${UPCOMING.time} · ${UPCOMING.duration}`,
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 1.8" />
      </svg>
    ),
  },
  {
    label: "Online · free to attend",
    icon: (
      <svg {...iconProps}>
        <rect x="2.5" y="6" width="13" height="12" rx="3" />
        <path d="m15.5 10.5 6-3v9l-6-3z" />
      </svg>
    ),
  },
];

/** Classic "live" indicator: a static core with an expanding ring behind it. */
export function LivePulse({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex h-2 w-2 ${className}`} aria-hidden>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
    </span>
  );
}

export default function LiveClass() {
  return (
    <section id="live" className="relative z-10 mx-auto max-w-[1300px] px-12 pb-28">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <p className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-teal">
          / Live classes
        </p>
        <h2 className="mt-4 max-w-[680px] font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight">
          Sit in on the next live session.
        </h2>
        <p className="mt-5 max-w-[580px] text-[15.5px] leading-relaxed text-muted">
          Recorded lessons show you the material. A live class lets you ask the awkward question
          halfway through — which is usually where the learning actually happens.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="relative mt-14"
      >
        <div
          aria-hidden
          className="absolute -top-8 left-1/2 h-40 w-[70%] -translate-x-1/2 rounded-full bg-teal/10 blur-[80px]"
        />

        {/* Teal-bordered rather than the usual hairline: this is the one
            time-sensitive block on the page, so it reads as an alert without
            resorting to a second primary button colour. */}
        <div className="relative grid grid-cols-1 gap-10 rounded-3xl border border-teal/20 bg-teal/[0.03] p-8 backdrop-blur-sm md:grid-cols-[auto_1fr_auto] md:items-center md:gap-12 md:p-10">
          {/* ------------------------------------------------ calendar tile -- */}
          <div className="flex w-[104px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] text-center">
            <span className="bg-teal/15 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-teal">
              {UPCOMING.month}
            </span>
            <span className="py-3 font-display text-[38px] font-bold leading-none tracking-tight">
              {UPCOMING.day}
            </span>
          </div>

          {/* ------------------------------------------------------ details -- */}
          <div>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-lime/30 bg-lime/[0.07] px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.11em] text-lime">
              <LivePulse />
              Upcoming live class
            </span>

            <h3 className="mt-4 max-w-[560px] font-display text-[clamp(21px,2.3vw,28px)] font-bold leading-[1.2] tracking-tight">
              {UPCOMING.topic}
            </h3>

            <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-muted">
              {UPCOMING.blurb}
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-3 list-none">
              {DETAILS.map((d) => (
                <li key={d.label} className="flex items-center gap-2.5 text-[14px] text-muted">
                  <span className="text-teal">{d.icon}</span>
                  {d.label}
                </li>
              ))}
            </ul>

            <ul className="mt-6 list-none space-y-2.5">
              {UPCOMING.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[14.5px]">
                  <span
                    aria-hidden
                    className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-teal"
                  />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* ----------------------------------------------------- register -- */}
          <div className="flex flex-col items-stretch gap-3 md:w-[210px]">
            <a
              href={LIVE_CLASS_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-purple to-[#2f74f0] px-7 py-4 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Register free
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.09em] text-muted">
              No payment required
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
