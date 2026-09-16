# Item bank — working area

Execution of [../research/PLAN-06-item-methodology.md](../research/PLAN-06-item-methodology.md). Schema and validation live in [../schema](../schema).

| File | Phase | State |
|---|---|---|
| `constructs.md` | 0 — construct definitions | 9 sheets drafted, **awaiting sign-off** |
| `constructs.md` § Blueprint | 1 — table of specifications | Block A fixed: 65 final items, 194 to generate |
| `pool-a1-drive.json` | 2 — generation | **24/24**, validates clean, matches blueprint |
| `pool-a2-threat.json` | 2 — generation | **24/24**, validates clean, matches blueprint |
| `pool-a3-restraint.json` | 2 — generation | **24/24**, validates clean, matches blueprint |
| `pool-a4-sociality.json` | 2 — generation | **24/24**, validates clean, matches blueprint |
| `pool-a7-systemizing.json` | 2 — generation | **24/24**, validates clean, matches blueprint |
| `pool-a5-antagonism.json` | 2 — generation | **24/24**, validates clean, matches blueprint |
| `pool-a6-unusual.json` | 2 — generation | **28/28**, validates clean, matches blueprint |
| `pool-a8-episodicity.json` | 2 — generation | **12/12**, validates clean, matches blueprint |
| `pool-a9-impairment.json` | 2 — generation | **10/10**, validates clean; keying balance waived (impairment format) |
| `v1-selection.json` + `v1-selection.md` | 3 — selection | **65 items chosen from 194**, reasoning recorded per scale |
| `v1.json` | 3 — selection | **Built bank v0.9.0** — schema-valid, all blueprint cells hit, 0 warnings |

**BLOCK A COMPLETE — 194 / 194 items**, all schema-valid and blueprint-conformant, 73 carrying recorded review notes.

⚠️ **Written by one author. No interviews, no independent raters, no pilot — and per [../research/PLAN-07-no-budget.md](../research/PLAN-07-no-budget.md), there will be none.** A5 and A6 were generated on invented phrasing rather than harvested speech, which is a known and permanent weakness on exactly the two scales where it matters most.

## Progress

| Scale | Sheet | Generated / target | Gate 1 fit | Gate 2 bias | Gate 3 desirability | Gate 4 clarity | Cog. interviews |
|---|---|---|---|---|---|---|---|
| A1 Drive | ✅ | **24 / 24** | ☐ | ☐ | ☐ | ☐ | ☐ |
| A2 Threat reactivity | ✅ | **24 / 24** | ☐ | ☐ | ☐ | ☐ | ☐ |
| A3 Restraint | ✅ | **24 / 24** | ☐ | ☐ | ☐ | ☐ | ☐ |
| A4 Sociality | ✅ | **24 / 24** | ☐ | ☐ | ☐ | ☐ | ☐ |
| A5 Antagonism | ✅ | **24 / 24** | ☐ | ☐ | ☐ | ☐ | ☐ |
| A6 Unusual cognition | ✅ | **28 / 28** | ☐ | ☐ | ☐ | ☐ | ☐ |
| A7 Systemizing | ✅ | **24 / 24** | ☐ | ☐ | ☐ | ☐ | ☐ |
| A8 Episodicity | ✅ | **12 / 12** | ☐ | ☐ | ☐ | ☐ | ☐ |
| A9 Impairment | ✅ | **10 / 10** | ☐ | ☐ | ☐ | ☐ | ☐ |

## Checks

```bash
# schema validity
npx ajv-cli validate --spec=draft2020 -c ajv-formats \
  -s schema/item-bank.schema.json -d bank/pool-a1-drive.json

# blueprint conformance (keying balance, facet spread, severity spread, dupes)
python tools/check-pool.py bank/pool-a1-drive.json
```

A1 currently reports: 24 items, keying 12/12, facets 12/12, severity 9 mild / 9 moderate / 6 extreme, no duplicates, mean reading grade 5.7 (max 8.0), informant paraphrases complete.

## Decision log

Every keep/cut/deviation with its reason, so nothing gets re-litigated by intuition later.

| Date | Scale | Decision | Reason |
|---|---|---|---|
| 2026-09-16 | A1 | Cut a planned "I finish dull work because I said I would" item | Belongs to A3 follow-through. The A1/A3 boundary is *effort cost* vs *competing pull*; this was the wrong side of it. |
| 2026-09-16 | A1 | Flipped `e05` and `f07` to reverse-keyed | Restore 12/12 keying balance after generation skewed positive. Both rewritten as genuine opposite-pole statements, not negations. |
| 2026-09-16 | A1 | Kept `f03` despite `desirabilityRisk: high` | It's the closest behavioral analogue to the effort-discounting paradigm that grounds the dopamine link. Matched at the opposite pole by `f02` and `f04`; will be dropped if it shows a strong desirability correlation in Pilot 1. |
| 2026-09-16 | A1 | Accepted a 4/2 keying split in the extreme band | Deviation from the blueprint. Extreme *low*-pole items are genuinely hard to write without describing depression instead of low drive — `e11` already flirts with anhedonia. Two more will be attempted during the revision round rather than forced now. |
| 2026-09-16 | A1 | Flagged `e11`, `f04`, `f12` for cross-loading checks | e11 ↔ depressive anhedonia; f04 ↔ A3; f12 ↔ A2 restlessness and A8 phases. All three are cut candidates if they load elsewhere. |
| 2026-09-16 | A1 | Flagged `e04` (waiting to be told) and `f09` (own time and money) for DIF | Workplace-hierarchy norms and disposable income respectively. |
| 2026-09-16 | A2 | Re-tagged `t01` mild → moderate and `a04` moderate → mild | The conformance checker caught a keying skew (mild 6+/3−, moderate 3+/6−). Rather than flip keying, re-examined severity: conceding that criticism "lands harder than it should" is a stronger admission than a mild item, and dealing with problems as they arrive is an ordinary preference. Both bands now within tolerance. |
| 2026-09-16 | A2 | Wrote `a07` as a deliberate near-pair with `a1_drive_f11` | Same behavior (opportunity declined), different motive (threat vs effort cost). If they correlate > .60 the distinction isn't reaching respondents and one goes. This is a designed test of the A1/A2 boundary, not an accident. |
| 2026-09-16 | A3 | Kept three high-desirability items (`c04`, `f03`, `b08`) | Each is the definitional core of its facet. All are matched by opposite-pole items and all are first-cut candidates if Pilot 1 shows desirability correlations. |
| 2026-09-16 | A3 | Kept `b07` double-barrelled ("a job, a relationship or a lot of money") | Deliberate: the construct is *serious consequence*, and enumerating raises the hit rate for a rare event. Cognitive interviews must confirm people read it as "any of these"; split if not. |
| 2026-09-16 | A4 | Wrote `r08` in lifetime framing ("never really understood what people get out of closeness") | Design fix for state contamination. "Never understood" is much harder to endorse during a depressive episode than "don't feel it now", so the lifetime anchor separates trait detachment from current withdrawal. Reusable pattern for every extreme low-pole item. |
| 2026-09-16 | A4 | Re-tagged `d03` mild and `d04` moderate at generation time | Applied the A2 lesson pre-emptively: "rather handle a problem alone" is an ordinary preference (mild), while claiming people know what's actually going on is a stronger positive claim (moderate). Bands balanced without a checker warning. |
| 2026-09-16 | A4 | Flagged the whole disclosure facet for gender/locale DIF | Disclosure norms are the most strongly gendered content in the bank. If DIF appears, the facet may need separate norms rather than item removal. |
| 2026-09-16 | A7 | Kept `l08` despite `desirabilityRisk: high` | "I read social situations quickly and accurately" is flattering, and the people most likely to under-endorse it are those who have learned to camouflage. Camouflaging is learned and gendered, so every autistic-trait self-report understates the construct in some groups — a limitation to state in the report copy rather than engineer away. |
| 2026-09-16 | A7 | Put sensory items (`c03`, `c06`, `c07`) in the detail facet, not A2 | Sensory load could be distress-driven. If the whole detail facet loads on A2 in Pilot 1, the facet belongs to Threat reactivity and A7 becomes a two-facet scale. Registered as a boundary test. |
| 2026-09-16 | A9 | Waived keying balance for impairment-format scales in `check-pool.py` | Severity formats are conventionally same-keyed, and reversing them ("my work has NOT suffered") is a documented source of respondent error. The waiver is conditioned on the response-scale type, not on the scale id, so it can't be abused to excuse an unbalanced Likert scale. |
| 2026-09-16 | A9 | Wrote the informant paraphrase of the risk item as *"they have talked about hurting themselves"* | Informants cannot report thoughts. Asking them to infer inner states would produce noise on the single most consequential item in the bank. |
| 2026-09-16 | A9 | Kept `imp_08` ("other people have had to cover for me") despite circumstance dependence | People without colleagues or family have nobody to cover for them and will under-endorse regardless of severity. The not-applicable option exists for this case; alternative was to cut a genuinely informative item. |
| 2026-09-16 | A8 | Marked the scale `internalOnly` | Episodicity feeds the pre-specified interaction rule rather than appearing as a headline band. Telling someone they score high on a bipolar-adjacent scale is the most stigmatizing output the test could produce, and it is not what the scale is for. |
| 2026-09-16 | A8 | Built the scale around reduced sleep *need*, not sleep quality | Per the construct sheet, this is the discriminating feature versus insomnia. `epi_06` carries it via the "and don't feel tired" clause; cognitive interviews must confirm that clause is doing the work. |
| 2026-09-16 | A5 | Wrote `s05` as a justification item ("I've been proved right about people I didn't trust") | Lets a suspicious respondent endorse the construct without conceding a flaw. With no informant data available, this is the only lever against low self-report validity on the bank's least self-observable scale. |
| 2026-09-16 | A5 | Kept `c07` ("I can hurt someone and not feel much about it") despite being the highest-stigma item in the bank | Without it the scale has no top end. Constraint recorded: it must never be surfaced as a standalone statement about the user. |
| 2026-09-16 | A5 | Flagged `c03` (blunt to the point of unkindness) as the bank's top DIF candidate | The same speech is "honest" in one culture and "unkind" in another, and the item is anchored to others' reactions, which are themselves culturally set. First cut if locale effects appear. |
| 2026-09-16 | A6 | Built the whole scale on consequence-anchoring rather than belief content | Items ask what followed (others' reactions, actions taken), never what was believed. This is the construct sheet's religion rule made operational, and it is the main defence available without DIF testing. |
| 2026-09-16 | A6 | Wrote `a09` specifically to give the shared-community case a low-pole answer | "Even my most unusual ideas turn out to be ones plenty of other people share" lets someone whose beliefs sit inside a tradition endorse and score low — the construct-sheet rule made answerable rather than merely stated. |
| 2026-09-16 | A6 | Flagged `f08` (being watched or singled out) for environment confound | Surveillance, harassment and discrimination are real; endorsement may be accurate rather than referential. Must never be read without the environment caveat. |
| 2026-09-16 | A2/A3 | Two extreme low-pole items still describe adjacent constructs | `a2_threat_t08` risks reading as callousness (A5) and `p08` as flattering resilience. Kept for pilot with cross-loading checks recorded; this is the predicted difficulty logged after A1. |

## Cross-loading register

Pre-specified boundary tests, written at generation time so Pilot 1 checks a fixed list rather than fishing. Each row is a place where two scales could turn out to be one.

| Items | Boundary | Prediction | If it fails |
|---|---|---|---|
| `a2_threat_a07` ↔ `a1_drive_f11` | Opportunity declined: threat motive vs effort cost | r < .60 | Drop one; the motive distinction isn't reaching respondents |
| `a3_restraint_f01` ↔ `a1_drive_f04` | Not finishing: competing pull vs effort cost | Loads on own scale | The A1/A3 facet split has failed; merge or re-specify |
| `a2_threat_t03` ↔ A7 Systemizing | Noticing tone: distress vs detection | Loads on A2 | Move to A7 — detection is not distress |
| `a2_threat_t08` ↔ A5 Antagonism | Not stung by what upsets others: low reactivity vs callousness | Loads on A2 | Cut; it's measuring callousness |
| `a3_restraint_f04`, `f06` ↔ Block C ADHD flag | Non-completion: pull vs distraction | Correlates with ASRS items but doesn't replace them | Route to the flag rather than inflating low Restraint |
| `a3_restraint_c03` ↔ Block B reward-cue gain | Stable tendency vs magnitude of pull | Separable | Drop the A3 item, keep the gain axis |
| `a3_restraint_b04` ↔ A5 Antagonism | Brake vs motive | No ceiling effect in low-A5 respondents | Reword: people with nothing to hold back can't answer it |
| `a1_drive_e11` ↔ state block | Not wanting anything new: low drive vs anhedonia | Tracks A1 more than PHQ | Cut |
| `a2_threat_p07` ↔ Block B/C sleep | Lost sleep over a remark: trigger vs insomnia | Tracks A2 | Cut |
| A7 detail facet (`c03`, `c06`, `c07`) ↔ A2 | Sensory load: systemizing vs distress | Loads on A7 | The facet moves to A2; A7 becomes two facets |
| `a4_soc_n08`, `a4_soc_r08` ↔ state block | Low sociality vs depressive withdrawal | `r08` (lifetime framing) resists state; `n08` may not | Keep `r08`, cut `n08` |
| `a7_sys_c06` ↔ A4 reward facet | Loud environments: sensory drain vs sociability | Loads on A7 | Reword to remove the social element |
| `a7_sys_l06` ↔ A5 Antagonism | Preferring directness vs being blunt | r < .50 | Reword; preference is not aggression |
| `a4_soc_n05` ↔ A2 | Seeking company when struggling: instinct vs action | Cognitive interviews confirm respondents read "instinct" | Reword — high-A4/high-A2 people want company but avoid seeking it |
| `a8_epi_03` ↔ A1 Drive | Productive weeks: variability vs level | Correlates with the rest of A8 more than with A1 | Cut; it's measuring Drive |
| `a8_epi_06` ↔ Block C sleep items | Reduced sleep need vs insomnia | Endorsed independently of insomnia items | Reword; the "don't feel tired" clause isn't working |
| `a9_imp_06` ↔ A3 follow-through | Not turning up: impairment vs low Restraint | Loads on A9 given the block framing | Add the "because of how I've been feeling" stem to the item itself |

## Notes from generating the first scale

Worth recording while it's fresh, because it changes how the remaining eight should be written:

1. **Extreme-severity reverse items are the hard case.** Writing "extremely high drive" is easy; writing "extremely low drive" without describing a depressive episode is not. Expect the same on A2 (extreme low reactivity reads as flatness) and A4 (extreme low sociality reads as depression). Plan: write these *last*, after the state block exists to contrast against.
2. **Six of 24 items needed review notes** — a quarter of the pool has a known confound or boundary risk recorded at birth. That's the schema doing its job; those notes become the Pilot 1 analysis checklist rather than surprises.
3. **The `other-observed` framing works well** ("People close to me have asked me to stop starting things"). It gets at extremity through external consequence rather than self-assessment, and the informant paraphrase is trivial. Use it more.
4. **Desirability is asymmetric by scale.** Drive items are flattering, so the positive pole attracts inflation. A5 Antagonism will have the opposite problem, and it's the scale where the informant module matters most.

## Notes from A2 and A3

5. **The conformance checker earned its keep immediately.** It caught a keying skew in A2 that I'd have shipped. Worth noting the fix was to re-examine *severity judgments*, not to flip keying — the tooling surfaced a genuine mis-rating rather than just a bookkeeping error.
6. **Flagged-item counts are climbing: 6 → 10 → 13.** A3 has 13 of 24 items carrying a recorded risk. That's not a quality problem, it's what happens when scales sit next to each other; but it does mean Pilot 1's analysis plan is now substantial and should be written before more scales are generated.
7. **Desirability is the recurring tax on high-pole items.** "I stick to limits", "I do what I said I'd do", "I don't do anything I'll regret" are all definitionally correct and all flattering. Each is matched at the opposite pole, but if Pilot 1 shows a desirability factor, A3 loses its cleanest items and will need rebuilding around behavioral evidence only.
8. **A5 Antagonism will be the hardest scale in the bank** — highest desirability pressure, lowest self-report validity, highest cultural loading on directness norms. It should be generated last, after the critical-incident interviews.

## Notes from A4 and A7

9. **The lifetime-framing trick is the best thing discovered so far.** `a4_soc_r08` ("I've never really understood what people get out of closeness") solves the extreme-low-pole problem that showed up in A1 and A2: a lifetime claim is hard to endorse from inside a depressive episode, while a present-tense one isn't. Every remaining extreme low-pole item should be tried in this framing first.
10. **Applying prior lessons pre-emptively works.** A4 was written with the A2 severity/keying lesson already in hand and produced no checker warnings. The cost of each scale is dropping as the rules accumulate.
11. **A7 has an honest limitation that can't be engineered away.** Camouflaging is learned and gendered, so autistic-trait self-report understates the construct in exactly the people most likely to have been missed by earlier assessment. This belongs in the report copy as a stated limitation — the same move as declaring `grade: "none"` on a body link.
12. **Flag counts stabilised** (6, 10, 13, 8, 7). A3 remains the outlier, which fits: it sits between A1, A5, Block B and the ADHD flag, so it has the most neighbours.

## Notes from A8 and A9

13. **The checker needed a principled exemption, not an override.** A9 is all same-keyed because reversing impairment items ("my work has NOT suffered") is a known source of respondent error. I conditioned the waiver on the *response-scale type* rather than the scale id, so it can't be reused to excuse a genuinely unbalanced Likert scale. Tooling exceptions should be earned by a property of the data, not by a name.
14. **A8 is the first `internalOnly` scale.** It feeds the interaction rule and never appears as a headline band. Telling someone they score high on a bipolar-adjacent scale is the most stigmatizing output this test could produce — and it isn't what the scale is for.
15. **The lifetime-framing pattern generalised immediately.** Three of A8's twelve items use it (`epi_07`, `epi_12`, and `epi_10`'s lifetime anchor), which is what makes a variability scale survivable when the respondent is currently in a trough.
16. **Block A's risk surface is exactly one item.** `a9_imp_10` is the only disclosure item in 142, and it carries an interrupt-level safety trigger. Worth stating plainly because it sets the safety review scope: one item, one interrupt path, one resource set to localize.

## Notes from A5 and A6 — and the budget reality

17. **A5 and A6 were generated without the interviews I said they needed.** That's a real, permanent weakness, not a deferred task. A5's phrasing may not match how combative people actually describe themselves, and A6's religiosity boundary is drawn with my language rather than respondents'. Both are recorded here rather than smoothed over.
18. **Consequence-anchoring is the technique that saved A6.** Every item asks what *followed* — what others said, what the person did — instead of what was believed. It's the only defence against the religiosity confound that doesn't require DIF testing we can't run.
19. **A5 has an unfixable asymmetry.** It's simultaneously the scale where self-report is least valid, desirability pressure is highest, and cultural loading is strongest. The justification item (`s05`) and the other-observed items are partial mitigations. The real fix is the informant module, which is now the highest-value thing left to build.
20. **A6's facets may not hold together.** Desirability runs *upward* on the associative facet (it reads as creativity) and *downward* on the perceptual facet (it reads as symptoms). If the scale splits in real data, that's a finding, not a defect — and the split would be interpretable.

## Next actions

Per [../research/PLAN-07-no-budget.md](../research/PLAN-07-no-budget.md), the paid phases are gone. What remains is free and worth doing in this order:

1. **Self-critique pass** over all 194 items against the ten writing rules, cutting 10–20 outright. The 3× overgeneration exists precisely so this is affordable without data.
2. **Resolve the near-duplicate pairs** in the cross-loading register by deciding now, rather than deferring to a pilot that won't happen on schedule.
3. **Select the v1 subset** — 8 items per scale from each pool of 24 — by judgment against the blueprint cells, with the reasoning recorded. This is the largest quality decision made without data, so it earns the most careful decision-log entries.
4. **Write the "what this isn't" copy first.** Per the no-budget rules it constrains every other claim in the product.
5. **Draft the safety copy and resource sets** for `a9_imp_10` before any real respondent sees the test.
6. **Freeze the cross-loading register into a pre-registration** (OSF is free) so that validation-by-usage is testing predictions rather than browsing data.
