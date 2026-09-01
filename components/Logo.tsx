import Image from "next/image";
import { asset, WEBSITE_URL } from "@/lib/site";

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
 * Links to edufulness.com, not to #hero. This page is one course in a family of
 * course sites, so the brand mark belongs to the parent — clicking it should go
 * to the main site, which is what visitors expect a logo to do. Back-to-top is
 * handled by the nav links instead.
 *
 * Same tab, deliberately: it's the same organisation, not an external site, so
 * a new tab would be unexpected.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <a
      href={WEBSITE_URL}
      // An aria-label replaces ALL inner content for screen readers, so the
      // strapline has to be repeated here or it is never announced. Naming the
      // destination matters more than usual, since the link leaves the page.
      // Spelled out here even though the visible text is the initialism: a
      // screen reader would announce "ADE" as a word, which means nothing.
      aria-label="EduFulness — Azure Data Engineering. Go to edufulness.com"
      className={`inline-flex min-w-0 shrink items-center gap-1 rounded-lg transition-opacity hover:opacity-80 ${className}`}
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
        A literal slash rather than a border-left, echoing the "/ Section name"
        eyebrow used throughout the page. Dimmer than the label so it reads as a
        separator, not a character in the text.

        "ADE" rather than "Data Engineering": the full label cost ~110px in the
        one row on the page that cannot wrap, and that width is what forced the
        strapline to hide below xl. At ~34px the initialism fits from sm up, so
        the course identity is now visible on nearly every viewport instead of
        only on large desktops — a better trade than a longer label nobody on a
        laptop ever saw.

        `truncate` is kept as a floor rather than `whitespace-nowrap`: with
        nowrap this overflowed its box and the nav links rendered on top of it.
        Worst case is now an ellipsis, never a collision.
      */}
      <span className="hidden min-w-0 truncate text-[13px] font-medium leading-tight text-muted sm:inline-block">
        <span aria-hidden className="mr-1.5 text-muted/50">
          /
        </span>
        ADE
      </span>
    </a>
  );
}
