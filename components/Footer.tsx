import Logo from "./Logo";

const COLUMNS = [
  {
    heading: "Course",
    links: [
      { label: "Curriculum", href: "#curriculum" },
      { label: "All 13 phases", href: "#phases" },
      { label: "Free resources", href: "#resources" },
      { label: "Enroll", href: "#course" },
      { label: "Instructor", href: "#instructor" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "Atchyut Kumar", href: "#instructor" },
      { label: "edufulness.com", href: "https://www.edufulness.com" },
      { label: "WhatsApp: 9567034641", href: "https://wa.me/919567034641" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.07]">
      <div className="mx-auto max-w-[1300px] px-12 py-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:gap-20">
          <div>
            <Logo />
            <p className="mt-4 max-w-[320px] text-[14.5px] text-muted">
              Master End-to-End Azure Data Engineering
            </p>
          </div>

          {/* nav landmark so the footer links are reachable as a group rather
              than as loose text at the end of the document. */}
          <nav aria-label="Footer" className="flex gap-16 sm:gap-24">
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
                        className="text-[14.5px] text-text/85 transition-colors hover:text-text"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/[0.07] pt-7 font-mono text-[11px] uppercase tracking-[0.08em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DataForge. All rights reserved.</p>
          <p>Think. Learn. Evolve.</p>
        </div>
      </div>
    </footer>
  );
}
