"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------- isometric maths -- */

/**
 * Projects an axis-aligned box onto the screen using a standard 2:1 isometric
 * projection, and returns only the three faces that can actually be seen from
 * this viewpoint (top, front-left, front-right). Drawing the hidden three would
 * cost fill rate for nothing and, without a depth buffer, would risk painting
 * over the visible ones.
 *
 * `b` is the bottom-most vertex — the near corner closest to the viewer.
 * Screen basis: x-axis → (w, w/2), y-axis → (-w, w/2), z-axis → (0, -h).
 */
function isoFaces(cx: number, cy: number, w: number, h: number) {
  const B0: [number, number] = [cx, cy - w];
  const B1: [number, number] = [cx + w, cy - w / 2];
  const B2: [number, number] = [cx, cy];
  const B3: [number, number] = [cx - w, cy - w / 2];

  const lift = ([x, y]: [number, number]): [number, number] => [x, y - h];
  const [T0, T1, T2, T3] = [B0, B1, B2, B3].map(lift);

  const pts = (arr: [number, number][]) => arr.map(([x, y]) => `${x},${y}`).join(" ");

  return {
    top: pts([T0, T1, T2, T3]),
    right: pts([T1, T2, B2, B1]),
    left: pts([T3, T2, B2, B3]),
    center: [cx, cy - w / 2 - h / 2] as [number, number],
  };
}

/* -------------------------------------------------------------- geometry -- */

const CUBES = [
  { cx: 150, cy: 178, w: 46, h: 58, color: "#5eead4", tilt: -6, delay: 0 },
  { cx: 300, cy: 288, w: 53, h: 68, color: "#c94fef", tilt: 5, delay: 0.7 },
  { cx: 142, cy: 402, w: 44, h: 56, color: "#b06bff", tilt: -4, delay: 1.4 },
  { cx: 302, cy: 512, w: 50, h: 63, color: "#8b3ffb", tilt: 7, delay: 2.1 },
];

/** Threads through the cube centres so the assembly still reads as a pipeline. */
const PIPE =
  "M150,120 C214,150 252,182 300,222 C348,262 214,286 142,332 C78,374 246,404 302,446";

/**
 * A dipole field rendered as nested loops. In projection, rotating a circular
 * field line around the vertical axis produces ellipses that share a centre and
 * height but differ in width — so varying rx alone reads as loops orbiting the
 * cube in 3D, without needing real geometry.
 */
function Field({
  cx,
  cy,
  h,
  color,
  delay,
}: {
  cx: number;
  cy: number;
  h: number;
  color: string;
  delay: number;
}) {
  const loops = [
    { rx: h * 0.42, ry: h * 1.5, opacity: 0.55 },
    { rx: h * 0.82, ry: h * 1.34, opacity: 0.36 },
    { rx: h * 1.15, ry: h * 1.12, opacity: 0.2 },
  ];

  return (
    <g>
      {loops.map((l, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={l.rx}
          ry={l.ry}
          fill="none"
          stroke={color}
          strokeWidth="1.1"
          strokeOpacity={l.opacity}
          strokeDasharray="7 11"
          className="animate-field"
          style={{ animationDelay: `${delay + i * 0.5}s` }}
        />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ main -- */

export default function HeroViz() {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // The travelling dots use SVG SMIL, which the prefers-reduced-motion rule in
  // globals.css cannot reach — that rule only overrides CSS animation and
  // transition durations. Pausing the SVG's own timeline stops SMIL without
  // altering the rendered markup, so there is no hydration mismatch.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (reduceMotion) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [reduceMotion]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Springs, not raw values: a direct pointer→rotation binding feels twitchy
  // and stops dead the instant the cursor does. The spring gives it weight.
  const spring = { stiffness: 110, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), spring);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    // Skip on touch and for reduced-motion users. `pointerType` is checked per
    // event rather than sniffing the device, which is what actually matters:
    // a hybrid laptop can receive both.
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      ref={wrapRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full"
      aria-hidden
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/20 blur-[90px]"
      />

      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="relative will-change-transform"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 450 580"
          className="h-auto w-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="vizPipe" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b3ffb" />
              <stop offset="100%" stopColor="#c94fef" />
            </linearGradient>
          </defs>

          {/* Field loops first so they sit behind the solids. */}
          {CUBES.map((c, i) => {
            const { center } = isoFaces(c.cx, c.cy, c.w, c.h);
            return (
              <Field
                key={`f${i}`}
                cx={center[0]}
                cy={center[1]}
                h={c.h}
                color={c.color}
                delay={c.delay}
              />
            );
          })}

          <path
            d={PIPE}
            fill="none"
            stroke="url(#vizPipe)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.9"
          />

          {[0, -2.4].map((begin, i) => (
            <circle key={i} r={i === 0 ? 5 : 3.5} fill={i === 0 ? "#d4ff5c" : "#5eead4"}>
              <animateMotion dur="5s" begin={`${begin}s`} repeatCount="indefinite" path={PIPE} />
            </circle>
          ))}

          {CUBES.map((c, i) => {
            const f = isoFaces(c.cx, c.cy, c.w, c.h);
            return (
              // Tilt and float are on separate <g> elements on purpose: a CSS
              // transform from a keyframe replaces the SVG transform attribute
              // instead of composing with it, so combining them collapses the
              // shape onto the origin.
              <g key={i} transform={`rotate(${c.tilt} ${f.center[0]} ${f.center[1]})`}>
                <g className="animate-floaty" style={{ animationDelay: `${c.delay}s` }}>
                  <polygon points={f.left} fill={c.color} fillOpacity="0.42" />
                  <polygon points={f.right} fill={c.color} fillOpacity="0.68" />
                  <polygon points={f.top} fill={c.color} fillOpacity="0.95" />
                  {/* Hairline on the silhouette only — inner seams read as
                      cracks rather than edges at this scale. */}
                  <polygon
                    points={f.top}
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity="0.28"
                    strokeWidth="1"
                  />
                </g>
              </g>
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}
