"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/**
 * Fixed bottom-right theme switch.
 *
 * The actual theme is applied by the inline script in layout.tsx, which runs
 * before first paint. This component only mirrors and updates it — if it owned
 * the initial application, the page would render in the wrong theme and flip
 * once React hydrated (the "flash of wrong theme").
 *
 * Because the correct value is only knowable on the client, the icon is held
 * back until after mount. Rendering a moon on the server and a sun on the
 * client is a hydration mismatch; the button keeps its exact dimensions
 * meanwhile so nothing shifts.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) ?? "dark";
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    // Persisted so the inline script can restore it on the next visit.
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing can throw on write; the toggle still works for the
      // session, it just won't be remembered.
    }
    setTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Switch theme"}
      aria-pressed={mounted ? !isDark : undefined}
      title={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : undefined}
      className="fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface-2 text-text shadow-[0_6px_24px_rgba(0,0,0,0.28)] backdrop-blur-md transition-colors hover:border-line-strong"
    >
      {/* Both icons are always in the DOM and cross-faded, rather than swapped.
          A swap would jump; this rotates one out as the other rotates in. */}
      <span className="relative block h-5 w-5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            mounted && !isDark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
          }`}
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
        </svg>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            !mounted || isDark ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
          }`}
        >
          <path d="M20.5 14.5A8.6 8.6 0 0 1 9.5 3.5a8.6 8.6 0 1 0 11 11Z" />
        </svg>
      </span>
    </button>
  );
}
