import { openai } from "../../../lib/openai";
import { supabase } from "../../../lib/supabase";
import data from "../../../data/constitution.json";

// Simple keyword search (we will upgrade to embeddings next)
function simpleSearch(query) {
  return data.filter((item) =>
    item.tags.some((tag) =>
      query.toLowerCase().includes(tag.toLowerCase())
    )
  );
}

export async function POST(req) {
  try {
    const { question, userId } = await req.json();

    if (!question) {
      return Response.json({ error: "No question provided" }, { status: 400 });
    }

    // Step 1: Find relevant legal context
    const relevant = simpleSearch(question);

    const context = relevant.length
      ? relevant.map((r) => `${r.title}: ${r.text}`).join("\n\n")
      : "No direct match found in legal database.";

    // Step 2: AI Response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a civic legal assistant.

ONLY use the legal context below if relevant.

${context}

Respond in this structure:

1. Simple Explanation
2. Real-Life Example
3. What You Should Do
4. What You Can Say (short phrase)

If unsure, say "I don't know".
          `,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = completion.choices[0].message.content;

    // Step 3: Save to Supabase (ONLY if userId exists)
    if (userId) {
      await supabase.from("history").insert({
        user_id: userId,
        question,
        answer,
      });
    }

    return Response.json({
      answer,
      sources: relevant.map((r) => r.title),
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}