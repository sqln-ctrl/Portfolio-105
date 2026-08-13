import { cn } from "@/lib/utils/cn";

type TagProps = {
  children: React.ReactNode;
  className?: string;
};

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm border border-line px-2 py-0.5",
        "font-mono text-xs uppercase tracking-widest text-text-subtle",
        className,
      )}
    >
      {children}
    </span>
  );
}
