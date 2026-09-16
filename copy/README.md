# Report copy

`deck.en-US.json` holds every piece of user-facing text the report renders. It is checked against the bank:

```bash
python tools/check-copy.py copy/deck.en-US.json bank/v1.json
```

The checker enforces:

- **Every `copyId` in the bank resolves here.** A scale without text fails the build rather than rendering blank.
- **Every scale has both cost *and* upside.** The schema requires both ids; this requires both to have content. Neither half is optional, because a trait shown only as a defect is a misrepresentation and a trait shown only as a strength is flattery.
- **Every safety `resourceSet` exists and lists real resources**, with trigger text. An item that can disclose risk cannot ship pointing at an empty resource set.
- **No population claims while norms are provisional.** Phrases like "percentile", "higher than most", "top 10%" are rejected anywhere in claim-making copy. This is the [no-budget rule](../research/PLAN-07-no-budget.md) made mechanical: we have no norms, so the copy cannot imply we do.
  - The `framing` block is exempt from that scan, because it exists to *disclaim* comparisons and has to be able to say the word.
  - The guard is live — injecting "you score higher than most people" into an entry fails the check.

## Structure

| Key | Contents |
|---|---|
| `framing` | Pre-test instructions, "what this isn't", why there are no numbers, how to read trait vs impairment, evidence-grade definitions, and the unexplained-impairment message |
| `bands` | Relative-position language only ("one of your higher scores"), never population position |
| `entries` | Per-scale cost and upside text, keyed by the ids the bank references |
| `safety` | Crisis resources for the one risk item, plus severe-impairment copy |
| `braverman_comparison` | What was kept, dropped, inverted, and why — for people arriving from the original |

## Voice rules used

1. Plain language, second person, short sentences.
2. Describe behavior and consequence, not character.
3. Both poles of every trait get a cost and an upside — including the "good" pole.
4. Never name a disorder as a finding about the reader.
5. State limitations in the same register as the findings, not in smaller type.
6. Where the evidence is weak, say which way it's weak.

## Not yet written

- Flag copy for Block C (chronotype, ALDH2, iron) — needed when those ship.
- Interaction-rule copy — the rules are written but disabled per the no-budget plan.
- Localized crisis resources beyond US/UK/IE and the international directory.
