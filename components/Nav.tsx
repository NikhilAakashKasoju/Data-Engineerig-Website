import Logo from "./Logo";
import { LivePulse } from "./LiveClass";

/**
 * Explicit label/href pairs rather than deriving the anchor from the label.
 * "Program" points at #course — deriving the href by lowercasing the label only
 * works until the two need to differ, and then it fails silently.
 *
 * The nav label is "Resources" while the section heading reads "Free
 * resources": the row is close to its width limit at lg and the shorter label
 * buys the space back. The word "free" still does its work in the section.
 */
const LINKS = [
  { label: "Curriculum", href: "#curriculum" },
  { label: "Phases", href: "#phases" },
  { label: "Resources", href: "#resources" },
  { label: "Program", href: "#course" },
  { label: "Instructor", href: "#instructor" },
  { label: "Contact", href: "#contact" },
];

/**
 * Lifted out of Hero for two reasons: a site-wide <nav> is not part of the hero
 * section semantically, and on its own it needs no hooks — so it stays a server
 * component and ships no JavaScript.
 */
export default function Nav() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 flex items-center justify-between bg-bg/70 px-12 py-5 backdrop-blur-md"
    >
      <Logo />

      {/* Links and CTAs share one right-hand group, so `justify-between` pushes
          the whole cluster against the right edge with the logo alone on the
          left — rather than the links floating in the centre. */}
      <div className="flex items-center gap-5 xl:gap-7">
        {/* lg, not md: the links plus the logo and the CTAs measure wider than a
            768px viewport, so at md they would collide with the buttons. */}
        <ul className="hidden list-none gap-5 text-[14.5px] text-muted lg:flex xl:gap-7">
          {LINKS.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="transition-colors hover:text-text">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Sits outside the link list on purpose: it stays visible at every
            breakpoint, and it needs a treatment the plain links don't have.
            An outlined teal pill with a pulsing dot reads as time-sensitive
            without competing with the solid gradient Enroll button — one filled
            CTA in the bar, and this is clearly second in the hierarchy. */}
        <a
          href="#live"
          className="hidden shrink-0 items-center gap-2.5 rounded-full border border-teal/35 bg-teal/[0.07] px-4 py-2 text-[13.5px] font-medium text-text transition-colors hover:border-teal/60 hover:bg-teal/[0.12] sm:inline-flex"
        >
          <LivePulse />
          Live Classes
        </a>

        <a
          href="#course"
          className="shrink-0 rounded-full bg-gradient-to-br from-purple to-[#2f74f0] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(11,79,219,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(11,79,219,0.55)]"
        >
          Enroll Now
        </a>
      </div>
    </nav>
  );
}
