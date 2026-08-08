import Image from "next/image";
import { asset } from "@/lib/site";

/**
 * Shared wordmark, used by the nav and the footer.
 *
 * The asset is a full lockup — icon *and* the word "edufulness" — so there is
 * no second text wordmark beside it; that would read as two brands.
 *
 * Width and height match the asset's real 976×252 ratio rather than being set
 * in CSS. Overriding only one axis with a Tailwind class makes next/image warn
 * about a distorted aspect ratio in dev.
 *
 * Links to #hero — the "logo goes home" convention on a single-page site, and
 * it doubles as back-to-top in the footer. A real <a> so it works without JS
 * and is keyboard-focusable for free.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <a
      href="#hero"
      // Includes the strapline so screen readers get the same information
      // sighted users do — an aria-label replaces ALL inner content, so without
      // this the visible text would simply never be announced.
      aria-label="EduFulness — Azure Data Engineering Course, back to top"
      className={`inline-flex min-w-0 shrink items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80 ${className}`}
    >
      <Image
        src={asset("/efnlogo.png")}
        alt=""
        width={132}
        height={34}
        priority
        className="w-[112px] shrink-0 select-none sm:w-[132px]"
      />
      {/*
        Hidden below xl. At 132px the mark plus this strapline plus the Live
        Classes pill and the Enroll button overflow anything narrower than a
        laptop, and the nav is the one row on the page that cannot wrap.
      */}
      <span className="hidden whitespace-nowrap border-l border-line pl-2.5 text-[13px] font-medium leading-tight text-muted xl:inline">
        Azure Data Engineering Course
      </span>
    </a>
  );
}
