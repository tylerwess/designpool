import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { companyWebsite } from "@/lib/company-logo";
import { listingByline } from "@/lib/format";
import type { Listing } from "@/lib/types";

export function ListingByline({ listing, size = "sm" }: { listing: Listing; size?: "sm" | "lg" }) {
  return (
    <p className={`flex items-center text-muted ${size === "lg" ? "gap-3" : "gap-2 text-sm"}`}>
      <CompanyLogo
        name={listing.company}
        website={companyWebsite(listing.source, listing.companyToken)}
        size={size}
      />
      <span className="min-w-0">{listingByline(listing)}</span>
    </p>
  );
}
