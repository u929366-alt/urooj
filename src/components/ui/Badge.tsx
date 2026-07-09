import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "primary" | "secondary" | "accent" | "neutral";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary-50 text-primary-700",
    secondary: "bg-secondary-50 text-secondary-700",
    accent: "bg-accent-50 text-accent-700",
    neutral: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
