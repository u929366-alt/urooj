import { cn } from "@/lib/utils";

export function MapEmbed({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-gray-200", className)}>
      <iframe
        title="Hunarsaaz location on Google Maps — Taxila, Punjab, Pakistan"
        src="https://www.google.com/maps?q=Kohsar+Extension,+Taxila,+Punjab,+Pakistan&output=embed"
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
