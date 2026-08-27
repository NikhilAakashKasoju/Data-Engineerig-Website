"use client";

import { useActiveSection } from "@/lib/useActiveSection";
import { LivePulse } from "./LiveClass";

type Link = { label: string; href: string };

/**
 * Desktop navigation with scroll-spy highlighting.
 *
 * Owns both the section links and the Live Classes pill, because both need the
 * active state — keeping them together means Nav itself stays a server
 * component and the observer is set up once, not twice.
 */
export default function NavLinks({ links }: { links: Link[] }) {
  const ids = links.map((l) => l.href.replace("#", ""));

  // "live" is observed too so the pill highlights alongside the text links,
  // even though it isn't part of the LINKS list.
  const active = useActiveSection([...ids, "live"]);

  return (
    <>
      {/* Seven links now. gap-4 and 14px at lg keeps the row inside a 1024px
          viewport alongside the logo, admin icon and Enroll button; both relax
          again at xl where there's room. Adding an eighth link will overflow —
          check at exactly 1024px if you do. */}
      <ul className="hidden list-none gap-4 text-[14px] text-muted lg:flex xl:gap-6 xl:text-[14.5px]">
        {links.map((item) => {
          const isActive = active === item.href.replace("#", "");
          return (
            <li key={item.href}>
              <a
                href={item.href}
                // aria-current is what tells assistive tech which item is
                // current; colour alone communicates nothing to a screen reader.
                aria-current={isActive ? "true" : undefined}
                className={`relative transition-colors hover:text-text ${
                  isActive ? "text-text" : ""
                }`}
              >
                {item.label}
                {/* Always rendered and faded rather than mounted on demand, so
                    the underline can transition instead of popping. */}
                <span
                  aria-hidden
                  className={`absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-purple-2 transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>

      <a
        href="#live"
        aria-current={active === "live" ? "true" : undefined}
        className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2.5 text-[13px] font-medium text-text transition-colors sm:gap-2.5 sm:px-4 sm:py-2 sm:text-[13.5px] ${
          active === "live"
            ? "border-teal/70 bg-teal/[0.16]"
            : "border-teal/35 bg-teal/[0.07] hover:border-teal/60 hover:bg-teal/[0.12]"
        }`}
      >
        <LivePulse />
        <span className="sm:hidden">Live</span>
        <span className="hidden sm:inline">Live Classes</span>
      </a>
    </>
  );
}
