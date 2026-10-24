import Image from "next/image";
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
 * A photograph where there is one, and a gradient stand-in where there is not.
 *
 * Giving this component the `src` rather than replacing it at each call site
 * means a photograph arriving later is one prop, in the shape the layout
 * already expects — and the pages still waiting for one keep working rather
 * than showing a broken image. `label` becomes the alt text when there is a
 * photo, so it is worth writing as a description either way.
 */
export function PlaceholderImage({
  label,
  icon: Icon = ImageIcon,
  seed,
  className,
  src,
  priority,
  position,
}: {
  label?: string;
  icon?: LucideIcon;
  seed?: string;
  className?: string;
  /** A real photograph, from /public. */
  src?: string;
  /** Set on the one photo above the fold, so it is not lazy-loaded. */
  priority?: boolean;
  /** object-position, for a crop that would otherwise cut off the subject. */
  position?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-gray-100", className)}>
        <Image
          src={src}
          alt={label ?? ""}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          priority={priority}
          className="object-cover"
          style={position ? { objectPosition: position } : undefined}
        />
      </div>
    );
  }

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
