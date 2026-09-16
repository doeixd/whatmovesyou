/**
 * @vitest-environment jsdom
 *
 * Reactivity tests for the session.
 *
 * These run under jsdom rather than node: in a node environment solid-js
 * resolves to its server build, where signals deliberately do not react, and
 * every one of these tests fails for the wrong reason.
 *
 * These exist because of a real bug: `snapshot()` does not track, so deriving
 * scores from `snapshot(answers)` inside a memo produced a value that never
 * updated — every scale reported "not enough answers" no matter what the user
 * answered. Type-checking and the scoring unit tests both passed. Only opening
 * the page revealed it, so it gets a test.
 */
import { createRoot, flush } from "solid-js";
import { describe, expect, it } from "vitest";
import { ITEMS, PAGES } from "../data/bank";
import { createSession } from "./session";

const driveItems = ITEMS.filter(i => i.scaleId === "a1_drive");

/**
 * Creates the session inside a root, then runs the test body *outside* it.
 *
 * Solid 2.x rejects writes from inside an owned scope, and the test body is
 * standing in for event handlers — which always run outside one. Calling
 * actions within the createRoot callback fails with REACTIVE_WRITE_IN_OWNED_SCOPE
 * and tests nothing the app actually does.
 */
function withSession<T>(fn: (s: ReturnType<typeof createSession>) => T): T {
  let dispose!: () => void;
  const session = createRoot(d => {
    dispose = d;
    return createSession();
  });
  try {
    return fn(session);
  } finally {
    dispose();
  }
}

describe("session reactivity", () => {
  it("updates derived scores when an answer changes", () => {
    withSession(session => {
      expect(session.result().scales.every(s => !s.reportable)).toBe(true);

      for (const item of driveItems) {
        session.answer(item.id, item.keyed === "+" ? 5 : 1);
      }
      flush();

      const drive = session.result().scales.find(s => s.scaleId === "a1_drive")!;
      expect(drive.reportable).toBe(true);
      expect(drive.answered).toBe(driveItems.length);
      expect(drive.mean).toBe(5);
    });
  });

  it("counts answers as they arrive", () => {
    withSession(session => {
      expect(session.answeredCount()).toBe(0);
      session.answer(driveItems[0].id, 4);
      flush();
      expect(session.answeredCount()).toBe(1);
      session.answer(driveItems[1].id, 2);
      flush();
      expect(session.answeredCount()).toBe(2);
    });
  });

  it("shrinks the time estimate as answers arrive", () => {
    withSession(session => {
      const before = session.remainingSeconds();
      session.answer(driveItems[0].id, 3);
      flush();
      expect(session.remainingSeconds()).toBeLessThan(before);
    });
  });

  it("only allows continuing once every item on the page is answered", () => {
    withSession(session => {
      session.start();
      flush();
      expect(session.pageComplete()).toBe(false);

      const firstPage = PAGES[0];
      for (const id of firstPage.slice(0, -1)) session.answer(id, 3);
      flush();
      expect(session.pageComplete()).toBe(false);

      session.answer(firstPage[firstPage.length - 1], 3);
      flush();
      expect(session.pageComplete()).toBe(true);
    });
  });

  it("raises the safety prompt the moment the risk item is answered", () => {
    withSession(session => {
      const risk = ITEMS.find(i => i.safety)!;
      expect(session.safetyPrompt()).toBeNull();

      session.answer(risk.id, 0);
      flush();
      expect(session.safetyPrompt()).toBeNull();

      session.answer(risk.id, risk.safety!.atOrAbove);
      flush();
      expect(session.safetyPrompt()).toBe("crisis.suicide");
    });
  });

  it("moves through pages and lands on results at the end", () => {
    withSession(session => {
      session.start();
      flush();
      expect(session.view()).toBe("items");

      for (let i = 0; i < PAGES.length - 1; i++) session.next();
      flush();
      expect(session.isLastPage()).toBe(true);

      session.next();
      flush();
      expect(session.view()).toBe("results");
    });
  });

  it("clears everything on restart", () => {
    withSession(session => {
      session.answer(driveItems[0].id, 5);
      session.start();
      session.next();
      flush();

      session.restart();
      flush();
      expect(session.view()).toBe("intro");
      expect(session.page()).toBe(0);
      expect(session.answeredCount()).toBe(0);
    });
  });
});
