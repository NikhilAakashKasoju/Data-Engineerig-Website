"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { ENROLL_URL, PROGRAM_CHECKOUT_URL } from "@/lib/site";
import HeroViz from "./HeroViz";

// Every figure here is off the curriculum PDF cover page. The previous values
// (12 weeks, 40+ labs, self-paced) were invented before the document existed —
// and "self-paced" actively contradicted it, since this runs as a weekend batch.
const STATS = [
  ["33", "Modules"],
  ["13", "Phases"],
  ["1", "Capstone Project"],
] as const;

export default function Hero() {
  return (
    <motion.section
      id="hero"
      className="relative z-10 mx-auto max-w-[1300px] px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Two independent columns rather than the visual layered behind the
          headline. The old version positioned a fixed 1200×520 viewBox over the
          text, which meant the artwork and the copy fought for the same pixels
          at every viewport width. Side by side, each owns its own space and the
          grid handles the reflow. */}
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_minmax(0,0.85fr)] lg:gap-16">
        <div>
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-teal/[0.06] px-4 py-2 font-mono text-xs tracking-[0.12em] text-teal"
          >
            ✦ INDUSTRY-STANDARD · 100% PROJECT-DRIVEN
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-7 font-display text-[clamp(40px,5vw,72px)] font-bold leading-[1.04] tracking-tight"
          >
            Master
            <br />
            End-to-End
            <br />
            <span className="bg-gradient-to-r from-purple-2 to-magenta bg-clip-text text-transparent">
              Azure Data
              <br />
              Engineering.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-[520px] text-[16.5px] leading-relaxed text-muted"
          >
            Build production-grade pipelines from ingestion to insight. Learn{" "}
            <b className="font-semibold text-[#c9c9d1]">SQL, Azure Data Factory, Databricks</b> and{" "}
            <b className="font-semibold text-[#c9c9d1]">PySpark</b> by shipping a real retail
            lakehouse — guided by Atchyut Kumar.
          </motion.p>

          {/*
            Stacked full-width on phones, inline from sm up.
            `flex-wrap` alone wasn't enough: each button is whitespace-nowrap, so
            "Enroll in UDEMY course" is wider than a 375px viewport minus the
            section padding — it would wrap to its own row and still be clipped.
            Going column-first guarantees every label is fully readable.
          */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            {/* Hands off to the Udemy checkout. rel="noopener noreferrer" is
                required alongside target="_blank" — without it the opened page
                gets a window.opener handle back to this one and can navigate it
                elsewhere (reverse tabnabbing). */}
            <a
              href={ENROLL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-br from-purple to-[#2f74f0] px-5 py-3 text-[14px] font-semibold text-white sm:py-2.5"
            >
              Enroll in UDEMY course
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            {/* Goes straight to checkout on the learning platform rather than
                scrolling to the pricing panel — this is the real enrolment
                path for the masterclass. */}
            <a
              href={PROGRAM_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-br from-purple to-[#2f74f0] px-5 py-3 text-[14px] font-semibold text-white sm:py-2.5"
            >
              Enroll in the program
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#curriculum"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-line bg-surface px-5 py-3 text-[14px] font-semibold transition-colors hover:border-line-strong hover:bg-surface-2 sm:py-2.5"
            >
              What you&apos;ll learn
            </a>
          </motion.div>

          <motion.dl variants={fadeUp} className="mt-14 flex flex-wrap gap-x-14 gap-y-6">
            {STATS.map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <b className="block font-display text-3xl font-bold">{value}</b>
                  <span className="mt-1 block font-mono text-[11.5px] uppercase tracking-[0.08em] text-muted">
                    {label}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Headline stays first in both source and visual order — on mobile the
            message should land before the decoration, and it keeps the LCP
            element near the top of the document. */}
        <motion.div variants={fadeUp} className="mx-auto w-full max-w-[400px] lg:max-w-none">
          <HeroViz />
        </motion.div>
      </div>
    </motion.section>
  );
}
