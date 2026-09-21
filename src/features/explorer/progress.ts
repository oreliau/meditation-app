import { createMMKV } from "react-native-mmkv";
import { isStorageAvailable } from "@/storage";
import { getProgram } from "./programs";

export const explorerStorage = createMMKV({ id: "aura-explorer" });
const COMPLETED_KEY = "completedSessionIds";
const progressListeners = new Set<() => void>();

export function subscribeToProgress(listener: () => void): () => void {
  progressListeners.add(listener);
  return () => progressListeners.delete(listener);
}

function notifyProgressChanged(): void {
  for (const listener of progressListeners) listener();
}

type ProgressData = Record<string, readonly string[]>;

function read(): ProgressData {
  const raw = explorerStorage.getString(COMPLETED_KEY);
  if (!raw) return {};

  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return {};
    return Object.fromEntries(
      Object.entries(value).filter(
        ([, sessions]) =>
          Array.isArray(sessions) &&
          sessions.every((session) => typeof session === "string"),
      ),
    ) as ProgressData;
  } catch {
    return {};
  }
}

function write(data: ProgressData): void {
  explorerStorage.set(COMPLETED_KEY, JSON.stringify(data));
}

export function getCompletedSessionIds(programId: string): readonly string[] {
  if (!isStorageAvailable()) return [];
  return read()[programId] ?? [];
}

export function isSessionCompleted(
  programId: string,
  sessionId: string,
): boolean {
  return getCompletedSessionIds(programId).includes(sessionId);
}

export function markSessionCompleted(
  programId: string,
  sessionId: string,
): void {
  if (!isStorageAvailable()) return;
  const program = getProgram(programId);
  if (!program?.sessions.some((session) => session.id === sessionId)) return;

  const data = read();
  const completed = new Set(data[programId] ?? []);
  completed.add(sessionId);
  write({ ...data, [programId]: [...completed] });
  notifyProgressChanged();
}

export function resetProgramProgress(programId: string): void {
  if (!isStorageAvailable()) return;
  const data = read();
  write({ ...data, [programId]: [] });
  notifyProgressChanged();
}

export function getProgramProgress(programId: string): {
  completed: number;
  total: number;
  isComplete: boolean;
} {
  const total = getProgram(programId)?.sessions.length ?? 0;
  const completed = getCompletedSessionIds(programId).length;
  return { completed, total, isComplete: total > 0 && completed >= total };
}
