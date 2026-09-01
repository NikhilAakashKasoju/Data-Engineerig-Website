"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useActiveSection } from "@/lib/useActiveSection";
import { ADMIN_URL, SIBLING_SITES } from "@/lib/site";

type Link = { label: string; href: string };

/**
 * Hamburger menu for anything below `lg`.
 *
 * Split out of Nav rather than built into it so Nav itself stays a server
 * component — only the open/close state needs to run on the client.
 *
 * The panel is PORTALLED to document.body, and that is not optional: <nav> has
 * `backdrop-blur-md`, and an element with a backdrop-filter establishes a
 * containing block for fixed-position descendants. Rendered in place,
 * `fixed inset-0` resolves against the nav's box rather than the viewport, so
 * the overlay collapses into a thin strip under the header. `transform`,
 * `filter`, `perspective`, `contain` and `will-change` all do the same thing.
 */
export default function MobileMenu({ links }: { links: Link[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const active = useActiveSection(links.map((l) => l.href.replace("#", "")));

  // document.body doesn't exist during SSR, so the portal can only be created
  // after mount.
  useEffect(() => setMounted(true), []);

  // Stop the page behind the overlay from scrolling. Without this, swiping the
  // menu scrolls the document underneath and you close it somewhere new.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes, and focus returns to the button that opened it — otherwise
  // keyboard focus is left orphaned at the top of the document.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  const panel = (
    <div
      id="mobile-menu"
      ref={panelRef}
      tabIndex={-1}
      aria-hidden={!open}
      /*
        z-40 keeps this BELOW the nav (z-50) on purpose, so the header — logo,
        both CTAs and the hamburger-turned-X — stays visible and clickable on
        top of it. pt-24 clears the header height.

        Kept mounted and translated rather than conditionally rendered so it can
        animate both directions; `invisible` when closed removes it from the
        accessibility tree and tab order, which translation alone would not.
      */
      className={`fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg/95 px-5 pb-10 pt-24 backdrop-blur-xl transition-all duration-300 lg:hidden ${
        open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-4 opacity-0"
      }`}
    >
      {/* Section links only. Live Classes and Enroll Now stay visible in the
          nav bar at every width, so duplicating them here would give the same
          action two places to live. */}
      <nav aria-label="Mobile">
        <ul className="list-none space-y-0.5">
          {links.map((item) => {
            const isActive = active === item.href.replace("#", "");
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "true" : undefined}
                  /* A left bar rather than an underline: in a stacked list the
                     bar aligns down the edge and reads as a position marker,
                     where six underlines would just look like six links. */
                  className={`flex items-center gap-3 rounded-xl px-4 py-3.5 font-display text-[20px] font-bold tracking-tight transition-colors ${
                    isActive ? "bg-surface-2 text-text" : "text-muted hover:bg-surface-2"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-5 w-[3px] rounded-full transition-colors ${
                      isActive ? "bg-purple-2" : "bg-transparent"
                    }`}
                  />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* The desktop Courses dropdown is hidden below lg, so the sibling sites
          live here instead. Section links above move you within this page;
          these leave it, hence the separation. */}
      <div className="mt-8 border-t border-line pt-8">
        <p className="px-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
          Also from EduFulness
        </p>
        <ul className="mt-3 list-none space-y-0.5">
          {SIBLING_SITES.map((course) => (
            <li key={course.href}>
              <a
                href={course.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors hover:bg-surface-2"
              >
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: course.dot }}
                />
                {course.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Below everything and visually separated: it isn't a place visitors are
          meant to go, so it shouldn't compete with them. */}
      <a
        href={ADMIN_URL}
        onClick={() => setOpen(false)}
        className="mt-8 flex items-center gap-2.5 border-t border-line px-4 pt-8 font-mono text-[11.5px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-text"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[14px] w-[14px]"
          aria-hidden
        >
          <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
        Admin login
      </a>
    </div>
  );

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface transition-colors hover:border-line-strong lg:hidden"
      >
        {/* Three bars that become an X: the outer two rotate into a cross while
            the middle one fades. One element set, two states — no icon swap. */}
        <span className="relative block h-4 w-5" aria-hidden>
          <span
            className={`absolute left-0 block h-[2px] w-5 rounded bg-text transition-all duration-300 ${
              open ? "top-[7px] rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-[7px] block h-[2px] w-5 rounded bg-text transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 block h-[2px] w-5 rounded bg-text transition-all duration-300 ${
              open ? "top-[7px] -rotate-45" : "top-[14px]"
            }`}
          />
        </span>
      </button>

      {mounted && createPortal(panel, document.body)}
    </>
  );
}
