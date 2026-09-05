// Shared error helpers for API routes

export function apiError(message, status = 500) {
  return Response.json({ error: message }, { status });
}

// Wrap a route handler so thrown errors become clean JSON responses.
// Malformed request JSON is the client's fault (400); anything else is
// logged server-side and reported generically so internals never leak.
export function withErrorHandling(handler) {
  return async function (req, ctx) {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof SyntaxError) {
        return apiError("Invalid JSON body", 400);
      }
      console.error(err);
      return apiError("Internal server error", 500);
    }
  };
}
