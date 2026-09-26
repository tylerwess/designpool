import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-line">
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link href="/" className="font-serif text-xl tracking-tight text-ink">
          Designpool<span className="text-accent">.</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-5">
          <Link href="/jobs" className="text-ink hover:text-accent">
            Jobs
          </Link>
          <Link href="/about" className="text-ink hover:text-accent">
            About
          </Link>
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}
