"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("sent");
      }}
      noValidate={false}
    >
      <label htmlFor="contact-name" className="flex flex-col gap-2 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-text-subtle">
          Name
        </span>
        <input
          id="contact-name"
          type="text"
          name="name"
          autoComplete="name"
          required
          className="rounded-md border border-line bg-ink-soft px-4 py-3 text-paper outline-none transition-[border-color] focus:border-signal"
        />
      </label>
      <label htmlFor="contact-email" className="flex flex-col gap-2 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-text-subtle">
          Email
        </span>
        <input
          id="contact-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          className="rounded-md border border-line bg-ink-soft px-4 py-3 text-paper outline-none transition-[border-color] focus:border-signal"
        />
      </label>
      <label htmlFor="contact-message" className="flex flex-col gap-2 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-text-subtle">
          Project summary
        </span>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          aria-describedby="contact-note"
          className="resize-y rounded-md border border-line bg-ink-soft px-4 py-3 text-paper outline-none transition-[border-color] focus:border-signal"
        />
      </label>
      <button
        type="submit"
        className="inline-flex w-fit items-center justify-center gap-2 rounded-md border border-signal bg-signal px-5 py-2.5 font-body text-sm font-medium tracking-wide text-ink transition-colors hover:bg-signal-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-signal"
      >
        Send message
      </button>
      <p id="contact-note" className="text-xs text-text-subtle" role="status" aria-live="polite">
        {status === "sent"
          ? "Thanks — form backend is not wired yet. Email us directly via the footer links for now."
          : "Form submission wiring is a phase-two task. Fields are validated locally."}
      </p>
    </form>
  );
}
