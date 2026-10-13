import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const base64 = readFileSync(join(root, "fonts/FjallaOne-Regular.ttf")).toString("base64");
writeFileSync(
  join(root, "lib/display-font.ts"),
  `// Generated from fonts/FjallaOne-Regular.ttf (SIL OFL, see fonts/OFL.txt).
// Embedded so the icon and Open Graph routes need no filesystem access on Cloudflare Workers.
// Regenerate after replacing the font: npm run embed-font
export const FJALLA_ONE_BASE64 =
  "${base64}";
`,
);
