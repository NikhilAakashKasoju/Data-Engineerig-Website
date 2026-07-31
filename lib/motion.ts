import type { Variants } from "framer-motion";

/**
 * Shared motion primitives.
 *
 * These were duplicated verbatim across Hero, Curriculum, Pricing, Instructor
 * and Contact. Beyond the DRY argument, identical timing is what makes the page
 * feel like one document rather than five separately-animated pages — so the
 * duration and easing are deliberately defined once, here.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

/**
 * `once: true` matters for more than taste: without it, every section re-runs
 * its entrance each time it scrolls back into view, which reads as broken on a
 * long page and keeps Framer subscribed to intersection updates for the whole
 * session.
 */
export const viewportOnce = { once: true, amount: 0.3 } as const;
