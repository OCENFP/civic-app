import laws from "../../../data/stateLaws.json";
import { handleError } from "../../../lib/errorHandler";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");

    if (!state) {
      return Response.json({ states: Object.keys(laws) });
    }

    const law = laws[state.toLowerCase()];

    if (!law) {
      return Response.json({ error: `No data for state: ${state}` }, { status: 404 });
    }

    return Response.json({ state: state.toLowerCase(), law });
  } catch (err) {
    return handleError(err);
  }
}
