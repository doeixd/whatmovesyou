/**
 * Item bank + response model.
 *
 * Source of truth for the assessment. `item-bank.schema.json` validates the
 * serialized bank against these shapes; keep the two in sync.
 *
 * Design rules encoded here (see research/PLAN-notes-05-gaps.md):
 *  - Items are immutable once piloted. Changing wording means a new id.
 *  - Every scale declares its body link with an evidence grade.
 *  - Every flag declares sens/spec per population and a minimum PPV to display.
 *  - Every item declares review state for cultural loading and desirability.
 *  - Informant wording lives on the item, not in a parallel bank.
 */

// ─────────────────────────────────────────────────────────── ids

/** Stable, human-readable. Never reused, never renamed. */
export type ItemId = string //  "a1_drive_007"
export type ScaleId = string //  "a1_drive"
export type FacetId = string //  "a1_drive.persistence"
export type BlockId = 'A' | 'B' | 'C'
export type FlagId = string //  "flag_chronotype"
export type ResponseScaleId = string //  "agree5"
export type CitationId = string //  "deyoung2013"
export type RouteId = string //  "route_ferritin"
export type CopyId = string //  "copy_a1_high"

// ─────────────────────────────────────────────────────────── bank

export interface ItemBank {
  /** Semver. Minor = items added; major = scoring or scale changes. */
  version: string
  updatedAt: string // ISO 8601
  locale: string // BCP 47, e.g. "en-US"
  blocks: Block[]
  responseScales: ResponseScale[]
  scales: Scale[]
  items: Item[]
  flags: Flag[]
  confirmationRoutes: ConfirmationRoute[]
  interactionRules: InteractionRule[]
  norms: NormTable[]
  contextFields: ContextField[]
  citations: Citation[]
}

export interface Block {
  id: BlockId
  name: string // "Spectra" | "Gain" | "Setpoints"
  question: string // "Who you are" — shown to the user
  order: number
  /** Block A + impairment can be served alone as the 5-minute core. */
  standalone: boolean
}

// ─────────────────────────────────────────────────────── response scales

export type ResponseScaleType =
  | 'likert' //  agreement
  | 'magnitude' //  how much X changes you
  | 'frequency'
  | 'impairment' //  0–8 WSAS-style
  | 'clockTime' //  chronotype: "23:30"
  | 'duration' //  minutes/hours
  | 'boolean'
  | 'single' //  one of N
  | 'multi' //  many of N

export interface ResponseScale {
  id: ResponseScaleId
  type: ResponseScaleType
  /** Ordered low→high. Omitted for clockTime/duration. */
  options?: ResponseOption[]
  /**
   * "Doesn't apply" is recorded and excluded from scoring — never scored as
   * low. A teetotaller is not low in alcohol reactivity.
   */
  allowNotApplicable: boolean
  notApplicableLabel?: string
}

export interface ResponseOption {
  value: number // scored value, ascending
  label: string
}

// ─────────────────────────────────────────────────────────── scales

export type EvidenceGrade =
  | 'strong' //  causal/replicated (dopamine agonists → ICDs)
  | 'moderate' //  replicated correlational (5-HT2A ↔ neuroticism r=.37)
  | 'preliminary' //  single lab / small n (μ-opioid ↔ attachment)
  | 'genetic' //  heritable, no clean transmitter story (autistic traits)
  | 'none' //  included without a biological claim

export interface BodyLink {
  system: string // "dopamine (D2)", "μ-opioid", "circadian"
  grade: EvidenceGrade
  /** One sentence, shown in the collapsible evidence panel. */
  mechanism: string
  /** What would confirm this in principle. Null when nothing would. */
  verification: string | null
  citations: CitationId[]
}

export interface Scale {
  id: ScaleId
  block: BlockId
  name: string
  poles: { low: string; high: string }
  definition: string
  facets?: Facet[]
  scoring: {
    method: 'mean' | 'sum' | 'derived'
    /** Below this many answered items the scale is not reported at all. */
    minItemsAnswered: number
    /** For 'derived' scales (e.g. MSFsc), the named formula in scoring.ts. */
    formula?: string
  }
  bodyLinks: BodyLink[]
  report: ReportPolicy
}

export interface Facet {
  id: FacetId
  name: string
  definition: string
}

export interface ReportPolicy {
  /** Some axes are too stigmatizing to show as a raw percentile. */
  showPercentile: boolean
  stigmaRisk: 'low' | 'medium' | 'high'
  /**
   * How much a current depressive/anxious state inflates this scale.
   * 'high' → widen the band and attach a retake caveat when impairment is high.
   * (research/PLAN-notes-05-gaps.md §2)
   */
  stateSensitivity: 'low' | 'medium' | 'high'
  /** Honest cost/upside copy. Both are required — no consolation-prize framing. */
  copy: { costId: CopyId; upsideId: CopyId }
  /** Held back from the user report and used only as internal signal. */
  internalOnly?: boolean
}

// ─────────────────────────────────────────────────────────── items

export type ItemStatus =
  | 'draft'
  | 'in-review'
  | 'piloted' //  frozen: edits require a new id
  | 'retired'

export interface Item {
  id: ItemId
  status: ItemStatus
  addedInVersion: string
  retiredInVersion?: string
  block: BlockId
  scaleId: ScaleId
  facetId?: FacetId
  /** First person, present tense, concrete and behavioral. */
  text: string
  /** Third person, for the informant module. Required once status='piloted'. */
  informantText?: string
  responseScaleId: ResponseScaleId
  /** '-' items are reverse-scored. Aim for ~50% per scale. */
  keyed: '+' | '-'
  timeframe: Timeframe
  /** Shown only when this evaluates true. */
  gate?: Gate
  /** Non-null on items that can disclose risk (e.g. self-harm). */
  safety?: SafetyTrigger
  /** Excluded from scale scores; used for response-quality checks. */
  validityRole?: 'attention-check' | 'infrequency' | 'desirability'
  review: ItemReview
  psychometrics?: ItemPsychometrics
  provenance: Provenance
  tags?: string[]
}

export type Timeframe =
  | 'general' //  "in general, over the past few years"
  | 'past-2-weeks'
  | 'past-month'
  | 'right-now'
  | 'typical-day'
  | 'lifetime'

export interface ItemReview {
  /**
   * Risk that the item measures culture/religion rather than the construct.
   * The "a sign was meant for me" problem. (PLAN-notes-05-gaps.md §4)
   */
  culturalLoad: 'low' | 'medium' | 'high'
  desirabilityRisk: 'low' | 'medium' | 'high'
  readabilityGrade: number // Flesch-Kincaid target ≤ 8
  reviewedBy?: string[]
  notes?: string
}

export interface ItemPsychometrics {
  sampleN: number
  sampleVersion: string
  itemTotalR?: number // drop below ~.30
  alphaIfDropped?: number
  meanResponse?: number
  sdResponse?: number
  /** Differential item functioning by group; non-empty = do not ship as-is. */
  difFlags?: Array<{
    grouping: 'religiosity' | 'gender' | 'age' | 'locale' | 'ancestry'
    effect: number
    note: string
  }>
}

export interface Provenance {
  origin: 'original' | 'adapted' | 'licensed'
  /** Required unless origin='original'. Instrument name + licence terms. */
  sourceInstrument?: string
  licence?: string
  /** Never a Braverman item — the 2005 bank is copyrighted. */
  adaptedFrom?: string
}

// ─────────────────────────────────────────────────────────── gating

/** Conditional display for cycle items, ancestry-gated flags, N/A branches. */
export type Gate = { all: Condition[] } | { any: Condition[] } | { not: Condition }

export interface Condition {
  source: 'context' | 'item' | 'scale' | 'flag'
  ref: string // ContextField.id | ItemId | ScaleId | FlagId
  op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'includes' | 'answered'
  value?: string | number | boolean | Array<string | number>
}

// ─────────────────────────────────────────────────────────── safety

export interface SafetyTrigger {
  /** Response values at or beyond this fire the trigger. */
  atOrAbove: number
  severity: 'support' | 'urgent'
  /** Resource set keyed by locale/region, resolved at render time. */
  resourceSet: string // "crisis.suicide"
  /** Shown immediately, never deferred to the results page. */
  interrupt: true
}

// ─────────────────────────────────────────────────────── flags (block C)

export interface Flag {
  id: FlagId
  name: string
  /** What physical difference this points at. */
  target: string
  itemIds: ItemId[]
  rule: FlagRule
  /**
   * Accuracy is per population, because PPV is what matters and PPV moves with
   * base rate. Self-reported alcohol flush: PPV ≈ 63% at 35% prevalence,
   * ≈ 3% at 1%. (PLAN-notes-05-gaps.md §3)
   */
  performance: FlagPerformance[]
  /** Below this computed PPV the flag is not surfaced. */
  minPpvToShow: number
  /** Gate on ancestry/sex/age where base rates demand it. */
  gate?: Gate
  confirmationRouteId: RouteId
  copy: {
    patternId: CopyId
    /** Explicit correction of a common wrong mechanism story, if any. */
    notThisId?: CopyId
  }
  citations: CitationId[]
}

export type FlagRule =
  | { kind: 'threshold'; scoreOf: ItemId[]; atOrAbove: number }
  | { kind: 'count'; scoreOf: ItemId[]; countAtOrAbove: number; minCount: number }
  | { kind: 'formula'; formula: string; atOrAbove?: number; atOrBelow?: number }

export interface FlagPerformance {
  /** Which population these numbers came from, and who they apply to. */
  population: string // "East Asian ancestry", "general adult"
  appliesWhen?: Gate
  sensitivity: number // 0–1
  specificity: number // 0–1
  basePrevalence: number // 0–1
  citations: CitationId[]
}

export interface ConfirmationRoute {
  id: RouteId
  kind: 'lab' | 'device' | 'clinical' | 'protocol' | 'genotype'
  name: string // "Serum ferritin"
  description: string
  /** e.g. "RLS research uses <50 µg/L; lab 'normal' often starts at 15." */
  thresholdNote?: string
  accessNote?: string // how a person actually gets it
}

// ─────────────────────────────────────────────── interactions & norms

/**
 * Hand-written and pre-specified only. With 7 scales there are hundreds of
 * combinations; anything mined from data is noise.
 * (PLAN-notes-05-gaps.md §9)
 */
export interface InteractionRule {
  id: string
  priority: number // lower = evaluated first
  conditions: Condition[]
  copyId: CopyId
  rationale: string
  citations: CitationId[]
  /** Never route to a diagnosis; only ever to an assessment conversation. */
  suggestsAssessment?: boolean
}

export interface NormTable {
  scaleId: ScaleId
  /** Age-banded always: traits and chronotype both shift with age. */
  band: {
    ageMin: number
    ageMax: number
    sex?: 'female' | 'male' | 'other' | 'any'
    locale?: string
  }
  n: number
  mean: number
  sd: number
  /** Percentile → raw score. Sparse is fine; interpolate between points. */
  percentiles?: Array<{ p: number; score: number }>
  source: string
  /** True until a real norming sample exists. Forces hedged copy. */
  provisional: boolean
}

export interface ContextField {
  id: string // "meds.ssri", "sleep.avgHours", "ancestry"
  label: string
  type: 'boolean' | 'number' | 'single' | 'multi' | 'text'
  options?: ResponseOption[]
  /** Never scored. Used for gating, flag base rates, and report caveats. */
  scored: false
  /** Explains a result before biology is invoked. */
  explains?: ScaleId[]
}

export interface Citation {
  id: CitationId
  title: string
  url: string
  year?: number
  /** The specific claim this source backs, in one sentence. */
  claim: string
}

// ─────────────────────────────────────────────────────── responses

export interface Session {
  id: string
  bankVersion: string
  locale: string
  mode: 'self' | 'informant'
  /** Set when mode='informant': the self-session being rated. */
  targetSessionId?: string
  /** Opaque, optional. Local-first by default. */
  subjectRef?: string
  startedAt: string
  completedAt?: string
  blocksCompleted: BlockId[]
  context: Record<string, string | number | boolean | string[]>
}

export interface Response {
  sessionId: string
  itemId: ItemId
  /** Null when skipped or not-applicable. */
  value: number | string | null
  notApplicable: boolean
  skipped: boolean
  latencyMs?: number
  answeredAt: string
}

export interface ScoreResult {
  sessionId: string
  scoredAt: string
  bankVersion: string
  scales: ScaleScore[]
  flags: FlagResult[]
  interactions: string[] // InteractionRule ids fired, in priority order
  validity: ValidityCheck
  /** Present when an informant session is linked. The gap is the product. */
  selfInformantGaps?: Array<{
    scaleId: ScaleId
    selfPercentile: number
    informantPercentile: number
    informantN: number
    gap: number
  }>
}

export interface ScaleScore {
  scaleId: ScaleId
  raw: number
  nAnswered: number
  percentile?: number
  band?: 'low' | 'below-average' | 'typical' | 'above-average' | 'high'
  /** Widened when norms are provisional or state sensitivity is high. */
  confidenceInterval?: [number, number]
  /** e.g. "current low mood may inflate this — consider retaking in 8 weeks" */
  caveats: string[]
  reportable: boolean // false if below minItemsAnswered
}

export interface FlagResult {
  flagId: FlagId
  triggered: boolean
  /** Computed from the matched FlagPerformance row and this person's context. */
  ppv?: number
  ppvPopulation?: string
  shown: boolean // triggered && ppv >= minPpvToShow && gate passed
  suppressedReason?: 'low-ppv' | 'gate-failed' | 'insufficient-items'
}

export interface ValidityCheck {
  attentionChecksPassed: number
  attentionChecksTotal: number
  /** Correlation across reverse-keyed pairs; near zero suggests yea-saying. */
  acquiescenceIndex?: number
  straightLineRuns: number
  medianLatencyMs: number
  usable: boolean
}
