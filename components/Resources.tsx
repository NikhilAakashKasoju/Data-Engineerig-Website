"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

/**
 * Titles and video counts are read off the actual YouTube playlists, not
 * invented. Update them here if the channel changes.
 *
 * Accents deliberately avoid the primary #0b4fdb: it's dark enough that as
 * small mono text on #0d0714 it fails contrast. The lighter blues, teal and
 * lime all clear it comfortably.
 */
type Resource = {
  title: string;
  href: string;
  count: string;
  tag: string;
  accent: string;
};

const RESOURCES: Resource[] = [
  {
    title: "Azure Data Factory (ADF) Tutorials",
    href: "https://www.youtube.com/playlist?list=PL6Gbi3RNCXcFblwBn4VGRJOY4buUcLONC",
    count: "39 videos",
    tag: "Data Factory",
    accent: "#4b85ff",
  },
  {
    title: "Real-Time Scenarios: Azure Data Factory",
    href: "https://www.youtube.com/playlist?list=PL6Gbi3RNCXcGxSyN9kIhlQqI0riNKUDkO",
    count: "9 videos",
    tag: "Scenarios",
    accent: "#2bb8f5",
  },
  {
    title: "Azure Databricks — PySpark Tutorials",
    href: "https://www.youtube.com/playlist?list=PL6Gbi3RNCXcGldBo_-OMFljcocjAwtDzh",
    count: "4 videos",
    tag: "Databricks",
    accent: "#5eead4",
  },
  {
    title: "SQL — Interview Questions",
    href: "https://www.youtube.com/playlist?list=PL6Gbi3RNCXcFGXa63-Y_Ex2CTSFoQ-Ofr",
    count: "4 videos",
    tag: "SQL",
    accent: "#d4ff5c",
  },
  {
    title: "PySpark Shorts",
    href: "https://www.youtube.com/playlist?list=PL6Gbi3RNCXcG76fVFR__iVdmWAQq2jDi7",
    count: "10 videos",
    tag: "PySpark",
    accent: "#7aa7ff",
  },
  {
    title: "EduFulness on YouTube",
    href: "https://www.youtube.com/@EduFulnessEFN",
    count: "Channel",
    tag: "Everything else",
    accent: "#4b85ff",
  },
];

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
    <path
      d="M7 17 17 7M9 7h8v8"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Card({ item }: { item: Resource }) {
  const isChannel = item.count === "Channel";

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      // The whole card is the link, so the click target is the full tile rather
      // than a small "watch" affordance in the corner.
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-surface-2"
    >
      {/* Accent colours vary per card, so the tints are inline styles — Tailwind
          compiles a static stylesheet and cannot generate classes from runtime
          values. */}
      <div
        className="relative aspect-video overflow-hidden rounded-xl border border-line"
        style={{ background: `linear-gradient(140deg, ${item.accent}33, #0c1428 65%)` }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(${item.accent} 1px, transparent 1.4px)`,
            backgroundSize: "14px 14px",
          }}
        />

        <span className="absolute inset-0 flex items-center justify-center">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
            style={{
              borderColor: `${item.accent}66`,
              backgroundColor: `${item.accent}24`,
            }}
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill={item.accent} aria-hidden>
              <path d="M8 5v14l11-7L8 5Z" />
            </svg>
          </span>
        </span>

        <span className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-white backdrop-blur-sm">
          {item.count}
        </span>
      </div>

      <div className="mt-4 flex flex-1 flex-col px-1 pb-1">
        <span
          className="font-mono text-[10.5px] uppercase tracking-[0.1em]"
          style={{ color: item.accent }}
        >
          {item.tag}
        </span>

        <h3 className="mt-2 font-display text-[17px] font-bold leading-snug tracking-tight">
          {item.title}
        </h3>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted transition-colors group-hover:text-text">
          {isChannel ? "Visit the channel" : "Watch free on YouTube"}
          <ExternalIcon />
        </span>
      </div>
    </a>
  );
}

export default function Resources() {
  return (
    <section id="resources" className="relative z-10 mx-auto max-w-[1300px] px-12 pb-28">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <p className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-teal">
          / Free resources
        </p>
        <h2 className="mt-4 max-w-[680px] font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight">
          Try the teaching before you pay for it.
        </h2>
        <p className="mt-5 max-w-[580px] text-[15.5px] leading-relaxed text-muted">
          66 free lessons across five playlists on the EduFulness channel — same instructor, same
          approach. Start with Data Factory, then work through PySpark and SQL.
        </p>
      </motion.div>

      {/* One parent observer with staggerChildren rather than six independent
          whileInView triggers, so the grid resolves as a single sweep. */}
      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-14 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {RESOURCES.map((item) => (
          <motion.li key={item.href} variants={fadeUp}>
            <Card item={item} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
