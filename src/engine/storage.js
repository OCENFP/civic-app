const DEFAULT_PROGRESS = { xp: 0, level: 1, streak: 0, lastActive: null };

export function loadProgress() {
  try {
    const data = localStorage.getItem("progress");
    if (!data) return { ...DEFAULT_PROGRESS };

    const parsed = JSON.parse(data);
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_PROGRESS };

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      xp: Number.isFinite(parsed.xp) ? parsed.xp : 0,
      streak: Number.isFinite(parsed.streak) ? parsed.streak : 0,
    };
  } catch {
    // Corrupt or inaccessible localStorage must never crash the app
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(data) {
  try {
    localStorage.setItem("progress", JSON.stringify(data));
  } catch {
    // Storage full or blocked — progress just stays in memory
  }
}

export function calculateLevel(xp) {
  return Math.floor(xp / 50) + 1;
}

export function updateStreak(progress) {
  const today = new Date().toDateString();

  if (progress.lastActive === today) return progress;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (progress.lastActive === yesterday.toDateString()) {
    progress.streak += 1;
  } else {
    progress.streak = 1;
  }

  progress.lastActive = today;
  return progress;
}
