import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Newspaper, MessageCircle } from "lucide-react";
import { FacebookIcon, XIcon } from "@/components/ui/SocialIcons";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { posts } from "@/data/blog";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const shareUrl = `${siteConfig.url}/blog/${post.slug}`;

  return (
    <>
      <PageHero breadcrumb={post.title} eyebrow={post.category} title={post.title} />
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm text-gray-500">
              By {post.author} · {formatDate(post.date)} · {post.readTime}
            </p>
            <PlaceholderImage
              label={post.title}
              icon={Newspaper}
              seed={post.slug}
              className="mt-6 aspect-[16/9] w-full rounded-3xl"
            />
            <div className="prose prose-lg mt-8 max-w-none text-gray-700">
              {post.content.map((paragraph, i) => (
                <p key={i} className="mb-5 leading-8">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-3 border-t border-gray-100 pt-6">
              <span className="text-sm font-medium text-gray-500">Share:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-700"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-700"
              >
                <XIcon className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-700"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>

            <Link
              href="/blog"
              className="mt-10 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              ← Back to all articles
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
