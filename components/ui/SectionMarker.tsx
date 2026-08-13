import { cn } from "@/lib/utils/cn";

type SectionMarkerProps = {
  index: string;
  label: string;
  className?: string;
};

export function SectionMarker({ index, label, className }: SectionMarkerProps) {
  return (
    <p className={cn("section-marker flex items-center gap-3", className)}>
      <span>{index}</span>
      <span className="h-px w-8 bg-line" aria-hidden />
      <span>{label}</span>
    </p>
  );
}
