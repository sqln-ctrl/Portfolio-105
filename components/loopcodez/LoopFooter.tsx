import Link from "next/link";
import { LoopMark } from "./LoopMark";
import { getSiteSettings } from "@/lib/content/project-store";

export async function LoopFooter() {
  const settings = await getSiteSettings();
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "loopcodez@gmail.com";
  return <footer className="loop-footer"><div className="loop-footer-top"><span className="loop-eyebrow">The next great thing starts with a conversation.</span><Link href="/contact" className="loop-footer-cta">Have a spark?<br /><em>{settings.footerHeading}</em><span aria-hidden="true">↗</span></Link></div><div className="loop-footer-links"><a href={`mailto:${email}`}>{email} ↗</a><nav aria-label="Footer"><Link href="/work">Work</Link><Link href="/services">Expertise</Link><Link href="/about">About</Link><Link href="/lab">Lab</Link><Link href="/notes">Notes</Link><Link href="/contact">Contact</Link></nav><a href="#main-content">Back to top ↑</a></div><div className="loop-footer-wordmark" aria-hidden="true"><LoopMark /><span>loopcodez</span></div><div className="loop-footer-bottom"><span>© {new Date().getFullYear()} Loopcodez</span><span>Independent by nature. Connected by design.</span><span>Built with intent.</span></div></footer>;
}


