"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const PIPE_PATH =
  "M170,200 C260,240 300,300 360,330 C430,365 480,300 560,255 C640,210 700,190 760,240 C830,300 900,320 970,270 C1020,235 1040,220 1060,210";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const pipelineRef = useRef<SVGSVGElement>(null);

  // The travelling dots use SVG SMIL (<animateMotion>), which the
  // prefers-reduced-motion rule in globals.css cannot reach — that rule only
  // overrides CSS animation/transition durations. Pausing the SVG's own
  // timeline stops SMIL without changing the rendered markup, so there's no
  // server/client hydration mismatch.
  useEffect(() => {
    const svg = pipelineRef.current;
    if (!svg) return;
    if (reduceMotion) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [reduceMotion]);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-12 py-5 bg-bg/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5 font-display font-bold text-lg tracking-tight">
          <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-purple to-magenta flex items-center justify-center shadow-[0_4px_14px_rgba(139,63,251,0.35)]">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M4 6c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2Z" stroke="#fff" strokeWidth="1.6" />
              <path d="M4 6v12c0 1.1 3.6 2 8 2s8-.9 8-2V6" stroke="#fff" strokeWidth="1.6" />
              <path d="M4 12c0 1.1 3.6 2 8 2s8-.9 8-2" stroke="#fff" strokeWidth="1.6" />
            </svg>
          </div>
          DataForge
        </div>
        <ul className="hidden md:flex gap-9 list-none text-[14.5px] text-muted">
          {["Curriculum", "Course", "Instructor", "Contact"].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} className="hover:text-text transition-colors">
                {item}
              </a>
            </li>
          ))}
        </ul>
        <button className="font-semibold text-sm px-5 py-2.5 rounded-full text-white bg-gradient-to-br from-purple to-[#a24bff] shadow-[0_4px_18px_rgba(139,63,251,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(139,63,251,0.5)] transition-all">
          Enroll Now
        </button>
      </nav>

      <motion.section
        className="relative z-10 px-12 pt-24 pb-16 max-w-[1300px] mx-auto"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-teal border border-white/[0.09] bg-teal/[0.04] px-4 py-2 rounded-full"
        >
          ✦ THE 2026 DATA ENGINEERING BOOTCAMP
        </motion.div>

        <div className="relative w-full h-[520px] mt-4">
          <motion.h1
            variants={fadeUp}
            className="font-display font-bold text-[clamp(42px,6vw,84px)] leading-[1.02] tracking-tight relative z-[3] max-w-[900px]"
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

          <svg
            ref={pipelineRef}
            className="absolute top-10 left-0 w-full h-full z-[2] pointer-events-none"
            viewBox="0 0 1200 520"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="connectorGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b3ffb" />
                <stop offset="100%" stopColor="#c94fef" />
              </linearGradient>
            </defs>

            <path
              d={PIPE_PATH}
              fill="none"
              stroke="url(#connectorGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {[
              [300, 300],
              [480, 300],
              [700, 192],
              [900, 320],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="4" fill="#d4ff5c" />
            ))}

            {[0, -2.2].map((begin, i) => (
              <circle key={i} r={i === 0 ? 5 : 4} fill={i === 0 ? "#d4ff5c" : "#5eead4"} opacity={i === 0 ? 1 : 0.9}>
                <animateMotion dur="4.5s" begin={`${begin}s`} repeatCount="indefinite" path={PIPE_PATH} />
              </circle>
            ))}

            {[
              { cx: 170, cy: 200, rx: 62, ry: 72, size: 76, rot: -6, fill: "#5eead4", delay: 0 },
              { cx: 360, cy: 330, rx: 70, ry: 82, size: 92, rot: -4, fill: "#c94fef", delay: 0.6 },
              { cx: 560, cy: 255, rx: 58, ry: 68, size: 68, rot: 8, fill: "#b06bff", delay: 1.2 },
              { cx: 760, cy: 360, rx: 72, ry: 86, size: 96, rot: -5, fill: "#7c2ae8", delay: 1.8 },
              { cx: 1000, cy: 230, rx: 60, ry: 70, size: 72, rot: 6, fill: "#5eead4", delay: 2.4 },
            ].map((n, i) => (
              <g key={i}>
                <ellipse cx={n.cx} cy={n.cy} rx={n.rx} ry={n.ry} fill="none" stroke="#3a3a44" strokeWidth="1.4" />
                <g
                  transform={`translate(${n.cx},${n.cy}) rotate(${n.rot})`}
                  className="animate-floaty"
                  style={{ animationDelay: `${n.delay}s` }}
                >
                  <rect x={-n.size / 2} y={-n.size / 2 - 6} width={n.size} height={n.size} rx="14" fill={n.fill} />
                </g>
              </g>
            ))}
          </svg>
        </div>

        <motion.p variants={fadeUp} className="max-w-[560px] text-muted text-[16.5px] leading-relaxed relative z-[3] mt-2">
          Build production-grade pipelines from ingestion to insight. Learn{" "}
          <b className="text-[#c9c9d1] font-semibold">Azure Data Factory, Databricks, Synapse</b> and{" "}
          <b className="text-[#c9c9d1] font-semibold">Power BI</b> by shipping a real end-to-end project — guided by John Doe.
        </motion.p>

        <motion.div variants={fadeUp} className="flex items-center gap-4 mt-8 relative z-[3]">
          <button className="btn-primary inline-flex items-center gap-2.5 font-semibold text-[15px] text-white px-[26px] py-4 rounded-full bg-gradient-to-br from-purple to-[#a24bff]">
            Enroll in the Course
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="font-semibold text-[15px] px-6 py-4 rounded-full border border-white/[0.09] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.18] transition-colors">
            What you&apos;ll learn
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className="flex gap-14 mt-16 relative z-[3]">
          {[
            ["12", "Weeks / Self-Paced"],
            ["40+", "Hands-on Labs"],
            ["1", "Capstone Project"],
          ].map(([num, label]) => (
            <div key={label}>
              <b className="block font-display text-3xl font-bold">{num}</b>
              <span className="block mt-1 font-mono text-[11.5px] tracking-[0.08em] text-muted uppercase">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.section>
    </>
  );
}
