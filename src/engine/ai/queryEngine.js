export function findBestMatch(question, scripts) {
  const q = question.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const key in scripts) {
    const item = scripts[key];
    let score = 0;

    for (const keyword of item.keywords) {
      if (q.includes(keyword)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestMatch;
}