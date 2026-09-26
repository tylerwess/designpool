export type PostgresSsl = false | "require";

export type PostgresClientOptions = {
  url: string;
  ssl: PostgresSsl;
};

function hostnameOf(raw: string): string {
  try {
    return new URL(raw).hostname;
  } catch {
    return "";
  }
}

function sslmodeOf(raw: string): string {
  try {
    return (new URL(raw).searchParams.get("sslmode") ?? "").toLowerCase();
  } catch {
    const match = raw.match(/[?&]sslmode=([^&]*)/i);
    return (match?.[1] ?? "").toLowerCase();
  }
}

function withoutClientOnlyParams(raw: string): string {
  try {
    const parsed = new URL(raw);
    parsed.searchParams.delete("channel_binding");
    return parsed.toString();
  } catch {
    return raw.replace(/([?&])channel_binding=[^&]*&?/gi, "$1").replace(/[?&]$/, "");
  }
}

function isLocalHost(host: string, raw: string): boolean {
  if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]") return true;
  return host === "" && /localhost|127\.0\.0\.1|\[::1\]/.test(raw);
}

/** TLS for postgres.js. Remote URLs always require TLS. */
export function postgresClientOptions(raw: string): PostgresClientOptions {
  const url = raw.trim();
  const host = hostnameOf(url);
  const local = isLocalHost(host, url);
  const ssl: PostgresSsl = local || sslmodeOf(url) === "disable" ? false : "require";
  return { url: withoutClientOnlyParams(url), ssl };
}
