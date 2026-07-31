import { NextResponse } from "next/server";

/**
 * Syllabus request endpoint.
 *
 * Validation is repeated here even though the client already checks, because
 * the client is not a trust boundary — anyone can POST directly to this route.
 * The client-side copy exists purely so the user gets instant feedback.
 *
 * TODO: wire an email provider (Resend, SendGrid, Postmark…) where marked.
 * Keep the API key in an env var — never NEXT_PUBLIC_*, or it ships to the
 * browser bundle.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  // --- Replace this block with a real send / CRM write -------------------
  console.log("[subscribe]", {
    name: name.trim(),
    email: email.trim(),
    message: typeof message === "string" ? message.trim() : "",
  });
  // ----------------------------------------------------------------------

  return NextResponse.json({ ok: true });
}
