import Logo from "./Logo";
import NavLinks from "./NavLinks";
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
  { label: "Phases", href: "#phases" },
  { label: "Resources", href: "#resources" },
  { label: "Program", href: "#course" },
  { label: "Instructor", href: "#instructor" },
  { label: "Contact", href: "#contact" },
];

/**
 * Stays a server component: it holds no state itself. The two pieces that need
 * the browser — scroll-spy highlighting and the hamburger — are isolated in
 * NavLinks and MobileMenu.
 */
export default function Nav() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 flex items-center justify-between gap-2 bg-bg/70 px-5 py-4 backdrop-blur-md sm:gap-3 sm:px-8 sm:py-5 lg:px-12"
    >
      <Logo />

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 xl:gap-7">
        <NavLinks links={LINKS} />

        {/* Icon-only on purpose. A full "Admin Login" label is ~90px, and the
            bar is already at its width limit at 1024px — adding it as text
            pushed the row into overflow. The label lives in the tooltip and the
            aria-label, and in full text inside the hamburger and the footer. */}
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
    </nav>
  );
}
