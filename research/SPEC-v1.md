# Test design v1 — the spec

Synthesis of everything in this folder. Where the planning notes explored options, this commits to a design.

**One-line description:** a three-block assessment that measures *where you sit* on dimensions that run from ordinary personality into clinical territory, *what moves you* day to day, and *what might be physically different* about you — with every biological claim graded by evidence and, where possible, a way to check it.

**Design commitments:**
1. Never output a disorder name as a finding about the user.
2. Never claim to measure a neurotransmitter level.
3. Every biological link carries an evidence grade.
4. Every setpoint flag carries a confirmation route.
5. Trait elevation and impairment are scored separately and always shown together.

---

## 1. Architecture

```
BLOCK A — SPECTRA      Who you are          ~60 items   dimensional, percentile-scored
BLOCK B — GAIN         What moves you       ~24 items   reactivity to named inputs
BLOCK C — SETPOINTS    What's different     ~26 items   flags + confirmation routes
CONTEXT                What's going on      checklist   meds, substances, sleep, stressors
```

Total ≈ 110 items, ~12–15 minutes. A 5-minute **core** (Block A + impairment only) works standalone for people who won't finish the long version.

Why three blocks: they answer genuinely different questions and have genuinely different evidence bases. Braverman collapsed all three into one and got all three wrong.

---

## 2. Block A — Spectra (the personality core)

Seven axes, each continuous, each running from ordinary variation into clinical territory. Six derive from the HiTOP/PID-5 structure; the seventh (Systemizing) is added because autistic traits aren't well captured by that model.

**8 items each = 56 items.** Half reverse-keyed. 5-point agreement scale.

| # | Axis | Poles | Body link | Evidence | How it's verifiable |
|---|---|---|---|---|---|
| A1 | **Drive** | Inert ←→ Driven | Dopamine (reward, effort, exploration) | **Strong** | Dopamine agonists cause impulse-control disorders; amphetamine raises effort-for-reward |
| A2 | **Reactivity to threat** | Unflappable ←→ Highly reactive | Serotonin 5-HT2A; SSRI-responsive | **Moderate** | 5-HT2A binding ↔ inward neuroticism (r=.37, replicated); paroxetine lowers neuroticism 6.8× placebo |
| A3 | **Restraint** | Impulsive ←→ Controlled | Dopamine reward-cue; serotonin constraint | **Strong (dopamine side)** | ICDs on dopamine agonists; tryptophan depletion in aggression-prone |
| A4 | **Sociality** | Detached ←→ Connected | μ-opioid | **Preliminary** | μ-opioid receptor availability ↔ attachment style (PET) |
| A5 | **Antagonism** | Accommodating ←→ Combative | Serotonin (weak); androgen exposure | **Weak–moderate** | Serotonin-aggression r=−.12; CAH and testosterone-therapy effects at clinical exposure |
| A6 | **Unusual cognition** | Conventional ←→ Unusual | Dopamine D2 | **Strong** | Antipsychotics are D2 blockers; amphetamine can induce psychosis |
| A7 | **Systemizing** | Fluid/social ←→ Systematic/literal | Highly heritable; no clean transmitter story | **Genetic, not chemical** | Twin/GWAS evidence; broader autism phenotype in relatives |

Plus two cross-cutting short scales:

| | Scale | Items | Why |
|---|---|---|---|
| A8 | **Episodicity** | 4 | Distinguishes stable high-Drive from *cycling* energy. This is the hypomanic-temperament signal — HPS was the best predictor of later bipolar disorder (d=0.67) over 23 years. It's the pattern over time, not the level, that carries the information. |
| A9 | **Impairment** | 5 | WSAS-style. **The most important scale in the test.** Without it, a trait score is uninterpretable. |

### Sample items

Style: concrete, behavioral, evidence-of-past-action. Not self-concept ("I am a deep thinker"), which is what made Braverman's items worthless.

**A1 Drive**
- "I start things nobody asked me to start." (+)
- "I'll do work others would find tedious if the thing itself interests me." (+)
- "I often decide something isn't worth the effort." (−)

**A2 Reactivity to threat**
- "Something that went wrong hours ago is still running in my head." (+)
- "I notice a change in someone's tone before other people do." (+)
- "Criticism rolls off me." (−)

**A3 Restraint**
- "I've spent money within minutes of first seeing something." (−)
- "I finish what I start even after the interesting part is over." (+)
- "I've said something in the moment that cost me later." (−)

**A4 Sociality**
- "A week without seeing anyone close to me feels fine." (−)
- "I'd rather tell someone what happened than process it alone." (+)
- "I keep parts of my life separate from everyone." (−)

**A5 Antagonism**
- "If someone pushes, I push back harder." (+)
- "I've been told I'm blunt to the point of unkindness." (+)
- "I give people the benefit of the doubt by default." (−)

**A6 Unusual cognition**
- "I make connections between things that other people don't see as related." (+)
- "I've had the sense that something was communicating with me personally — a song, a sign, a coincidence." (+)
- "My thinking is conventional and I'm fine with that." (−)

**A7 Systemizing**
- "I notice small changes to a room or a routine that others miss." (+)
- "I need to know how a thing works before I can use it comfortably." (+)
- "I read between the lines easily in conversation." (−)

**A8 Episodicity**
- "There are weeks when I need much less sleep and get far more done." (+)
- "My energy and confidence are roughly the same month to month." (−)
- "People who know me would say I come in waves." (+)

**A9 Impairment** (0–8 scale, "because of how I've been feeling or functioning...")
- "...my work or studies have suffered."
- "...my close relationships have suffered."
- "...I've avoided things I'd otherwise do."

---

## 3. Block B — Gain (what moves you)

The reactivity layer, grounded in the strongest person-level finding in the research: the PMDD add-back studies, where identical hormone levels produced opposite behavioral responses. **Sensitivity to change, not level, is the individual difference that matters.**

Six axes × 4 items = 24 items. Magnitude scale ("No different → Completely derails me"), with a recorded "doesn't apply" option.

| Axis | Body link | Evidence |
|---|---|---|
| **Sleep** | Circadian/serotonergic; the largest everyday effect on mood and motivation | Strong |
| **Stimulants** (caffeine, nicotine) | Adenosine/dopamine; CYP1A2 metabolizer status | Moderate |
| **Alcohol** | GABA-A; next-day rebound anxiety | Strong (acute) |
| **Stress/provocation** | Cortisol, noradrenaline | Moderate |
| **Reward cues** (food, shopping, games, feeds) | Ghrelin/leptin, dopamine; GLP-1 trials cut craving across substances | Moderate–strong |
| **Social connection/rejection** | μ-opioid | Preliminary |

Sample items in [draft-items.json](draft-items.json). Key wording fix flagged there: ask for **magnitude of change** ("how different is your mood"), not direction.

Note the relationship to Block A: Gain is *state sensitivity*, Block A is *trait level*. They're separable — a person can be low-Drive and highly sleep-reactive, or high-Drive and barely affected by anything.

---

## 4. Block C — Setpoints (what's physically different)

**Inclusion rule: a knob goes in only if there's a way to check the answer.** This is what most distinguishes the test from Braverman's, which offers no confirmation route for anything.

| Flag | Items | What it detects | Confirmation route |
|---|---|---|---|
| **Chronotype** | 4 (clock times, work/free days → MSFsc) | Circadian phase — a literal physiological setpoint | Wearable sleep timing on free days; DLMO in research settings. MCTQ ↔ DLMO r ≈ .54–.68 |
| **ADHD pattern** | 6 (ASRS-style) | Real, heritable, treatable attention difference | Clinical assessment. Report must state this is **not** "low dopamine" — a 2024 review found limited evidence for a hypo-dopaminergic state |
| **Cycle/hormone sensitivity** | 4, gated | Mood change tied to cycle phase, contraception start, perimenopause | Prospective daily ratings across 2 cycles — the actual diagnostic gold standard, and something an app can do |
| **Iron status** | 4 (leg restlessness at night, fatigue out of proportion, heavy periods, donor/vegetarian) | Low ferritin | Ferritin blood test. Note RLS research uses <50 µg/L, while lab "normal" often starts at 15 |
| **Thyroid** | 3 (cold intolerance, unexplained weight/energy change, family history) | Hypothyroidism | TSH/free T4 |
| **ALDH2 flush** | 2 | A discrete genotype, detectable by questionnaire (self-report ~100% sensitive, ~68% specific; refined versions ~95%/~77%) | Genotype, or an observed flush |
| **Caffeine metabolism** | 2 | Fast vs slow CYP1A2 metabolizer | Consumer genotype, or a structured self-experiment |

~26 items, most of them fast.

### Context checklist (not scored)
Medications (SSRIs, stimulants, dopamine agonists, hormonal contraception, GLP-1s, thyroid), substances, average sleep, recent stressors, known lab results. Many Block A and C findings have an obvious explanation sitting right here, and the report should say so before reaching for biology.

---

## 5. Scoring

- **Mean of items per scale**, not a count. Handles missing data and unequal scale lengths.
- **Percentile against norms**, shown as a band with uncertainty, never a bare number. No norms at launch → show profile shape relative to the person's own other scores and say so.
- **No dominant type. No tie-break rule.** Those were Braverman's errors.
- **Episodicity and Impairment modify interpretation**, they don't get headline billing.
- **Quality checks:** 3 attention items, a response-time floor, and an acquiescence index from reverse-keyed pairs.
- **Reactivity floor:** "doesn't apply" (never drinks, no caffeine) is recorded and excluded, never scored as low.

### The interpretation grid

|  | Low impairment | High impairment |
|---|---|---|
| **Trait elevated** | "A real feature of how you're built. Here's the cost and the upside." | "This pattern is affecting your life. Worth a formal assessment." |
| **Trait typical** | — | "Something is affecting you that this profile doesn't explain. Worth looking further." |

The bottom-right cell prevents the test from falsely reassuring someone who's genuinely unwell.

---

## 6. The report

1. **Headline** — the reactivity profile, not a personality type. "Sleep-sensitive, low stimulant reactivity, steady under provocation." Shareable, specific, and it claims nothing about chemistry.
2. **Spectra profile** — seven bands with cost *and* upside for each. The upside is not a consolation prize: differential-susceptibility evidence shows high-sensitivity people do better in good environments, not just worse in bad ones.
3. **Setpoint flags** — each with a confidence level, what the pattern is, and **how to check it**. Conservative thresholds; "no flags" is a common and fine result.
4. **What moves you** — the gain profile, translated into levers ranked by evidence strength.
5. **What this isn't** — not a diagnosis, not a measurement of brain chemistry, not permanent.
6. **Compared to the Braverman test** — for people arriving from the original. Explains that the GABA and acetylcholine natures have no validated trait behind them, and that the serotonin nature is inverted (serotonin tracks *constraint*; thrill-seeking tracks dopamine).

---

## 7. Deliberately excluded

| Excluded | Why |
|---|---|
| "GABA nature," "acetylcholine nature" | No validated trait exists for either. The one cholinergic PET trait finding points to *higher harm avoidance*, the opposite of Braverman's description. |
| "Serotonin = impulsive thrill-seeker" | Backwards. |
| Type A | The original coronary finding failed to replicate; only hostility survived, on thin evidence. Hostility is already in A5. |
| Dominant-type labels | Types throw away information and destabilize retest results. |
| Supplement dosing | No trial links questionnaire scores to supplement response, and 5-HTP/St John's Wort interact dangerously with SSRIs. |
| Any disorder name as a result | Screening isn't diagnosis. |
| Blood pressure, cholesterol, vein visibility, body temperature | People can't self-report these. |

---

## 8. Safety (non-negotiable)

- Suicidality items → region-aware crisis resources immediately on a positive answer, never at the end of a results page.
- "Screening, not diagnosis" stated before Block A and again on results.
- Severe impairment + elevated trait → prominent prompt to contact a clinician.
- Language of degree and current state, never identity ("you score high on detachment," not "you're schizoid").
- Note in the copy that on seven axes, something is elevated for most people — that's how percentiles work.
- Adults only at launch.
- Health data: local-first where possible; explicit consent, export and delete; norms use is a separate opt-in.

---

## 9. Build order

| Phase | Scope |
|---|---|
| 0 | Item bank written to this spec, stored as structured JSON (extend [draft-items.json](draft-items.json): `key`, `scale`, `timeframe`, `axis`) |
| 1 | Block A + impairment, local scoring, profile report, safety interstitials — the 5-minute core |
| 2 | Blocks B and C, context checklist, setpoint flags with confirmation routes |
| 3 | Braverman comparison view |
| 4 | Pilot (n≈200–300): α, item-total correlations, factor structure, acquiescence |
| 5 | Convergent validity (n≈150) against IPIP-NEO/BFAS, PID-5-BF, ASRS; test-retest (n≈100, 4–6 weeks) |
| 6 | Tracking + n-of-1 experiments; observed vs predicted reactivity |
| 7 | Norms, percentile reporting, adaptive short form |

---

## 10. Decisions still open

1. **Original items or licensed instruments?** Licensed (PID-5-BF, ASRS, WSAS) buys instant validity and norms, but needs licensing clearance — especially for commercial use. Original items are free and differentiating but need the full validation road. **Leaning: original items written against these constructs, validated against the licensed ones in Phase 5.**
2. **Seven axes or six?** Systemizing (A7) may partly load on Detachment and Unusual cognition. The pilot factor analysis decides.
3. **Percentiles for clinical-range scores?** Telling someone they're at the 97th percentile on unusual cognition is heavy. Bands may be both kinder and more honest.
4. **How prominent is the Braverman comparison?** Best differentiator; also the most likely to attract a complaint.
5. **Is Block C a medical screener?** It's edging that way. The line: "worth a conversation with a clinician," never "you have X."

## Source documents

Evidence behind every claim above: [neurotransmitters-and-personality.md](neurotransmitters-and-personality.md) · [chemistry-and-behavior.md](chemistry-and-behavior.md) · [PLAN-notes-03-setpoints.md](PLAN-notes-03-setpoints.md) · [PLAN-notes-04-clinical-spectra.md](PLAN-notes-04-clinical-spectra.md) · [PLAN-notes-02-reactivity.md](PLAN-notes-02-reactivity.md) · [validity.md](validity.md)
