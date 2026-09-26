import { companies } from "../data/companies";

type Result = { name: string; ats: string; token: string; ok: boolean; count?: number; error?: string };

async function check(company: (typeof companies)[number]): Promise<Result> {
  const url =
    company.ats === "greenhouse"
      ? `https://boards-api.greenhouse.io/v1/boards/${company.token}/jobs`
      : company.ats === "ashby"
        ? `https://api.ashbyhq.com/posting-api/job-board/${company.token}`
        : `https://api.lever.co/v0/postings/${company.token}?mode=json`;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) return { name: company.name, ats: company.ats, token: company.token, ok: false, error: String(response.status) };
    const data = (await response.json()) as { jobs?: unknown[] } | unknown[];
    const count = Array.isArray(data) ? data.length : Array.isArray(data.jobs) ? data.jobs.length : 0;
    return { name: company.name, ats: company.ats, token: company.token, ok: count > 0, count };
  } catch (error) {
    return {
      name: company.name,
      ats: company.ats,
      token: company.token,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const results: Result[] = [];
  for (const company of companies) results.push(await check(company));
  const bad = results.filter((result) => !result.ok);
  console.log(`Verified ${results.length - bad.length} of ${results.length} companies.`);
  if (bad.length) {
    console.log(JSON.stringify(bad, null, 2));
    process.exitCode = 1;
  }
}

main();
