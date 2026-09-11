"use client";

import { useEffect, useRef, useState } from "react";
import { useHydrated } from "@/lib/motion/use-hydrated";
import { LivePreviewShell } from "@/components/work/LivePreviewShell";

type LiveSitePreviewProps = {
  url: string;
  title: string;
  hostname?: string;
  className?: string;
  "data-card-image"?: boolean;
};

function getDisplayHost(url: string, hostname?: string): string {
  if (hostname) return hostname;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function LiveSitePreview({
  url,
  title,
  hostname,
  className = "",
  ...rest
}: LiveSitePreviewProps) {
  const showCardImage = Boolean(rest["data-card-image"]);
  const mounted = useHydrated();
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  const displayHost = getDisplayHost(url, hostname);



  useEffect(() => {
    if (!mounted) return;
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => {
      const w = frame.clientWidth;
      if (w > 0) setScale(w / 1440);
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(frame);
    return () => ro.disconnect();
  }, [mounted]);

  if (!mounted) {
    return (
      <LivePreviewShell
        url={url}
        title={title}
        hostname={hostname}
        className={className}
        showCardImage={showCardImage}
      />
    );
  }

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
      <div ref={frameRef} className="live-site-preview__frame">
        <iframe
          src={url}
          title={`${title} — live preview`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms"
          style={{
            transform: `scale(${scale})`,
            width: "1440px",
            height: "900px",
          }}
        />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="live-site-preview__link"
          aria-label={`Open ${title} live site`}
        >
          Open live site ↗
        </a>
      </div>
      <span className="project-live-pill">Live</span>
    </div>
  );
}

