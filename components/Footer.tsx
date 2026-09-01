import Logo from "./Logo";
import { ADMIN_URL, SIBLING_SITES, WEBSITE_URL, WHATSAPP_URL } from "@/lib/site";

type FooterLink = { label: string; href: string; external?: boolean };

const COLUMNS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "On this page",
    links: [
      { label: "Curriculum", href: "#curriculum" },
      { label: "All 13 phases", href: "#phases" },
      { label: "Free resources", href: "#resources" },
      { label: "Live classes", href: "#live" },
      { label: "Program", href: "#course" },
      { label: "Instructor", href: "#instructor" },
      { label: "Reviews", href: "#reviews" },
    ],
  },
  {
    // The sibling course sites. Keeps visitors inside the family rather than
    // sending them back to the parent site to find another course.
    heading: "Elsewhere",
    links: SIBLING_SITES.map((s) => ({ ...s, external: true })),
  },
  {
    heading: "Contact",
    links: [
      { label: "Atchyut Kumar", href: "#instructor" },
      { label: "edufulness.com", href: WEBSITE_URL, external: true },
      { label: "WhatsApp channel", href: WHATSAPP_URL, external: true },
    ],
  },
];

/** Marks links that leave this page, so the destination isn't a surprise. */
const ExternalArrow = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="inline-block h-3 w-3 shrink-0 align-[-1px] text-muted"
    aria-hidden
  >
    <path
      d="M7 17 17 7M9 7h8v8"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto max-w-[1300px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-20">
          <div>
            <Logo />
            <p className="mt-4 font-display text-[15px] font-bold">Think. Learn. Evolve.</p>
            <p className="mt-3 max-w-[320px] text-[14.5px] leading-relaxed text-muted">
              An industry-standard, project-driven Azure Data Engineering programme — 33 modules
              across 13 phases, ending in a full retail lakehouse build.
            </p>
          </div>

          {/* nav landmark so the footer links are reachable as a group rather
              than as loose text at the end of the document. Wraps at small
              widths now that there are three columns. */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 sm:gap-x-16 lg:gap-x-20"
          >
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  {col.heading}
                </h2>
                <ul className="mt-5 list-none space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="inline-flex items-start gap-1.5 text-[14.5px] text-text/85 transition-colors hover:text-text"
                      >
                        {link.label}
                        {link.external && <ExternalArrow />}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-7 font-mono text-[11px] uppercase tracking-[0.08em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} EduFulness. All rights reserved.</p>

          <div className="flex items-center gap-5">
            {/* The conventional home for an admin entry point — present but not
                advertised. */}
            <a href={ADMIN_URL} className="transition-colors hover:text-text">
              Admin login
            </a>
            {/* Restores the affordance the logo used to provide, now that the
                logo navigates to edufulness.com instead. */}
            <a
              href="#hero"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-text"
            >
              Back to top
              <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
                <path
                  d="M12 19V5M6 11l6-6 6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
