/**
 * Shared wordmark. Extracted because the nav and the footer were about to hold
 * two copies of the same markup — and a logo is exactly the thing that gets
 * tweaked once and forgotten in the other place.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-2.5 font-display text-lg font-bold tracking-tight ${className}`}
    >
      <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-gradient-to-br from-purple to-magenta shadow-[0_4px_14px_rgba(139,63,251,0.35)]">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <path
            d="M4 6c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2Z"
            stroke="#fff"
            strokeWidth="1.6"
          />
          <path d="M4 6v12c0 1.1 3.6 2 8 2s8-.9 8-2V6" stroke="#fff" strokeWidth="1.6" />
          <path d="M4 12c0 1.1 3.6 2 8 2s8-.9 8-2" stroke="#fff" strokeWidth="1.6" />
        </svg>
      </div>
      DataForge
    </div>
  );
}
