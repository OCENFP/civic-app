"""Minimal in-memory sliding-window rate limiter.

Per-process only (resets on restart) -- a stopgap against anonymous
cost abuse of AI-spending endpoints, not a substitute for real quotas.
"""

import time

_buckets: dict[str, list[float]] = {}


def is_rate_limited(client_ip: str, limit: int = 10, window_seconds: int = 60) -> bool:
    now = time.monotonic()
    hits = [t for t in _buckets.get(client_ip, []) if now - t < window_seconds]

    if len(hits) >= limit:
        _buckets[client_ip] = hits
        return True

    hits.append(now)
    _buckets[client_ip] = hits

    if len(_buckets) > 10_000:
        _buckets.clear()

    return False
