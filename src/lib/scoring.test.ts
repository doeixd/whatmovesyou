/**
 * @vitest-environment node
 *
 * Pure functions over data — no DOM needed, which is the point of keeping
 * src/lib free of Solid imports.
 */
import { describe, expect, it } from "vitest";
import { ITEMS, ITEMS_BY_ID, type ItemId } from "../data/bank";
import { itemScore, safetyTriggered, scoreSession, type Answers } from "./scoring";

const itemsOf = (scaleId: string) => ITEMS.filter(i => i.scaleId === scaleId);

/** Answer every item on a scale as if strongly at its high pole. */
function atPole(scaleId: string, pole: "high" | "low" | "mid"): Answers {
  const answers: Answers = {};
  for (const item of itemsOf(scaleId)) {
    if (pole === "mid") {
      answers[item.id] = 3;
    } else {
      const high = pole === "high";
      // Reverse-keyed items need the opposite raw response to reach the same pole.
      answers[item.id] = item.keyed === "+" ? (high ? 5 : 1) : high ? 1 : 5;
    }
  }
  return answers;
}

function allMid(): Answers {
  const answers: Answers = {};
  for (const item of ITEMS) {
    answers[item.id] = item.responseScaleId === "impair9" ? 0 : 3;
  }
  return answers;
}

describe("itemScore", () => {
  it("leaves positively keyed items alone", () => {
    const item = ITEMS.find(i => i.keyed === "+" && i.responseScaleId === "agree5")!;
    expect(itemScore(item, 5)).toBe(5);
    expect(itemScore(item, 1)).toBe(1);
  });

  it("flips reverse-keyed items about the midpoint", () => {
    const item = ITEMS.find(i => i.keyed === "-" && i.responseScaleId === "agree5")!;
    expect(itemScore(item, 5)).toBe(1);
    expect(itemScore(item, 1)).toBe(5);
    expect(itemScore(item, 3)).toBe(3);
  });
});

describe("scoreSession", () => {
  it("reports every non-internal scale and withholds internal ones", () => {
    const result = scoreSession(allMid());
    expect(result.scales.map(s => s.scaleId)).not.toContain("a6_unusual");
    expect(result.scales.map(s => s.scaleId)).not.toContain("a8_episodicity");
    expect(result.internal.map(s => s.scaleId)).toContain("a6_unusual");
    expect(result.internal.map(s => s.scaleId)).toContain("a8_episodicity");
  });

  it("calls a flat profile middle rather than inventing variation", () => {
    const result = scoreSession(allMid());
    for (const scale of result.scales) {
      expect(scale.band).toBe("middle");
    }
  });

  it("puts a scale answered at its high pole in a high band", () => {
    const answers = { ...allMid(), ...atPole("a1_drive", "high") };
    const result = scoreSession(answers);
    const drive = result.scales.find(s => s.scaleId === "a1_drive")!;
    expect(drive.mean).toBe(5);
    expect(drive.band).toBe("high");
  });

  it("puts a scale answered at its low pole in a low band", () => {
    const answers = { ...allMid(), ...atPole("a1_drive", "low") };
    const result = scoreSession(answers);
    const drive = result.scales.find(s => s.scaleId === "a1_drive")!;
    expect(drive.mean).toBe(1);
    expect(drive.band).toBe("low");
  });

  it("never reports a scale below its minimum answered items", () => {
    const answers: Answers = {};
    const [first] = itemsOf("a1_drive");
    answers[first.id] = 4;
    const result = scoreSession(answers);
    expect(result.scales.find(s => s.scaleId === "a1_drive")!.reportable).toBe(false);
  });

  it("excludes 'na' answers rather than scoring them as low", () => {
    const answers = allMid();
    const naItem = itemsOf("a9_impairment")[0];
    const withNa: Answers = { ...answers, [naItem.id]: "na" };
    const result = scoreSession(withNa);
    expect(result.impairment.answered).toBe(itemsOf("a9_impairment").length - 1);
  });

  describe("the interpretive grid", () => {
    const highImpairment = (): Answers => {
      const a = allMid();
      for (const item of itemsOf("a9_impairment")) a[item.id] = 6;
      return a;
    };

    it("flags high impairment with an unremarkable profile — the 'look elsewhere' cell", () => {
      const result = scoreSession(highImpairment());
      expect(result.grid).toBe("typical-high-impairment");
    });

    it("separates an elevated trait with little disruption from one with a lot", () => {
      const calm = scoreSession({ ...allMid(), ...atPole("a1_drive", "high") });
      expect(calm.grid).toBe("elevated-low-impairment");

      const costly = scoreSession({ ...highImpairment(), ...atPole("a1_drive", "high") });
      expect(costly.grid).toBe("elevated-high-impairment");
    });
  });

  it("attaches a state-sensitivity caveat only when impairment is high", () => {
    const calm = scoreSession(allMid());
    expect(calm.scales.find(s => s.scaleId === "a2_threat")!.caveats).not.toContain(
      "state-sensitive"
    );

    const impaired = allMid();
    for (const item of itemsOf("a9_impairment")) impaired[item.id] = 6;
    const result = scoreSession(impaired);
    expect(result.scales.find(s => s.scaleId === "a2_threat")!.caveats).toContain(
      "state-sensitive"
    );
  });
});

/**
 * The safety path is pure client code with no server to back it up, so it gets
 * a test that fails loudly if it ever stops firing. See APP-PLAN.md §7.
 */
describe("safety trigger", () => {
  const riskItem = ITEMS.find(i => i.safety)!;

  it("exists — Block A must contain exactly one risk-disclosure item", () => {
    expect(ITEMS.filter(i => i.safety)).toHaveLength(1);
    expect(riskItem.safety!.resourceSet).toBe("crisis.suicide");
  });

  it("fires at the threshold and above", () => {
    const at = riskItem.safety!.atOrAbove;
    expect(safetyTriggered(riskItem.id, at)).toBe("crisis.suicide");
    expect(safetyTriggered(riskItem.id, at + 2)).toBe("crisis.suicide");
  });

  it("does not fire below the threshold, or on a skip", () => {
    expect(safetyTriggered(riskItem.id, 0)).toBeNull();
    expect(safetyTriggered(riskItem.id, null)).toBeNull();
    expect(safetyTriggered(riskItem.id, "na")).toBeNull();
  });

  it("does not fire on ordinary items", () => {
    const ordinary = ITEMS.find(i => !i.safety)!;
    expect(safetyTriggered(ordinary.id, 5)).toBeNull();
  });

  it("puts the risk item last, so nobody meets it cold on page one", () => {
    const last = ITEMS[ITEMS.length - 1];
    expect(ITEMS_BY_ID[last.id as ItemId].safety).toBeTruthy();
  });
});
