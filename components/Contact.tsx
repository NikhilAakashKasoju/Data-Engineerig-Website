"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { CONTACT_ENDPOINT, LEAD_SOURCE, WHATSAPP_URL } from "@/lib/site";

const fieldClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-[15px] text-text placeholder:text-muted/70 outline-none transition-colors focus:border-purple/60 focus:ring-2 focus:ring-purple/25";

const labelClass = "block font-mono text-[11px] uppercase tracking-[0.11em] text-muted";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  // Set once on first render and sent with the payload. The server rejects
  // anything filled in implausibly fast — a ref rather than state so it never
  // triggers a re-render.
  const startedAt = useRef(Date.now());

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
          company: String(data.get("company") ?? ""), // honeypot
          started: startedAt.current,
          source: LEAD_SOURCE,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      form.reset();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" className="relative z-10 mx-auto max-w-[1300px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2 md:gap-20">
        {/* ------------------------------------------------------------ copy -- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <p className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-teal">
            / Ready to build?
          </p>

          <h2 className="mt-4 max-w-[480px] font-display text-[clamp(28px,3.5vw,43px)] font-bold leading-[1.13] tracking-tight">
            Start your data engineering journey.
          </h2>

          <p className="mt-5 max-w-[440px] text-[15.5px] leading-relaxed text-muted">
            Leave your details and we&apos;ll send the full 33-module syllabus and the next batch
            dates — or join the WhatsApp channel for announcements.
          </p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-6 py-3.5 text-[14.5px] font-semibold transition-colors hover:border-line-strong hover:bg-surface-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-[17px] w-[17px] text-teal" aria-hidden>
              <path d="M12 2.7a9.2 9.2 0 0 0-7.9 13.9L2.7 21.3l4.9-1.3A9.2 9.2 0 1 0 12 2.7Zm0 16.7a7.5 7.5 0 0 1-3.8-1l-.27-.16-2.9.76.77-2.83-.18-.29A7.5 7.5 0 1 1 12 19.4Zm4.2-5.5c-.23-.12-1.36-.67-1.57-.74s-.36-.12-.52.11-.6.74-.73.9-.27.17-.5.06a6.1 6.1 0 0 1-1.8-1.11 6.8 6.8 0 0 1-1.25-1.56c-.13-.23 0-.35.1-.46l.35-.4a1.6 1.6 0 0 0 .23-.39.42.42 0 0 0 0-.4c0-.11-.52-1.25-.71-1.71s-.38-.39-.52-.4h-.44a.85.85 0 0 0-.62.29 2.59 2.59 0 0 0-.8 1.92 4.48 4.48 0 0 0 .94 2.39 10.3 10.3 0 0 0 3.95 3.48 4.53 4.53 0 0 0 2.78.58 2.36 2.36 0 0 0 1.55-1.1 1.92 1.92 0 0 0 .13-1.09c-.05-.1-.2-.16-.43-.27Z" />
            </svg>
            Join the WhatsApp channel
          </a>
        </motion.div>

        {/* ------------------------------------------------------------ form -- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative"
        >
          <div aria-hidden className="absolute -inset-4 rounded-[2rem] bg-purple/15 blur-[70px]" />

          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative rounded-2xl border border-line bg-surface p-6 backdrop-blur-sm sm:p-8"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className={labelClass}>Name</label>
                <input
                  id="name" name="name" type="text" required autoComplete="name"
                  placeholder="Ada Lovelace" className={`${fieldClass} mt-2.5`}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                  id="email" name="email" type="email" required autoComplete="email"
                  inputMode="email" placeholder="you@company.com"
                  className={`${fieldClass} mt-2.5`}
                />
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>Message (optional)</label>
                <textarea
                  id="message" name="message" rows={4}
                  placeholder="I'd like to know more about the next batch…"
                  className={`${fieldClass} mt-2.5 resize-y`}
                />
              </div>
            </div>

            {/*
              Honeypot. Hidden from sight and from assistive tech, and taken out
              of the tab order, so no real person can fill it — but it's a plain
              input in the DOM, which is exactly what a scraping bot fills in.
              `sr-only` is deliberately NOT used: screen readers would announce
              it and users would try to complete it.
            */}
            <div aria-hidden className="pointer-events-none absolute left-[-9999px] opacity-0">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-br from-purple to-[#2f74f0] px-7 py-4 text-[15px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Submit"}
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z"
                  stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </button>

            <p
              role="status"
              aria-live="polite"
              className={`mt-4 min-h-[20px] text-center text-[13.5px] ${
                status === "error" ? "text-magenta" : "text-teal"
              }`}
            >
              {status === "success" && "Thanks — the instructor will be in touch with you soon."}
              {status === "error" && error}
            </p>

            <p className="mt-2 text-center text-[11.5px] leading-relaxed text-muted">
              We store your name and email only to reply about this course.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
