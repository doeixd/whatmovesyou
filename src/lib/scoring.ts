// Scoring. Pure functions over the bank and an answer map.
//
// No Solid imports, no DOM, no side effects — so this is unit-testable and
// survives a framework change. Everything the report shows is derived here.
//
// Constraints from research/PLAN-07-no-budget.md §2:
//   - no percentiles, no population comparison; bands are relative to the
//     person's own profile only
//   - scales marked internalOnly never reach the report
//   - trait scores are always accompanied by impairment

import {
  ITEMS_BY_ID,
  RESPONSE_SCALES,
  SCALES,
  SCALES_BY_ID,
  type Item,
  type ItemId,
  type Scale,
  type ScaleId
} from "../data/bank";

export type AnswerValue = number | "na" | null;
export type Answers = Partial<Record<ItemId, AnswerValue>>;

export type Band = "high" | "above" | "middle" | "below" | "low";
export type ImpairmentLevel = "none" | "mild" | "moderate" | "severe";

export interface ScaleScore {
  readonly scaleId: ScaleId;
  readonly name: string;
  /** Mean of answered items, reverse-keyed items flipped. 1–5 for Likert. */
  readonly mean: number;
  readonly answered: number;
  readonly total: number;
  /** False when below the scale's minimum; the report must not show it. */
  readonly reportable: boolean;
  /** Position relative to this person's other trait scores. Never population. */
  readonly band: Band;
  /** Distance from the person's own mean, in their own SD units. */
  readonly relative: number;
  readonly caveats: readonly Caveat[];
}

export type Caveat = "state-sensitive" | "few-items";

export interface Result {
  readonly scales: readonly ScaleScore[];
  /** Scales withheld from the report (internalOnly), still computed. */
  readonly internal: readonly ScaleScore[];
  readonly impairment: {
    readonly mean: number;
    readonly level: ImpairmentLevel;
    readonly answered: number;
  };
  /** The interpretive grid from SPEC-v1 §5. */
  readonly grid: GridCell;
  readonly answeredCount: number;
  readonly totalCount: number;
  readonly complete: boolean;
}

export type GridCell =
  | "elevated-low-impairment"
  | "elevated-high-impairment"
  | "typical-high-impairment"
  | "typical-low-impairment";

const LIKERT_MIN = 1;
const LIKERT_MAX = 5;

/** Reverse-keyed items are flipped about the scale midpoint. */
export function itemScore(item: Item, raw: number): number {
  if (item.keyed === "+") return raw;
  const scale = RESPONSE_SCALES[item.responseScaleId];
  const values = scale.options.map(o => o.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min + max - raw;
}

function numericAnswers(answers: Answers, itemIds: readonly ItemId[]): number[] {
  const out: number[] = [];
  for (const id of itemIds) {
    const value = answers[id];
    if (typeof value !== "number") continue; // null = unanswered, "na" = excluded
    out.push(itemScore(ITEMS_BY_ID[id], value));
  }
  return out;
}

function mean(values: readonly number[]): number {
  if (!values.length) return Number.NaN;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function sd(values: readonly number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  return Math.sqrt(values.reduce((acc, v) => acc + (v - m) ** 2, 0) / (values.length - 1));
}

function itemsFor(scaleId: ScaleId): ItemId[] {
  return Object.values(ITEMS_BY_ID)
    .filter(i => i.scaleId === scaleId)
    .map(i => i.id);
}

/**
 * Band from position within the person's own profile.
 *
 * Deliberately not a percentile: with no norms we can only say which of
 * someone's scores sit high or low relative to each other. If their profile is
 * flat, everything is "middle" — which is the honest answer.
 */
function bandFor(value: number, profileMean: number, profileSd: number): {
  band: Band;
  relative: number;
} {
  if (!Number.isFinite(value)) return { band: "middle", relative: 0 };
  if (profileSd < 0.15) return { band: "middle", relative: 0 }; // flat profile
  const z = (value - profileMean) / profileSd;
  const band: Band =
    z >= 1 ? "high" : z >= 0.35 ? "above" : z <= -1 ? "low" : z <= -0.35 ? "below" : "middle";
  return { band, relative: z };
}

function impairmentLevel(m: number): ImpairmentLevel {
  if (!Number.isFinite(m)) return "none";
  if (m < 1) return "none";
  if (m < 3) return "mild";
  if (m < 5) return "moderate";
  return "severe";
}

export function scoreSession(answers: Answers): Result {
  // 1. Raw means per scale.
  const raw = SCALES.map((scale: Scale) => {
    const ids = itemsFor(scale.id);
    const values = numericAnswers(answers, ids);
    return {
      scale,
      ids,
      values,
      mean: mean(values),
      answered: values.length,
      reportable: values.length >= scale.minItemsAnswered
    };
  });

  const impairmentRaw = raw.find(r => r.scale.id === "a9_impairment")!;
  const impairmentMean = impairmentRaw.mean;
  const level = impairmentLevel(impairmentMean);

  // 2. Profile centre from reportable Likert trait scales only. Impairment uses
  //    a different response scale (0–8), so including it would distort the
  //    comparison it exists to contextualise.
  const traitScores = raw.filter(
    r => r.scale.id !== "a9_impairment" && r.reportable && Number.isFinite(r.mean)
  );
  const profileMean = mean(traitScores.map(r => r.mean));
  const profileSd = sd(traitScores.map(r => r.mean));

  const build = (r: (typeof raw)[number]): ScaleScore => {
    const { band, relative } = bandFor(r.mean, profileMean, profileSd);
    const caveats: Caveat[] = [];
    // A current low mood inflates state-sensitive scales; say so rather than
    // silently adjusting, which would remove real trait variance.
    if (
      r.scale.stateSensitivity === "high" &&
      (level === "moderate" || level === "severe")
    ) {
      caveats.push("state-sensitive");
    }
    if (r.reportable && r.answered < r.ids.length) caveats.push("few-items");

    return {
      scaleId: r.scale.id,
      name: r.scale.name,
      mean: r.mean,
      answered: r.answered,
      total: r.ids.length,
      reportable: r.reportable,
      band,
      relative,
      caveats
    };
  };

  const traits = raw.filter(r => r.scale.id !== "a9_impairment");
  const scales = traits.filter(r => !r.scale.internalOnly).map(build);
  const internal = traits.filter(r => r.scale.internalOnly).map(build);

  // 3. The grid. "Elevated" means at least one reportable trait stands out
  //    within this person's profile.
  const anyElevated = scales.some(s => s.reportable && s.band === "high");
  const highImpairment = level === "moderate" || level === "severe";
  const grid: GridCell = anyElevated
    ? highImpairment
      ? "elevated-high-impairment"
      : "elevated-low-impairment"
    : highImpairment
      ? "typical-high-impairment"
      : "typical-low-impairment";

  const answeredCount = Object.values(answers).filter(v => v !== null && v !== undefined).length;
  const totalCount = Object.keys(ITEMS_BY_ID).length;

  return {
    scales,
    internal,
    impairment: {
      mean: impairmentMean,
      level,
      answered: impairmentRaw.answered
    },
    grid,
    answeredCount,
    totalCount,
    complete: answeredCount >= totalCount
  };
}

/** Does this answer trip a safety trigger? Checked on every response. */
export function safetyTriggered(itemId: ItemId, value: AnswerValue): string | null {
  const item = ITEMS_BY_ID[itemId];
  if (!item.safety || typeof value !== "number") return null;
  return value >= item.safety.atOrAbove ? item.safety.resourceSet : null;
}

/** Exposed for tests and the results page. */
export const LIKERT_RANGE = { min: LIKERT_MIN, max: LIKERT_MAX } as const;

export function scaleById(id: ScaleId): Scale {
  return SCALES_BY_ID[id];
}
