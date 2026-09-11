import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { ProjectCardVisual } from "@/components/work/ProjectCardVisual";
import type { CaseStudy } from "@/lib/content/projects";

type CaseStudyDraftBannerProps = {
  project: CaseStudy;
};

export function CaseStudyDraftBanner({ project }: CaseStudyDraftBannerProps) {
  if (project.approved) return null;

  return (
    <div
      className="mb-10 rounded-lg border border-signal/30 bg-signal/5 px-5 py-4"
      role="status"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-signal">
        Awaiting founder approval
      </p>
      <p className="mt-2 text-sm text-text-muted">
        This case study uses representative content and placeholder visuals.
        Umer and Saqlain will approve final project details, assets, and claims
        before launch.
      </p>
    </div>
  );
}

type CaseStudyHeroProps = {
  project: CaseStudy;
};

export function CaseStudyHero({ project }: CaseStudyHeroProps) {


  return (
    <header className="case-study-hero mb-12 border-b border-line pb-12">

      <div className="mt-4 mb-6 flex flex-wrap items-center gap-2">
        {project.typeTags.map((tag) => (
          <span key={tag} className="work-type-tag">
            {tag}
          </span>
        ))}
        <span className="work-type-tag work-type-tag--year">{project.year}</span>
        {!project.approved && (
          <span className="work-type-tag work-type-tag--draft">Draft</span>
        )}
        {project.approved && project.liveUrl && (
          <Tag>Live</Tag>
        )}
      </div>
      <h1 className="display-heading mb-4 max-w-4xl text-4xl uppercase tracking-tight text-paper md:text-5xl">
        {project.title.replace(/ — .+$/, "")}
      </h1>
      <p className="mb-6 max-w-2xl text-xl text-signal">{project.outcome}</p>
      <dl className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-widest text-text-subtle">
        <div>
          <dt className="inline text-text-subtle">Role · </dt>
          <dd className="inline text-text-muted">{project.role}</dd>
        </div>
        <div>
          <dt className="inline text-text-subtle">Timeline · </dt>
          <dd className="inline text-text-muted">{project.timeline}</dd>
        </div>
        <div>
          <dt className="inline text-text-subtle">Category · </dt>
          <dd className="inline text-text-muted">{project.category}</dd>
        </div>
      </dl>
      <ProjectCardVisual
        slug={project.slug}
        title={project.title}
        liveUrl={project.liveUrl}
        coverUrl={project.coverUrl}
        approved={project.approved}
        typeTags={project.typeTags}
        className="mt-10 aspect-[16/9]"
      />
      {project.liveUrl && project.approved && (
        <p className="mt-4">
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-widest text-signal hover:underline"
          >
            View live site ↗
          </Link>
        </p>
      )}
    </header>
  );
}

type CaseStudyBlockProps = {
  index: string;
  title: string;
  children: React.ReactNode;
};

export function CaseStudyBlock({ title, children }: CaseStudyBlockProps) {
  return (
    <section className="case-study-block border-b border-line py-10 last:border-b-0">

      <h2 className="display-heading mb-6 text-2xl text-paper">{title}</h2>
      <div className="max-w-2xl space-y-4 text-text-muted leading-relaxed">
        {children}
      </div>
    </section>
  );
}

type CaseStudyTechStackProps = {
  technologies: string[];
};

export function CaseStudyTechStack({ technologies }: CaseStudyTechStackProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <li key={tech}>
          <Tag>{tech}</Tag>
        </li>
      ))}
    </ul>
  );
}

type CaseStudyNextNavProps = {
  prev: CaseStudy | null;
  next: CaseStudy | null;
};

export function CaseStudyNextNav({ prev, next }: CaseStudyNextNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      className="mt-16 grid gap-4 border-t border-line pt-10 md:grid-cols-2"
      aria-label="More case studies"
    >
      {prev ? (
        <Link
          href={`/work/${prev.slug}`}
          className="group rounded-lg border border-line p-6 transition-colors hover:border-signal/35"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-text-subtle">
            ← Previous project
          </span>
          <p className="mt-2 font-display text-lg font-semibold group-hover:text-signal">
            {prev.title}
          </p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/work/${next.slug}`}
          className="group rounded-lg border border-line p-6 text-right transition-colors hover:border-signal/35 md:col-start-2"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-text-subtle">
            Next project →
          </span>
          <p className="mt-2 font-display text-lg font-semibold group-hover:text-signal">
            {next.title}
          </p>
        </Link>
      ) : null}
    </nav>
  );
}

