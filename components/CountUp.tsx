"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Counts from 0 up to `value` once, when the element first scrolls into view.
 *
 * Driven by requestAnimationFrame against a real timestamp rather than a fixed
 * per-frame increment: a step-per-frame counter runs at whatever rate the
 * display refreshes, so the same animation finishes twice as fast on a 120Hz
 * screen. Timestamp-based means the duration is the duration.
 *
 * `suffix` is kept out of the animated number so "40+" counts as 40 and keeps
 * its "+" throughout, instead of the symbol appearing at the end.
 */
export default function CountUp({
  value,
  suffix = "",
  duration = 1400,
  className = "",
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    // Anyone who has asked for less motion gets the final number immediately.
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        // `started` guards against re-running if the element leaves and
        // re-enters the viewport.
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const start = performance.now();

        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);

          // easeOutExpo — fast at first, then a long settle. A linear ramp
          // reads as a loading spinner; this reads as a number arriving.
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

          setDisplay(Math.round(eased * value));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {/*
        The live region is the number itself, but announcing every frame would
        flood a screen reader. aria-hidden on the animating text plus a static
        sr-only value means assistive tech gets the final figure once.
      */}
      <span aria-hidden>
        {display}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
