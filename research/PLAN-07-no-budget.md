# The no-budget path

**Constraint:** no interviews, no paid participants, no funds. Permanently.

[PLAN-06-item-methodology.md](PLAN-06-item-methodology.md) assumed ~$5–6.5k and four months of recruiting. That plan is void. This replaces it.

The honest framing: **we can build a well-constructed instrument, but we cannot validate it before shipping.** What we can do is ship it labelled accurately and let it validate itself from real use, at zero marginal cost, over a longer timescale.

---

## 1. What's lost, plainly

| Phase | Needed | Status |
|---|---|---|
| Critical-incident interviews | 8–12 participants | **Cut.** Items are author-written; phrasing is invented, not harvested. |
| Construct-fit raters | 4–5 independent raters | **Cut.** No independent content-validity index. |
| Cognitive interviews | ~10 think-aloud sessions | **Cut** as a pre-launch step — partially recoverable in-product (§3). |
| Pilot 1 (n≈300) | Paid panel | **Deferred** to accumulated real users. |
| Pilot 2 (n≈450) | Paid panel | **Deferred.** No IRT calibration, so no adaptive short form. |
| Convergent validity | n≈150 taking other instruments | **Probably permanently lost** — asking free users to also complete an IPIP-NEO-120 is a big ask, though a small opt-in sub-study is conceivable. |
| Test-retest | n≈100 at 4–6 weeks | **Recoverable free** from repeat takers, if the app supports returning. |
| Informant sub-study | n≈80 dyads | **Recoverable free** — users recruit their own informants. |
| Barnum control | n≈100 | **Recoverable free** as an in-product A/B (§3). |

The irreducible losses are the pre-launch ones: no independent rater checked whether these items measure what the construct sheets say, and nobody read them aloud to find out what they think they're being asked. Everything downstream can be rebuilt from usage; those two cannot.

---

## 2. What this changes about what we may claim

This is the part that matters. The whole point of this project was that the original test makes claims it hasn't earned. Without a budget we are at risk of doing the same thing with better citations.

**Rules, binding:**

1. **No percentiles until norms exist.** Until a demographic band has n ≥ 100, the report shows *profile shape* — which of your own scores are relatively high and low — not a population comparison. The schema already forces `provisional: true` below n=100; the UI must honour it by suppressing the number, not by shrinking the font.
2. **"In development" is stated up front**, not buried: this instrument has not been independently validated, the items were written by one author, and scores are provisional. Anyone who reads that and continues has given informed consent to a rough tool.
3. **Block C flags ship only where published accuracy AND base rates exist.** That means chronotype, ALDH2 (ancestry-gated), and iron. Thyroid, apnea, CRP and ADHD become *"questions worth raising with a clinician"* — presented as prompts, not as scored flags with implied precision. This removes the PPV arithmetic problem we cannot otherwise solve.
4. **No interaction rule fires an assessment suggestion until it has fired against real data** at least a few hundred times and the constituent scales look sane. Until then, interactions are written but disabled.
5. **A6 and A8 stay `internalOnly`.** With no DIF testing, the religiosity confound on A6 is unmitigated, and showing a stigmatizing band computed from possibly-biased items is the single worst thing this product could do.

If those five rules make the product feel thin, that's the accurate feeling. The alternative is claiming precision we don't have, which is the thing we set out to fix.

---

## 3. What's free and worth doing

### Machine-assisted content review — weak, but better than nothing
An LLM can simulate multiple rater perspectives: sort items to scales blind, rate fit, flag cultural loading, flag desirability. **Honest limitation:** it isn't independent of the author (same model wrote the items), so it shares blind spots and will over-approve. Treat it as a spell-check for construct drift, not as a content-validity index. Record it as `reviewedBy: ["machine-assisted"]` so nobody later mistakes it for human review.

### In-product cognitive feedback — the best free substitute
Many items carry notes saying "cognitive interviews must confirm X." Replace that with a per-item affordance in the live app: a small "this question was confusing" control, plus an optional free-text box. It is worse than think-aloud (you get complaints, not comprehension) but it's real signal from real respondents, and it costs nothing. Route the responses into the item's `review.notes`.

Specifically outstanding questions this could answer:
- Does `a8_epi_06` read as *reduced sleep need* rather than insomnia?
- Does `a3_restraint_b07` read as "any of these" rather than "all three"?
- Does `a4_soc_n05` read as instinct rather than action?

### Validation by usage — the actual plan
Every free user contributes. At zero marginal cost, accumulating responses give us:
- **α / ω per scale** and item-total correlations (n ≈ 150 is enough to start)
- **EFA** on the pool (n ≈ 300+)
- **Inter-scale correlations** — the cross-loading register's fifteen pre-specified tests
- **DIF** by self-reported age, gender, religiosity (n ≈ 500+ per group)
- **Test-retest** from returning users
- **Self-informant agreement** from the informant module, which users staff themselves

This is a slower, self-selected, messier version of Pilots 1 and 2 — but it is the same analyses on the same pre-specified questions. The sample will be internet-volunteer biased, and that limitation is permanent and must be stated wherever norms are shown.

### Barnum control as an A/B — free and important
Randomly assign a small fraction of users a mismatched profile and ask both groups to rate accuracy. If the mismatched group rates it nearly as accurate, the copy is a horoscope. **Ethics:** they must be told immediately afterward and shown their real profile. Worth doing precisely because it's the cheapest check on the failure mode most likely to kill this project's integrity.

### Pre-registration — free
OSF costs nothing. Register the analysis plan and the cross-loading predictions *before* the data accumulates. Without paid pilots this is more important, not less: it's the only thing separating "validation by usage" from "looking at data until something appealing appears."

---

## 4. Revised scope for v1

Shipping less, better.

| In v1 | Out of v1 |
|---|---|
| Block A: 7 spectra + episodicity + impairment | Block B (gain) — needs tracking to mean anything |
| Profile-shape report, no percentiles | Block C flags except chronotype/ALDH2/iron |
| Evidence panels with grades | Interaction rules (written, disabled) |
| Trait × impairment grid | Adaptive short form (needs IRT) |
| Safety interrupt on the one risk item | Norms |
| Braverman comparison view | Percentile claims of any kind |
| In-product item feedback | |
| Informant module (if buildable) | |

The informant module is the highest-value optional add, because it's the only source of non-self-report data available to us at any budget, and users recruit the participants themselves.

---

## 5. Revised success criteria

The old bar was "beat IPIP-NEO + PHQ-9 on incremental prediction." That needs a validation study we can't run. The replacement:

1. **Internal coherence emerges from real data.** At n ≈ 300, do the seven scales show ω ≥ .70 and roughly the intended factor structure? If not, the bank is wrong and gets rebuilt. This is free and falsifiable.
2. **The pre-specified boundary tests resolve.** Fifteen registered predictions in the cross-loading register, each with a stated consequence. Resolving them honestly — including cutting items that fail — is itself the validation work.
3. **Users act on a confirmation route.** Anyone who gets a ferritin test, a sleep-timing check or a clinical assessment they'd otherwise not have had is the product working. Free to measure via self-report follow-up.
4. **The Barnum gap is real.** Matched profiles rated meaningfully more accurate than mismatched ones.

If (1) fails, the honest response is to say so publicly and not ship a scored report — just the items and the reasoning.

---

## 6. What to do about the item bank as it stands

Block A is complete: **194 items across 9 scales, all schema-valid and blueprint-conformant, 73 carrying recorded review notes.** Written by one author, unreviewed, unpiloted.

Immediate, free, worth doing before any code:

1. **A self-critique pass** against the ten writing rules, scale by scale, recording outcomes in the decision log. Expect to cut 10–20 items outright; the pool was overgenerated at 3× precisely so this is affordable.
2. **Resolve the near-duplicate pairs** flagged in the cross-loading register by choosing, not by deferring to a pilot that won't happen on schedule.
3. **Pick the v1 subset** — 8 items per scale from the 24 — using judgment against the blueprint cells rather than IRT. Record why each was chosen. This is the single largest quality decision made without data, so it deserves the decision log's most careful entries.
4. **Write the "what this isn't" copy first**, as §2 constrains everything else.

---

## 7. The thing to keep hold of

Without validation, the only thing separating this from the Braverman test is **honesty about its own status** — graded evidence, declared confounds, recorded decisions, suppressed claims, and a public account of what hasn't been checked.

That's a real difference, and it's defensible. But it's the *whole* difference, so it can't be quietly traded away later for a nicer-looking results page.
