/**
 * The job boards Designpool ingests from, with the site each app icon is fetched for.
 * `color` is the dominant color of that app icon, used for its pulse on the About circuit.
 */
export const SOURCE_PLATFORMS = [
  { name: "Greenhouse", website: "https://www.greenhouse.com", color: "#24a47f" },
  { name: "Ashby", website: "https://www.ashbyhq.com", color: "#473bce" },
  { name: "Lever", website: "https://www.lever.co", color: "#47a7a2" },
] as const;
