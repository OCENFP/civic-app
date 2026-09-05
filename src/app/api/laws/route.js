import stateLaws from "../../../data/stateLaws.json";
import { apiError, withErrorHandling } from "../../../lib/errorHandler";

// GET /api/laws          → all states
// GET /api/laws?state=california → one state
export const GET = withErrorHandling(async (req) => {
  const state = new URL(req.url).searchParams.get("state");

  if (!state) return Response.json(stateLaws);

  const laws = stateLaws[state.toLowerCase()];

  if (!laws) return apiError(`No laws found for state: ${state}`, 404);

  return Response.json({ state: state.toLowerCase(), laws });
});
