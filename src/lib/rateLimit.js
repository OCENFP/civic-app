// Minimal in-memory sliding-window rate limiter for AI-spending routes.
// Per-instance only (resets on deploy/restart) — a stopgap against
// anonymous cost-abuse, not a substitute for real quotas.
const buckets = new Map();

export function rateLimit(req, { limit = 10, windowMs = 60_000 } = {}) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const hits = (buckets.get(ip) || []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    buckets.set(ip, hits);
    return Response.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429 }
    );
  }

  hits.push(now);
  buckets.set(ip, hits);

  if (buckets.size > 10_000) buckets.clear();

  return null;
}
