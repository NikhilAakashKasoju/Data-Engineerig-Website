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
 *
 * `courses` is a slot rendered between the two. The Courses menu belongs
 * visually between the section links and the Live pill, but it has no business
 * knowing about scroll-spy, so it's injected as a node from Nav rather than
 * imported here — that keeps this file's only concern the active section.
 */
export default function NavLinks({
  links,
  courses,
}: {
  links: Link[];
  courses?: React.ReactNode;
}) {
  const ids = links.map((l) => l.href.replace("#", ""));

  // "live" is observed too so the pill highlights alongside the text links,
  // even though it isn't part of the LINKS list.
  const active = useActiveSection([...ids, "live"]);

  return (
    <>
      {/*
        Padding sits on every item, not just the active one, so the row does not
        shift as the highlight moves between links. Seven links plus padding is
        wide, hence the tight px and gap at lg — both relax at xl.
      */}
      <ul className="hidden list-none items-center gap-0.5 text-[13.5px] text-muted lg:flex xl:gap-1 xl:text-[14px]">
        {links.map((item) => {
          const isActive = active === item.href.replace("#", "");
          return (
            <li key={item.href}>
              <a
                href={item.href}
                // aria-current is what tells assistive tech which item is
                // current; colour alone communicates nothing to a screen reader.
                aria-current={isActive ? "true" : undefined}
                className={`inline-block rounded-full px-2.5 py-1.5 transition-colors xl:px-3 ${
                  isActive
                    ? "bg-surface-2 text-text"
                    : "hover:bg-surface hover:text-text"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>

      {courses}

      <a
        href="#live"
        aria-current={active === "live" ? "true" : undefined}
        className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-[13px] font-medium text-text transition-colors sm:gap-2.5 sm:px-3.5 sm:text-[13.5px] ${
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
