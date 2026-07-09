import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
