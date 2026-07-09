import Link from "next/link";
import { Clock, Users, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { getIcon } from "@/lib/icons";
import type { Program } from "@/data/programs";

export function ProgramCard({ program }: { program: Program }) {
  const Icon = getIcon(program.icon);

  return (
    <Card className="flex flex-col overflow-hidden">
      <PlaceholderImage
        label={program.title}
        icon={Icon}
        seed={program.slug}
        className="aspect-[16/10] w-full"
      />
      <div className="flex flex-1 flex-col p-6">
        <Badge tone="primary">{program.category}</Badge>
        <h3 className="mt-3 text-lg font-bold text-primary-900">{program.title}</h3>
        <p className="mt-2 flex-1 text-sm text-gray-600">{program.summary}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {program.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {program.eligibility}
          </span>
        </div>
        <Link
          href={`/programs/${program.slug}`}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-secondary-600 hover:text-secondary-700"
        >
          View Details & Apply
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}
