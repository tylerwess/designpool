import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-serif text-xl tracking-tight text-ink">
          Designpool
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/jobs" className="text-ink hover:text-accent">
            Jobs
          </Link>
          <Link href="/about" className="text-ink hover:text-accent">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
