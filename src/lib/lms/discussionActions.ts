"use server";

import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { canDiscuss } from "./discussion";
import type { User } from "@/payload-types";

async function currentUser() {
  const payload = await getPayload({ config });
  const requestHeaders = await nextHeaders();
  const { user } = await payload.auth({ headers: requestHeaders });
  return { payload, user: (user as User | null) ?? null };
}

/** Start a thread. Only people on the course may post to it. */
export async function createThreadAction(formData: FormData) {
  const { payload, user } = await currentUser();
  const courseSlug = String(formData.get("courseSlug") || "");
  const base = `/learn/courses/${courseSlug}/discussion`;
  if (!user) redirect(`/learn/login?next=${encodeURIComponent(base)}`);

  const courseResult = await payload.find({
    collection: "courses",
    where: { slug: { equals: courseSlug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const course = courseResult.docs[0];
  if (!course) redirect("/learn/courses");

  if (!(await canDiscuss(user, course.id))) redirect(`/learn/courses/${courseSlug}`);

  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!title || !body) redirect(`${base}?error=empty`);

  const thread = await payload.create({
    collection: "discussions",
    overrideAccess: true,
    data: {
      title: title.slice(0, 160),
      body,
      course: course.id,
      author: user.id,
    },
  });

  revalidatePath(base);
  redirect(`${base}/${thread.id}`);
}

/** Reply to a thread. Blocked when the thread is locked. */
export async function replyAction(formData: FormData) {
  const { payload, user } = await currentUser();
  const courseSlug = String(formData.get("courseSlug") || "");
  const threadId = String(formData.get("threadId") || "");
  const target = `/learn/courses/${courseSlug}/discussion/${threadId}`;
  if (!user) redirect(`/learn/login?next=${encodeURIComponent(target)}`);
  if (!threadId) redirect(`/learn/courses/${courseSlug}/discussion`);

  const thread = await payload.findByID({
    collection: "discussions",
    id: threadId,
    depth: 0,
    overrideAccess: true,
  });
  if (!thread) redirect(`/learn/courses/${courseSlug}/discussion`);

  const courseId =
    typeof thread.course === "object" && thread.course ? thread.course.id : thread.course;
  if (!(await canDiscuss(user, courseId))) redirect(`/learn/courses/${courseSlug}`);
  if (thread.locked) redirect(`${target}?error=locked`);

  const body = String(formData.get("body") || "").trim();
  if (!body) redirect(`${target}?error=empty`);

  await payload.create({
    collection: "discussion-replies",
    overrideAccess: true,
    data: { body, discussion: thread.id, course: courseId, author: user.id },
  });

  revalidatePath(target);
  redirect(target);
}

/** Pin or lock a thread. Staff only. */
export async function moderateThreadAction(formData: FormData) {
  const { payload, user } = await currentUser();
  const courseSlug = String(formData.get("courseSlug") || "");
  const threadId = String(formData.get("threadId") || "");
  const target = `/learn/courses/${courseSlug}/discussion/${threadId}`;

  if (!user || (user.role !== "admin" && user.role !== "instructor")) redirect(target);

  const action = String(formData.get("action") || "");
  const thread = await payload.findByID({
    collection: "discussions",
    id: threadId,
    depth: 0,
    overrideAccess: true,
  });
  if (!thread) redirect(`/learn/courses/${courseSlug}/discussion`);

  await payload.update({
    collection: "discussions",
    id: thread.id,
    overrideAccess: true,
    data:
      action === "pin"
        ? { pinned: !thread.pinned }
        : { locked: !thread.locked },
  });

  revalidatePath(target);
  redirect(target);
}
