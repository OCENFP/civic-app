import { shareResult } from "../share";
import { generateShare } from "./growthEngine";
import { trackEvent } from "../analytics";

// Share a training result and track the share event
export function shareTrainingResult({ xp, streak, grade }) {
  const text = generateShare(
    `I hit ${xp} XP with a ${streak}-day streak (${grade}) training my rights.`
  );

  shareResult(text);
  trackEvent("share", { xp, streak, grade });
}
