import Link from "next/link";
import { LoopHero } from "./LoopHero";
import { LoopMark } from "./LoopMark";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCardVisual } from "@/components/work/ProjectCardVisual";
import { getProjectsForSite, getSiteSettings } from "@/lib/content/project-store";
import { processSteps } from "@/lib/content/site";
import { ServicesExperience } from "./ServicesExperience";

export async function LoopHome() {
  const [projects, settings] = await Promise.all([getProjectsForSite(), getSiteSettings()]);
  const selected = projects.filter((project) => project.featured).slice(0, settings.homepageCount);
  return (
    <div className="loop-home">
      <LoopHero settings={settings} />
      <div className="loop-discipline-strip" aria-label="Our disciplines"><span>Design with feeling</span><LoopMark /><span>Build with purpose</span><LoopMark /><span>Think beyond the obvious</span><LoopMark /></div>
      {selected.length > 0 ? <section id="selected-work" className="loop-section loop-work" aria-labelledby="loop-work-title">
        <div className="loop-section-top"><span className="loop-eyebrow">Selected work</span><span className="loop-caption">Good ideas. Out in the world.</span></div>
        <Reveal className="loop-section-heading"><h2 id="loop-work-title">{settings.workHeading}<br /><em>{settings.workSubtitle}</em></h2><Link className="loop-text-link" href="/work">All projects <span>↗</span></Link></Reveal>
        <div className="loop-projects">
          {selected.map((project, index) => <Reveal key={project.slug} className={`loop-project loop-project--${index}`}>
            <div className="loop-project-image"><ProjectCardVisual slug={project.slug} title={project.title} liveUrl={project.liveUrl} coverUrl={project.coverUrl} approved={project.approved} className="loop-project-preview" /><Link href={`/work/${project.slug}`} className="loop-project-open" aria-label={`View ${project.title} case study`}><span>Case study</span>↗</Link></div>
            <Link href={`/work/${project.slug}`} className="loop-project-meta"><div><p>{project.category} <span>/ {project.year}</span></p><h3>{project.title.replace(/ — .+$/, "").replace(" Account Manager", "")}</h3></div><span aria-hidden="true">↗</span></Link>
          </Reveal>)}
        </div>
      </section> : <div id="selected-work" />}
      <section className="loop-section loop-about" aria-labelledby="loop-about-title">
        <div className="loop-about-side"><span className="loop-eyebrow">The way we see it</span><LoopMark className="loop-about-mark" /><span className="loop-caption">Two founders.<br />One continuous creative loop.</span></div>
        <Reveal className="loop-about-copy"><h2 id="loop-about-title">The best things happen<br />when <em>different minds</em><br />connect.</h2><div className="loop-about-details"><p>{settings.aboutStatement}</p><Link href="/about" className="loop-text-link">Meet Loopcodez <span>↗</span></Link></div><div className="loop-values"><span>Automation</span><span>Consistency</span><span>Ongoing support</span></div></Reveal>
      </section>
      <section className="loop-section loop-services" aria-labelledby="loop-services-title">
        <div className="loop-section-top"><span className="loop-eyebrow">What we do</span><span className="loop-caption">From the first spark to the final detail.</span></div>
        <Reveal className="loop-section-heading"><h2 id="loop-services-title">Creative thinking.<br /><em>Serious making.</em></h2><p className="loop-section-description">Six ways to move you forward.<br />One team to connect the dots.</p></Reveal>
        <ServicesExperience />
      </section>
      <section className="loop-section loop-process" aria-labelledby="loop-process-title"><div className="loop-section-top"><span className="loop-eyebrow">Our process</span><span className="loop-caption">An open conversation. At every step.</span></div><Reveal className="loop-section-heading"><h2 id="loop-process-title">A clear process.<br /><em>Room for the unexpected.</em></h2></Reveal><div className="loop-process-steps">{processSteps.map((step) => <article key={step.step}><span className="loop-process-node" aria-hidden="true" /><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></section>
      <section className="loop-section loop-lab"><span className="loop-eyebrow">Always exploring</span><h2>A space for<br /><em>“what if?”</em></h2><p>Small experiments. New interactions.<br />The ideas that keep us curious.</p><Link href="/lab" className="loop-pill">Enter the lab <span>↗</span></Link><LoopMark className="loop-lab-mark" /></section>
    </div>
  );
}

