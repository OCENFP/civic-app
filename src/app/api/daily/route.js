import scenarios from "../../../data/scenarios.json";

// Rotate through the real training scenarios so the dashboard's
// "Start Training" always has a matching exercise.
export async function GET() {
  const challenges = scenarios.map((s) => ({
    scenarioId: s.id,
    title: s.title,
    challenge: s.description,
  }));

  const today = new Date().getDate();
  const pick = challenges[today % challenges.length];

  return Response.json(pick);
}
