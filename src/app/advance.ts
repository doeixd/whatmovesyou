// The scroll rule for the item screen.
//
// Its own module, not inline in ItemScreen.tsx, for two reasons: it is logic
// that deserves a test, and a .tsx module pulls Solid's JSX runtime — including
// the refresh transform — into anything that imports it, which the test runner
// cannot load.

import type { Item, ItemId } from "../data/bank";
import type { AnswerValue } from "../lib/scoring";

/** What the view should do once a freshly answered question has been recorded. */
export type Advance =
  | { readonly kind: "item"; readonly id: ItemId }
  | { readonly kind: "nav" }
  | { readonly kind: "none" };

/**
 * The scroll rule after a fresh answer.
 *
 * Step forward only when the question straight after this one is still waiting.
 * If that one has already been answered the reader is working through the page
 * in an order of their own, and pulling them forward past their place is worse
 * than leaving them where they are. The exception is the last question left on
 * the page: then the way out is the Continue button, so that is what comes into
 * view.
 *
 * Written so it does not depend on the answer store having recorded `answered`
 * yet — the question just answered counts as answered either way.
 */
export function advanceAfter(
  answered: ItemId,
  items: readonly Item[],
  answers: Partial<Record<ItemId, AnswerValue>>
): Advance {
  const done = (item: Item) => item.id === answered || answers[item.id] != null;
  if (items.every(done)) return { kind: "nav" };

  const next = items[items.findIndex(i => i.id === answered) + 1];
  return next && !done(next) ? { kind: "item", id: next.id } : { kind: "none" };
}
