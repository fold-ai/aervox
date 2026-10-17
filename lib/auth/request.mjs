/** Only allow browser mutations from this request's own origin. */
export function isSameOriginRequest(request) {
  const origin = request.headers.get("origin");
  const site = request.headers.get("sec-fetch-site");
  if (!origin || (site && site !== "same-origin")) return false;
  try {
    const target = new URL(request.url);
    // Next can normalize its internal URL to localhost; Host keeps the browser-facing authority.
    const host = request.headers.get("host");
    if (host) {
      const external = new URL(`${target.protocol}//${host}`);
      if (external.host !== host || external.username || external.password) return false;
      return new URL(origin).origin === external.origin;
    }
    return new URL(origin).origin === target.origin;
  }
  catch { return false; }
}

/** Prevent protocol-relative URLs, backslashes and control characters at sign-in. */
export function safeNextPath(value, fallback = "/admin-pro") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\x00-\x20\x7f]/.test(value)) return fallback;
  try {
    const base = "https://actprove.invalid";
    const parsed = new URL(value, base);
    return parsed.origin === base ? parsed.pathname + parsed.search + parsed.hash : fallback;
  } catch { return fallback; }
}
