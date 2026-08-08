/**
 * External destinations, defined once.
 *
 * The enrolment URL carries a coupon code with a date in it, so it is going to
 * change — and a URL that changes is exactly the thing you do not want pasted
 * into three components. Update it here and every button follows.
 */

export const ENROLL_URL =
  "https://www.udemy.com/course/azure-data-factory-data-engineer-real-time-projects/?couponCode=EFNJUL26BEST";

/** Broadcast channel (join link), not a direct chat — the copy says "join". */
export const WHATSAPP_URL = "https://whatsapp.com/channel/0029Val125n2UPBNAPAprU1G";

export const WEBSITE_URL = "https://www.edufulness.com";

/**
 * Prefixes a file in public/ with the deploy sub-path.
 *
 * Necessary because Next applies basePath to its own bundles but passes
 * next/image `src` values through untouched — so on a subfolder deploy an
 * un-prefixed "/logo.png" resolves against the domain root and 404s.
 *
 * The value comes from next.config.mjs via env, so basePath stays defined once.
 */
export const asset = (path: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

/**
 * PHP lead-capture endpoint (masterclass-backend/contact.php).
 *
 * Root-relative, which assumes the exported site and the PHP folder sit on the
 * same domain — that's why the subfolder deploy is preferable to a subdomain.
 * If it does end up on a subdomain, make this absolute AND set `allowed_origin`
 * in the PHP config, or the browser will block it on CORS.
 */
export const CONTACT_ENDPOINT = "/masterclass/contact.php";

/** Read-only JSON for the Live Classes section, editable in live-admin.php. */
export const LIVE_CLASS_ENDPOINT = "/masterclass/live-class.php";

/** Admin sign-in. login.php carries noindex, so this is never crawled. */
export const ADMIN_URL = "/masterclass/login.php";

/** Tags each lead by course, so the DSA site can share the same table later. */
export const LEAD_SOURCE = "azure";

/**
 * TODO: replace with the real live-class registration link when it exists.
 * Pointed at WhatsApp in the meantime so the button does something useful
 * rather than sitting dead on "#".
 */
export const LIVE_CLASS_REGISTER_URL = WHATSAPP_URL;
