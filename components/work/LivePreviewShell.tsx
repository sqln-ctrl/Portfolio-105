function getDisplayHost(url: string, hostname?: string): string {
  if (hostname) return hostname;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

type LivePreviewShellProps = {
  url: string;
  title: string;
  hostname?: string;
  className?: string;
  showCardImage?: boolean;
};

export function LivePreviewShell({
  url,
  title,
  hostname,
  className = "",
  showCardImage,
}: LivePreviewShellProps) {
  const displayHost = getDisplayHost(url, hostname);

  return (
    <div
      className={`live-site-preview ${className}`}
      {...(showCardImage ? { "data-card-image": "" } : {})}
    >
      <div className="project-browser-chrome">
        <span />
        <span />
        <span />
        <p>{displayHost}</p>
      </div>
      <div className="live-site-preview__frame live-site-preview__frame--shell">
        <span className="live-site-preview__shimmer" aria-hidden />
        <span className="sr-only">{title} live preview loading</span>
      </div>
      <span className="project-live-pill">Live</span>
    </div>
  );
}
