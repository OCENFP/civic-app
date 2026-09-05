import { trackEvent } from "./analytics";
import { loadProgress, saveProgress } from "./storage";
import { emitProgressChange } from "./useProgress";
import { authHeaders } from "../lib/auth";

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

  // 🔥 SEND TO DATABASE (fire-and-forget; identity travels via auth token)
  if (user) {
    authHeaders()
      .then((headers) =>
        fetch("/api/progress", {
          method: "POST",
          headers,
          body: JSON.stringify({ xp: progress.xp, streak: progress.streak }),
        })
      )
      .catch(() => {});
  }

  return progress;
}
