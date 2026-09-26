export const SOURCE_LOGOS = [
  {
    name: "Greenhouse",
    src: "/logos/greenhouse.svg",
    origin: "https://www.greenhouse.com/ (official wordmark)",
    width: 140,
    height: 32,
  },
  {
    name: "Ashby",
    src: "/logos/ashby.svg",
    origin: "https://www.ashbyhq.com/ (official wordmark)",
    width: 1001,
    height: 328,
  },
  {
    name: "Lever",
    src: "/logos/lever.png",
    origin: "https://www.lever.co/images/lever-only-logo.png",
    width: 1020,
    height: 252,
  },
] as const;

/** Duplicate the three marks so one track group stays wider than a desktop viewport. */
export const SOURCE_REEL_REPEAT = 8;

/** Current loop was 48s; 25% speed is 4× duration. */
export const SOURCE_REEL_DURATION_S = 192;

/** Company tiles were 28px; marks are 25% larger. */
export const SOURCE_REEL_LOGO_HEIGHT_PX = 35;

export const SOURCE_REEL_CAPTION = "Listings curated from Ashby, Greenhouse, and Lever.";
