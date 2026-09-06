"use client";

import { useSyncExternalStore } from "react";
import { loadProgress } from "./storage";

const SERVER_SNAPSHOT = { xp: 0, level: 1, streak: 0, lastActive: null };

let snapshot = null;
const listeners = new Set();

function subscribe(callback) {
  listeners.add(callback);
  const onStorage = () => emitProgressChange();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  if (snapshot === null) snapshot = loadProgress();
  return snapshot;
}

export function emitProgressChange() {
  snapshot = null;
  listeners.forEach((l) => l());
}

export function useProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}
