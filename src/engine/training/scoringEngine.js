// Scoring rules for training scenarios

export const XP_PER_CORRECT = 10;

export function scoreChoice(choice) {
  return choice.correct ? XP_PER_CORRECT : 0;
}

export function scoreRun(choices) {
  const correct = choices.filter((c) => c.correct).length;

  return {
    total: choices.length,
    correct,
    xp: correct * XP_PER_CORRECT,
    percent: choices.length
      ? Math.round((correct / choices.length) * 100)
      : 0,
  };
}

export function grade(percent) {
  if (percent === 100) return "Rights Defender";
  if (percent >= 75) return "Well Prepared";
  if (percent >= 50) return "Getting There";
  return "Keep Training";
}
