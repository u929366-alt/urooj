import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MessageSquare, Pin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/lms/auth";
import { getCourseBySlug } from "@/lib/lms/queries";
import { canDiscuss, listThreads } from "@/lib/lms/discussion";
import { createThreadAction } from "@/lib/lms/discussionActions";
import type { User } from "@/payload-types";

export const metadata: Metadata = {
  title: "Course discussion",
  robots: { index: false, follow: false },
};

function when(value?: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function DiscussionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/learn/login?next=${encodeURIComponent(`/learn/courses/${slug}/discussion`)}`);
  if (!(await canDiscuss(user, course.id))) redirect(`/learn/courses/${slug}`);

  const threads = await listThreads(course.id);

  return (
    <Container className="py-12">
      <Link href={`/learn/courses/${slug}`} className="text-sm font-semibold text-primary-600 hover:underline">
        ← {course.title}
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold text-primary-900">Discussion</h1>
      <p className="mt-2 text-gray-600">
        Ask a question or help another student. Only people on this course can see it.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          {threads.length === 0 && (
            <Card className="p-8 text-center text-gray-600">
              <MessageSquare className="mx-auto h-9 w-9 text-primary-300" aria-hidden />
              <p className="mt-3">No questions yet. Be the first to ask.</p>
            </Card>
          )}

          {threads.map((thread) => {
            const author = thread.author as User | null;
            return (
              <Card key={thread.id} className="p-5">
                <h2 className="flex items-start gap-2 font-semibold text-primary-900">
                  {thread.pinned && (
                    <Pin className="mt-0.5 h-4 w-4 shrink-0 text-secondary-500" aria-label="Pinned" />
                  )}
                  <Link
                    href={`/learn/courses/${slug}/discussion/${thread.id}`}
                    className="hover:underline"
                  >
                    {thread.title}
                  </Link>
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">{thread.body}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {author?.name ?? "Someone"} · {when(thread.createdAt)}
                  {thread.locked && " · locked"}
                </p>
              </Card>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-primary-900">Ask a question</h2>
            {error === "empty" && (
              <p role="alert" className="mt-3 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
                Please fill in both fields.
              </p>
            )}
            <form action={createThreadAction} className="mt-4 space-y-3">
              <input type="hidden" name="courseSlug" value={slug} />
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-800">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  maxLength={160}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label htmlFor="body" className="block text-sm font-semibold text-gray-800">
                  Your question
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows={5}
                  required
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
              >
                Post question
              </button>
            </form>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
