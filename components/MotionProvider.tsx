"use client";

import { MotionConfig } from "framer-motion";

/**
 * Framer Motion drives transforms from JS, so the prefers-reduced-motion rule
 * in globals.css (which only overrides CSS animation/transition durations)
 * has no effect on it. Framer defaults to reducedMotion: "never".
 *
 * Setting it to "user" makes every motion component in the tree drop transform
 * and layout animations when the OS setting is on, while still allowing opacity
 * fades — so content appears rather than jumping in. Applied once at the root
 * so each new section gets it for free.
 *
 * This is a client boundary that only wraps children; the children themselves
 * stay server components.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
