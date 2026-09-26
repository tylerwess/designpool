import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Container } from "@/components/ui/Container";
import { reelCompanies } from "@/lib/company-logo";
import type { Listing } from "@/lib/types";

export function SourceLogoReel({ jobs = [] }: { jobs?: Listing[] }) {
  const marks = reelCompanies(jobs);
  if (marks.length === 0) return null;

  return (
    <section aria-label="Listings curated from Ashby, Greenhouse, and Lever">
      <Container>
        <p className="max-w-2xl text-base leading-7 text-muted">
          Listings curated from Ashby, Greenhouse, and Lever
        </p>
      </Container>
      <div className="source-reel mt-6" aria-hidden="true">
        <div className="source-reel-track">
          <div className="source-reel-group">
            {marks.map((company) => (
              <CompanyLogo key={`${company.name}-${company.website}`} name={company.name} website={company.website} />
            ))}
          </div>
          <div className="source-reel-group">
            {marks.map((company) => (
              <CompanyLogo key={`dup-${company.name}-${company.website}`} name={company.name} website={company.website} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
