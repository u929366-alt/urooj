import "server-only";

import { cache } from "react";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import type { User } from "@/payload-types";

/**
 * Data Access Layer for the learning portal.
 *
 * Every protected read goes through `requireUser()` here rather than relying
 * on the proxy, which the Next.js docs are explicit about: proxy is for
 * optimistic redirects only, never for authorisation. `cache()` means one
 * lookup per render pass no matter how many components ask.
 */

export const getPayloadClient = cache(async () => getPayload({ config }));

/** The signed-in user, or null. Never throws, never redirects. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const payload = await getPayloadClient();
  const requestHeaders = await nextHeaders();
  try {
    const { user } = await payload.auth({ headers: requestHeaders });
    return (user as User | null) ?? null;
  } catch {
    return null;
  }
});

/** The signed-in user, or a redirect to the login page. */
export async function requireUser(returnTo?: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    const target = returnTo ? `/learn/login?next=${encodeURIComponent(returnTo)}` : "/learn/login";
    redirect(target);
  }
  return user;
}

/** A user who is allowed to author or grade — instructor or admin. */
export async function requireStaff(returnTo?: string): Promise<User> {
  const user = await requireUser(returnTo);
  if (user.role !== "instructor" && user.role !== "admin") {
    redirect("/learn");
  }
  return user;
}

export function isStaff(user: User | null): boolean {
  return user?.role === "instructor" || user?.role === "admin";
}
