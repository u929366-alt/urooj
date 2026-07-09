import { ArrowRight, Images } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { galleryItems } from "@/data/partners";

export function GalleryPreview() {
  const items = galleryItems.slice(0, 8);

  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Gallery" title="Life at Hunarsaaz" />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((item, i) => (
            <PlaceholderImage
              key={item.id}
              label={item.caption}
              icon={Images}
              seed={item.id}
              className={`rounded-2xl ${i % 5 === 0 ? "aspect-square sm:col-span-2 sm:row-span-2 sm:aspect-square" : "aspect-square"}`}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/gallery" variant="outline">
            View Full Gallery
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
