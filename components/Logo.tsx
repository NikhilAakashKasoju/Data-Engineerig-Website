import Image from "next/image";

/**
 * Shared wordmark, used by the nav and the footer.
 *
 * The supplied asset is a full lockup — icon *and* the word "edufulness" — so
 * the old icon tile plus "DataForge" text has gone entirely. Pairing a wordmark
 * with a second, different wordmark would read as two brands.
 *
 * Width and height match the asset's real 976×252 ratio rather than being set
 * in CSS. Overriding only one axis with a Tailwind class makes next/image warn
 * about a distorted aspect ratio in dev.
 *
 * Links to #hero — on a single-page site that's the "logo goes home"
 * convention, and it doubles as back-to-top in the footer. A real <a> so it
 * works without JS and is keyboard-focusable for free.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <a
      href="#hero"
      aria-label="EduFulness — back to top"
      className={`inline-flex shrink-0 items-center rounded-lg transition-opacity hover:opacity-80 ${className}`}
    >
      <Image
        src="/efnlogo.png"
        alt="EduFulness"
        width={132}
        height={34}
        priority
        className="select-none"
      /> Azure Data Engineering Course
    </a>
  );
}
