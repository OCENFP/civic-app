import { trackEvent } from "./analytics";
import { loadProgress, saveProgress, updateStreak } from "./storage";

export function updateProgress({ correct, user }) {
  const progress = updateStreak(loadProgress());

  if (correct) {
    progress.xp += 10;
  }

  saveProgress(progress);

  trackEvent("progress_update", { xp: progress.xp, streak: progress.streak });

  // 🔥 SEND TO DATABASE
  fetch("/api/progress", {
    method: "POST",
    body: JSON.stringify({
      userId: user?.id,
      xp: progress.xp,
      streak: progress.streak,
    }),
  });

  return progress;
}
