/**
 * Illustrations for the five pipeline stages.
 *
 * These are hand-drawn SVG rather than photography on purpose: stock photos of
 * "server racks" and "blue lights" decorate without explaining, and they carry
 * licensing and weight costs. Each of these depicts the literal meaning of the
 * word — many sources funnelling into one store, layered storage tiers, chaos
 * becoming order, a dependency graph, a dashboard — so the picture teaches the
 * concept instead of just filling the box.
 *
 * All five share a 640×360 viewBox (16:9) so they drop into the same panel, and
 * they use theme colours only, with one deliberate exception noted on Store.
 *
 * Movement uses the existing `animate-field` CSS dash-flow, which means the
 * global prefers-reduced-motion rule already switches it off.
 */

const STROKE = "#3a3a44";

/* ---------------------------------------------------------------- ingest -- */

function Ingest() {
  const feeds = [
    "M132,104 C232,104 252,146 316,172",
    "M132,180 C212,180 258,180 316,180",
    "M132,256 C232,256 252,214 316,188",
  ];

  return (
    <>
      {[104, 180, 256].map((y, i) => (
        <g key={i}>
          <rect
            x="62"
            y={y - 22}
            width="70"
            height="44"
            rx="10"
            fill="#5eead4"
            fillOpacity={0.16}
            stroke="#5eead4"
            strokeOpacity={0.5}
          />
          <circle cx="97" cy={y} r="5" fill="#5eead4" />
        </g>
      ))}

      {feeds.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#5eead4"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeDasharray="6 10"
          className="animate-field"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}

      {/* Funnel — the whole point of the ingest stage in one shape. */}
      <polygon
        points="300,124 392,124 355,194 355,236 337,236 337,194"
        fill="#8b3ffb"
        fillOpacity="0.22"
        stroke="#b06bff"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <path
        d="M346,238 C346,272 402,272 444,244"
        fill="none"
        stroke="#c94fef"
        strokeWidth="2"
        strokeDasharray="6 10"
        className="animate-field"
      />

      <g>
        <path d="M452,206 v54 a53,16 0 0 0 106,0 v-54" fill="#c94fef" fillOpacity="0.2" />
        <path
          d="M452,206 v54 a53,16 0 0 0 106,0 v-54"
          fill="none"
          stroke="#c94fef"
          strokeWidth="2"
        />
        <ellipse cx="505" cy="206" rx="53" ry="16" fill="#c94fef" fillOpacity="0.45" />
        <ellipse cx="505" cy="206" rx="53" ry="16" fill="none" stroke="#c94fef" strokeWidth="2" />
      </g>
    </>
  );
}

/* ----------------------------------------------------------------- store -- */

/**
 * Bronze / Silver / Gold are the literal names of the medallion tiers, so the
 * slabs use metallic colours rather than the brand palette. This is the one
 * place I've stepped outside the tokens: naming a layer "bronze" and drawing it
 * purple would actively work against the illustration's job.
 */
const TIERS = [
  { cy: 112, fill: "#e8c26a" }, // gold
  { cy: 186, fill: "#b8c0cc" }, // silver
  { cy: 260, fill: "#c98a5a" }, // bronze
];

function Store() {
  const cx = 320;
  const w = 148;
  const h = 52;
  const t = 17;

  return (
    <>
      {TIERS.map((tier, i) => {
        const { cy, fill } = tier;
        const top = `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`;
        const left = `${cx - w},${cy} ${cx},${cy + h} ${cx},${cy + h + t} ${cx - w},${cy + t}`;
        const right = `${cx + w},${cy} ${cx},${cy + h} ${cx},${cy + h + t} ${cx + w},${cy + t}`;

        return (
          <g key={i}>
            <polygon points={left} fill={fill} fillOpacity="0.3" />
            <polygon points={right} fill={fill} fillOpacity="0.45" />
            <polygon points={top} fill={fill} fillOpacity="0.7" />
            <polygon points={top} fill="none" stroke="#ffffff" strokeOpacity="0.22" />
          </g>
        );
      })}

      {/* Data descending through the tiers, refining as it goes. */}
      <path
        d="M320,64 V96 M320,150 V172 M320,224 V246"
        stroke="#d4ff5c"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="5 9"
        className="animate-field"
      />
    </>
  );
}

/* ------------------------------------------------------------- transform -- */

const MESSY = [
  [78, 96, -18],
  [140, 74, 12],
  [96, 158, 26],
  [162, 148, -9],
  [72, 226, 8],
  [146, 232, -22],
  [116, 292, 15],
];

function Transform() {
  return (
    <>
      {/* Left: unaligned, mismatched, grey — raw input. */}
      {MESSY.map(([x, y, r], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="46"
          height="34"
          rx="7"
          transform={`rotate(${r} ${x + 23} ${y + 17})`}
          fill="#6b6b78"
          fillOpacity="0.42"
          stroke={STROKE}
        />
      ))}

      {/* Centre: the transformation itself, as a closed cycle. */}
      <g>
        <circle
          cx="320"
          cy="180"
          r="46"
          fill="#8b3ffb"
          fillOpacity="0.12"
          stroke="#b06bff"
          strokeWidth="2"
          strokeDasharray="5 8"
          className="animate-field"
        />
        <path
          d="M300,166 h30 a14,14 0 0 1 0,28 h-30"
          fill="none"
          stroke="#d4ff5c"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="m306,158 -8,8 8,8"
          fill="none"
          stroke="#d4ff5c"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Right: aligned, uniform, on-brand — conformed output. */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={432 + col * 58}
            y={100 + row * 58}
            width="46"
            height="46"
            rx="9"
            fill={row === 0 ? "#5eead4" : row === 1 ? "#b06bff" : "#c94fef"}
            fillOpacity="0.55"
          />
        )),
      )}
    </>
  );
}

/* ----------------------------------------------------------- orchestrate -- */

const DAG_NODES = [
  { x: 92, y: 180, fill: "#5eead4" },
  { x: 262, y: 100, fill: "#b06bff" },
  { x: 262, y: 260, fill: "#b06bff" },
  { x: 432, y: 180, fill: "#c94fef" },
  { x: 556, y: 180, fill: "#d4ff5c" },
];

const DAG_EDGES = [
  "M150,180 C196,180 206,116 232,108",
  "M150,180 C196,180 206,244 232,252",
  "M292,108 C330,100 386,146 404,172",
  "M292,252 C330,260 386,214 404,188",
  "M462,180 H524",
];

function Orchestrate() {
  return (
    <>
      {DAG_EDGES.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#8b3ffb"
          strokeOpacity="0.75"
          strokeWidth="2"
          strokeDasharray="6 9"
          className="animate-field"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}

      {DAG_NODES.map((n, i) => (
        <g key={i}>
          <rect
            x={n.x - 30}
            y={n.y - 24}
            width="60"
            height="48"
            rx="12"
            fill={n.fill}
            fillOpacity="0.55"
            stroke={n.fill}
            strokeOpacity="0.9"
            strokeWidth="1.5"
          />
          <path
            d={`M${n.x - 13},${n.y - 6} h26 M${n.x - 13},${n.y + 4} h16`}
            stroke="#0d0714"
            strokeOpacity="0.55"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Schedule marker — orchestration is dependencies plus time. */}
      <g transform="translate(556,74)">
        <circle r="24" fill="none" stroke={STROKE} strokeWidth="2" />
        <path
          d="M0,-13 V0 l9,7"
          fill="none"
          stroke="#5eead4"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </>
  );
}

/* ----------------------------------------------------------------- serve -- */

const BARS = [
  [0.42, "#8b3ffb"],
  [0.66, "#b06bff"],
  [0.34, "#8b3ffb"],
  [0.86, "#c94fef"],
  [0.58, "#b06bff"],
  [0.72, "#c94fef"],
] as const;

function Serve() {
  return (
    <>
      <rect
        x="70"
        y="52"
        width="500"
        height="256"
        rx="18"
        fill="#ffffff"
        fillOpacity="0.03"
        stroke={STROKE}
        strokeWidth="1.6"
      />
      <path d="M70,96 H570" stroke={STROKE} strokeWidth="1.6" />
      {[92, 110, 128].map((cx) => (
        <circle key={cx} cx={cx} cy="74" r="4.5" fill="#6b6b78" />
      ))}

      {/* KPI tiles */}
      {[0, 1].map((i) => (
        <g key={i}>
          <rect
            x={94 + i * 122}
            y="118"
            width="106"
            height="58"
            rx="10"
            fill="#5eead4"
            fillOpacity="0.08"
            stroke="#5eead4"
            strokeOpacity="0.28"
          />
          <rect
            x={110 + i * 122}
            y="134"
            width={i === 0 ? 52 : 40}
            height="10"
            rx="5"
            fill="#5eead4"
            fillOpacity="0.75"
          />
          <rect
            x={110 + i * 122}
            y="152"
            width="70"
            height="7"
            rx="3.5"
            fill="#6b6b78"
            fillOpacity="0.7"
          />
        </g>
      ))}

      {/* Bar chart */}
      {BARS.map(([scale, fill], i) => {
        const h = 84 * scale;
        return (
          <rect
            key={i}
            x={96 + i * 40}
            y={280 - h}
            width="26"
            height={h}
            rx="5"
            fill={fill}
            fillOpacity="0.85"
          />
        );
      })}

      {/* Trend line */}
      <path
        d="M366,266 L400,232 L434,246 L468,196 L502,214 L540,166"
        fill="none"
        stroke="#d4ff5c"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[
        [366, 266],
        [400, 232],
        [434, 246],
        [468, 196],
        [502, 214],
        [540, 166],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="#d4ff5c" />
      ))}
      <path d="M366,290 H548" stroke={STROKE} strokeWidth="1.6" />
    </>
  );
}

/* ------------------------------------------------------------------ api -- */

const ART = {
  ingest: Ingest,
  store: Store,
  transform: Transform,
  orchestrate: Orchestrate,
  serve: Serve,
};

export type StageName = keyof typeof ART;

export default function StageArt({ name }: { name: StageName }) {
  const Art = ART[name];
  return (
    <svg
      viewBox="0 0 640 360"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Illustration of the ${name} stage`}
    >
      <Art />
    </svg>
  );
}
