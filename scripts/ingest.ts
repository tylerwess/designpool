import { runIngest } from "../lib/ingest";

async function main() {
  const result = await runIngest();
  console.log(JSON.stringify(result, null, 2));
  if (result.succeeded === 0) process.exitCode = 1;
}

main();
