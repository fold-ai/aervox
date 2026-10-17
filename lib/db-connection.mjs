/** Remote database connections must validate TLS, even if a URL disables it. */
export function databaseConnectionOptions(connectionString, ca) {
  const parsed = new URL(connectionString);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  if (!local) {
    for (const key of [...parsed.searchParams.keys()]) {
      if (key.toLowerCase().startsWith("ssl") || key === "uselibpqcompat") parsed.searchParams.delete(key);
    }
  }
  return {
    connectionString: parsed.toString(),
    ssl: local ? undefined : { rejectUnauthorized: true, ...(ca ? { ca } : {}) },
  };
}
