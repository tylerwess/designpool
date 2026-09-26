import { Button } from "@/components/ui/Button";

export function FloatingApply({ href }: { href: string }) {
  return (
    <div className="floating-apply">
      <Button href={href} external className="floating-apply-button">
        Apply now
        <span className="sr-only"> (opens the company posting in a new tab)</span>
      </Button>
    </div>
  );
}
