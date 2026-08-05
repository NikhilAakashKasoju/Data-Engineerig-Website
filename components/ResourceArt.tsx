/**
 * Cover art for the free-resource cards, one illustration per playlist topic.
 *
 * Not real YouTube thumbnails: those need a video ID (i.ytimg.com/vi/<id>/…)
 * and a playlist URL doesn't expose one — fetching a playlist returns title and
 * count only. Getting them properly means the YouTube Data API plus a key, plus
 * a remotePatterns entry in next.config.mjs. See the README note.
 *
 * These tiles stay dark in both themes, like the curriculum stage panels, so
 * the colours here are deliberately literal rather than themed — they only ever
 * sit on a dark canvas.
 *
 * Shared 320×180 viewBox so every card crops identically at aspect-video.
 */

const LINE = "#61708f";
const PALE = "#c9d6ee";

type ArtProps = { accent: string };

/* ------------------------------------------------------------- adf canvas -- */

function Activity({ x, y, accent }: { x: number; y: number; accent: string }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="58"
        height="32"
        rx="7"
        fill={accent}
        fillOpacity="0.18"
        stroke={accent}
        strokeOpacity="0.8"
        strokeWidth="1.4"
      />
      <rect x={x + 10} y={y + 10} width="24" height="4" rx="2" fill={PALE} fillOpacity="0.75" />
      <rect x={x + 10} y={y + 19} width="14" height="4" rx="2" fill={LINE} />
    </g>
  );
}

/** Azure Data Factory: the authoring canvas — activities wired into a pipeline. */
function Adf({ accent }: ArtProps) {
  return (
    <>
      {[
        "M86,76 C104,76 108,56 129,56",
        "M86,76 C104,76 108,120 129,120",
        "M189,56 C210,56 214,88 232,88",
        "M189,120 C210,120 214,88 232,88",
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={accent}
          strokeOpacity="0.55"
          strokeWidth="1.6"
          strokeDasharray="5 7"
          className="animate-field"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      <Activity x={28} y={60} accent={accent} />
      <Activity x={131} y={40} accent={accent} />
      <Activity x={131} y={104} accent={accent} />
      <Activity x={232} y={72} accent={accent} />
    </>
  );
}

/* -------------------------------------------------------- real scenarios -- */

/** A branch that resolves to success or failure — what a "scenario" actually is. */
function Scenarios({ accent }: ArtProps) {
  return (
    <>
      <path
        d="M80,90 H112 M168,74 C186,74 190,58 210,58 M168,106 C186,106 190,122 210,122"
        fill="none"
        stroke={accent}
        strokeOpacity="0.6"
        strokeWidth="1.6"
        strokeDasharray="5 7"
        className="animate-field"
      />

      <rect
        x="24"
        y="74"
        width="56"
        height="32"
        rx="7"
        fill={accent}
        fillOpacity="0.18"
        stroke={accent}
        strokeOpacity="0.8"
        strokeWidth="1.4"
      />
      <rect x="36" y="86" width="30" height="4" rx="2" fill={PALE} fillOpacity="0.75" />
      <rect x="36" y="95" width="18" height="4" rx="2" fill={LINE} />

      {/* Condition */}
      <g transform="translate(140,90) rotate(45)">
        <rect
          x="-20"
          y="-20"
          width="40"
          height="40"
          rx="6"
          fill={accent}
          fillOpacity="0.16"
          stroke={accent}
          strokeOpacity="0.85"
          strokeWidth="1.5"
        />
      </g>

      {/* Success */}
      <rect
        x="210"
        y="42"
        width="72"
        height="32"
        rx="7"
        fill="#5eead4"
        fillOpacity="0.14"
        stroke="#5eead4"
        strokeOpacity="0.6"
        strokeWidth="1.4"
      />
      <path
        d="m224,58 5,5 9,-10"
        fill="none"
        stroke="#5eead4"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="244" y="56" width="26" height="4" rx="2" fill={LINE} />

      {/* Failure + retry */}
      <rect
        x="210"
        y="106"
        width="72"
        height="32"
        rx="7"
        fill="#d4ff5c"
        fillOpacity="0.12"
        stroke="#d4ff5c"
        strokeOpacity="0.5"
        strokeWidth="1.4"
      />
      <path
        d="M231,114 v8 m0,5 v1"
        stroke="#d4ff5c"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="244" y="120" width="26" height="4" rx="2" fill={LINE} />
    </>
  );
}

/* -------------------------------------------------- databricks / pyspark -- */

/** A notebook on the left, the driver/executor cluster it runs on to the right. */
function Databricks({ accent }: ArtProps) {
  return (
    <>
      <rect
        x="22"
        y="26"
        width="168"
        height="128"
        rx="10"
        fill="#ffffff"
        fillOpacity="0.04"
        stroke={LINE}
        strokeWidth="1.4"
      />
      <path d="M22,50 H190" stroke={LINE} strokeWidth="1.4" />
      {[34, 46, 58].map((cx) => (
        <circle key={cx} cx={cx} cy="38" r="3.4" fill={LINE} />
      ))}

      {[62, 96, 130].map((y, i) => (
        <g key={y}>
          <rect
            x="34"
            y={y}
            width="144"
            height="22"
            rx="5"
            fill={accent}
            fillOpacity={i === 1 ? 0.16 : 0.07}
          />
          <rect x="42" y={y + 9} width={i === 1 ? 88 : 60} height="4" rx="2" fill={PALE} fillOpacity="0.7" />
          <rect x={i === 1 ? 136 : 108} y={y + 9} width="26" height="4" rx="2" fill={LINE} />
        </g>
      ))}

      {/* Driver → executors */}
      <path
        d="M246,60 V78 M246,78 H214 V106 M246,78 H278 V106 M246,78 V106"
        fill="none"
        stroke={accent}
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <rect
        x="224"
        y="34"
        width="44"
        height="26"
        rx="6"
        fill={accent}
        fillOpacity="0.28"
        stroke={accent}
        strokeOpacity="0.85"
        strokeWidth="1.4"
      />
      {[214, 246, 278].map((cx) => (
        <rect
          key={cx}
          x={cx - 16}
          y="106"
          width="32"
          height="24"
          rx="5"
          fill={accent}
          fillOpacity="0.14"
          stroke={accent}
          strokeOpacity="0.6"
          strokeWidth="1.3"
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------- sql -- */

/** A result grid beside a query — the shape of every SQL interview question. */
function Sql({ accent }: ArtProps) {
  return (
    <>
      {/* Query */}
      <rect x="22" y="34" width="112" height="52" rx="8" fill={accent} fillOpacity="0.12" />
      <rect x="34" y="46" width="34" height="5" rx="2.5" fill={accent} />
      <rect x="72" y="46" width="26" height="5" rx="2.5" fill={PALE} fillOpacity="0.7" />
      <rect x="34" y="60" width="20" height="5" rx="2.5" fill={accent} />
      <rect x="58" y="60" width="44" height="5" rx="2.5" fill={LINE} />
      <rect x="34" y="72" width="28" height="5" rx="2.5" fill={accent} />

      {/* Question mark — the "interview" half */}
      <circle cx="66" cy="126" r="22" fill={accent} fillOpacity="0.14" stroke={accent} strokeOpacity="0.5" strokeWidth="1.4" />
      <path
        d="M60,119 a6.5,6.5 0 1 1 6.5,7 v3"
        fill="none"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="66.5" cy="135" r="1.9" fill={accent} />

      {/* Result grid */}
      <rect
        x="160"
        y="34"
        width="136"
        height="112"
        rx="8"
        fill="#ffffff"
        fillOpacity="0.04"
        stroke={LINE}
        strokeWidth="1.4"
      />
      <rect x="160" y="34" width="136" height="24" rx="8" fill={accent} fillOpacity="0.22" />
      <path
        d="M160,58 H296 M160,80 H296 M160,102 H296 M160,124 H296 M205,34 V146 M251,34 V146"
        stroke={LINE}
        strokeWidth="1.1"
      />
      {[68, 90, 112, 134].map((y, r) =>
        [176, 221, 267].map((x, c) => (
          <rect
            key={`${y}-${x}`}
            x={x}
            y={y - 2}
            width={(r + c) % 3 === 0 ? 14 : 22}
            height="4"
            rx="2"
            fill={LINE}
          />
        )),
      )}
    </>
  );
}

/* ---------------------------------------------------------------- shorts -- */

/** Vertical frames — the format is the subject. */
function Shorts({ accent }: ArtProps) {
  return (
    <>
      {[
        { x: 74, w: 46, h: 104, o: 0.35 },
        { x: 200, w: 46, h: 104, o: 0.35 },
      ].map((f) => (
        <rect
          key={f.x}
          x={f.x}
          y={(180 - f.h) / 2}
          width={f.w}
          height={f.h}
          rx="8"
          fill={accent}
          fillOpacity={0.08}
          stroke={accent}
          strokeOpacity={f.o}
          strokeWidth="1.4"
        />
      ))}

      <rect
        x="130"
        y="18"
        width="60"
        height="144"
        rx="11"
        fill={accent}
        fillOpacity="0.18"
        stroke={accent}
        strokeOpacity="0.9"
        strokeWidth="1.6"
      />
      <rect x="142" y="132" width="36" height="4" rx="2" fill={PALE} fillOpacity="0.6" />
      <rect x="142" y="142" width="22" height="4" rx="2" fill={LINE} />

      {/* Lightning — short, fast */}
      <path
        d="M164,52 L150,86 h11 l-5,26 20,-36 h-11 l6,-24 z"
        fill="#d4ff5c"
        fillOpacity="0.9"
      />
    </>
  );
}

/* --------------------------------------------------------------- channel -- */

/** A wall of content rather than one video, plus the subscribe bell. */
function Channel({ accent }: ArtProps) {
  return (
    <>
      {[
        [30, 30],
        [122, 30],
        [214, 30],
        [30, 100],
        [122, 100],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect
            x={x}
            y={y}
            width="76"
            height="50"
            rx="7"
            fill={accent}
            fillOpacity={i === 1 ? 0.24 : 0.1}
            stroke={accent}
            strokeOpacity={i === 1 ? 0.8 : 0.4}
            strokeWidth="1.3"
          />
          <rect x={x + 10} y={y + 36} width="34" height="4" rx="2" fill={LINE} />
        </g>
      ))}

      <circle cx="252" cy="125" r="26" fill={accent} fillOpacity="0.16" stroke={accent} strokeOpacity="0.6" strokeWidth="1.4" />
      <path
        d="M252,110 a9,9 0 0 1 9,9 v7 l3,4 h-24 l3,-4 v-7 a9,9 0 0 1 9,-9 z"
        fill="none"
        stroke="#d4ff5c"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M248,134 a4,4 0 0 0 8,0" fill="none" stroke="#d4ff5c" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

/* ------------------------------------------------------------------- api -- */

const ART = {
  adf: Adf,
  scenarios: Scenarios,
  databricks: Databricks,
  sql: Sql,
  shorts: Shorts,
  channel: Channel,
};

export type ResourceArtName = keyof typeof ART;

export default function ResourceArt({
  name,
  accent,
}: {
  name: ResourceArtName;
  accent: string;
}) {
  const Art = ART[name];
  return (
    <svg
      viewBox="0 0 320 180"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <Art accent={accent} />
    </svg>
  );
}
