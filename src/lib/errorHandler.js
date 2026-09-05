// Shared error helpers for API routes

export function apiError(message, status = 500) {
  return Response.json({ error: message }, { status });
}

// Wrap a route handler so thrown errors become clean JSON responses
export function withErrorHandling(handler) {
  return async function (req, ctx) {
    try {
      return await handler(req, ctx);
    } catch (err) {
      console.error(err);
      return apiError(err.message || "Internal server error", 500);
    }
  };
}
