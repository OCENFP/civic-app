import { describe, it, expect, beforeEach, vi } from "vitest";

// storage.js reads/writes localStorage; stub it before importing.
beforeEach(() => {
  const store = new Map();
  vi.stubGlobal("localStorage", {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  });
});

const load = async () => await import("../src/engine/storage.js");

describe("calculateLevel", () => {
  it("starts at level 1 and rises every 50 XP", async () => {
    const { calculateLevel } = await load();
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(49)).toBe(1);
    expect(calculateLevel(50)).toBe(2);
    expect(calculateLevel(120)).toBe(3);
  });
});

describe("loadProgress / saveProgress", () => {
  it("returns defaults when nothing is stored", async () => {
    const { loadProgress } = await load();
    expect(loadProgress()).toEqual({ xp: 0, level: 1, streak: 0, lastActive: null });
  });

  it("round-trips saved progress", async () => {
    const { loadProgress, saveProgress } = await load();
    saveProgress({ xp: 30, level: 1, streak: 3, lastActive: "x" });
    expect(loadProgress()).toEqual({ xp: 30, level: 1, streak: 3, lastActive: "x" });
  });
});

describe("updateStreak", () => {
  it("starts a streak at 1 on first activity", async () => {
    const { updateStreak } = await load();
    const p = updateStreak({ xp: 0, streak: 0, lastActive: null });
    expect(p.streak).toBe(1);
  });

  it("does not double-count the same day", async () => {
    const { updateStreak } = await load();
    const today = new Date().toDateString();
    const p = updateStreak({ xp: 0, streak: 5, lastActive: today });
    expect(p.streak).toBe(5);
  });
});
