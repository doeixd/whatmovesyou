# Planning notes 2: working the open questions

Follow-on to [PLAN-next-gen-test.md](PLAN-next-gen-test.md). That doc laid out options. This one takes positions on the hard ones and works through the consequences.

---

## 1. The tension the first plan doesn't resolve

The plan says "measure traits honestly, attach evidence panels." But that quietly removes the reason anyone takes the Braverman test in the first place.

People don't take it to learn they're conscientious. They take it because it promises: **"there's a physical reason you are like this, and here's what to do about it."** Strip that and we have an IPIP-NEO clone with better citations — Option B, which nobody asked for.

So the real design question isn't "how do we make it accurate." It's:

> **What can we honestly offer that delivers the same payoff as the false promise?**

Three candidate answers:

### (a) "Which levers move you" instead of "which chemical are you"
The causal evidence is strong at the *intervention* level ([chemistry-and-behavior.md](chemistry-and-behavior.md)): dopamine agonists cause gambling, SSRIs lower neuroticism, GLP-1s cut craving, sleep loss wrecks motivation. What's missing is only the inference *from behavior back to chemistry*. So invert the product: don't diagnose a deficiency, **map the person to the interventions with the best evidence for their specific profile**, graded by effect size and honest about uncertainty.

This keeps the payoff ("here's what to do") and drops the unsupported claim ("here's what you're low in").

### (b) Reactivity, not level ⭐ the strongest idea in these notes
See §2. This is the one genuinely novel, research-grounded thing we could build.

### (c) Explanation rather than prescription
Some of the value is just *narrative*: "my restlessness and my risk-taking are the same thing." A profile can deliver that without any biology claim. Lower ceiling, but real, and it's most of what personality tests actually sell.

**Position:** build (b) as the differentiator, use (a) as the output layer, and let (c) fall out of a well-written report.

---

## 2. Reactivity as the core construct

### The insight
The single best piece of evidence in all the research is the PMDD add-back design (Schmidt 1998, replicated 2017 and 2025). Ovarian hormones were suppressed, then estradiol or progesterone added back blind. Women with PMDD developed mood symptoms; controls didn't — **at identical hormone levels**. The 2017 follow-up showed the trigger is the *change*, not the level.

The same shape recurs everywhere:
- Tryptophan depletion increases aggression **only in people already aggression-prone**
- Dopamine agonists cause impulse-control disorders in ~17%, not everyone
- Testosterone effects appear **under provocation**, in men already high in dominance
- Hormonal contraception raises depression risk **for some**, strongest in adolescents

**The pattern:** the person-level variable that actually matters is not *how much* of a chemical someone has. It's *how much their behavior moves when it changes*. Braverman's model, and every level-based model, measures the wrong thing.

### What this becomes in a product
A **Reactivity Profile**: not "which neurotransmitter are you," but **"which perturbations move you, and how much."**

Candidate reactivity axes, each with a real evidence base:

| Axis | Perturbation | Evidence anchor |
|---|---|---|
| Sleep reactivity | Short/disrupted sleep | Serotonin/circadian; ISI; strongest everyday effect |
| Stimulant reactivity | Caffeine, nicotine | Dopamine/adenosine |
| Alcohol reactivity | Alcohol, next-day rebound | GABA; GLP-1 craving trials |
| Hormonal-cycle reactivity | Menstrual phase, contraception, perimenopause | PMDD add-back studies |
| Stress reactivity | Acute stressors, provocation | Cortisol/noradrenaline studies |
| Reward-cue reactivity | Food/gambling/shopping cues, hunger | Ghrelin, leptin, dopamine agonist ICDs |
| Social reactivity | Conflict, isolation, rejection | μ-opioid and attachment |

This is defensible in a way the original never was: we're not claiming to measure a chemical. We're measuring **how much a person's state moves in response to a named input**, which is (i) directly observable, (ii) the thing the causal literature actually establishes, and (iii) actionable — if sleep is your biggest lever, that's a plan.

### Two ways to measure it
1. **Self-reported reactivity (survey).** "After a night under 6 hours, how different is your mood the next day?" Fast, cheap, works at first sitting. Weakness: recall bias, and people are poor at estimating their own sensitivities.
2. **Observed reactivity (tracking).** Log the input and the state; compute within-person coupling. Slow, needs retention. But it's real measurement.

**Design that unifies them:** the survey gives a *predicted* reactivity profile on day 1. Tracking gives an *observed* one over weeks. The app's flagship moment is showing the person where those two disagree — "you thought caffeine barely touched you; your own data disagrees."

That's a hook nobody else has, it's honest, and it's genuinely useful.

---

## 3. n-of-1 experiments: the endgame

Tracking gives correlation. The PMDD studies got their answer from a **blinded within-person crossover**. That design is imitable in an app for benign inputs:

- Randomize caffeine/no-caffeine by day for 3 weeks
- Randomize a 30-minute walk vs none
- Randomize bedtime target ±45 minutes
- Randomize screens-off-after-9 vs free

This is real causal inference at the individual level, and it's the only structure that can honestly say "**for you**, X changes Y." It's also the true modern descendant of what Braverman was gesturing at: personalized biochemistry, done the way it actually works.

**Constraints:**
- Only for benign, reversible, self-administered inputs. **Never medication changes, supplements, or anything requiring clinical supervision.**
- Needs enough days for power; be honest that 2 weeks proves little.
- No blinding for most inputs (you know if you had coffee), so expectancy effects persist — say so.
- Frame as self-experimentation, not treatment.

---

## 4. Consequences for the statistics

Within-person inference has its own failure modes, and getting these wrong would repeat Braverman's sin with better math.

| Trap | What goes wrong | Mitigation |
|---|---|---|
| **Regression to the mean** | You track after a bad week, everything "improves" | Compare against within-person baseline, not first reading |
| **Autocorrelation** | Mood is correlated day to day; naive p-values are wildly optimistic | Mixed models or block bootstrapping; large minimum-N before any claim |
| **Multiple comparisons** | 7 inputs × 5 outcomes = 35 tests; something always "works" | Pre-register the question, or correct, or report effect sizes only |
| **Reverse causation** | Bad mood → poor sleep, not the other way | Lagged models; state it's ambiguous |
| **Confounding by week structure** | Alcohol on weekends, stress on weekdays | Include day-of-week; randomize where possible |
| **Sparse/missing data** | People log when they feel bad | Prompt on a schedule; report completion rate with results |

**Guardrails to build in:**
- Minimum data thresholds before any pattern is surfaced (e.g. 21+ days, 10+ instances of the input)
- Always show uncertainty bands, never a bare number
- Language discipline: "associated with" for tracking; "changed" only after a randomized n-of-1
- A visible "not enough data yet" state — it will be the honest answer most of the time early on

---

## 5. Revisiting the open questions from the first plan

**Q1 Who is this for?**
Position: **people who already tried the Braverman test or similar and want the real version**, plus self-quantifiers. Not clinicians (regulatory weight, different feature set). That audience already accepts the premise "my biology shapes my behavior," so the reframe from levels to reactivity lands rather than disappoints.

**Q2 Keep a type label?**
Position: **yes, but of the reactivity profile, not the trait profile.** "Sleep-sensitive, low stimulant reactivity" is shareable, specific, actionable, and doesn't claim to be a chemical. Trait scores stay as a continuous profile underneath. This dodges the worst of typing while keeping the shareable artifact.

**Q3 Is the biology framing load-bearing?**
Position: **yes, but relocated.** Biology explains the *mechanism of the lever* ("sleep loss degrades dopaminergic motivation signaling — moderate evidence"), not the *identity of the person*. Same interest, none of the false inference.

**Q4 Commercial or free?**
Position: free assessment, and if anything is paid, it's tracking/n-of-1. Selling a "brain chemistry result" invites health-claim scrutiny; selling a self-experiment tool doesn't. Defer.

**Q5 Collect data for norms?**
Position: yes eventually, opt-in, separate consent, and it's genuinely valuable because reactivity norms **don't exist anywhere**. That's a legitimate contribution. But not at launch.

**Q6 Four dimensions or six?**
Position: **four trait dimensions, plus the reactivity axes.** The trait half doesn't have to carry the product any more, so it can be shorter and more defensible:
1. **Drive** (exploration + effort; dopamine-linked, strong evidence)
2. **Alarm** (withdrawal/negative emotionality; serotonin-linked, moderate)
3. **Restraint** (constraint/stability vs volatility/impulsivity, as one bipolar axis; moderate)
4. **Bond** (attachment/social sensitivity; opioid-linked, preliminary)

Collapsing Seeker+Engine into Drive and Anchor+Surge into Restraint drops us from six scales to four, ~40 items instead of ~70, and echoes the original's four-domain shape without copying its content.

**Q7 Braverman comparison — feature or liability?**
Position: **feature, carefully built.** Don't reproduce his items. Instead: after someone completes our assessment, show "the 2005 model would have called you a ___ nature — here's why that label isn't supported." Educational, no copyright exposure, no scraping of his instrument.
Open sub-question: can we even map our scores onto his natures without his items? Roughly — high Drive ≈ his dopamine nature; high Restraint ≈ his GABA nature. But his serotonin nature maps to *high* Drive/*low* Restraint, which is exactly the inversion we're criticizing, and that makes the mapping a nice teaching device.

**Q8 How much weight on context?**
Position: **heavy.** Context (sleep, meds, cycle, stressors) is where reactivity lives. It graduates from "Part 3, optional" in the first plan to a core input.

---

## 6. Revised product shape

```
Day 1 (10 min)
├── Trait profile          4 scales × ~10 items, Likert, half reversed
├── Reactivity survey      7 axes × ~4 items ("how much does X move you?")
├── Context intake         sleep, substances, meds, cycle, stressors
└── State screen           PHQ-9 / GAD-7 / ISI / SHAPS  → safety-gated

Result
├── Trait profile with evidence panels           (what you're like)
├── Predicted reactivity profile + headline      (what moves you)      ← shareable
├── Lever recommendations, effect-size graded    (what to try)
└── "How the 2005 model would have read you"     (why it was wrong)

Weeks 2+ (optional, 30 sec/day)
├── Daily check-in: state + inputs
├── Observed reactivity vs predicted             ← the payoff moment
└── n-of-1 experiment builder                    ← the endgame
```

---

## 7. What could sink this

- **Retention.** Reactivity needs weeks of data. Most people do three days. Mitigation: make day-1 value complete on its own; treat tracking as a bonus, not a prerequisite.
- **Self-report reactivity may be near-worthless.** Genuinely unknown — that's an empirical question, and it's the first thing the pilot should test (does predicted reactivity correlate at all with observed?). If the answer is no, that finding is itself interesting and the product pivots to observed-only.
- **We reinvent mood tracking.** Dozens exist. The differentiator has to be the reactivity framing and the n-of-1 engine, not the logging.
- **Honesty is less fun than typing.** A profile with confidence bands is less shareable than "you're a dopamine type." The reactivity headline is the compromise; if it doesn't land, we'll be tempted back toward types. Decide now that we won't.
- **Scope.** The first plan's Phase 1 was a weekend. This is not. Sequence it: day-1 assessment first, tracking only if people actually finish.

---

## 8. Next concrete steps (revised)

1. **Draft the reactivity survey items** — 7 axes × 4 items. This is the novel part and the fastest way to see if the idea holds up on paper. *(Started: [draft-items.json](draft-items.json))*
2. **Draft Drive (10 items)** as the trait-scale format test.
3. **Write the day-1 result page copy** for one fictional profile, end to end. If that reads as valuable without any biology claim, the design works.
4. **Define the data model** for daily check-ins before building the assessment, so day-1 answers slot into the same schema.
5. **Decide the minimum-data thresholds** and the "not enough data yet" copy — early and in writing, because the pressure to show patterns too soon will be constant.
