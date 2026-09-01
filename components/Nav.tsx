import Logo from "./Logo";
import NavLinks from "./NavLinks";
import CoursesMenu from "./CoursesMenu";
import MobileMenu from "./MobileMenu";
import { ADMIN_URL } from "@/lib/site";

/**
 * Explicit label/href pairs rather than deriving the anchor from the label.
 * "Program" points at #course — lowercasing the label to build the href only
 * works until the two need to differ, and then it fails silently.
 *
 * Defined here and passed to both navigations so they can't drift apart.
 */
const LINKS = [
  { label: "Curriculum", href: "#curriculum" },
  { label: "Resources", href: "#resources" },
  { label: "Program", href: "#course" },
  { label: "Instructor", href: "#instructor" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

/**
 * Stays a server component: it holds no state itself. The two pieces that need
 * the browser — scroll-spy highlighting and the hamburger — are isolated in
 * NavLinks and MobileMenu.
 */
export default function Nav() {
  return (
    /*
     * The bar itself stays edge-to-edge so the blurred background spans the
     * viewport — a sticky header that stops short of the edges looks broken.
     * Its *contents* use the same max-w-[1300px] container as every section,
     * so the logo lines up with the hero text instead of hugging the screen
     * edge on wide displays.
     */
    <nav aria-label="Main" className="sticky top-0 z-50 bg-bg/70 backdrop-blur-md">
      <div className="container mx-auto flex max-w-[1300px] items-center justify-between gap-2 px-5 py-4 sm:gap-3 sm:px-8 sm:py-5 lg:px-12">
        <div className="flex min-w-0 items-center gap-1">
          <Logo />
        </div>

        {/* shrink-0 so the links and CTAs always keep their full width. If
            anything has to give when the row gets tight, it must be the logo
            strapline (which truncates) — never a navigation target. */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
          {/* Cross-site switcher, passed into NavLinks so it lands between the
              section links and the Live Classes pill. It reads as the last item
              of the navigation run rather than an interruption of it, and it
              leaves Live Classes directly adjacent to the Enroll CTA — the two
              conversion targets stay together at the end of the row. */}
          <NavLinks links={LINKS} courses={<CoursesMenu />} />

          {/* Icon-only on purpose. A full "Admin Login" label is ~90px, and the
              bar is already at its width limit at 1024px — adding it as text
              pushed the row into overflow. The label lives in the tooltip and
              the aria-label, and in full text in the hamburger and footer. */}
          <a
            href={ADMIN_URL}
            title="Admin login"
            aria-label="Admin login"
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-text lg:inline-flex"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[15px] w-[15px]"
              aria-hidden
            >
              <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
              <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
            </svg>
          </a>

          <a
            href="#course"
            className="shrink-0 rounded-full bg-gradient-to-br from-purple to-[#2f74f0] px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_18px_rgba(11,79,219,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(11,79,219,0.55)] sm:px-5 sm:text-sm"
          >
            <span className="sm:hidden">Enroll</span>
            <span className="hidden sm:inline">Enroll Now</span>
          </a>

          <MobileMenu links={LINKS} />
        </div>
      </div>
    </nav>
  );
}
