type AmbientBackgroundProps = {
  variant?: "hero" | "section";
};

export function AmbientBackground({ variant = "section" }: AmbientBackgroundProps) {
  return (
    <div
      className={`ambient-bg ambient-bg--${variant}`}
      aria-hidden
    >

      <div className="ambient-glow ambient-glow--warm" />
      <div className="ambient-glow ambient-glow--cool" />
      <div className="ambient-noise" />
    </div>
  );
}

export function WireGlobe({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`wire-globe ${className}`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
    >
      <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
      <ellipse cx="60" cy="60" rx="52" ry="18" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <ellipse cx="60" cy="60" rx="18" ry="52" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <ellipse cx="60" cy="60" rx="38" ry="52" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <path d="M8 60h104M60 8v104" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

export function CrosshairMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

