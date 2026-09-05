import stateLaws from "../../../data/stateLaws.json";
import { apiError, withErrorHandling } from "../../../lib/errorHandler";

// GET /api/laws          → all states
// GET /api/laws?state=california → one state
export const GET = withErrorHandling(async (req) => {
  const state = new URL(req.url).searchParams.get("state");

  if (!state) return Response.json(stateLaws);

  const key = state.toLowerCase();

  // own-property check so lookups like "constructor" can't hit the prototype chain
  if (!Object.prototype.hasOwnProperty.call(stateLaws, key)) {
    return apiError(`No laws found for state: ${state}`, 404);
  }

  return Response.json({ state: key, laws: stateLaws[key] });
});
