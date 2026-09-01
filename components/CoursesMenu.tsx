"use client";

import { useEffect, useRef, useState } from "react";
import { SIBLING_SITES } from "@/lib/site";

/**
 * Cross-site course switcher.
 *
 * Opens on click, not hover. A hover menu is unreachable on touch — a tap fires
 * a synthetic hover, the menu appears, and the same tap often activates
 * whatever is underneath it. Click works identically on every input type.
 *
 * Rendered by NavLinks as the last item of the navigation run, immediately
 * before the Live Classes pill. It is still a different kind of navigation from
 * the section links — those move you within this page, this moves you to
 * another site — so it keeps a chevron and a panel rather than looking like a
 * seventh anchor.
 */
export default function CoursesMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on a click anywhere outside. `mousedown` rather than `click` so the
  // menu is gone before the underlying element reacts.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        // Focus returns to the trigger, or it's stranded at the top of the DOM.
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative hidden shrink-0 lg:block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13.5px] transition-colors xl:text-[14px] ${
          open ? "bg-surface-2 text-text" : "text-muted hover:bg-surface hover:text-text"
        }`}
      >
        Courses
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/*
        Rendered only when open — unlike the mobile menu, there is no exit
        animation to preserve, and keeping it mounted would leave two off-screen
        links in the tab order on every page.
      */}
      {open && (
        <div
          // Back to left-anchored now that the trigger sits mid-row instead of
          // at the right edge. At the 1024px breakpoint there is roughly 420px
          // between the button's left edge and the container edge — the Live
          // pill, admin icon and Enroll CTA — so a 278px panel clears it. The
          // panel overlays those controls while open, which is expected of a
          // dropdown; it does not push the row into overflow.
          className="absolute left-0 top-full z-50 mt-2 w-[278px] rounded-2xl border border-line bg-bg/95 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          role="menu"
        >
          <p className="px-3 pb-2 pt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
            Also from EduFulness
          </p>

          {SIBLING_SITES.map((course) => (
            <a
              key={course.href}
              href={course.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-text transition-colors hover:bg-surface-2"
            >
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: course.dot }}
              />
              {course.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
