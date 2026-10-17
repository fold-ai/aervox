import test from "node:test";
import assert from "node:assert/strict";
import { safeNextPath, isSameOriginRequest } from "../lib/auth/request.mjs";

test("sign-in redirects remain on this site", () => {
  for (const input of ["//attacker.example", "/\\attacker.example", "https://attacker.example", "javascript:alert(1)", "/\n/attacker.example", "///attacker.example", "/\t/attacker.example", undefined]) {
    assert.equal(safeNextPath(input), "/admin-pro");
  }
  assert.equal(safeNextPath("/admin-pro/runs?id=12#details"), "/admin-pro/runs?id=12#details");
  assert.equal(safeNextPath("/admin-pro/../contact"), "/contact");
});

test("auth mutations require a matching origin and reject cross-site requests", () => {
  const request = (origin, site) => new Request("https://www.actprove.com/auth/login", { headers: { ...(origin ? { origin } : {}), ...(site ? { "sec-fetch-site": site } : {}) } });
  assert.equal(isSameOriginRequest(request("https://www.actprove.com", "same-origin")), true);
  assert.equal(isSameOriginRequest(request("https://www.actprove.com")), true);
  for (const [origin, site] of [["https://attacker.example", "cross-site"], [null, null], ["null", null], ["http://www.actprove.com", null], ["https://www.actprove.com", "same-site"]]) {
    assert.equal(isSameOriginRequest(request(origin, site)), false);
  }
});

test("remote database TLS cannot be disabled through URL options", async () => {
  const { databaseConnectionOptions } = await import("../lib/db-connection.mjs");
  for (const host of ["db.example.com", "localhost.attacker.example"]) {
    const config = databaseConnectionOptions(`postgres://user:synthetic@${host}/db?sslmode=disable&ssl=false&sslrootcert=untrusted&uselibpqcompat=true&application_name=actprove`, "synthetic-ca");
    const url = new URL(config.connectionString);
    assert.equal(url.searchParams.get("sslmode"), null);
    assert.equal(url.searchParams.get("ssl"), null);
    assert.equal(url.searchParams.get("application_name"), "actprove");
    assert.deepEqual(config.ssl, { rejectUnauthorized: true, ca: "synthetic-ca" });
  }
  assert.equal(databaseConnectionOptions("postgres://localhost/db").ssl, undefined);
});

test("same-origin checks use the actual request Host when Next normalizes localhost", () => {
  const headers = { host: "127.0.0.1:3021", origin: "http://127.0.0.1:3021" };
  assert.equal(isSameOriginRequest(new Request("http://localhost:3021/auth/login", { headers })), true);
  assert.equal(isSameOriginRequest(new Request("http://localhost:3021/auth/login", { headers: { ...headers, origin: "http://attacker.example" } })), false);
});
