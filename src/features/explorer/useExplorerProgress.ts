import { useSyncExternalStore } from "react";
import {
  getCompletedSessionIds,
  markSessionCompleted,
  subscribeToProgress,
} from "@/features/explorer";
import { getSessionStore } from "@/features/timer";

let version = 0;
const listeners = new Set<() => void>();

function notify(): void {
  version += 1;
  for (const listener of listeners) listener();
}

subscribeToProgress(notify);

let subscribed = false;
function ensureTimerSubscription(): void {
  if (subscribed) return;
  subscribed = true;
  getSessionStore().subscribeToCompletion((context) => {
    if (!context) return;
    markSessionCompleted(context.programId, context.sessionId);
  });
}

export function useExplorerProgress(programId?: string): readonly string[] {
  ensureTimerSubscription();
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () =>
      `${programId ?? "all"}:${version}:${programId ? getCompletedSessionIds(programId).join(",") : ""}`,
    () => `${programId ?? "all"}:server`,
  );
  return getCompletedSessionIds(programId ?? "");
}
