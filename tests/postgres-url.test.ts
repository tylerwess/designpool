import assert from "node:assert/strict";
import test from "node:test";
import { postgresClientOptions } from "../lib/postgres-url";

const neonUnpooled =
  "postgresql://neondb_owner:secret@ep-quiet-unit-123456.us-east-2.aws.neon.tech/neondb?sslmode=require";
const neonPooled =
  "postgresql://neondb_owner:secret@ep-quiet-unit-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

test("a Neon unpooled URL with sslmode=require uses TLS", () => {
  const options = postgresClientOptions(neonUnpooled);
  assert.equal(options.ssl, "require");
  assert.match(options.url, /sslmode=require/);
  assert.equal(options.url.includes("channel_binding"), false);
});

test("a Neon pooled URL with channel_binding uses TLS and drops that param", () => {
  const options = postgresClientOptions(neonPooled);
  assert.equal(options.ssl, "require");
  assert.match(options.url, /sslmode=require/);
  assert.equal(options.url.includes("channel_binding"), false);
  assert.match(options.url, /-pooler\./);
});

test("a remote URL without sslmode still uses TLS", () => {
  assert.equal(
    postgresClientOptions("postgres://user:pass@db.example.com:5432/app").ssl,
    "require",
  );
});

test("localhost and 127.0.0.1 disable TLS", () => {
  assert.equal(postgresClientOptions("postgres://user:pass@localhost:5432/app").ssl, false);
  assert.equal(postgresClientOptions("postgres://user:pass@127.0.0.1:5432/app").ssl, false);
  assert.equal(postgresClientOptions("postgres://user:pass@[::1]:5432/app").ssl, false);
});

test("sslmode=disable turns TLS off even on a remote host", () => {
  assert.equal(
    postgresClientOptions("postgres://user:pass@db.example.com/app?sslmode=disable").ssl,
    false,
  );
});
