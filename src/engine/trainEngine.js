import { trackEvent } from "./analytics";
import { loadProgress, saveProgress } from "./storage";
import { emitProgressChange } from "./useProgress";

export function updateProgress({ correct, user }) {
  const progress = loadProgress();

  if (correct) {
    progress.xp += 10;
    progress.streak += 1;
  } else {
    progress.streak = 0;
  }

  progress.lastActive = new Date().toDateString();

  saveProgress(progress);
  emitProgressChange();

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
