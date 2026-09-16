# Scoring

Every item is true/false, and every TRUE is worth 1 point to its group. There is no reverse scoring, no weighting and no cross-loading: each statement belongs to exactly one group.

| Group | Nature | Items | Group | Deficiency | Items |
|---|---|---|---|---|---|
| 1A | Dopamine | 50 | 1B | Dopamine | 25 |
| 2A | Acetylcholine | 50 | 2B | Acetylcholine | 25 |
| 3A | GABA | 50 | 3B | GABA | 40 |
| 4A | Serotonin | 50 | 4B | Serotonin | 25 |

Total: 315 items (200 in Part 1, 115 in Part 2). Each group has four subsections: Memory and Attention, Physical, Personality and Character. The subsections only organize the items. They aren't scored separately.

## Part 1: Dominant nature

- **Time frame:** "How you feel most of the time, not just today."
- **Dominant nature:** the group with the highest TRUE count.
- **Tie-break:** Sources say that when scores tie, the nature that comes first in the order dopamine → acetylcholine → GABA → serotonin wins. For example, if dopamine and acetylcholine tie, the result is dopamine. This rule comes from bravermantest.com's FAQ.
- **Strongly dominant:** 35 or more in one group. Braverman calls this "classically dominant" and says it suggests a less-than-balanced life.
- **Relative deficiency:** another nature that scores 10–15 or more points below the dominant one is "probably a lifelong relative deficiency."

## Part 2: Deficiencies

- **Time frame:** "How you feel right now," however long the symptoms have lasted.
- **Most deficient nature:** the group with the **highest** TRUE count. The book says to "circle the highest number" and to balance that nature first.
  - Some modern sites (e.g. outliyr.com) say the *lowest* score means the greatest need. That contradicts the original instructions, so treat it as an error.
- **Severity bands (applied to each group separately):**

| TRUE count | Band | Book's guidance |
|---|---|---|
| 0–5 | Minor | "Early warning signs" |
| 6–15 | Moderate | Usually treatable with nutrition, hormones and lifestyle changes |
| >15 (16+) | Major | "Get your doctor involved as soon as possible" |

  Note: the dosage tables in the book label the major band "15+", and the GABA table labels moderate as "5–15". Both overlap the text's cutoffs. Use the wording in the text: up to 5, 6–15, more than 15.
- Your deficient nature can be the same as your dominant nature, and the book says it often is ("you burn out your edge just by being yourself").
- **A zero doesn't equal "no deficiency":** the book calls 0–5 minor. An app should probably show 0 as "none reported."
- **The scale differs by group:** 3B has 40 items while the others have 25, so raw counts overstate GABA compared with the rest. The book compares raw counts anyway. An app could also show the percentage of items answered TRUE.

## Population claims (from the book, unverified)

- Dopamine: ~17%
- GABA: ~50%
- Serotonin: ~17%
- Acetylcholine: no figure given in the sources (by elimination about 17%)

## Reference algorithm

```ts
type Nature = 'dopamine' | 'acetylcholine' | 'gaba' | 'serotonin'
const ORDER: Nature[] = ['dopamine', 'acetylcholine', 'gaba', 'serotonin']

// Pick the highest score; on a tie the earlier nature in ORDER wins.
const top = (s: Record<Nature, number>) =>
  ORDER.reduce((best, n) => (s[n] > s[best] ? n : best), ORDER[0])

const band = (n: number) => (n <= 5 ? 'minor' : n <= 15 ? 'moderate' : 'major')

function score(dominant: Record<Nature, number>, deficiency: Record<Nature, number>) {
  const d = top(dominant)
  return {
    dominant: d,
    strongDominance: dominant[d] >= 35,
    relativeDeficiencies: ORDER.filter(n => n !== d && dominant[d] - dominant[n] >= 10),
    mostDeficient: top(deficiency),
    deficiencyBands: Object.fromEntries(ORDER.map(n => [n, band(deficiency[n])])),
  }
}
```
