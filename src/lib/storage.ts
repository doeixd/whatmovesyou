// Local persistence. No account, no server, no cookies.
//
// Every access is wrapped: private windows throw on localStorage, and resuming
// is a convenience — never a requirement for the test to work.

import type { Answers } from "./scoring";

const DRAFT_KEY = "braverman.draft.v1";
const FEEDBACK_KEY = "braverman.feedback.v1";

export interface Draft {
  readonly bankVersion: string;
  readonly savedAt: number;
  readonly page: number;
  readonly answers: Answers;
}

export interface ItemFeedback {
  readonly itemId: string;
  readonly note?: string;
  readonly at: number;
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private window, quota, or storage disabled — carry on without it */
  }
}

export function loadDraft(bankVersion: string): Draft | null {
  const draft = read<Draft>(DRAFT_KEY);
  if (!draft) return null;
  // A draft from a different item bank can't be scored against this one.
  if (draft.bankVersion !== bankVersion) return null;
  return draft;
}

export function saveDraft(draft: Draft): void {
  write(DRAFT_KEY, draft);
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* nothing to do */
  }
}

/**
 * Item feedback ("this question was confusing"). Stored locally until a
 * submission endpoint exists — see research/PLAN-07-no-budget.md §3, where this
 * is the free stand-in for the cognitive interviews we can't run.
 */
export function recordFeedback(entry: ItemFeedback): void {
  const all = read<ItemFeedback[]>(FEEDBACK_KEY) ?? [];
  write(FEEDBACK_KEY, [...all, entry]);
}

export function loadFeedback(): ItemFeedback[] {
  return read<ItemFeedback[]>(FEEDBACK_KEY) ?? [];
}

export function storageAvailable(): boolean {
  try {
    const probe = "__braverman_probe__";
    localStorage.setItem(probe, "1");
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}
