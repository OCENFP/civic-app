// Client-side coach: sends the user's spoken/typed response to the AI
// and returns short coaching feedback.

export async function coach(input) {
  const res = await fetch("/api/voice", {
    method: "POST",
    body: JSON.stringify({
      input: `You are a rights-training coach. The user said: "${input}". In 2 sentences, tell them if this protects their rights and what to say instead if not.`,
    }),
  });

  const data = await res.json();
  return data.reply || data.error || "No feedback available.";
}
