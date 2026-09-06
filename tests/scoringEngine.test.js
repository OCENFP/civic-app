import { describe, it, expect } from "vitest";
import {
  XP_PER_CORRECT,
  scoreChoice,
  scoreRun,
  grade,
} from "../src/engine/training/scoringEngine";

describe("scoreChoice", () => {
  it("awards XP for a correct choice", () => {
    expect(scoreChoice({ correct: true })).toBe(XP_PER_CORRECT);
  });
  it("awards nothing for an incorrect choice", () => {
    expect(scoreChoice({ correct: false })).toBe(0);
  });
});

describe("scoreRun", () => {
  it("summarizes a mixed run", () => {
    const result = scoreRun([
      { correct: true },
      { correct: false },
      { correct: true },
      { correct: true },
    ]);
    expect(result).toEqual({
      total: 4,
      correct: 3,
      xp: 3 * XP_PER_CORRECT,
      percent: 75,
    });
  });

  it("handles an empty run without dividing by zero", () => {
    expect(scoreRun([])).toEqual({ total: 0, correct: 0, xp: 0, percent: 0 });
  });
});

describe("grade", () => {
  it("maps percentages to labels", () => {
    expect(grade(100)).toBe("Rights Defender");
    expect(grade(75)).toBe("Well Prepared");
    expect(grade(50)).toBe("Getting There");
    expect(grade(10)).toBe("Keep Training");
  });
});
