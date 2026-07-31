"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

type Phase = {
  n: string;
  title: string;
  modules: string;
  body: string;
};

const PHASES: Phase[] = [
  {
    n: "01",
    title: "Data Engineering Foundations",
    modules: "Module 1",
    body: "The mental model first — OLTP vs OLAP, warehouse vs lake vs lakehouse, ETL vs ELT, and the medallion architecture everything later builds on.",
  },
  {
    n: "02",
    title: "Azure Fundamentals",
    modules: "Modules 2–3",
    body: "Get the platform under you: subscriptions, resource groups and regions, then ADLS Gen2 with a Bronze/Silver/Gold layout and secured access paths.",
  },
  {
    n: "03",
    title: "SQL for Data Engineers",
    modules: "Modules 4–6",
    body: "From joins and set operators through window functions, recursive CTEs, views and stored procedures — the SQL depth interviews actually probe.",
  },
  {
    n: "04",
    title: "Azure Data Factory",
    modules: "Modules 7–14",
    body: "The longest phase. Linked services and activities, then dynamic parameterised pipelines, a metadata-driven framework, incremental loads, logging and SHIR.",
  },
  {
    n: "05",
    title: "Databricks & PySpark",
    modules: "Modules 15–18",
    body: "How Spark genuinely executes — driver, executors, DAG, Catalyst, AQE — then DataFrames, schemas, complex types, joins and vectorised UDFs.",
  },
  {
    n: "06",
    title: "Delta Lake & Lakehouse",
    modules: "Modules 19–21",
    body: "ACID on the lake: the transaction log, MERGE, time travel, Z-ordering and change data feed, assembled into a working Bronze → Silver → Gold flow.",
  },
  {
    n: "07",
    title: "Streaming Data Engineering",
    modules: "Modules 22–23",
    body: "Structured Streaming with checkpointing, watermarks and stateful aggregation, plus Auto Loader for event-driven incremental file discovery.",
  },
  {
    n: "08",
    title: "Performance Tuning",
    modules: "Modules 24–25",
    body: "Why pipelines are slow and how to prove it — partitioning, broadcast joins, skew and salting, Photon, caching and cluster right-sizing.",
  },
  {
    n: "09",
    title: "Enterprise Databricks",
    modules: "Modules 26–28",
    body: "Unity Catalog governance and lineage, row and column-level security, secret scopes, and multi-task Workflows with retries and alerting.",
  },
  {
    n: "10",
    title: "DevOps & CI/CD",
    modules: "Modules 29–31",
    body: "Treat pipelines as software: Git-backed Repos, branching and promotion, Databricks Asset Bundles, and tested releases via GitHub Actions or Azure DevOps.",
  },
  {
    n: "11",
    title: "Data Warehousing",
    modules: "Modules 32–33",
    body: "Dimensional modelling done properly — facts, dimensions, star vs snowflake — and SCD Types 1, 2 and 3 implemented with Delta MERGE.",
  },
  {
    n: "12",
    title: "End-to-End Industry Project",
    modules: "Capstone",
    body: "The retail lakehouse build: metadata-driven ingestion, full and incremental loads, audit logging, SCD 1 and 2, and a business-ready gold layer.",
  },
];

const QUESTION_BANK = [
  ["150+", "SQL"],
  ["100+", "PySpark"],
  ["50+", "ADF scenarios"],
  ["50+", "Delta Lake"],
  ["50+", "Architecture"],
] as const;

export default function Phases() {
  return (
    <section id="phases" className="relative z-10 mx-auto max-w-[1300px] px-12 pb-28">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <p className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-teal">
          / The path
        </p>
        <h2 className="mt-4 max-w-[720px] font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight">
          Thirteen phases. Thirty-three modules. One production platform.
        </h2>
        <p className="mt-5 max-w-[600px] text-[15.5px] leading-relaxed text-muted">
          Built for data engineers with 3–8 years of experience. The programme moves in order —
          foundations, then the Azure stack, then the enterprise patterns a senior engineer is
          expected to own. Nearly every phase ends in a hands-on build.
        </p>
      </motion.div>

      {/* A staggered container rather than per-card whileInView: twelve cards
          each running their own viewport observer is wasteful, and independent
          triggers make the grid pop in raggedly as you scroll. One parent
          observer, children offset by index, reads as a single deliberate sweep. */}
      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-14 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {PHASES.map((p) => (
          <motion.li
            key={p.n}
            variants={fadeUp}
            className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors hover:border-purple/35 hover:bg-white/[0.04]"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[12px] tracking-[0.1em] text-purple-2">
                PHASE {p.n}
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">
                {p.modules}
              </span>
            </div>

            <h3 className="mt-3.5 font-display text-[19px] font-bold leading-snug tracking-tight">
              {p.title}
            </h3>

            <p className="mt-2.5 text-[14px] leading-relaxed text-muted">{p.body}</p>
          </motion.li>
        ))}

        {/* Phase 13 spans the row: twelve single cards fill four rows exactly,
            so the closing phase gets the full width without leaving a hole in
            the grid — and it earns the emphasis, since it's the outcome phase. */}
        <motion.li
          variants={fadeUp}
          className="rounded-2xl border border-teal/25 bg-teal/[0.04] p-6 sm:col-span-2 lg:col-span-3 lg:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div>
              <span className="font-mono text-[12px] tracking-[0.1em] text-teal">PHASE 13</span>
              <h3 className="mt-3.5 font-display text-[21px] font-bold tracking-tight">
                Interview &amp; Certification Preparation
              </h3>
              <p className="mt-2.5 max-w-[560px] text-[14px] leading-relaxed text-muted">
                400+ scenario questions, Spark tuning drills, system design for data engineers and
                mock interview sessions — plus a direct path to the Databricks Certified Data
                Engineer Associate and Professional exams.
              </p>
            </div>

            <dl className="flex flex-wrap gap-x-9 gap-y-4">
              {QUESTION_BANK.map(([count, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label} questions</dt>
                  <dd>
                    <b className="block font-display text-[26px] font-bold leading-none tracking-tight text-teal">
                      {count}
                    </b>
                    <span className="mt-1.5 block font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">
                      {label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.li>
      </motion.ul>
    </section>
  );
}
