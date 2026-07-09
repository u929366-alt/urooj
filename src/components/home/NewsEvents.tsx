import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Newspaper } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { posts } from "@/data/blog";
import { events } from "@/data/events";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function NewsEvents() {
  const latestPosts = posts.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  return (
    <section className="bg-gray-50 py-20">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Latest News" title="News & Updates" align="left" />
            <div className="mt-8 space-y-6">
              {latestPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="flex gap-4 p-4">
                    <PlaceholderImage
                      label={post.title}
                      icon={Newspaper}
                      seed={post.slug}
                      className="aspect-square w-24 shrink-0 rounded-xl"
                    />
                    <div>
                      <Badge tone="secondary">{post.category}</Badge>
                      <h3 className="mt-2 font-semibold text-primary-900">{post.title}</h3>
                      <p className="mt-1 text-xs text-gray-500">{formatDate(post.date)}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            <Button href="/blog" variant="ghost" className="mt-6">
              Read More Stories
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <SectionHeading eyebrow="What's Next" title="Upcoming Events" align="left" />
            <div className="mt-8 space-y-4">
              {upcomingEvents.map((event) => {
                const date = new Date(event.date);
                return (
                  <Card key={event.slug} className="flex gap-4 p-4">
                    <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-600 text-white">
                      <span className="text-xs font-medium uppercase">
                        {date.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-xl font-bold">{date.getDate()}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-900">{event.title}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" /> {event.time}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3.5 w-3.5" /> {event.location}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
