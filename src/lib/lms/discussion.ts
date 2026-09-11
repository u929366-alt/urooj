import "server-only";

import { cache } from "react";
import { getPayloadClient } from "./auth";
import type { Discussion, DiscussionReply, User } from "@/payload-types";

/** Can this person read and post in a course's discussion? */
export async function canDiscuss(
  user: User | null,
  courseId: number | string,
): Promise<boolean> {
  if (!user) return false;
  if (user.role === "admin" || user.role === "instructor") return true;

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "enrollments",
    where: { and: [{ student: { equals: user.id } }, { course: { equals: courseId } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const enrolment = result.docs[0];
  return Boolean(enrolment && enrolment.status !== "withdrawn");
}

export const listThreads = cache(async (courseId: number | string): Promise<Discussion[]> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "discussions",
    where: { course: { equals: courseId } },
    sort: ["-pinned", "-createdAt"],
    limit: 100,
    depth: 1,
    overrideAccess: true,
  });
  return result.docs;
});

export const getThread = cache(
  async (
    threadId: number | string,
  ): Promise<{ thread: Discussion; replies: DiscussionReply[] } | null> => {
    const payload = await getPayloadClient();
    const thread = await payload.findByID({
      collection: "discussions",
      id: threadId,
      depth: 1,
      overrideAccess: true,
    });
    if (!thread) return null;

    const replies = await payload.find({
      collection: "discussion-replies",
      where: { discussion: { equals: threadId } },
      sort: "createdAt",
      limit: 500,
      depth: 1,
      overrideAccess: true,
    });
    return { thread, replies: replies.docs };
  },
);

export const countThreads = cache(async (courseId: number | string): Promise<number> => {
  const payload = await getPayloadClient();
  const result = await payload.count({
    collection: "discussions",
    where: { course: { equals: courseId } },
    overrideAccess: true,
  });
  return result.totalDocs;
});
