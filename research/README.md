# Braverman Test research

The **Braverman Nature Assessment** (often called the Braverman Test) is a 315-item true/false questionnaire from Eric R. Braverman, MD, *The Edge Effect: Achieve Total Health and Longevity with the Balanced Brain Advantage* (Sterling, 2005). It claims to identify which of four neurotransmitters is your "dominant nature" (Part 1) and which ones you are deficient in (Part 2).

## Files

| File | Contents |
|---|---|
| **[SPEC-v1.md](SPEC-v1.md)** | **★ The design: 3 blocks, 7 spectra, 6 reactivity axes, 7 setpoint flags, scoring, report, safety** |
| **[PLAN-07-no-budget.md](PLAN-07-no-budget.md)** | **★ Supersedes the validation plan: what we may claim with no funds, free substitutes, revised v1 scope** |
| [PLAN-06-item-methodology.md](PLAN-06-item-methodology.md) | **How to build the item bank: construct sheets, blueprint, generation, review gates, pilots, validity studies** |
| [PLAN-next-gen-test.md](PLAN-next-gen-test.md) | Planning doc: options and trade-offs that led to the spec |
| **[PLAN-notes-02-reactivity.md](PLAN-notes-02-reactivity.md)** | **Working the open questions; the reactivity-not-level reframe and n-of-1 design** |
| **[PLAN-notes-03-setpoints.md](PLAN-notes-03-setpoints.md)** | **The real, checkable knobs: chronotype, ADHD, hormone sensitivity, ALDH2, ferritin, thyroid, androgen exposure, SPS** |
| **[PLAN-notes-04-clinical-spectra.md](PLAN-notes-04-clinical-spectra.md)** | **Mental-illness traits as dimensions: HiTOP/PID-5, autistic traits, schizotypy, hypomanic temperament, trait vs impairment** |
| **[PLAN-notes-05-gaps.md](PLAN-notes-05-gaps.md)** | **What the spec gets wrong: self-report ceiling, state/trait contamination, base rates, cultural DIF, missed setpoints** |
| [draft-items.json](draft-items.json) | Draft original items (Drive scale + 7 reactivity axes) with open issues |
| [questions.json](questions.json) | All 315 items, organized by part → group → subsection. Ready for the app to import. |
| [scoring.md](scoring.md) | Scoring rules, tie-break, severity bands, reference algorithm |
| [natures.md](natures.md) | What each nature and deficiency supposedly means |
| [validity.md](validity.md) | Evidence, criticisms, safety notes |
| [versions.md](versions.md) | Other versions; the bravermantest.com diff |
| [related-research.md](related-research.md) | Validated models (TCI, Fisher FTI, DeYoung, BIS/BAS), symptom scales, how to improve the test |
| [neurotransmitters-and-personality.md](neurotransmitters-and-personality.md) | Modern evidence by system and method, how Braverman's claims hold up, a research-based redesign |
| [chemistry-and-behavior.md](chemistry-and-behavior.md) | Causal evidence: what changes when drugs/hormones are manipulated (dopamine agonists, SSRIs, testosterone, cortisol, ovarian hormones, thyroid, ghrelin/GLP-1) |
| [sources/](sources/) | Original PDFs plus `pdftotext` extractions |

## Structure at a glance

| Part | Time frame | Groups (items) | Result |
|---|---|---|---|
| 1: Dominant Nature | "most of the time" | 1A Dopamine (50), 2A Acetylcholine (50), 3A GABA (50), 4A Serotonin (50) | Highest count = dominant nature |
| 2: Deficiencies | "right now" | 1B Dopamine (25), 2B Acetylcholine (25), 3B GABA (40), 4B Serotonin (25) | Highest count = most deficient; 0–5 minor, 6–15 moderate, >15 major |

## Transcription notes

- Part 1 comes from the ancronmedical.com PDF and Part 2 from the drhannetjie.co.za PDF, which is cleaner. The two agree wherever they overlap.
- I fixed obvious typos: "principals" → "principles", "I needs" → "I need", "pay by the rules" → "play by the rules" (the second PDF confirms this one).
- The count per group matches the published total of 315.
- The questions are copyrighted material from the book. They are reproduced here from publicly circulated clinic handouts for research. Consider licensing or rewording them before shipping a public app.

## Sources

- Braverman Assessment Part 1 & 2 (PDF): https://ancronmedical.com/wp-content/uploads/2015/04/Braverman-Assessment.pdf
- Part 2 Defining your Deficiencies (PDF): https://www.drhannetjie.co.za/assets/braverman-prt-2---deficiencies3.pdf
- Results/interpretation and supplement tables (PDF): https://drtimkelly.net/fileupload/bravermantestresultsinfo.pdf
- STARS Braverman Assessment (PDF): http://starsofwellness.com/pdfs/STARS-Braverman-Assessment.pdf
- Bravermantest.com FAQ (tie-break, 35+ dominance, 10–15 gap): https://bravermantest.com/frequently-asked-questions/
- Bravermantest.net: https://bravermantest.net/
- Outliyr overview: https://outliyr.com/braverman-test
- Holistic Help, neurotransmitter testing validity: https://www.holistichelp.net/blog/neurotransmitter-testing-accuracy-and-validity/
