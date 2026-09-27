import { CompanyLogo } from "@/components/ui/CompanyLogo";

export const SOURCE_PLATFORMS = [
  { name: "Greenhouse", website: "https://www.greenhouse.com" },
  { name: "Ashby", website: "https://www.ashbyhq.com" },
  { name: "Lever", website: "https://www.lever.co" },
];

export function SourcePlatforms({ className = "" }: { className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-2 font-display text-ink ${className}`.trim()}>
      {SOURCE_PLATFORMS.map((platform, index) => (
        <span key={platform.name} className="inline-flex items-center gap-2">
          {index > 0 ? <span aria-hidden="true">+</span> : null}
          <span className="inline-flex items-center gap-2">
            <CompanyLogo name={platform.name} website={platform.website} />
            {platform.name}
          </span>
        </span>
      ))}
    </p>
  );
}
