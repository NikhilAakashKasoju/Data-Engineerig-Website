"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

const fieldClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-[15px] text-text placeholder:text-muted/70 outline-none transition-colors focus:border-purple/60 focus:ring-2 focus:ring-purple/25";

const labelClass =
  "block font-mono text-[11px] uppercase tracking-[0.11em] text-muted";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: "" }));
        throw new Error(msg || "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" className="relative z-10 mx-auto max-w-[1300px] px-12 py-28">
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
            Drop your details to get the full 33-module syllabus and upcoming batch dates — or
            reach Atchyut directly on WhatsApp.
          </p>

          <a
            href="https://wa.me/919567034641"
            className="btn-primary mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-purple to-[#a24bff] px-7 py-4 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Message on WhatsApp
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
          <div
            aria-hidden
            className="absolute -inset-4 rounded-[2rem] bg-purple/15 blur-[70px]"
          />

          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-sm"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  className={`${fieldClass} mt-2.5`}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@company.com"
                  className={`${fieldClass} mt-2.5`}
                />
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Message (optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="I'd like to know more about the cohort…"
                  className={`${fieldClass} mt-2.5 resize-y`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-br from-purple to-[#a24bff] px-7 py-4 text-[15px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Submit"}
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* aria-live so the outcome is announced to screen readers — a purely
                visual status change is silent to anyone not looking at it. */}
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
          </form>
        </motion.div>
      </div>
    </section>
  );
}
