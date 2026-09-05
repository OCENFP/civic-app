import { getEmbedding } from "../../../lib/embeddings";
import { handleError } from "../../../lib/errorHandler";

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    const embedding = await getEmbedding(text);

    return Response.json({ embedding });
  } catch (err) {
    return handleError(err);
  }
}
