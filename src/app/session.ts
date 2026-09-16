// Session state: a four-view state machine plus the answer store.
//
// Solid 2.x notes:
//   - draft-first store updates (setAnswers(draft => ...)), snapshot() to serialize
//   - derived values are memos; nothing writes state from inside a tracked scope
//   - persistence is the one effect, split into compute/apply

import { createEffect, createMemo, createSignal, createStore } from "solid-js";
import { BANK_VERSION, ITEMS, ITEMS_BY_ID, PAGES, TOTAL_ITEMS, type ItemId } from "../data/bank";
import { safetyTriggered, scoreSession, type AnswerValue, type Answers } from "../lib/scoring";
import { clearDraft, loadDraft, recordFeedback, saveDraft } from "../lib/storage";

export type View = "intro" | "items" | "results";

/** Median seconds per item, used for an honest time estimate. */
const SECONDS_PER_ITEM = 6;

export function createSession() {
  const [view, setView] = createSignal<View>("intro");
  const [page, setPage] = createSignal(0);
  const [answers, setAnswers] = createStore<Answers>({});
  const [safetyPrompt, setSafetyPrompt] = createSignal<string | null>(null);
  /**
   * Which items have been flagged as unclear.
   *
   * This lives in the session rather than inside the item card because
   * <For keyed={false}> reuses components across pages: local state in a card
   * would stay behind and mark a different question on the next page.
   */
  const [flagged, setFlagged] = createStore<Partial<Record<ItemId, true>>>({});
  const [resumed, setResumed] = createSignal(false);

  /**
   * A plain copy of the answers, built by reading each item id individually.
   *
   * `snapshot()` does NOT track — using it inside a memo produces a value that
   * never updates. Reading properties one by one is what registers the
   * dependencies, so anything derived from answers must go through this.
   */
  function plainAnswers(): Answers {
    const out: Answers = {};
    for (const item of ITEMS) {
      const value = answers[item.id];
      if (value !== undefined) out[item.id] = value;
    }
    return out;
  }

  // ── derived ──────────────────────────────────────────────────────────────
  const currentItems = createMemo(() => PAGES[page()].map(id => ITEMS_BY_ID[id]));

  const answeredCount = createMemo(
    () => Object.values(plainAnswers()).filter(v => v !== null).length
  );

  const pageComplete = createMemo(() =>
    PAGES[page()].every(id => {
      const v = answers[id];
      return v !== null && v !== undefined;
    })
  );

  const remainingSeconds = createMemo(() => (TOTAL_ITEMS - answeredCount()) * SECONDS_PER_ITEM);

  /** Every question answered — a saved run that can be shown again. */
  const complete = createMemo(() => answeredCount() >= TOTAL_ITEMS);

  const result = createMemo(() => scoreSession(plainAnswers()));

  const isLastPage = createMemo(() => page() === PAGES.length - 1);

  // ── actions (writes live here, never in a tracked scope) ─────────────────
  function answer(itemId: ItemId, value: AnswerValue) {
    setAnswers(draft => {
      draft[itemId] = value;
    });
    const resourceSet = safetyTriggered(itemId, value);
    if (resourceSet) setSafetyPrompt(resourceSet);
  }

  function dismissSafety() {
    setSafetyPrompt(null);
  }

  function start(fresh = false) {
    if (fresh) {
      setAnswers(() => ({}));
      setFlagged(() => ({}));
      setPage(0);
      clearDraft();
    }
    setView("items");
  }

  /** Jump straight to the results of a finished run, without re-answering. */
  function showResults() {
    setView("results");
  }

  function next() {
    if (isLastPage()) {
      setView("results");
      return;
    }
    setPage(p => p + 1);
  }

  function back() {
    if (page() === 0) {
      setView("intro");
      return;
    }
    setPage(p => p - 1);
  }

  function restart() {
    setAnswers(() => ({}));
    setFlagged(() => ({}));
    setPage(0);
    setSafetyPrompt(null);
    clearDraft();
    setView("intro");
  }

  function flagItem(itemId: ItemId, note?: string) {
    setFlagged(draft => {
      draft[itemId] = true;
    });
    recordFeedback({ itemId, note, at: Date.now() });
  }

  /** Called once the view has settled; restores a draft if one matches. */
  function restore() {
    const draft = loadDraft(BANK_VERSION);
    if (!draft || Object.keys(draft.answers).length === 0) return;
    setAnswers(() => ({ ...draft.answers }));
    setPage(Math.min(draft.page, PAGES.length - 1));
    setResumed(true);
  }

  // ── persistence: compute tracks, apply writes ────────────────────────────
  createEffect(
    () => ({ answers: plainAnswers(), page: page(), view: view() }),
    state => {
      if (state.view === "intro" && Object.keys(state.answers).length === 0) return;
      saveDraft({
        bankVersion: BANK_VERSION,
        savedAt: Date.now(),
        page: state.page,
        answers: state.answers
      });
    }
  );

  return {
    // reads
    view,
    page,
    answers,
    flagged,
    currentItems,
    answeredCount,
    pageComplete,
    remainingSeconds,
    complete,
    result,
    isLastPage,
    safetyPrompt,
    resumed,
    totalPages: PAGES.length,
    // writes
    answer,
    start,
    showResults,
    next,
    back,
    restart,
    restore,
    flagItem,
    dismissSafety
  };
}

export type Session = ReturnType<typeof createSession>;
