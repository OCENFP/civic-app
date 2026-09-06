import laws from "../../../data/stateLaws.json";
import california from "../../../data/states/california.json";
import { handleError } from "../../../lib/errorHandler";

// Per-state detail files enrich the base stateLaws entries.
const stateDetails = { california };

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");

    if (!state) {
      return Response.json({ states: Object.keys(laws) });
    }

    const key = state.toLowerCase();
    const law = Object.hasOwn(laws, key) ? laws[key] : null;

    if (!law) {
      return Response.json({ error: `No data for state: ${state}` }, { status: 404 });
    }

    const details = Object.hasOwn(stateDetails, key) ? stateDetails[key] : null;

    return Response.json({
      state: key,
      law: details ? { ...law, ...details } : law,
    });
  } catch (err) {
    return handleError(err);
  }
}
