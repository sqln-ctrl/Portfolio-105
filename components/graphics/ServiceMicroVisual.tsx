type ServiceMicroVisualProps = {
  slug: string;
  className?: string;
};

export function ServiceMicroVisual({ slug, className = "" }: ServiceMicroVisualProps) {
  return (
    <div
      className={`service-micro service-micro--${slug} ${className}`}
      aria-hidden
      data-service-visual
    >
      {slug === "ai-agents" && (
        <div className="service-micro-agents">
          <span className="service-micro-node service-micro-node--core" />
          <span className="service-micro-node" />
          <span className="service-micro-node" />
          <span className="service-micro-edge" />
          <span className="service-micro-edge service-micro-edge--2" />
        </div>
      )}

      {slug === "automations" && (
        <div className="service-micro-flow">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="service-micro-flow-step" />
          ))}
        </div>
      )}

      {slug === "web-development" && (
        <div className="service-micro-web">
          <span className="service-micro-web-bar" />
          <span className="service-micro-web-panel service-micro-web-panel--a" />
          <span className="service-micro-web-panel service-micro-web-panel--b" />
        </div>
      )}

      {slug === "app-development" && (
        <div className="service-micro-app">
          <span className="service-micro-screen service-micro-screen--a" />
          <span className="service-micro-screen service-micro-screen--b" />
        </div>
      )}

      {slug === "ecommerce-solutions" && (
        <div className="service-micro-commerce">
          {[0, 1, 2].map((i) => (
            <span key={i} className="service-micro-commerce-item" />
          ))}
        </div>
      )}

      {slug === "content-management" && (
        <div className="service-micro-cms">
          <span className="service-micro-cms-block service-micro-cms-block--a" />
          <span className="service-micro-cms-block service-micro-cms-block--b" />
          <span className="service-micro-cms-block service-micro-cms-block--c" />
        </div>
      )}
    </div>
  );
}
