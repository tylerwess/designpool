import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <Container className="grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg">
            Designpool<span className="text-accent">.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
            Design roles, kept for 30 days. Made for people who hire and practice the craft.
          </p>
        </div>
        <div>
          <Eyebrow>Navigate</Eyebrow>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/jobs" className="hover:text-accent">
                Jobs
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-accent">
                About
              </Link>
            </li>
            <li>
              <Link href="/design" className="hover:text-accent">
                Design system
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <Eyebrow>Sources</Eyebrow>
          <p className="mt-3 text-sm leading-6 text-muted">
            Pulled from public Greenhouse, Ashby, and Lever boards. Apply goes to the original posting.
          </p>
        </div>
      </Container>
    </footer>
  );
}
