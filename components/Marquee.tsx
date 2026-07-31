const ITEMS = [
  "Ingest",
  "Store",
  "Transform",
  "Orchestrate",
  "Serve",
  "Azure",
  "Databricks",
  "Synapse",
  "Power BI",
];

/**
 * Infinite keyword band.
 *
 * The track holds exactly two copies of the list and translates to -50%, so the
 * moment the first copy leaves the viewport the second is sitting in precisely
 * the position the first started from — the reset is invisible. This only works
 * because the track is `w-max` (width driven by content, not the viewport), so
 * 50% is always exactly one copy wide regardless of screen size or font loading.
 */
export default function Marquee() {
  return (
    <section
      className="marquee-mask relative z-10 overflow-hidden border-y border-white/[0.06] py-7"
      aria-label="Course topics"
    >
      <div className="flex w-max animate-marquee will-change-transform hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex list-none items-center"
          >
            {ITEMS.map((item) => (
              <li key={item} className="flex items-center">
                <span className="whitespace-nowrap font-display text-[clamp(26px,3.1vw,40px)] font-bold uppercase tracking-tight text-text">
                  {item}
                </span>
                <span
                  aria-hidden
                  className="mx-9 h-[7px] w-[7px] shrink-0 rounded-full bg-purple-2"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
