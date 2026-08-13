import { LiveSitePreview } from "@/components/work/LiveSitePreview";

type ProjectCardVisualProps = {
  slug: string;
  title: string;
  liveUrl?: string;
  approved?: boolean;
  typeTags?: string[];
  className?: string;
  "data-card-image"?: boolean;
};

export function ProjectCardVisual({
  slug,
  title,
  liveUrl,
  approved,
  typeTags = [],
  className = "",
  ...rest
}: ProjectCardVisualProps) {
  const dataAttrs = rest["data-card-image"] ? { "data-card-image": true } : {};

  if (liveUrl && approved) {
    return (
      <LiveSitePreview
        url={liveUrl}
        title={title}
        className={className}
        {...dataAttrs}
      />
    );
  }

  if (slug === "ai-task-agent") {
    return (
      <div
        className={`project-visual project-visual--agent ${className}`}
        {...dataAttrs}
      >
        <div className="project-visual-body">
          <p className="project-visual-brand project-visual-brand--mono">AI Task Agent</p>
          <p className="project-visual-tagline">Agent architecture · Draft</p>
          <div className="project-visual-agent-graph" aria-hidden>
            <span className="project-visual-agent-node project-visual-agent-node--core" />
            <span className="project-visual-agent-node" />
            <span className="project-visual-agent-node" />
            <span className="project-visual-agent-node" />
            <span className="project-visual-agent-edge" />
            <span className="project-visual-agent-edge project-visual-agent-edge--2" />
            <span className="project-visual-agent-edge project-visual-agent-edge--3" />
          </div>
        </div>
        <span className="project-draft-pill">Draft</span>
      </div>
    );
  }

  if (slug === "workflow-automation-platform") {
    return (
      <div
        className={`project-visual project-visual--automation ${className}`}
        {...dataAttrs}
      >
        <div className="project-visual-body">
          <p className="project-visual-brand project-visual-brand--mono">
            Workflow Automation
          </p>
          <p className="project-visual-tagline">Connected systems · Draft</p>
          <div className="project-visual-flow" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="project-visual-flow-node" />
            ))}
          </div>
        </div>
        <span className="project-draft-pill">Draft</span>
      </div>
    );
  }

  if (slug === "gamevault-account-manager") {
    return (
      <div
        className={`project-visual project-visual--gamevault ${className}`}
        {...dataAttrs}
      >
        <div className="project-visual-body">
          <p className="project-visual-brand">GameVault</p>
          <p className="project-visual-tagline">Account vault · Live</p>
          <div className="project-visual-grid-ui" aria-hidden />
        </div>
      </div>
    );
  }

  if (slug === "andaaz-luxury-watches") {
    return (
      <div
        className={`project-visual project-visual--andaaz ${className}`}
        {...dataAttrs}
      >
        <div className="project-visual-body">
          <p className="project-visual-brand">Andaaz</p>
          <p className="project-visual-tagline">Luxury ecommerce · Live</p>
          <div className="project-visual-watch" aria-hidden />
        </div>
      </div>
    );
  }

  return (
    <div className={`project-visual project-visual--draft ${className}`} {...dataAttrs}>
      <div className="project-visual-body">
        <p className="project-visual-brand">{title}</p>
        <p className="project-visual-tagline">{approved ? "Case study" : "Coming soon"}</p>
        {typeTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {typeTags.map((tag) => (
              <span key={tag} className="work-type-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {!approved && <span className="project-draft-pill">Draft</span>}
    </div>
  );
}
