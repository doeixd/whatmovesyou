# v1 selection — 65 items from 194

Built by `tools/build-v1.py` from `v1-selection.json` into `v1.json` (bank version **0.9.0** — deliberately pre-1.0; 1.0.0 is reserved for a version whose psychometrics have been checked against real data).

**This is the largest quality decision in the project made without data.** With no pilot and no IRT, selection was judgment against the blueprint cells. Everything below is the reasoning, so a later reader can disagree with specific calls rather than the whole pool.

## Result

| Scale | Items | Keying | Severity (m/mod/ext) | Facets |
|---|---|---|---|---|
| A1 Drive | 8 | +4/−4 | 3/3/2 | 4 / 4 |
| A2 Threat reactivity | 8 | +4/−4 | 3/3/2 | 3 / 3 / 2 |
| A3 Restraint | 8 | +4/−4 | 3/3/2 | 3 / 3 / 2 |
| A4 Sociality | 8 | +4/−4 | 3/3/2 | 3 / 3 / 2 |
| A5 Antagonism | 8 | +4/−4 | 3/3/2 | 3 / 3 / 2 |
| A6 Unusual cognition | 8 | +4/−4 | 3/3/2 | 3 / 3 / 2 |
| A7 Systemizing | 8 | +4/−4 | 3/3/2 | 3 / 3 / 2 |
| A8 Episodicity | 4 | +2/−2 | 1/1/2 | — |
| A9 Impairment | 5 | +5/−0 | 2/1/2 | — |
| **Total** | **65** | | | |

Every scale hits its blueprint cells exactly. Zero errors, zero warnings from `check-pool.py`.

## Selection rules applied, in priority order

1. **Cut anything carrying an unresolvable confound note** — DIF candidates, SES dependence, political loading — wherever an unflagged item covered the same cell. This is why flagged-item counts drop from 73 across the pool to 8 in v1.
2. **Prefer behavioral and other-observed framings** over self-concept statements.
3. **Prefer lifetime framing at the extreme low pole**, which resists depressive-state contamination.
4. **Drop high-desirability items unless nothing else covers the cell.**
5. **Resolve near-duplicate pairs by choosing, not deferring** — the pilot that would have arbitrated them isn't coming.
6. **Keep the pool intact.** Cut items stay in `pool-*.json` at `status: draft`; if v1 data shows a gap, replacements already exist.

---

## Per-scale reasoning

### A1 Drive
**In:** `e01` (starts unasked), `e02` (sticks with what works), `e07` (doesn't seek the next thing), `e12` (people asked me to stop starting things), `f02` (not worth the effort), `f05` (keeps going after others stop), `f06` (loses interest once the interesting part ends), `f10` (pushed to exhaustion unasked).

**Cut and why:** `f03` "I'll take the harder option when the payoff is bigger" — the closest analogue to the effort-discounting paradigm, but the highest desirability risk in the pool and impossible to police without data. `f04` and `f12` — boundary cases with A3 and A2/A8. `e11` — flirted with anhedonia. `e04` (workplace-hierarchy DIF) and `f09` (needs disposable income).

Losing `f03` costs the scale its tightest link to the mechanism literature. Accepted: an item that everyone endorses measures nothing.

### A2 Threat reactivity
**In:** `p01`, `p02`, `p05` (persistence), `t04`, `t05`, `t07` (trigger), `a02`, `a08` (anticipation).

**Cut and why:** `t02` and `t06` — stoicism and public-correction norms are gendered and cultural. `t03` — likely loads on A7 detection rather than A2 distress. `t08` — reads as callousness. `p07` — sleep content overlapping two other blocks. `p08` — high-desirability resilience claim. `a07` — see below.

### A3 Restraint
**In:** `c02`, `c06`, `c08` (cue), `f02`, `f05`, `f07` (follow-through), `b01`, `b05` (brake).

**Cut and why:** `c04`, `f03`, `b08` — the three high-desirability items, all definitionally central, all cut together. This is the scale most weakened by rule 4, and it now leans on behavioral evidence (`b01` said something costly, `b05` sent messages I'd have slept on, `f07` people stopped relying on me). `b07` — the double-barrelled consequence item, cut because no cognitive interview will confirm how people parse it. `c01`/`c05` — SES-dependent. `f04`/`f06` — route to the ADHD flag rather than inflating low Restraint.

### A4 Sociality
**In:** `n01`, `n06`, `n07` (need), `r02`, `r05`, `r08` (reward), `d02`, `d04` (disclosure).

**Cut and why:** `n02` (solitude norms by locale), `d01`/`d05` (the most strongly gendered disclosure items), `n08` (present-tense extreme low pole, indistinguishable from depressive withdrawal). `r08` was kept over `n08` precisely because its lifetime framing survives a current episode.

Only one disclosure item pair survives, which makes that facet thin. Flagged as a known v1 weakness.

### A5 Antagonism
**In:** `c01`, `c04` (callousness), `r02`, `r04`, `r07` (retaliation), `s02`, `s05`, `s08` (suspicion).

**Cut and why:** `c03` (blunt to the point of unkindness) — the bank's top DIF candidate; directness norms differ too sharply. `c05` — tracks beliefs about personal responsibility as much as callousness. `c07` ("I can hurt someone and not feel much about it") — the highest-stigma item in the bank, cut in favour of `r07` ("gone out of my way to get back at someone"), which covers the extreme cell behaviorally rather than by asking someone to confess to callousness. `r05`, `r08`, `c08` — high desirability. `s01`, `s04` — generalized trust tracks environment, not just disposition.

`s05` (the justification item) was kept deliberately: with no informant data, it's the only lever against this scale's weak self-report validity.

### A6 Unusual cognition
**In:** `p03`, `p07` (perceptual), `a02`, `a05`, `a09` (associative), `f02`, `f05`, `f07` (referential).

**Cut and why:** `p06` (sensed a presence) and `p08` (heard someone speaking) — both common in bereavement and religiously normative, and with no DIF testing available there's no way to separate signal from culture. `p04` — same problem in reverse. `f03` (people say I read meaning into things) — the facet's top DIF candidate despite being the rewritten, religion-safe version. `f08` (being watched or singled out) — for some people that's accurate rather than referential.

What survives is the consequence-anchored core: `f07` (acted on the sense that events were directed at me) and `a09` (the community check that lets shared beliefs score low). The perceptual facet is down to two items and is the weakest part of v1 — appropriate, given it's the part most likely to measure religion.

### A7 Systemizing
**In:** `s01`, `s02`, `s05` (rule), `c04`, `c07`, `c08` (detail), `l01`, `l04` (literality).

**Cut and why:** `l08` ("I read social situations quickly and accurately") — high desirability, and under-endorsed exactly by people who have learned to camouflage. `l03`, `l06` — high-context/low-context communication norms. `c03` — likely loads on A2 distress rather than A7 load. `s07` (taken something apart) — kept out only because the extreme cells were full; a strong item held in reserve.

### A8 Episodicity
**In:** `epi_01` (energy comes in waves), `epi_07` (never felt unusually capable — lifetime), `epi_10` (decisions I couldn't explain), `epi_12` (never felt like a different person — lifetime).

Deviates from the blueprint's 2/1/1 severity split in favour of **1/1/2**, weighting the extreme end. Justification: the scale exists to feed one interaction rule about the high end, and two lifetime-framed reverse items give it state resistance a four-item scale badly needs.

**Cut:** `epi_03` and `epi_06` — the sleep-need item is the scale's most discriminating, but it needs a cognitive interview to confirm the "don't feel tired" clause does its work, and that interview isn't happening. Held in reserve.

### A9 Impairment
**In:** `imp_01` (work/study), `imp_03` (doing less of what I enjoy), `imp_05` (avoidance), `imp_09` (can't keep up at all), `imp_10` (thoughts of self-harm).

**Cut:** `imp_06` (didn't turn up — overlaps A3), `imp_08` (needed cover — circumstance-dependent), `imp_02`, `imp_04`, `imp_07` — all reasonable, cut only for length. Three of the five retained are adapted-format items whose licence still reads TO VERIFY; `check-pool.py` will block them at `piloted` status until that's resolved.

---

## Cross-cutting decisions

**The designed near-pair is gone.** `a2_threat_a07` (opportunity declined from threat) and `a1_drive_f11` (opportunity declined from effort cost) were written as a test of whether respondents hear the motive distinction. That test needed a pilot. Both items were individually ambiguous, so both were cut rather than shipping one and guessing which. The pair stays in the pool, and if usage data ever reaches useful n, it can be re-introduced as a designed probe.

**Flagged items drop from 73/194 to 8/65.** Of the eight that remain, each is flagged for a confound that can be *stated* rather than removed — circumstance dependence, camouflaging, bereavement — and each is the only reasonable occupant of its blueprint cell.

**Reading level:** max grade 7.4, mean 5.6.

**Seven items in v1 use the `other-observed` framing** (people told me / people stopped relying on me / people asked me to stop). That's the highest-value technique found during generation, and it's the closest a self-report instrument gets to informant data without the informant module.

## Known weaknesses of v1, stated plainly

1. **A3 lost its three cleanest items to desirability** and now leans on behavioral evidence. If real data shows it under-performing, the fix is to re-introduce `c04`/`f03` with a desirability control, not to invent new items.
2. **A4's disclosure facet has two items,** both non-gendered leftovers after the gendered ones were cut.
3. **A6's perceptual facet has two items,** deliberately — it's the facet most likely to measure religion.
4. **A5 remains the weakest scale by construction:** lowest self-report validity, highest desirability pressure, strongest cultural loading. The informant module is its only real remedy.
5. **No item in v1 has been read aloud by anyone but its author.**
