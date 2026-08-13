type ServiceIconProps = {
  slug: string;
  className?: string;
};

export function ServiceIcon({ slug, className = "" }: ServiceIconProps) {
  const props = {
    className: `service-icon ${className}`,
    viewBox: "0 0 32 32",
    fill: "none",
    "aria-hidden": true as const,
  };

  switch (slug) {
    case "ai-agents":
      return (
        <svg {...props}>
          <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="11" cy="16" r="2" fill="currentColor" />
          <path d="M16 13h8M16 16h6M16 19h8" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    case "automations":
      return (
        <svg {...props}>
          <circle cx="8" cy="16" r="3" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="24" cy="16" r="3" stroke="currentColor" strokeWidth="1.25" />
          <path d="M11 16h10" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 2" />
          <path d="M16 6v4M16 22v4" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    case "web-development":
      return (
        <svg {...props}>
          <path d="M6 10l10-4 10 4v12l-10 4-10-4V10z" stroke="currentColor" strokeWidth="1.25" />
          <path d="M16 6v20M6 10l10 4 10-4" stroke="currentColor" strokeWidth="1.25" opacity="0.5" />
        </svg>
      );
    case "app-development":
      return (
        <svg {...props}>
          <rect x="9" y="4" width="14" height="24" rx="3" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="16" cy="24" r="1.25" fill="currentColor" />
          <path d="M13 8h6" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    case "ecommerce-solutions":
      return (
        <svg {...props}>
          <path d="M8 10h16l-2 14H10L8 10z" stroke="currentColor" strokeWidth="1.25" />
          <path d="M11 10V8a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    case "content-management":
      return (
        <svg {...props}>
          <rect x="6" y="6" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.25" />
          <path d="M10 12h12M10 16h8M10 20h10" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <rect x="8" y="8" width="16" height="16" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
  }
}
