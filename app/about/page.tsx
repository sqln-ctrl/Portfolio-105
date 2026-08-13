import { AmbientBackground } from "@/components/graphics/AmbientBackground";
import { AboutRoomVisual } from "@/components/graphics/AboutRoomVisual";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { TextLink } from "@/components/ui/TextLink";
import { createPageMetadata } from "@/lib/seo/metadata";
import { founders, originTimeline, siteCopy } from "@/lib/content/site";

export const metadata = createPageMetadata({
  title: "About",
  description: siteCopy.about.body,
  path: "/about",
});

export default function AboutPage() {
  const { about } = siteCopy;

  return (
    <div className="relative section-pad overflow-hidden">
      <AmbientBackground />
      <div className="container-site relative z-10">
        <div className="grid-site items-start gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <AboutRoomVisual />
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <SectionMarker index="→" label="About" className="mb-4" />
            <p className="origin-marker">
              <span>Room 105</span>
              <span className="origin-marker__sep">/</span>
              <span>Origin / 001</span>
            </p>
            <h1 className="display-heading mb-6 text-4xl text-paper md:text-5xl">
              {about.title}
            </h1>
            <p className="body-lg">{about.body}</p>

            <ol className="origin-timeline mt-10">
              {originTimeline.map((item, i) => (
                <li key={item.label} className="origin-timeline-item">
                  <span className="origin-timeline-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="origin-timeline-label">{item.label}</p>
                    <p className="origin-timeline-detail">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {founders.map((founder) => (
            <article
              key={founder.name}
              className="founder-card rounded-lg border border-line bg-ink-soft/80 p-8 backdrop-blur-sm"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
                {founder.name}
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-signal">
                {founder.roles}
              </p>
              <p className="mt-4 font-display text-lg text-paper">{founder.tagline}</p>
              <p className="mt-3 text-sm text-text-muted">{founder.personal}</p>
              <div className="mt-6">
                <TextLink href={founder.github} showArrow={false}>
                  GitHub ↗
                </TextLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
