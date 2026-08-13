import { TextLink } from "@/components/ui/TextLink";
import { Button } from "@/components/ui/Button";

const footerLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/lab", label: "Lab" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer border-t border-line bg-ink-soft">
      <div className="container-site section-pad !pb-12 !pt-16">
        <div className="grid-site items-end gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="mark-105" aria-hidden>
                105
              </span>
              <p className="font-display text-xl font-semibold tracking-tight">
                Studio 105
              </p>
            </div>
            <p className="display-heading max-w-lg text-3xl text-paper md:text-4xl">
              Built to mean something.
            </p>
            <p className="mt-4 max-w-md text-sm text-text-muted">
              Have something worth building?
            </p>
            <div className="mt-6">
              <Button href="/contact">Let&apos;s talk →</Button>
            </div>
          </div>

          <nav
            className="col-span-12 flex flex-wrap gap-x-8 gap-y-3 lg:col-span-2 lg:col-start-9"
            aria-label="Footer"
          >
            {footerLinks.map((link) => (
              <TextLink key={link.href} href={link.href} showArrow={false}>
                {link.label}
              </TextLink>
            ))}
          </nav>

          <div className="col-span-12 flex flex-col gap-3 border-t border-line pt-8 lg:col-span-3 lg:col-start-10 lg:border-t-0 lg:pt-0">
            <TextLink href="https://github.com/SMPanther" showArrow={false}>
              GitHub ↗
            </TextLink>
            <TextLink href="/contact" showArrow={false}>
              Email
            </TextLink>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-text-subtle">
              Room 105 · {year}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
