import Link from "next/link";
import { SourcePlatforms } from "@/components/SourcePlatforms";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <Logo className="text-lg" />
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
            The free design job board that respects your time. Roles stay for 30 days.
          </p>
        </div>
        <div>
          <Eyebrow>Navigate</Eyebrow>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/jobs" className="hover:underline">
                Jobs
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <Eyebrow>Sources</Eyebrow>
          <SourcePlatforms className="mt-3 text-base" />
          <p className="mt-2 text-sm leading-6 text-muted">Apply goes to the original posting.</p>
        </div>
      </Container>
    </footer>
  );
}
