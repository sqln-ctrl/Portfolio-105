"use client";
import { useRef, useState, type FormEvent } from "react";
import { services } from "@/lib/content/site";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const submissionId = useRef<string | null>(null);
  const pending = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    if (!submissionId.current) submissionId.current = crypto.randomUUID();
    const payload = { id: submissionId.current, ...Object.fromEntries(["name", "email", "company", "service", "budget", "message", "website"].map((key) => [key, String(values.get(key) ?? "").trim()])) };
    pending.current = true; setStatus("sending"); setMessage("");
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok || !data.id) throw new Error(data.error || "Your enquiry could not be saved. Please try again.");
      setStatus("saved"); setMessage("Your project is in our inbox. We’ll review your brief and get back to you.");
      form.reset(); submissionId.current = null;
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Your enquiry could not be saved. Please try again."); }
    finally { pending.current = false; }
  }
  return <form className="loop-contact-form" onSubmit={submit}>
    <div className="loop-contact-pair"><label htmlFor="contact-name">Your name<input id="contact-name" name="name" autoComplete="name" minLength={2} maxLength={120} required placeholder="How should we call you?" /></label><label htmlFor="contact-email">Email address<input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required placeholder="you@company.com" /></label></div>
    <label htmlFor="contact-company">Company <span>(optional)</span><input id="contact-company" name="company" autoComplete="organization" maxLength={160} placeholder="Where you’re building" /></label>
    <div className="loop-contact-pair"><label htmlFor="contact-service">What do you have in mind?<select id="contact-service" name="service" defaultValue=""><option value="">Let’s figure it out together</option>{services.map((service) => <option key={service.slug}>{service.title}</option>)}</select></label><label htmlFor="contact-budget">Budget range <span>(optional)</span><select id="contact-budget" name="budget" defaultValue=""><option value="">Still exploring</option><option>Under $2,000</option><option>$2,000–$5,000</option><option>$5,000–$10,000</option><option>$10,000+</option></select></label></div>
    <label htmlFor="contact-message">Tell us about your project<textarea id="contact-message" name="message" minLength={20} maxLength={10000} rows={5} required placeholder="The idea, the challenge, the ambition. We’re listening." /></label>
    <label className="contact-honeypot" aria-hidden="true">Website<input name="website" autoComplete="off" tabIndex={-1} /></label>
    <div className="loop-contact-submit"><button className="loop-pill" type="submit" disabled={status === "sending"}>{status === "sending" ? "Saving your enquiry…" : "Send your project"}<span aria-hidden="true">↗</span></button><p>Your details are shared only with the Loopcodez team so we can respond to your enquiry.</p></div>
    {message && <div className={`loop-form-message ${status}`} role={status === "error" ? "alert" : "status"}>{message}</div>}
  </form>;
}
