import { NextResponse } from "next/server";

/**
 * Syllabus request endpoint.
 *
 * Validation is repeated here even though the client already checks, because
 * the client is not a trust boundary — anyone can POST directly to this route.
 * The client-side copy exists purely so the user gets instant feedback.
 *
 * Delivery goes through Resend's REST API over plain fetch rather than their
 * SDK: it's one HTTP call, so a dependency would buy nothing and would add to
 * the server bundle.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Where enquiries land. Override per-environment without touching code. */
const TO = process.env.CONTACT_TO ?? "nikhilaakashkasoju@gmail.com";

/**
 * Resend will only send from a domain you've verified. `onboarding@resend.dev`
 * is their shared sandbox sender — it works immediately with no DNS setup, but
 * it can ONLY deliver to the email address that owns the Resend account. Once
 * you verify a domain, set CONTACT_FROM to something like
 * "DataForge <hello@yourdomain.com>" and it will deliver anywhere.
 */
const FROM = process.env.CONTACT_FROM ?? "DataForge <onboarding@resend.dev>";

/** Values are interpolated into an HTML email, so they must be escaped. */
function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string,
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  if (typeof message === "string" && message.length > 2000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const lead = {
    name: name.trim(),
    email: email.trim(),
    message: typeof message === "string" ? message.trim() : "",
  };

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Locally this is fine — log it so the form is still testable end to end.
    // In production it is a misconfiguration, and failing loudly is far better
    // than telling someone their enquiry was sent when it was dropped.
    console.warn("[subscribe] RESEND_API_KEY is not set — email not sent.", lead);

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Email is not configured yet. Please use WhatsApp for now." },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true, delivered: false });
  }

  const html = `
    <h2>New syllabus request</h2>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Message:</strong><br>${escapeHtml(lead.message).replace(/\n/g, "<br>") || "<em>(none)</em>"}</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        // Hitting Reply in the inbox replies to the enquirer, not to Resend.
        reply_to: lead.email,
        subject: `Syllabus request — ${lead.name}`,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[subscribe] Resend rejected the request:", res.status, detail);
      return NextResponse.json(
        { error: "We couldn't send that just now. Please try again." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[subscribe] Network error talking to Resend:", err);
    return NextResponse.json(
      { error: "We couldn't send that just now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}
