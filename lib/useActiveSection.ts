"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Returns the id of the section currently being read.
 *
 * Uses IntersectionObserver rather than a scroll handler: a scroll listener
 * fires on every frame and would need throttling plus a getBoundingClientRect
 * per section per tick. The observer only wakes when a boundary is crossed.
 *
 * `rootMargin` shrinks the viewport to a band running from just below the
 * sticky nav down to 30% of the screen height. Whichever section overlaps that
 * band is "active" — which matches where the eye actually is, rather than
 * flipping the moment a section's top edge appears at the very bottom.
 *
 * @param ids     Section ids, in document order.
 * @param navOffset Height of the sticky header, in px.
 */
export function useActiveSection(ids: string[], navOffset = 96): string | null {
  const [active, setActive] = useState<string | null>(null);

  // Array identity changes every render, which would re-run the effect
  // endlessly. The joined string is stable.
  const key = ids.join(",");

  const stableIds = useMemo(() => key.split(","), [key]);

  useEffect(() => {
    const elements = stableIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Tracked across callbacks because the observer only reports sections whose
    // state CHANGED — a single callback isn't a complete picture of what's
    // currently on screen.
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }

        // Topmost visible section wins, since ids are in document order.
        const topmost = stableIds.find((id) => visible.has(id));
        if (topmost) setActive(topmost);
      },
      {
        rootMargin: `-${navOffset}px 0px -70% 0px`,
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [stableIds, navOffset]);

  return active;
}
