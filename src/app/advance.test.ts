/**
 * The scroll rule after answering a question.
 *
 * Pure logic, so it runs in the node environment. That matters here: the rule is
 * mostly about when *not* to move the view, and getting that wrong is invisible
 * in a build log, in the type-checker, and to every other test.
 */
import { describe, expect, it } from "vitest";
import { ITEMS_BY_ID, PAGES } from "../data/bank";
import type { ItemId } from "../data/bank";
import type { AnswerValue } from "../lib/scoring";
import { advanceAfter } from "./advance";

/** A real page's six questions, so the ids are the ones the app actually uses. */
const page = PAGES[0].map(id => ITEMS_BY_ID[id]);
const [q1, q2, q3, q4, q5, q6] = PAGES[0];

/** `answered(q2, q3)` — the answers already recorded on this page. */
function answered(...ids: ItemId[]): Partial<Record<ItemId, AnswerValue>> {
  const all: Partial<Record<ItemId, AnswerValue>> = {};
  for (const id of ids) all[id] = 0;
  return all;
}

describe("advanceAfter", () => {
  it("steps to the next question when it is still waiting", () => {
    expect(advanceAfter(q1, page, {})).toEqual({ kind: "item", id: q2 });
  });

  it("stays put when the question after this one is already answered", () => {
    expect(advanceAfter(q1, page, answered(q2))).toEqual({ kind: "none" });
  });

  it("stays put when the next is answered and a later one is not", () => {
    // The reader is working through the page in their own order. q3-q5 are
    // still open, but none of them is the step after the one just answered.
    expect(advanceAfter(q1, page, answered(q2, q6))).toEqual({ kind: "none" });
  });

  it("goes to the Continue button when this was the last question left", () => {
    expect(advanceAfter(q1, page, answered(q2, q3, q4, q5, q6))).toEqual({ kind: "nav" });
  });

  it("goes to the Continue button when the last question left is mid-page", () => {
    expect(advanceAfter(q4, page, answered(q1, q2, q3, q5, q6))).toEqual({ kind: "nav" });
  });

  it("stays put when answering the final question while others remain", () => {
    // Nothing follows q6 and the page is not finished — the reader is already
    // at the bottom.
    expect(advanceAfter(q6, page, {})).toEqual({ kind: "none" });
  });

  it("goes to the Continue button for the final question of the page", () => {
    expect(advanceAfter(q6, page, answered(q1, q2, q3, q4, q5))).toEqual({ kind: "nav" });
  });

  it("counts 'not applicable' as an answer", () => {
    const na: Partial<Record<ItemId, AnswerValue>> = { [q2]: "na" };
    expect(advanceAfter(q1, page, na)).toEqual({ kind: "none" });
  });

  it("does not depend on the answer store having recorded this answer yet", () => {
    // Every case above omits the question being answered from the answers map:
    // the rule is told what was just answered rather than reading it back, so it
    // cannot race the store. Here that is the difference between reaching the
    // Continue button and stopping short of it.
    expect(advanceAfter(q2, page, answered(q1, q3, q4, q5, q6))).toEqual({ kind: "nav" });
  });
});
