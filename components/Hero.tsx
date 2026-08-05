"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { ENROLL_URL } from "@/lib/site";
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
      className="relative z-10 mx-auto max-w-[1300px] px-12 pb-16 pt-20"
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
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-teal/[0.04] px-4 py-2 font-mono text-xs tracking-[0.12em] text-teal"
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

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
            {/* Hands off to the Udemy checkout. rel="noopener noreferrer" is
                required alongside target="_blank" — without it the opened page
                gets a window.opener handle back to this one and can navigate it
                elsewhere (reverse tabnabbing). */}
            <a
              href={ENROLL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2.5 rounded-full bg-gradient-to-br from-purple to-[#2f74f0] px-[26px] py-4 text-[15px] font-semibold text-white"
            >
              Enroll in the Course
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
            <a
              href="#curriculum"
              className="rounded-full border border-white/[0.09] bg-white/[0.02] px-6 py-4 text-[15px] font-semibold transition-colors hover:border-white/[0.18] hover:bg-white/[0.06]"
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
