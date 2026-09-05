export function handleError(err, status = 500) {
  console.error(err);
  return Response.json(
    { error: err?.message || "Internal server error" },
    { status }
  );
}
