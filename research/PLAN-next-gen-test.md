# Planning doc: a research-grounded successor to the Braverman test

Status: **draft for discussion**. Nothing here is decided. This pulls together [scoring.md](scoring.md), [natures.md](natures.md), [validity.md](validity.md), [versions.md](versions.md), [neurotransmitters-and-personality.md](neurotransmitters-and-personality.md) and [chemistry-and-behavior.md](chemistry-and-behavior.md) into options, trade-offs and open questions for building something better.

---

## 1. What we're trying to fix

What the Braverman test gets **right**, and worth keeping:

- **Two-part structure.** Trait ("how you are most of the time") vs state ("how you feel right now") is a genuinely good design, and it matches the research: traits are stable and weakly chemistry-linked, states are changeable and strongly chemistry-linked.
- **Four domains keep it legible.** People finish it and remember their result. That's not nothing.
- **It connects to action.** A result implies something to do, which is why people take it.

What's **broken**:

| Problem | Evidence | See |
|---|---|---|
| Claims to measure brain chemicals from behavior | No validated method exists; causation only runs chemistry→behavior | [chemistry-and-behavior.md](chemistry-and-behavior.md) §3 |
| The four-type mapping is wrong in places | Serotonin↔impulsive thrill-seeking is backwards; ACh↔creative-romantic is unsupported (the one PET finding is harm avoidance) | [neurotransmitters-and-personality.md](neurotransmitters-and-personality.md) §3 |
| Types instead of dimensions | Traits are continuous; forced typing throws away information and inflates test-retest instability | [validity.md](validity.md) |
| All items keyed the same direction | Acquiescent responders score high on everything | [validity.md](validity.md) |
| Unequal scale lengths (3B has 40 items vs 25) | Raw counts aren't comparable | [scoring.md](scoring.md) |
| Items double-counted across scales | "I have insomnia" appears in 1A, 2B, 4B | [validity.md](validity.md) |
| Level model, not sensitivity model | PMDD add-back studies: identical levels, opposite behavioral response | [chemistry-and-behavior.md](chemistry-and-behavior.md) §2 |
| Supplement dosing from questionnaire scores | No trial links scores to supplement response; 5-HTP/St John's Wort interact with SSRIs | [natures.md](natures.md) |
| Copyrighted items | Reproduced from the 2005 book | [README.md](README.md) |

---

## 2. Framing options (pick one, this decides everything else)

### Option A — "Traits, with evidence-rated biology notes" ⭐ recommended
Measure validated trait dimensions. Report them as traits. Attach a clearly-labeled "what research links this to" panel with a strength rating.
- **Pro:** honest, defensible, still delivers the "brain chemistry" hook people want; items can be original or IPIP-derived (public domain).
- **Con:** less punchy than "you are dopamine-dominant."

### Option B — "Pure trait profile"
Drop biology entirely. Just a well-built personality + current-state profile.
- **Pro:** maximally defensible, no safety surface.
- **Con:** it's then a Big Five clone with nothing distinctive.

### Option C — "Faithful Braverman + critique layer"
Ship the original 315 items and overlay modern commentary showing where each claim stands.
- **Pro:** unique, genuinely useful to people who've encountered the test; educational.
- **Con:** copyright; and it lends the original credibility by reproducing it.

### Option D — "Tracking-first app"
The questionnaire is the on-ramp; the product is longitudinal self-tracking (mood, sleep, alcohol, meds, cycle) showing within-person patterns.
- **Pro:** this is the one thing that actually matches the science ("sensitivity to change" beats "level"), and it's defensible.
- **Con:** a bigger build; retention problem; needs a real data model.

**Suggested path:** **A now, D later.** Ship the assessment as a trait profile with evidence panels, designed so results become the baseline for optional tracking.

---

## 3. Proposed structure

Mirrors Braverman's two-part shape, but with defensible content.

### Part 1 — Trait profile (stable, "most of the time")

Six dimensions, each drawn from research with a known biological link. Proposed 8–12 items each, half reverse-keyed.

| # | Dimension | Working name | Research basis | Linked system | Evidence strength |
|---|---|---|---|---|---|
| 1 | Exploration / Plasticity | "Seeker" | DeYoung 2013; Extraversion + Openness | Dopamine | **Strong** |
| 2 | Drive & effort tolerance | "Engine" | Treadway 2012 effort-for-reward; BAS Drive | Dopamine | **Strong** |
| 3 | Withdrawal / negative emotionality | "Alarm" | Neuroticism inward facets; 5-HT2A binding r=.37 | Serotonin | **Moderate** |
| 4 | Volatility / impulsivity | "Surge" | UPPS-P urgency; tryptophan depletion in aggression-prone | Serotonin × dopamine | **Moderate** |
| 5 | Constraint / stability | "Anchor" | Conscientiousness + Agreeableness; DeYoung "Stability" | Serotonin | **Moderate** |
| 6 | Attachment & social bonding | "Bond" | Nummenmaa μ-opioid & attachment style | Endogenous opioid | **Preliminary** |

Optional 7th: **Vigilance / arousal** (trait anxiety, startle-proneness) → norepinephrine, *preliminary*.

Notes:
- 1 and 2 are both dopamine-linked but separable (exploring vs. persisting); worth keeping apart, and a factor analysis can tell us if they collapse.
- **Deliberately no GABA or acetylcholine dimension.** There's no validated trait for either. Their symptom territory (anxiety, cognitive complaints) lives in Part 2 where it belongs. This is the biggest departure from Braverman and should be explained in the report, not hidden.

### Part 2 — Current state (changeable, "the last two weeks")

Five short scales. Two options:

- **2a. Use established public instruments** (PHQ-9, GAD-7, ISI, SHAPS, UPPS-P short). Validated, normed, immediately interpretable.
  - Check licensing per instrument. PHQ-9/GAD-7 are free for non-commercial use; confirm before shipping commercially.
- **2b. Write original parallel items** covering the same domains. No licensing issues, no norms, no validation.

**Recommendation: 2a**, with a clinical-language wrapper ("screening, not diagnosis").

| Domain | Instrument | Braverman analogue |
|---|---|---|
| Low mood | PHQ-9 | serotonin deficiency |
| Anxiety / tension | GAD-7 | GABA deficiency |
| Sleep | ISI | serotonin deficiency |
| Anhedonia / motivation | SHAPS or DARS | dopamine deficiency |
| Cognitive complaints | CFQ short | acetylcholine deficiency |

### Part 3 (optional) — Context and modifiers

Short, non-scored, but this is where the real explanatory power sits per [chemistry-and-behavior.md](chemistry-and-behavior.md):

- Sleep debt, alcohol/caffeine/nicotine, exercise
- Current medications (SSRIs, stimulants, dopamine agonists, hormonal contraception, GLP-1s, thyroid meds)
- Menstrual cycle phase / perimenopause status
- Recent life stressors, illness, chronic pain
- Known thyroid/anemia/vitamin D status

**Why this matters:** many Part 2 "deficiency" symptoms have an obvious cause sitting right here. Showing "your low-motivation score may relate to the 5h average sleep you reported" is more useful and more honest than "dopamine deficiency."

---

## 4. Item-writing guidelines

1. **5-point Likert** ("Strongly disagree" → "Strongly agree"), not true/false. Better reliability per item; fewer items needed.
2. **~50% reverse-keyed** per scale, so acquiescence cancels.
3. **One construct per item.** No double-barreled items ("I'm creative *and* remember faces").
4. **No item on two scales.**
5. **Behavioral and concrete over abstract self-concept.** "In the past month I started a project no one asked me to" beats "I am innovative."
6. **Drop unobservables.** No blood pressure, cholesterol, vein visibility, body temperature. People can't self-report these.
7. **No moral/religious content in trait scales.** ("I value a religious philosophy" was a dopamine item — it's culture, not chemistry.)
8. **Time anchors explicit.** Part 1: "in general, over the past few years." Part 2: "over the past two weeks."
9. **Neutral desirability.** Pilot-check that a scale doesn't just measure wanting to look good.
10. **Reading level ≈ grade 8.** Short sentences.

**Example rewrites:**

| Braverman original | Problem | Rewrite |
|---|---|---|
| "I am a deep thinker." | Pure self-flattery, undefined | "I keep turning an idea over after other people have moved on." |
| "My veins are visible…" | Unobservable, irrelevant | *cut* |
| "I have insomnia." (3 scales) | Double-counted, state-like | Move to ISI in Part 2 |
| "Savings are for suckers." | Caricature, low base rate | "I'd rather spend on something good now than save it." |
| "I have high ethical standards that I live by." | Social desirability | "I've turned down something I wanted because it broke a rule I'd set." |

**Target length:** 60–72 trait items + ~45 state items ≈ 8–12 minutes. Braverman's 315 items at ~25 minutes is a completion-rate liability, and the extra length buys nothing once items are Likert and reverse-keyed.

Consider an adaptive short form (~25 items) for a free tier, with the full version as the "complete profile."

---

## 5. Scoring

- **Score each dimension as a mean of its items**, not a raw count. Handles missing answers and unequal lengths.
- **Report percentiles against a norm sample**, with confidence bands. No norms at launch → say so and show raw profile shape ("relative to your own other scores") until data accumulates.
- **No dominant type, no tie-break rule.** Show a profile, and optionally name the highest *and* lowest dimension as "your most distinctive scores."
- **If a type label is kept for shareability**, derive it from the top dimension but always show the full profile alongside, and never hide the runner-up.
- **Severity bands in Part 2** come from each instrument's published cutoffs (PHQ-9 5/10/15/20, GAD-7 5/10/15), not invented ones.
- **Acquiescence index:** correlate a person's answers across reverse-keyed pairs; flag inconsistent or straight-line responding.
- **Careless-response check:** 2–3 attention items, plus response-time floor.

Open question: do we z-score against norms or report raw means? Norms need data we don't have yet — see §8.

---

## 6. Report design

Per dimension:
1. **Where you scored**, on a continuum with a band, not a point.
2. **What it means behaviorally** — 2–3 sentences, concrete, non-flattering, both directions.
3. **Evidence panel** (collapsible): "Research links this to dopamine — **Strong**" with a one-line summary and citations. Strength ratings come straight from [neurotransmitters-and-personality.md](neurotransmitters-and-personality.md).
4. **What actually moves this**, if anything, with honest effect sizes. Sleep, exercise, therapy, and medication have real evidence; supplements mostly don't.

Also in the report:
- **A "what this isn't" section.** Not a diagnosis, not a measurement of your brain chemistry, not stable across your whole life.
- **A "how Braverman differs" section** for people arriving from the original. This is a differentiator, not a footnote: explain that GABA and acetylcholine natures aren't supported, and that the serotonin mapping is inverted.
- **Explicit uncertainty.** If our sample is small, say the percentile is provisional.

---

## 7. Safety

Non-negotiable:

- **Suicidality items** (PHQ-9 item 9; Braverman 4B had two) → crisis resources shown immediately on a positive answer, region-aware (988 in the US). Never buried at the end of a results page.
- **Screening ≠ diagnosis**, stated before Part 2 starts and again on results.
- **Severe scores** (e.g. PHQ-9 ≥ 20) → prompt to contact a clinician, prominently.
- **No supplement dosing.** If supplements are mentioned at all, mention interactions (5-HTP/St John's Wort + SSRIs = serotonin syndrome risk) and stop there.
- **No claims that a score indicates a chemical deficiency.**
- **Data:** results are sensitive health data. Local-first if possible; if stored, explicit consent, export and delete. If we ever use the data for norms, that's a separate opt-in.
- Consider whether under-18s should be allowed, given the contraception/depression findings and PHQ-9 use in adolescents.

---

## 8. Validation plan (what makes this legitimately "better")

Phase 1 — **Content**
- Item review against the guidelines in §4; 3–5 people rate each item for clarity and construct fit.
- Cognitive interviews with ~10 people: read items aloud, ask what they think it's asking.

Phase 2 — **Pilot (n ≈ 200–300)**
- Internal consistency: target α ≥ .70 per scale (Braverman has no published figure).
- Item-total correlations; drop items below ~.30.
- Exploratory factor analysis: do six factors emerge, or do Seeker/Engine collapse?
- Check acquiescence and social-desirability correlations.

Phase 3 — **Convergent validity (n ≈ 150)**
- Administer alongside IPIP-NEO-120 or BFAS, BIS/BAS, and one of TCI/FTI.
- Predictions to pre-register: Seeker ↔ Openness/Extraversion; Alarm ↔ Neuroticism; Anchor ↔ Conscientiousness; Bond ↔ attachment (ECR-RS).

Phase 4 — **Test-retest (n ≈ 100, 4–6 weeks)**
- Target r ≥ .70 for trait scales. Expect and *predict* lower values for Part 2 state scales — that's the point of splitting them.

Phase 5 — **Norms**
- Only after enough data, and with consent. Report demographic breakdowns; be careful about applying norms across cultures.

Realistic note: phases 2–4 need real recruiting (Prolific ≈ $2–4/participant, so roughly $1.5–3k total). If that's out of scope, then **say clearly in the app that it's unvalidated** — which still puts it ahead of the original, which is also unvalidated but doesn't admit it.

---

## 9. Legal and ethical

- **Don't ship Braverman's items.** They're from a 2005 copyrighted book. Clinic PDFs circulating freely is not a license. Write original items, or use public-domain IPIP items.
- **Instrument licensing:** PHQ-9/GAD-7 are generally free to use, but verify terms for a commercial product. ISI and SHAPS have their own terms. Check each before shipping.
- **Don't use the name "Braverman test"** as the product name — comparison and commentary are fine, branding is not.
- **Health-claim exposure:** avoid anything that reads as diagnosis or treatment recommendation.

---

## 10. Build phases

| Phase | Scope |
|---|---|
| 0 | Item bank written (§4), dimensions locked (§3), stored as structured JSON like [questions.json](questions.json) |
| 1 | Static assessment: Likert flow, local scoring, profile report, evidence panels, safety interstitials |
| 2 | Comparison mode: "how Braverman would have scored you, and where that model is wrong" — the differentiator |
| 3 | Pilot data collection + psychometrics; revise item bank |
| 4 | Tracking (Option D): daily/weekly check-ins, within-person trend charts, modifier logging |
| 5 | Norms, percentile reporting, adaptive short form |

Phase 1 is genuinely small — the existing Vite+ app plus a JSON item bank and a scoring module.

---

## 11. Open questions

1. **Who is this for?** Curious self-quantifiers, people arriving from the original Braverman test, or clinicians? The framing (§2) depends on this.
2. **Do we keep a type label at all?** Types drive sharing and retention; they're also the least defensible part. Middle ground: profile-first with an optional shareable "headline."
3. **Is the biology framing load-bearing, or can we drop it?** If it's mostly a hook, Option B gets simpler and safer.
4. **Commercial or free?** Licensing, health claims and data consent all get stricter if we charge.
5. **Do we collect data for norms?** Big value, big responsibility.
6. **Six dimensions or four?** Four is more memorable and echoes the original's shape. Six is truer to the evidence. Could ship four primary + two secondary.
7. **Is the Braverman comparison a feature or a liability?** It's our best differentiator and also the thing most likely to attract a complaint.
8. **How much do we lean on Part 3 (context)?** Arguably the most useful part for an actual user, and the least "test-like."

---

## 12. Immediate next steps

1. Answer Q1, Q2 and Q6 in §11 — everything else follows.
2. Draft 12 items for one dimension (suggest "Seeker") as a format test.
3. Decide Part 2: licensed instruments vs original items.
4. Define the JSON schema for the new item bank (extend the shape of [questions.json](questions.json): add `key` for reverse scoring, `scale`, `timeframe`).
5. Write the "what this isn't" copy early — it constrains every claim the rest of the app makes.
