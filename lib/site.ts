/**
 * External destinations, defined once.
 *
 * The enrolment URL carries a coupon code with a date in it, so it is going to
 * change — and a URL that changes is exactly the thing you do not want pasted
 * into three components. Update it here and every button follows.
 */

export const ENROLL_URL =
  "https://www.udemy.com/course/azure-data-factory-data-engineer-real-time-projects/?couponCode=EFNJUL26BEST";

export const WHATSAPP_URL = "https://wa.me/919567034641";

/**
 * TODO: replace with the real live-class registration link when it exists.
 * Pointed at WhatsApp in the meantime so the button does something useful
 * rather than sitting dead on "#".
 */
export const LIVE_CLASS_REGISTER_URL = WHATSAPP_URL;
