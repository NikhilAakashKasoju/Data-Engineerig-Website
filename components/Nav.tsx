import Logo from "./Logo";

/**
 * Explicit label/href pairs rather than deriving the anchor from the label.
 * "Phases" happens to match its id, but "Program" points at #course — deriving
 * the href by lowercasing the label only works until the two need to differ,
 * and then it fails silently with a dead link.
 */
const LINKS = [
  { label: "Curriculum", href: "#curriculum" },
  { label: "Phases", href: "#phases" },
  { label: "Free Resources", href: "#resources" },
  { label: "Program", href: "#course" },
  { label: "Instructor", href: "#instructor" },
  { label: "Contact", href: "#contact" },
];

/**
 * Lifted out of Hero for two reasons: a site-wide <nav> is not part of the hero
 * section semantically, and on its own it needs no hooks — so it stays a server
 * component and ships no JavaScript. Inside Hero it was being dragged into that
 * component's "use client" boundary for nothing.
 */
export default function Nav() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 flex items-center justify-between bg-bg/70 px-12 py-5 backdrop-blur-md"
    >
      <Logo />

      {/* Links and CTA share one right-hand group, so `justify-between` on the
          nav pushes the whole cluster against the right edge with the logo
          alone on the left — rather than the links floating in the centre. */}
      <div className="flex items-center gap-10">
        {/* lg, not md: the links plus the logo and the CTA measure wider than a
            768px viewport, so at md they would collide with the button. gap-6
            until xl because "Free Resources" pushed the row close to the 1024px
            edge — the wider gap comes back once there's room for it. */}
        <ul className="hidden list-none gap-6 text-[14.5px] text-muted lg:flex xl:gap-8">
          {LINKS.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="transition-colors hover:text-text">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Scrolls to the pricing panel rather than leaving for Udemy — the nav
            is persistent, so it should move you around the page, not off it.
            The hero and pricing CTAs are the ones that hand off to checkout. */}
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
