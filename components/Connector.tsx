"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * The zigzag link between two curriculum modules.
 *
 * The stroke is drawn with Framer's `pathLength` (0 → 1), which under the hood
 * sets strokeDasharray/strokeDashoffset on a normalised 0–1 scale — so we never
 * have to measure the path with getTotalLength(), and the curve can change
 * without touching the animation.
 *
 * The arrowhead is a separate path held at opacity 0 until the stroke is ~80%
 * drawn, which produces the "a line opens into an arrow" read: you see a plain
 * line extending, and only at the end does it resolve into a pointer.
 *
 * Progress is scrubbed against scroll position rather than fired once on entry,
 * so scrolling back up un-draws it.
 */
export default function Connector({ direction }: { direction: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Maps "this element's top hits 90% down the viewport" → "its bottom hits
  // 55% down" onto 0 → 1. Tuned so the draw completes a little before the
  // connector reaches the vertical centre, rather than trailing behind the eye.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 55%"],
  });

  const headOpacity = useTransform(scrollYProgress, [0.78, 1], [0, 1]);

  // With reduced motion on, render the finished state — the connector still
  // communicates the flow, it just doesn't animate.
  const drawn = reduceMotion === true;

  return (
    <div ref={ref} className="pointer-events-none relative h-[120px] w-full" aria-hidden>
      <svg
        viewBox="0 0 200 120"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-full w-[280px] overflow-visible sm:w-[360px]"
        style={{ transform: direction === "right" ? "scaleX(-1)" : undefined }}
      >
        <motion.path
          d="M160 10 C150 58, 122 80, 60 100"
          fill="none"
          stroke="#5eead4"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={drawn ? undefined : { pathLength: scrollYProgress }}
        />
        <motion.path
          d="M81.7 103.7 L60 100 L75.2 84.1"
          fill="none"
          stroke="#5eead4"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={drawn ? undefined : { opacity: headOpacity }}
        />
      </svg>
    </div>
  );
}
