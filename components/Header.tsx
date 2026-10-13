"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative pb-1 ${
        active
          ? "text-accent after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-accent"
          : "text-ink hover:underline"
      }`}
    >
      {children}
    </Link>
  );
}

export function Header() {
  return (
    <header className="border-b border-line">
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link href="/" className="text-xl" aria-label="Designpool">
          <Logo />
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-5">
          <NavLink href="/jobs">Jobs</NavLink>
          <NavLink href="/about">About</NavLink>
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}
