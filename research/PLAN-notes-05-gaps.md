# Planning notes 5: what the spec still gets wrong

Gaps in [SPEC-v1.md](SPEC-v1.md) that I hadn't examined. Several of these are more consequential than anything in the spec itself.

---

## 1. The whole thing rests on self-report, and I never questioned that

Every block is self-report. That's a real ceiling, and it fails *unevenly* — worst precisely where the test most wants to be right.

**Self-Other Knowledge Asymmetry** (Vazire): self and informant agree well on visible, low-evaluative traits and badly on invisible or evaluative ones. Self-other agreement is r ≈ .72 for Agreeableness but r ≈ .42 for Openness/Intellect. Informant reports are **more internally consistent than self-reports on most dimensions**, and for pathological traits each source predicts things the other misses.

The blunt version: **A5 Antagonism is the axis people are least able to report on**, because it's the one where seeing yourself accurately is most costly. Same problem, smaller, for A6 Unusual cognition and A3 Restraint.

**Design response — an informant module.** After finishing, the user can send a link to 1–3 people who know them well. Same items, third-person wording. Then show self vs informant per axis.

- The **disagreement** is the product, not a flaw. "You rate yourself mid-range on Antagonism; two informants put you in the top 15%" is the single most useful sentence this test could produce, and nothing else in the design comes close.
- Risks: social dynamics (asking someone to rate you is loaded), retaliation/joke ratings, privacy of the informant's answers, and low completion. Mitigate with aggregate-only display when n ≥ 2, and never show who said what.
- Cheap version if the full module is too much: a single question per axis — "what would someone close to you say?"

**Position:** this moves up the roadmap. It's a bigger validity gain than any item refinement.

---

## 2. State contaminates trait, and the spec measures both without connecting them

If someone is depressed right now, their Block A scores are wrong — not slightly.

Evidence: personality scores look more pathological during a depressive episode than before onset or after remission, partly from genuine item overlap between neuroticism and symptom measures, partly from mood-congruent recall bias. Neuroticism, Extraversion and interpersonal sensitivity all move toward normal as depression lifts, while Openness, Conscientiousness and Agreeableness stay stable. Some elevation persists into remission, so it isn't purely artifact.

**This cuts right through the design.** The test measures state (impairment, PHQ-style items) and traits in the same sitting, and then reports the traits as if they were stable.

**Design responses, in increasing order of effort:**
1. **Caveat** — if impairment/low mood is high, label A2 and A4 as "may be depressed-state-inflected; worth retaking when things are steadier." Cheap, honest, do this at minimum.
2. **Differential confidence** — widen the uncertainty band on state-sensitive axes (A2, A4) when current state is elevated; leave A7 and A3 narrower, since those are more stable.
3. **Retest prompt** — invite a retake in 8–12 weeks and show the delta. This turns the weakness into a feature.
4. **Statistical adjustment** — regress out current state. Tempting, and probably wrong: it would remove real trait variance, since high-N people genuinely are more often in bad states.

**Position:** do 1–3. Never 4.

---

## 3. The base-rate problem: my setpoint flags will mostly be false positives

I specified sensitivity/specificity for some flags and then never did the arithmetic. Doing it changes the design.

### ALDH2 flush
Self-reported flushing: ~100% sensitive, ~68% specific.

| Population | Prevalence of ALDH2 deficiency | PPV of a positive flush report |
|---|---|---|
| East Asian ancestry | ~35% | **~63%** — useful |
| European ancestry | ~1% | **~3%** — worthless; 97% of flags are wrong |

Same question, same accuracy, completely different meaning. **The flag must be gated on ancestry**, or not shown.

### Sleep apnea (if added, see §5)
STOP-BANG ≥3: sensitivity ~85%, specificity ~40%. At ~10% population prevalence of moderate-severe OSA, PPV ≈ **14%**. Roughly 6 of 7 flagged people don't have it.
Fixes: a higher threshold (≥5, or ≥7 where specificity reaches ~95%), or combining with a sleepiness scale, which is shown to improve specificity.

### The general rule this implies
> **Any flag's usefulness depends on the base rate in the person in front of us, not on the questionnaire's accuracy.**

So: compute expected PPV for every Block C flag using demographic-conditioned base rates; only surface a flag when PPV clears some threshold (30%? — needs deciding); and state the number in the report — "roughly 1 in 3 people with this pattern turn out to have it" is more honest and more motivating than a confidence word.

This also caps how many flags we can show. A screen with seven flags each at 15% PPV generates anxiety and wasted tests. **Fewer, higher-threshold flags.**

---

## 4. Items that measure culture instead of biology

My own sample item in the spec:

> A6: "I've had the sense that something was communicating with me personally — a song, a sign, a coincidence."

In a secular sample this indexes unusual cognition. In a religious sample it indexes **ordinary, socially normative belief**. That's differential item functioning, and it would systematically push religious users up the psychoticism axis — the single most stigmatizing axis in the test.

Same problem elsewhere: A4 Sociality items assume a culture of emotional disclosure; A5 Antagonism items assume directness norms; Braverman's original had "I value a religious philosophy" as a *dopamine* item, which is the same error.

**Design responses:**
- Screen items for cultural/religious loading during review; test for DIF in the pilot across at least religiosity, gender and age.
- Prefer items about **function** over content: not "have you felt a sign was meant for you" but "have people told you that you read meaning into things that isn't there?"
- Consider excluding A6 entirely from the v1 report and using it only as internal signal. It's the highest-stigma, highest-DIF, hardest-to-word axis.

---

## 5. Setpoints I missed, ranked by what they'd add

| Candidate | Why it belongs | Confirmation | Verdict |
|---|---|---|---|
| **Obstructive sleep apnea** | Highly prevalent, frequently undiagnosed, independent risk factor for depression and cognitive impairment; ~60% of OSA patients show cognitive impairment; treatable. Behaviorally enormous. | Home sleep study | **Add** — but with the threshold fix from §3 |
| **Inflammation (CRP)** | CRP is the most predictive inflammatory marker for antidepressant response (pooled OR ≈ 2.47); ≥3 mg/L marks a subgroup with poorer SSRI outcomes; anti-inflammatory augmentation helps in elevated-CRP patients. A real, blood-testable behavioral setpoint. | hs-CRP blood test | **Add as a question to ask a clinician**, not as a flag we score |
| **Perimenopause** | Large, common, under-recognized mood/cognition effects; the hormone-*change* logic from PMDD applies directly | Clinical assessment; symptom timing | **Add** to the cycle flag as a life-stage branch |
| **Dysautonomia/POTS** | Behaviorally huge (fatigue, brain fog, exercise intolerance), commonly misattributed to anxiety | Active stand test, clinical | **Maybe** — needs its own evidence check |
| **Blood glucose variability** | Plausible mood/energy link; consumer CGMs make it measurable | CGM | **No** — evidence for behavioral effects in non-diabetics is thin |

Sleep apnea in particular is a glaring omission: it's probably the highest-yield thing in the whole Block C list for an adult population, and it's the kind of finding that changes someone's life rather than their self-concept.

---

## 6. Age, and the fact that none of this is fixed

The spec treats scores as static. They aren't:
- **Traits** shift with age in a known direction (neuroticism down, conscientiousness up through adulthood). Percentiles must be **age-banded** or they'll systematically mislabel the young as pathological.
- **Chronotype** shifts across the lifespan — latest in adolescence, progressively earlier with age. An age-blind chronotype norm would flag most 19-year-olds as extreme.
- **Reactivity** changes with life stage (sleep reactivity rises with age; alcohol reactivity rises markedly).

**Design response:** age-banded norms everywhere, and copy that says plainly these numbers are a reading of now, not a fixed fact. That also softens the identity-lock-in risk from [PLAN-notes-04-clinical-spectra.md](PLAN-notes-04-clinical-spectra.md) §6.

---

## 7. The Barnum test — the cheapest validation we're not doing

Personality feedback feels accurate almost regardless of content. Any report we write will get "wow, that's me" reactions that tell us nothing.

**Do the classic experiment on our own copy:** give a sample of users *someone else's* profile text and ask them to rate its accuracy. If the mismatched profiles score nearly as high as the real ones, our copy is horoscope, not measurement.

This costs almost nothing, can run before any psychometric pilot, and it's the single best defense against building something that feels great and means nothing. It should gate the report copy the way §8 of the spec gates the items.

---

## 8. What would make this test worth existing — a falsifiable criterion

Nowhere have I written down what success means. Without it, we'll ship whatever we build and declare it good, which is exactly how the original happened.

**Proposed bar:** the test must beat a free baseline — IPIP-NEO-120 + PHQ-9 + GAD-7 — on at least one of:
1. **Incremental prediction** of an outcome people care about (functional impairment, treatment-seeking, medication response) beyond what the baseline predicts.
2. **Actionability:** a measurable rate of users who complete a named confirmation step (ferritin test, sleep study, clinical assessment) and get a result.
3. **Discovery:** the self-vs-informant gap or the predicted-vs-observed reactivity gap tells people something they didn't already know — measured by asking them.

Criterion 2 is the most achievable and the most honest: **we are a routing device, not an oracle.** If 8% of users get a ferritin test they wouldn't have had, and a fifth of those are low, the test has done more good than every personality quiz on the internet combined.

---

## 9. Reporting interactions — where the insight actually is, and the trap

Single-axis feedback is bland. The interesting statements are combinations:
- High Drive + low Restraint + high Episodicity → the pattern most worth a bipolar-spectrum conversation
- High Systemizing + low Sociality + high Impairment → worth an autism assessment
- High Threat-reactivity + high sleep reactivity + evening chronotype → a very specific, very fixable trap
- Low Drive + high Impairment + no elevated trait → the "look elsewhere" cell, possibly iron/thyroid/apnea

**The trap:** interactions multiply comparisons, and with 7 axes there are hundreds of combinations. Anything mined from data will be noise.

**Position:** a **pre-specified, hand-written** list of at most 8–10 interaction patterns, each with a stated rationale and citation, evaluated in fixed order, with at most two shown per user. No data mining, no emergent combinations.

---

## 10. Things I'm still unsure about

1. **Is the informant module a different product?** It may be too socially heavy for a solo self-insight tool, or it may be the whole point.
2. **Does honest uncertainty destroy the experience?** Bands, caveats, PPVs and "retake in 8 weeks" is a lot of hedging. There's a version of this that's so careful it's useless. Untested.
3. **Who reads a result like "1 in 3 with this pattern have it"?** Numeracy varies enormously; that framing may land as either reassuring or alarming depending on the reader.
4. **Have I over-medicalized it?** Block C now has apnea, ferritin, thyroid, CRP, ADHD. That's a symptom checker wearing a personality test's clothes. Possibly fine, possibly a different product with different obligations.
5. **What does someone with no flags and an unremarkable profile get?** Probably the majority of users. If the answer is "not much," the design has a hole in the middle.

## Sources

- Self-Other Knowledge Asymmetry extended to pathological traits: https://www.sciencedirect.com/science/article/abs/pii/S0092656622001489
- Self-other agreement meta-analysis (N≈33,000): https://journals.sagepub.com/doi/abs/10.1177/0956797618810000
- Informant vs self report internal consistency: https://pmc.ncbi.nlm.nih.gov/articles/PMC4753771/
- Self-other knowledge asymmetries in personality pathology: https://pmc.ncbi.nlm.nih.gov/articles/PMC3424287/
- Decoupling personality and acute psychiatric symptoms: https://pmc.ncbi.nlm.nih.gov/articles/PMC6782051/
- Influence of depressive state features on trait measurement: https://pubmed.ncbi.nlm.nih.gov/12113925/
- STOP-Bang narrative review (thresholds, sensitivity/specificity): https://www.sciencedirect.com/science/article/pii/S1087079224001114
- STOP-Bang plus Epworth for specificity: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9578009/
- OSA, depression and cognitive impairment: https://pmc.ncbi.nlm.nih.gov/articles/PMC5381386/
- Inflammatory markers as predictors of antidepressant response (meta-analysis): https://pmc.ncbi.nlm.nih.gov/articles/PMC13203315/
- Anti-inflammatory treatment in depressed patients with elevated inflammation (AJP meta-analysis): https://psychiatryonline.org/doi/10.1176/appi.ajp.20241115
- Stratifying the inflamed endotype in difficult-to-treat depression: https://pmc.ncbi.nlm.nih.gov/articles/PMC12752927/
- Alcohol flushing questionnaire validation (sensitivity/specificity): https://pubmed.ncbi.nlm.nih.gov/29205834/
