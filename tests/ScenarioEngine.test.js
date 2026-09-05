import { describe, it, expect } from "vitest";
import ScenarioEngine from "../src/engine/ScenarioEngine";

const scenarios = [
  {
    id: "s1",
    correct_script: "I do not consent to a search.",
    choices: [
      { text: "Sure, go ahead", correct: false },
      { text: "I do not consent", correct: true },
    ],
  },
];

describe("ScenarioEngine", () => {
  it("finds a scenario by id", () => {
    const engine = new ScenarioEngine(scenarios);
    expect(engine.getScenario("s1").id).toBe("s1");
  });

  it("scores a correct answer and increments score", () => {
    const engine = new ScenarioEngine(scenarios);
    const res = engine.checkAnswer(scenarios[0], 1);
    expect(res.correct).toBe(true);
    expect(engine.score).toBe(1);
  });

  it("reports the correct script on a wrong answer and does not score", () => {
    const engine = new ScenarioEngine(scenarios);
    const res = engine.checkAnswer(scenarios[0], 0);
    expect(res.correct).toBe(false);
    expect(res.message).toContain("I do not consent to a search.");
    expect(engine.score).toBe(0);
  });
});
