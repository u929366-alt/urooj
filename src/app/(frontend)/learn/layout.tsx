import Link from "next/link";
import { ClipboardCheck, GraduationCap, LayoutDashboard, LogOut } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getCurrentUser } from "@/lib/lms/auth";
import { logoutAction } from "@/lib/lms/actions";

export default async function LearnLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="bg-gray-50/60">
      <div className="border-b border-gray-100 bg-white">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
          <nav aria-label="Learning portal" className="flex items-center gap-1 text-sm font-semibold">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-primary-700 hover:bg-primary-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              My Learning
            </Link>
            <Link
              href="/learn/courses"
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-gray-700 hover:bg-primary-50"
            >
              <GraduationCap className="h-4 w-4" />
              Course Catalogue
            </Link>
            {(user?.role === "instructor" || user?.role === "admin") && (
              <Link
                href="/learn/teach"
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-gray-700 hover:bg-primary-50"
              >
                <ClipboardCheck className="h-4 w-4" />
                Grading
              </Link>
            )}
          </nav>

          {user ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-600">
                {user.name}
                {user.role !== "student" && (
                  <span className="ml-2 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary-700">
                    {user.role}
                  </span>
                )}
              </span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Link href="/learn/login" className="rounded-full px-3 py-1.5 text-gray-700 hover:bg-gray-100">
                Sign in
              </Link>
              <Link
                href="/learn/register"
                className="rounded-full bg-secondary-500 px-4 py-1.5 text-white hover:bg-secondary-600"
              >
                Create account
              </Link>
            </div>
          )}
        </Container>
      </div>
      {children}
    </div>
  );
}
