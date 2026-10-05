const EXCLUDE = [
  /\bmechanical\b/i,
  /\basic\b/i,
  /\bchip\b/i,
  /\bhardware design\b/i,
  /\bcircuit\b/i,
  /\bfpga\b/i,
  /\brtl\b/i,
  /\bvlsi\b/i,
  /\bsemiconductor\b/i,
  /\banalog design\b/i,
  /\bphysical design\b/i,
  /\bdesign verification\b/i,
  /\bstructural\b/i,
  /\bcivil\b/i,
  /\bpcb\b/i,
  /\bthermal\b/i,
  /\bcad\b/i,
  /\bsolidworks\b/i,
  /\binstructional\b/i,
  /\blearning experience\b/i,
  /\borganizational design\b/i,
  /\bcompensation design\b/i,
  /\binterior design\b/i,
  /\bfashion design\b/i,
  /\blandscape design\b/i,
  /\bproduct design engineer\b/i,
  /\brf\b/i,
  /\belectrical\b/i,
  /\bpropulsion\b/i,
  /\baerostructur/i,
  /\baircraft\b/i,
  /\bbattery\b/i,
  /\bmotor design\b/i,
  /\btool design\b/i,
  /\bactuation\b/i,
  /\belectromechanical\b/i,
  /\bprogrammer\b/i,
  /\bsoftware engineer\b/i,
  /\bfront-?end engineer\b/i,
  /\bbackend engineer\b/i,
  /\bfull[- ]stack engineer\b/i,
];

/**
 * Jobs in another function that mention design only as the team they support,
 * e.g. "Staff Technical Recruiter, Design", "Account Executive, Design Tools" or
 * "People Partner - Engineering, Product, Design".
 * A title that also says "designer" is still kept.
 */
const OTHER_FUNCTION =
  /\b(recruiter|recruiting|recruitment|sourcer|talent acquisition|talent partner|people partner|people business partner|people operations|people ops|hrbp|hr|human resources|account executive|account manager|sales|business development|customer success|paralegal|counsel|attorney|accountant)\b/i;

const ENGINEERING_NOISE =
  /\b(software|backend|frontend|full[\s-]?stack|data|machine learning|security|infra|infrastructure|platform|ios|android|devops|site reliability|firmware|embedded)\b/i;

/**
 * Keep product, UX, visual, brand, research, content, motion, design engineering,
 * and design leadership. Drop mechanical, chip, hardware, and circuit design.
 */
export function isDesignRole(title: string): boolean {
  const normalized = title.toLowerCase().replace(/[/|_]+/g, " ");
  if (EXCLUDE.some((pattern) => pattern.test(normalized))) return false;
  if (OTHER_FUNCTION.test(normalized) && !/\bdesigner\b/i.test(normalized)) return false;
  if (ENGINEERING_NOISE.test(normalized) && !/\b(designer|design engineer|ux|ui)\b/i.test(normalized)) {
    return false;
  }
  const productDesignEngineer = /\bdesign engineer\b/i.test(normalized) && !/\b(rf|electrical|propulsion|mechanical|hardware|circuit)\b/i.test(normalized);
  if (/\b(engineer|programmer)\b/i.test(normalized) && !/\bdesigner\b/i.test(normalized) && !productDesignEngineer) {
    return false;
  }

  const included =
    /\bdesigner\b/i.test(normalized) ||
    /\bdesign\b/i.test(normalized) ||
    /\bux\b/i.test(normalized) ||
    /\bui\b/i.test(normalized) ||
    /\buser experience\b/i.test(normalized) ||
    /\buser interface\b/i.test(normalized) ||
    /\buser research/i.test(normalized) ||
    /\bux writer\b/i.test(normalized) ||
    /\bcontent design/i.test(normalized) ||
    /\bcreative director\b/i.test(normalized) ||
    /\bart director\b/i.test(normalized) ||
    /\bresearcher\b/i.test(normalized);

  if (!included) return false;
  if (/\bresearcher\b/i.test(normalized) && !/\b(ux|user|design)\b/i.test(normalized)) return false;
  return true;
}
