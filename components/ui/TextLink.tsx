import { cn } from "@/lib/utils/cn";

type TextLinkProps = React.ComponentProps<"a"> & {
  showArrow?: boolean;
};

export function TextLink({
  className,
  showArrow = true,
  children,
  ...props
}: TextLinkProps) {
  return (
    <a
      className={cn(
        "group inline-flex items-center gap-2 text-sm text-paper-muted",
        "transition-colors duration-[var(--duration-base)] hover:text-signal",
        className,
      )}
      {...props}
    >
      <span className="border-b border-transparent transition-[border-color] group-hover:border-signal/50">
        {children}
      </span>
      {showArrow && (
        <span
          aria-hidden
          className="transition-transform duration-[var(--duration-base)] group-hover:translate-x-0.5"
        >
          →
        </span>
      )}
    </a>
  );
}
