import { TranslateListing } from "@/components/TranslateListing";
import { Button } from "@/components/ui/Button";

export function FloatingApply({
  href,
  translate = null,
}: {
  href: string;
  /** Set for non-English listings: shows "Translate to English" beside Apply. */
  translate?: { sourceLanguage: string; languageName: string } | null;
}) {
  return (
    <div className="floating-apply">
      {translate ? <TranslateListing sourceLanguage={translate.sourceLanguage} languageName={translate.languageName} /> : null}
      <Button href={href} external className="floating-apply-button">
        Apply now
        <span className="sr-only"> (opens the company posting in a new tab)</span>
      </Button>
    </div>
  );
}
