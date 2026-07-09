import { cn } from "@/lib/utils";
import { ImageIcon, type LucideIcon } from "lucide-react";

const gradients = [
  "from-primary-600 via-primary-500 to-accent-500",
  "from-secondary-500 via-secondary-400 to-primary-600",
  "from-accent-600 via-accent-500 to-primary-500",
  "from-primary-700 via-secondary-500 to-accent-500",
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Sample-content stand-in for real photography. Swap for actual images
 * before launch — see README "Placeholder content" section.
 */
export function PlaceholderImage({
  label,
  icon: Icon = ImageIcon,
  seed,
  className,
}: {
  label?: string;
  icon?: LucideIcon;
  seed?: string;
  className?: string;
}) {
  const gradient = gradients[hashString(seed ?? label ?? "hunarsaaz") % gradients.length];

  return (
    <div
      role="img"
      aria-label={label ?? "Placeholder image"}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br text-white",
        gradient,
        className
      )}
    >
      <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] [background-size:24px_24px]" />
      <Icon className="relative h-10 w-10 opacity-90" strokeWidth={1.5} />
      {label && (
        <span className="absolute bottom-2 left-2 right-2 truncate text-xs font-medium text-white/80">
          {label}
        </span>
      )}
    </div>
  );
}
