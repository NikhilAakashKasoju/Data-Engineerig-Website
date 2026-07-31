import Logo from "./Logo";

const LINKS = ["Curriculum", "Course", "Instructor", "Contact"];

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

      <ul className="hidden list-none gap-9 text-[14.5px] text-muted md:flex">
        {LINKS.map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              className="transition-colors hover:text-text"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#course"
        className="rounded-full bg-gradient-to-br from-purple to-[#a24bff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(139,63,251,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(139,63,251,0.5)]"
      >
        Enroll Now
      </a>
    </nav>
  );
}
