import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ComponentProps<"a"> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary:
    "bg-signal !text-paper hover:bg-signal-hover border border-signal rounded-[var(--radius-pill)] shadow-[0_0_24px_color-mix(in_srgb,var(--color-signal)_35%,transparent)]",
  secondary:
    "bg-transparent text-paper border border-line-strong hover:border-signal hover:text-signal rounded-[var(--radius-pill)]",
  ghost:
    "bg-transparent text-paper-muted hover:text-paper border border-transparent",
};

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-2.5",
        "font-mono text-xs font-medium uppercase tracking-widest",
        "transition-colors duration-[var(--duration-base)] ease-[var(--ease-out)]",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-signal",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
