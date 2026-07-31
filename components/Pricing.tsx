"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[17px] w-[17px]",
};

const FEATURES = [
  {
    label: "180–220 hours · 4–5 months",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 1.8" />
      </svg>
    ),
  },
  {
    label: "33 modules across 13 phases",
    icon: (
      <svg {...iconProps}>
        <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
        <path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5" />
      </svg>
    ),
  },
  {
    label: "Databricks certification prep",
    icon: (
      <svg {...iconProps}>
        <path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0V4Z" />
        <path d="M7.5 5.5H5A1.5 1.5 0 0 0 3.5 7c0 1.7 1.6 3 3.5 3M16.5 5.5H19A1.5 1.5 0 0 1 20.5 7c0 1.7-1.6 3-3.5 3M9.5 20.5h5M12 13.5v7" />
      </svg>
    ),
  },
];

export default function Pricing() {
  return (
    <section id="course" className="relative z-10 mx-auto max-w-[1300px] px-12 py-28">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <p className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-teal">
          / The program
        </p>
        <h2 className="mt-4 max-w-[620px] font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight">
          One course. The entire Azure data stack.
        </h2>
      </motion.div>

      {/* This is a raised panel, so unlike the other sections it gets its own
          surface: a translucent white wash over the page vignette rather than a
          solid fill, so the violet gradient still reads through and the card
          doesn't look pasted on. The halo above it is a blurred sibling rather
          than a box-shadow — a shadow that large and diffuse renders with
          visible banding on the dark background. */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="relative mt-14"
      >
        <div
          aria-hidden
          className="absolute -top-10 left-1/2 h-40 w-[70%] -translate-x-1/2 rounded-full bg-purple/20 blur-[80px]"
        />

        <div className="relative grid grid-cols-1 gap-10 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-10 backdrop-blur-sm md:grid-cols-[1.5fr_1fr] md:gap-0 md:p-12">
          {/* ------------------------------------------------- left column -- */}
          <div className="md:pr-12">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-purple/40 bg-purple/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.11em] text-purple-2">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              Weekend batch · 100% project-driven
            </span>

            <h3 className="mt-6 max-w-[540px] font-display text-[clamp(24px,2.6vw,32px)] font-bold leading-[1.18] tracking-tight">
              Azure Data Engineering with SQL, Data Factory, Databricks &amp; PySpark
            </h3>

            <p className="mt-4 max-w-[480px] text-[15.5px] leading-relaxed text-muted">
              An industry-standard curriculum for professionals with 5+ years of experience. From
              raw ingestion to a governed gold layer, ending in a full retail lakehouse build.
            </p>

            <ul className="mt-8 list-none space-y-4">
              {FEATURES.map((f) => (
                <li key={f.label} className="flex items-center gap-3.5 text-[15px]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-teal">
                    {f.icon}
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------------------------------------ right column -- */}
          {/* Hairline divider is a left border on the column rather than an
              absolutely positioned element, so it can't drift out of sync with
              the card's padding — and it disappears automatically when the grid
              collapses to one column. */}
          <div className="flex flex-col justify-center border-t border-white/[0.08] pt-10 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            {/* The $499/$899 price that was here was invented — the curriculum
                PDF quotes no fee at all. Rather than publish a made-up number on
                a real course page, this now leads with the verifiable commitment
                and routes the fee question to a human. */}
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Full programme
            </p>

            <p className="mt-3">
              <b className="font-display text-[clamp(38px,4.4vw,52px)] font-bold leading-none tracking-tight">
                180–220
              </b>
              <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.09em] text-muted">
                Hours · 4–5 months · weekend batch
              </span>
            </p>

            <a
              href="#contact"
              className="btn-primary mt-7 inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-purple to-[#a24bff] px-7 py-4 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Request the syllabus
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
              href="https://wa.me/919567034641"
              className="mt-3 block text-center font-mono text-[10.5px] uppercase tracking-[0.09em] text-muted transition-colors hover:text-text"
            >
              Or call / WhatsApp 9567034641
            </a>
             <a
              href="https://www.udemy.com/course/azure-data-factory-data-engineer-real-time-projects/?couponCode=EFNJUL26BEST"
              className="btn-primary mt-7 inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-purple to-[#a24bff] px-7 py-4 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Enroll Now
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
          </div>
        </div>
      </motion.div>
    </section>
  );
}
