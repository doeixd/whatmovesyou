# Item development methodology

How we get from the design in [SPEC-v1.md](SPEC-v1.md) to an item bank we can defend. The order matters: most bad tests are bad because someone started writing questions on day one.

**Governing principle:** we are not writing questions. We are building a *measurement instrument*, and every step below exists to catch a specific failure mode that killed the original Braverman test.

---

## Phase 0 — Define the constructs before writing anything

You cannot write a good item for a construct you haven't bounded. Braverman's items drift because "dopamine nature" was never defined — it's a vibe, so items like "I value a religious philosophy" can be smuggled in.

**Deliverable: one construct definition sheet per scale.** Nothing gets written until its sheet is signed off.

### Template

```
SCALE: <name>                                    ID: <scale_id>
─────────────────────────────────────────────────────────────
DEFINITION        One sentence. What varies between people.
POLES             Low pole ←→ High pole, both described neutrally.
FACETS            2–4 sub-components, each defined.
IN SCOPE          Behaviors/experiences that count. Be concrete.
OUT OF SCOPE      Adjacent constructs this is NOT. Name them.
BOUNDARY CASES    3–5 hard calls, decided in advance.
SEVERITY RANGE    What "mildly", "notably" and "extremely" look like.
BODY LINK         System + evidence grade + one-line mechanism + citations.
STATE SENSITIVITY How much a depressive episode inflates this. (low/med/high)
VISIBILITY        Can others observe it? (drives informant expectations)
KNOWN CONFOUNDS   Culture, religion, age, gender, SES, health status.
```

### Worked example

```
SCALE: Drive                                     ID: a1_drive
─────────────────────────────────────────────────────────────
DEFINITION        Tendency to initiate activity and to expend effort
                  for reward, absent external demand.
POLES             Inert ←→ Driven
FACETS            Exploration (seeking novelty/information unprompted)
                  Effort tolerance (paying a cost for a larger reward)
IN SCOPE          Self-initiated projects; persistence past the
                  interesting phase; cost/benefit tradeoffs actually made.
OUT OF SCOPE      Conscientiousness (Drive is about initiation, not
                  reliability); Sociality; current energy (that's state);
                  achievement outcomes (confounded with opportunity/SES).
BOUNDARY CASES    - Works 60h/week under threat of firing → NOT high Drive
                    (external demand).
                  - Many started, few finished → high exploration,
                    low effort tolerance. Both facets must be separable.
                  - Intense drive in one narrow domain → counts; note
                    overlap with Systemizing.
SEVERITY RANGE    Mild: takes on optional work occasionally.
                  Notable: consistently generates own projects.
                  Extreme: cannot rest; starts things at personal cost.
BODY LINK         Dopamine (reward/effort/exploration) — STRONG.
                  Agonists produce impulse-control disorders; amphetamine
                  raises effort-for-reward. [dominion2010, treadway2012]
STATE SENSITIVITY Medium — depression suppresses it markedly.
VISIBILITY        High — expect good self-informant agreement (r ≈ .5–.6).
KNOWN CONFOUNDS   SES and life stage (a parent of a newborn has no slack);
                  culture around self-promotion.
```

The OUT OF SCOPE and BOUNDARY CASES lines are what make the later factor analysis interpretable. Write them before you're invested in any item.

---

## Phase 1 — The blueprint (table of specifications)

A grid fixing, per scale, how many items go to each cell **before** generation. Prevents the usual failure where 80% of items cluster on the easiest facet.

Two axes per scale:

**Facet** × **Severity target**

| | Mild (common) | Moderate | Extreme (rare) |
|---|---|---|---|
| Facet 1 | 2 items | 1 | 1 |
| Facet 2 | 2 items | 1 | 1 |

**Why severity spread matters, and why Braverman has none:** his items are nearly all pitched at the same middling level ("I am a deep thinker"). An instrument made of same-level items discriminates well at one point on the continuum and badly everywhere else. In IRT terms we want item locations spread across the range, so the test is informative for the mildly elevated *and* the markedly elevated. This is the single biggest technical upgrade available.

Per-scale blueprint targets:
- **8 final items** → generate **24** (3× overgeneration; expect to cut two-thirds)
- **50% reverse-keyed**, spread across facets and severity — not all reverse items clustered at the mild end
- Every item gets its informant paraphrase written **at the same time**, not retrofitted

Blueprint the whole bank before writing: ~56 Block A items → ~170 generated; ~24 Block B → ~70; Block C is mostly borrowed formats, so ~30 generated.

---

## Phase 2 — Generation

Four sources, used together. Diversity of source is what stops the bank sounding like one person's inner monologue.

1. **Critical-incident interviews (highest value).** Ask 8–12 people: "Tell me about a time you started something nobody asked for." Harvest their *actual phrasings*. Items derived from real speech beat items derived from theory almost every time, and they come pre-loaded with concrete behavior.
2. **Construct mining, not text copying.** Read the validated instruments (PID-5, BFAS, BIS/BAS, HPS, ASRS) for *what they target*, then write fresh items for those targets. Never copy wording — copyright, and it imports their problems.
3. **Behavioral-evidence prompts.** For each facet ask: "what would someone have *done* in the last month if they were high on this?" Convert answers into past-behavior items. This produces the "I've spent money within minutes of first seeing something" style rather than the "I am impulsive" style.
4. **LLM-assisted expansion, human-curated.** Useful for filling blueprint cells and generating reverse-keyed variants at speed. Two hard rules: every generated item passes the same review gates, and a human de-duplicates for near-synonyms — LLMs produce fluent items that all say the same thing, which inflates alpha while measuring one narrow thing.

### Writing rules (extends SPEC §4)

1. **5-point Likert**, one construct per item, ≤ 240 characters, reading age ≈ grade 8.
2. **Reverse-keyed ≠ negated.** "I am not driven" is a negation; "I often decide something isn't worth the effort" is a genuine opposite-pole statement. Negations confuse readers and create method factors.
3. **Behavior over self-concept.** "I've done X" beats "I am X-ish."
4. **No double-barrels**, no "and/or".
5. **Time anchor matches the block.** Block A "in general"; Block B "typical day"; state items "past two weeks".
6. **Nothing unobservable to the person** (cholesterol, blood pressure, vein visibility).
7. **No moral, religious or political content** in trait scales — that's the item that sank both Braverman's dopamine scale and my own first psychoticism draft.
8. **Severity is carried by the statement, not the response scale.** Don't rely on "strongly agree" to mark extremity; write a genuinely extreme item.
9. **Informant paraphrase must preserve severity**, not soften it.
10. **Avoid frequency words that vary wildly in meaning** ("often", "sometimes") when a concrete anchor is possible ("more than once a week").

---

## Phase 3 — Review gates

Nothing reaches a pilot without passing all four. Each is cheap; skipping them is what produces a 315-item bank with items on three scales at once.

| Gate | Method | Pass rule |
|---|---|---|
| **Construct fit** | 4–5 raters independently sort items to scales blind, and rate fit 1–4 | Content Validity Index ≥ .78 per item; misassignment by >1 rater = rewrite |
| **Bias & loading** | Review for cultural/religious/gender/age loading; the schema's `culturalLoad` field | `high` requires written justification or removal |
| **Desirability** | Rate how much the item invites a flattering answer | `high` items need a matched pair at the other pole, or go |
| **Clarity** | Readability score + plain-language check | Grade ≤ 8; ambiguous quantifiers flagged |

Then **cognitive interviews (n ≈ 10)**: think-aloud on ~30 items. Ask what the item is asking, what they thought of when answering, and why they picked their option. This catches the failures statistics never will — items people interpret differently from each other but answer consistently. Budget one round of rewrites afterward; expect to lose 15–25% of items here.

---

## Phase 4 — Pilot 1: structure and trimming (n ≈ 250–300)

Full overgenerated pool, randomized order, attention checks embedded.

**Analyses:**
- Descriptives: floor/ceiling (drop items where >85% pick one option), response distribution per item
- Item-total correlation (drop < .30)
- Cronbach's α and McDonald's ω per scale (target ≥ .70; ω is the better statistic)
- **EFA/parallel analysis**: does the intended factor count emerge? Pre-register the prediction that Drive and Restraint separate, and that Systemizing doesn't collapse into Detachment.
- Acquiescence index from reverse-keyed pairs
- Inter-scale correlations: any pair above ~.70 is one construct wearing two names — merge or re-specify

**Decision rules written in advance:** drop, revise, or keep, with the drop list produced *before* looking at which items are prettiest.

**Kill criteria** (say these out loud now, so they're not renegotiated later):
- ω < .65 after one revision round → the construct is bad, not the items
- Factor structure fails to approximate the blueprint twice → re-specify the scale
- Two scales correlate > .85 → merge

---

## Phase 5 — Pilot 2: calibration and short forms (n ≈ 400–500)

Trimmed pool plus replacement items.

- **CFA / ESEM** to confirm the structure on fresh data
- **IRT (graded response model)** per scale: item discrimination (a) and thresholds (b). Select the final 8 items to maximize **information across the full range**, not just average discrimination — this is where severity spread pays off.
- **DIF testing** by religiosity, gender, age band and (where n permits) locale. Any flagged item is rewritten or dropped; the schema records the result on the item.
- **Short form** derived from the IRT parameters, targeting the 5-minute core. Later, the same parameters enable adaptive administration.

---

## Phase 6 — Validity studies

Run pre-registered, with directional predictions written *before* data collection. Predictions that could fail are the point.

| Study | n | Pre-registered predictions |
|---|---|---|
| **Convergent/discriminant** | ~150 | Drive ↔ BAS Drive/Extraversion r > .50; Drive ↔ Agreeableness \|r\| < .25; Threat-reactivity ↔ Neuroticism r > .60; Systemizing ↔ autistic-traits measure r > .50 and ↔ Detachment r < .40 |
| **Test-retest, 4–6 weeks** | ~100 | **Differential stability:** Block A r ≥ .70; Block B (gain) r ≈ .55–.70; state scales r < .55. If state scales are as stable as traits, the block distinction is fiction and the design is wrong. |
| **Self-informant** | ~80 dyads | **Per SOKA:** agreement higher for visible scales (Drive, Antagonism per others' view) than invisible ones (Threat reactivity). Antagonism shows the largest self-vs-informant gap. |
| **Barnum control** | ~100 | Users rate their real profile as more accurate than a randomly assigned one, by a clear margin. If the gap is small, the report copy is a horoscope and gets rewritten. |
| **Predicted vs observed reactivity** | ~60, 3 weeks tracking | Self-rated reactivity correlates with within-person coupling from logs. This one may fail — and if it does, Block B pivots to observed-only. |

**Block C flags don't get validated this way.** We can't afford gold-standard comparison (polysomnography, blood panels). Instead: use published sensitivity/specificity with demographically-conditioned base rates for PPV, and track the only outcome we can actually observe — **confirmation-route completion and result**, i.e. how many people flagged for ferritin got tested and what came back. That telemetry is also the product's success metric (SPEC §8 / notes-05 §8).

---

## Phase 7 — Ongoing

- **Version the bank** semantically; items freeze at `piloted`.
- **Decision log**: every drop/keep with its reason, so nobody re-litigates by intuition.
- **Norms accumulate** with explicit opt-in, age-banded, provisional until n ≥ 100 per band.
- **Annual DIF re-check** as the sample diversifies.

---

## Cost and timeline (rough)

| Phase | Time | Cost |
|---|---|---|
| 0–1 Constructs + blueprint | 2 weeks | — |
| 2 Generation (incl. interviews) | 2–3 weeks | ~$300 participant incentives |
| 3 Review + cognitive interviews | 2 weeks | ~$300 |
| 4 Pilot 1 (n=300) | 2 weeks | ~$900–1,200 (Prolific) |
| 5 Pilot 2 (n=450) | 3 weeks | ~$1,400–1,800 |
| 6 Validity studies (~490 total) | 4–6 weeks | ~$2,000–2,500 |
| **Total** | **~4 months** | **~$5,000–6,500** |

If that's out of scope, the honest fallback is Phases 0–3 plus cognitive interviews — content validity only — and saying plainly in the app that the instrument is unvalidated. That's still ahead of the original, which is also unvalidated but doesn't say so.

---

## Ethics and governance

- **Ethics review** needed if we intend to publish. For a commercial product: informed consent, data minimization, export and delete, separate opt-in for norms.
- **Safety protocol** in every study that includes risk items, including a documented escalation path.
- **Pre-registration** (OSF) for Phases 4–6. It's free, it takes an afternoon, and it's the difference between a validation study and a marketing exercise.
- **Publish the failures.** If self-reported reactivity doesn't predict observed reactivity, that's a finding worth writing up, and saying so publicly is the strongest possible differentiator from every other personality quiz.

---

## Immediate next actions

1. Write construct definition sheets for all 7 Block A scales — the Drive example above is the template.
2. Fix the blueprint grid (facets × severity) per scale.
3. Recruit 8–12 critical-incident interviews.
4. Generate to 3× target, entering items directly into the schema with `status: "draft"` and full `review` metadata.
5. Book the 4–5 construct-fit raters before generation finishes, so the gate isn't the bottleneck.
6. Draft the pre-registration for Pilot 1 in parallel with generation — writing the analysis plan early is what stops the analysis drifting.
