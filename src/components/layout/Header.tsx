"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { mainNav, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setOpenDropdown(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-200",
        scrolled
          ? "border-gray-100 bg-white/95 shadow-sm backdrop-blur"
          : "border-transparent bg-white"
      )}
    >
      <a
        href="#main-content"
        className="skip-link fixed left-2 top-2 z-[60] -translate-y-24 rounded-md bg-primary-600 px-4 py-2 text-white transition-transform"
      >
        Skip to main content
      </a>
      <Container>
        <div className="flex h-20 items-center justify-between py-2">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-lockup.svg"
              alt={siteConfig.name}
              width={149}
              height={64}
              loading="eager"
              className="h-16 w-auto"
            />
          </Link>

          <nav aria-label="Main navigation" className="hidden lg:flex lg:items-center lg:gap-1">
            {mainNav.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => item.children && setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-700",
                    pathname === item.href && "text-primary-700"
                  )}
                  aria-expanded={item.children ? openDropdown === item.label : undefined}
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>
                {item.children && openDropdown === item.label && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="w-72 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-xl px-4 py-3 hover:bg-primary-50"
                        >
                          <span className="block text-sm font-semibold text-gray-900">
                            {child.label}
                          </span>
                          {child.description && (
                            <span className="mt-0.5 block text-xs text-gray-500">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button href="/admissions" variant="outline" size="sm">
              Apply Now
            </Button>
            <Button href="/donate" variant="primary" size="sm">
              <Heart className="h-4 w-4" />
              Donate
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {mainNav.map((item) => (
              <div key={item.label} className="border-b border-gray-50 pb-2">
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 font-semibold text-gray-800 hover:bg-primary-50"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-primary-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-3 flex gap-3">
              <Button href="/admissions" variant="outline" size="sm" className="flex-1">
                Apply Now
              </Button>
              <Button href="/donate" variant="primary" size="sm" className="flex-1">
                Donate
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
