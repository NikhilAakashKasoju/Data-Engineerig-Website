"use client";

import { motion, type Variants } from "framer-motion";
import Connector from "./Connector";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ---------------------------------------------------------------- icons -- */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[18px] w-[18px]",
};

const ICONS = {
  ingest: (
    <svg {...iconProps}>
      <path d="M7 17a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.5-1.5A3.75 3.75 0 0 1 18 17" />
      <path d="M12 12v6m0 0-2.5-2.5M12 18l2.5-2.5" />
    </svg>
  ),
  store: (
    <svg {...iconProps}>
      <ellipse cx="12" cy="6" rx="7" ry="2.6" />
      <path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" />
      <path d="M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6" />
    </svg>
  ),
  transform: (
    <svg {...iconProps}>
      <path d="m4 20 9-9M14.5 4.5 16 3l1.5 1.5L19 6l-1.5 1.5" />
      <path d="m13 11 3-3M6 5l.8 2L9 7.8 6.8 8.6 6 11l-.8-2.4L3 7.8 5.2 7Zm13 8 .6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6Z" />
    </svg>
  ),
  orchestrate: (
    <svg {...iconProps}>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
      <path d="M10 6.5h3.5A2.5 2.5 0 0 1 16 9v5M6.5 10v3.5A2.5 2.5 0 0 0 9 16h5" />
    </svg>
  ),
  serve: (
    <svg {...iconProps}>
      <path d="M4 20V10m5 10V4m5 16v-7m5 7V8" />
    </svg>
  ),
};

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" className="mt-[3px] h-[17px] w-[17px] shrink-0">
    <circle cx="12" cy="12" r="9.2" stroke="#d4ff5c" strokeWidth="1.5" />
    <path
      d="m8.4 12.2 2.5 2.5 4.7-4.9"
      stroke="#d4ff5c"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ----------------------------------------------------------------- data -- */

type ModuleItem = {
  n: string;
  icon: keyof typeof ICONS;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  /** Drop a real image path here (e.g. "/curriculum/ingest.jpg") to replace the
   *  gradient placeholder. */
  image?: string;
};

const MODULES: ModuleItem[] = [
  {
    n: "01",
    icon: "ingest",
    eyebrow: "Data Factory · Event Hubs",
    title: "Ingest",
    body: "Pull data from APIs, databases and streams. Build resilient, incremental ingestion pipelines that never lose an event.",
    points: ["Batch & streaming sources", "Change data capture", "Fault-tolerant loads"],
  },
  {
    n: "02",
    icon: "store",
    eyebrow: "ADLS Gen2 · Lakehouse",
    title: "Store",
    body: "Design a medallion lakehouse. Model bronze, silver and gold layers with partitioning that scales to billions of rows.",
    points: ["Delta Lake tables", "Bronze/Silver/Gold", "Cost-smart partitioning"],
  },
  {
    n: "03",
    icon: "transform",
    eyebrow: "Databricks · PySpark",
    title: "Transform",
    body: "Clean, join and reshape at scale. Handle schema drift, deduplication and business logic with tested Spark jobs.",
    points: ["PySpark & SQL", "Schema evolution", "Unit-tested transforms"],
  },
  {
    n: "04",
    icon: "orchestrate",
    eyebrow: "Airflow · ADF Pipelines",
    title: "Orchestrate",
    body: "Schedule, monitor and retry. Wire everything into dependable DAGs with alerting, backfills and data quality gates.",
    points: ["DAG design", "Retries & SLAs", "Data quality checks"],
  },
  {
    n: "05",
    icon: "serve",
    eyebrow: "Synapse · Power BI",
    title: "Serve",
    body: "Turn curated data into decisions. Publish semantic models and interactive dashboards stakeholders actually use.",
    points: ["Semantic models", "Power BI dashboards", "Self-serve analytics"],
  },
];

/* ------------------------------------------------------------ subviews -- */

function Panel({ item }: { item: ModuleItem }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-purple/25 via-[#1a1030] to-teal/10">
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={`${item.title} — ${item.eyebrow}`}
          className="h-full w-full object-cover"
        />
      )}
      <span className="absolute bottom-4 left-4 rounded-md bg-black/55 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-text backdrop-blur-sm">
        {item.title}
      </span>
    </div>
  );
}

function Copy({ item }: { item: ModuleItem }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <b className="font-display text-[40px] font-bold leading-none text-white/15">{item.n}</b>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple/30 bg-purple/15 text-purple-2">
          {ICONS[item.icon]}
        </span>
      </div>

      <p className="mt-5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-teal">
        {item.eyebrow}
      </p>
      <h3 className="mt-2 font-display text-[34px] font-bold tracking-tight">{item.title}</h3>
      <p className="mt-3 max-w-[460px] text-[15.5px] leading-relaxed text-muted">{item.body}</p>

      <ul className="mt-6 list-none space-y-3">
        {item.points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-[15px]">
            <Check />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- main -- */

export default function Curriculum() {
  return (
    <section id="curriculum" className="relative z-10 mx-auto max-w-[1300px] px-12 py-28">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <p className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-teal">
          / What you&apos;ll learn
        </p>
        <h2 className="mt-4 max-w-[640px] font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight">
          Follow the data — from raw source to real decisions.
        </h2>
        <p className="mt-5 max-w-[560px] text-[15.5px] leading-relaxed text-muted">
          Every module maps to one stage of a production pipeline. You&apos;ll build each stage
          yourself, then connect them into a single end-to-end system.
        </p>
      </motion.div>

      <div className="mt-20">
        {MODULES.map((item, i) => {
          const textFirst = i % 2 === 0;
          return (
            <div key={item.n}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
              >
                {/* Source order is always copy-then-panel so screen readers and
                    keyboard order stay logical; the visual swap is done with
                    `order` at md+ only. */}
                <div className={textFirst ? "md:order-1" : "md:order-2"}>
                  <Copy item={item} />
                </div>
                <div className={textFirst ? "md:order-2" : "md:order-1"}>
                  <Panel item={item} />
                </div>
              </motion.div>

              {i < MODULES.length - 1 && (
                <Connector direction={textFirst ? "left" : "right"} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
