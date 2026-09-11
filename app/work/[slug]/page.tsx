import { notFound } from "next/navigation";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { CaseStudyBlock, CaseStudyHero, CaseStudyNextNav, CaseStudyTechStack } from "@/components/case-study/CaseStudySections";
import { getProjectBySlugForSite, getAdjacentProjectsForSite } from "@/lib/content/project-store";
import { createPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlugForSite(slug);
  return project ? createPageMetadata({ title: project.title, description: project.outcome, path: `/work/${slug}` }) : { title: "Project not found", robots: { index: false } };
}
export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlugForSite(slug);
  if (!project) notFound();
  const { prev, next } = await getAdjacentProjectsForSite(slug);
  const chapters = [
    { title: "The challenge", text: project.problem },
    { title: "The insight", text: project.insight },
    { title: "Our approach", list: project.approach },
    { title: "Design decisions", list: project.designDecisions },
    { title: "The interaction", text: project.interactionDetail },
    { title: "The result", list: project.results },
    { title: "What we learned", text: project.reflection },
  ];
  return <article className="section-pad case-study-page"><div className="container-site max-w-5xl"><SectionMarker index="" label="Case study" className="mb-8" /><CaseStudyHero project={project} />{project.sections?.length ? project.sections.map((section) => <section key={section.id} className={`case-custom-section case-layout-${section.layout}`}><h2>{section.title}</h2><div>{section.body.split(/\n\s*\n/).filter(Boolean).map((paragraph,i) => <p key={i}>{paragraph}</p>)}</div></section>) : chapters.filter((chapter) => chapter.text || chapter.list?.length).map((chapter) => <CaseStudyBlock key={chapter.title} index="" title={chapter.title}>{chapter.text ? <p>{chapter.text}</p> : <ul className="space-y-4">{chapter.list?.map((item,i) => <li key={i}>{item}</li>)}</ul>}</CaseStudyBlock>)}{project.technologies.length > 0 && <CaseStudyBlock index="" title="Built with"><CaseStudyTechStack technologies={project.technologies} /></CaseStudyBlock>}<CaseStudyNextNav prev={prev} next={next} /></div></article>;
}
