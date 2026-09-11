import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Lock, Pin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getCurrentUser, isStaff } from "@/lib/lms/auth";
import { getCourseBySlug } from "@/lib/lms/queries";
import { canDiscuss, getThread } from "@/lib/lms/discussion";
import { moderateThreadAction, replyAction } from "@/lib/lms/discussionActions";
import type { User } from "@/payload-types";

export const metadata: Metadata = {
  title: "Discussion",
  robots: { index: false, follow: false },
};

function when(value?: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function roleBadge(author: User | null) {
  if (author?.role === "instructor") return <Badge tone="secondary">Instructor</Badge>;
  if (author?.role === "admin") return <Badge tone="primary">Staff</Badge>;
  return null;
}

export default async function ThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; threadId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug, threadId } = await params;
  const { error } = await searchParams;

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const user = await getCurrentUser();
  const target = `/learn/courses/${slug}/discussion/${threadId}`;
  if (!user) redirect(`/learn/login?next=${encodeURIComponent(target)}`);
  if (!(await canDiscuss(user, course.id))) redirect(`/learn/courses/${slug}`);

  const found = await getThread(threadId);
  if (!found) notFound();
  const { thread, replies } = found;

  // A thread id from another course must not be readable through this route.
  const threadCourseId =
    typeof thread.course === "object" && thread.course ? thread.course.id : thread.course;
  if (String(threadCourseId) !== String(course.id)) notFound();

  const author = thread.author as User | null;
  const staff = isStaff(user);

  return (
    <Container className="py-12">
      <Link
        href={`/learn/courses/${slug}/discussion`}
        className="text-sm font-semibold text-primary-600 hover:underline"
      >
        ← All questions
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <h1 className="flex items-start gap-2 font-display text-2xl font-bold text-primary-900">
          {thread.pinned && <Pin className="mt-1 h-5 w-5 shrink-0 text-secondary-500" aria-label="Pinned" />}
          {thread.title}
        </h1>
        {staff && (
          <div className="flex gap-2">
            <form action={moderateThreadAction}>
              <input type="hidden" name="courseSlug" value={slug} />
              <input type="hidden" name="threadId" value={String(thread.id)} />
              <input type="hidden" name="action" value="pin" />
              <button
                type="submit"
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {thread.pinned ? "Unpin" : "Pin"}
              </button>
            </form>
            <form action={moderateThreadAction}>
              <input type="hidden" name="courseSlug" value={slug} />
              <input type="hidden" name="threadId" value={String(thread.id)} />
              <input type="hidden" name="action" value="lock" />
              <button
                type="submit"
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {thread.locked ? "Unlock" : "Lock"}
              </button>
            </form>
          </div>
        )}
      </div>

      <Card className="mt-5 p-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{author?.name ?? "Someone"}</span>
          {roleBadge(author)}
          <span>· {when(thread.createdAt)}</span>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-gray-800">{thread.body}</p>
      </Card>

      <h2 className="mt-8 font-display text-lg font-semibold text-primary-900">
        {replies.length} {replies.length === 1 ? "reply" : "replies"}
      </h2>

      <div className="mt-4 space-y-3">
        {replies.map((reply) => {
          const replyAuthor = reply.author as User | null;
          return (
            <Card key={reply.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{replyAuthor?.name ?? "Someone"}</span>
                {roleBadge(replyAuthor)}
                <span>· {when(reply.createdAt)}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-gray-800">{reply.body}</p>
            </Card>
          );
        })}
      </div>

      {thread.locked ? (
        <p className="mt-8 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
          <Lock className="h-4 w-4" aria-hidden />
          This thread is locked. No new replies can be added.
        </p>
      ) : (
        <Card className="mt-8 p-6">
          {error === "empty" && (
            <p role="alert" className="mb-3 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
              Please write a reply first.
            </p>
          )}
          {error === "locked" && (
            <p role="alert" className="mb-3 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
              This thread was locked before your reply was posted.
            </p>
          )}
          <form action={replyAction} className="space-y-3">
            <input type="hidden" name="courseSlug" value={slug} />
            <input type="hidden" name="threadId" value={String(thread.id)} />
            <label htmlFor="body" className="block text-sm font-semibold text-gray-800">
              Add a reply
            </label>
            <textarea
              id="body"
              name="body"
              rows={4}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            <button
              type="submit"
              className="rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
            >
              Post reply
            </button>
          </form>
        </Card>
      )}
    </Container>
  );
}
