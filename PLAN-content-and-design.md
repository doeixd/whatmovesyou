# Plan: typography, hierarchy, research surfacing, and articles

Follows [APP-PLAN.md](APP-PLAN.md). The app works; this is about making it read well, show its evidence, and be findable.

**The constraint that shapes everything:** the product's only real differentiator is honesty about its own status ([PLAN-07-no-budget.md](research/PLAN-07-no-budget.md) §7). That applies to SEO too. No clickbait titles, no FAQ schema on questions nobody asked, no thin pages built to rank. Every article has to be something a person is glad they read.

Fortunately the research folder already contains material almost nobody else has written: a careful, sourced account of what neurotransmitter research actually supports. That's the moat. The work is surfacing it, not inventing it.

---

## 1. Typography

### What's wrong now

The current pages are clean but undifferentiated: one serif, one sans, three sizes, and no system underneath. Specific problems:

- **No modular scale.** Sizes were picked ad hoc (2rem, 1.15rem, 1rem), so headings don't feel related.
- **Hierarchy collapses on long pages.** `/about/evidence.html` is 16 KB of h3s and paragraphs with no visual rhythm — it reads as a wall.
- **No component vocabulary.** Kickers, ledes, callouts, citations and grade chips each got invented once, inconsistently.
- **Line-height is uniform.** Headings need tighter leading than body text; both are currently ~1.6.
- **The band bar implies a scale it doesn't have.** A left-anchored filled bar reads as "0–100% of a maximum", which is exactly the population-comparison claim we refuse to make.

### Type scale

A minor third (1.2) on mobile, major third (1.25) above 40rem, anchored at 17px body.

| Role | Mobile | Desktop | Leading | Notes |
|---|---|---|---|---|
| Display (h1 on articles) | 1.95rem | 2.6rem | 1.12 | Tight, optical letter-spacing −0.02em |
| Title (h1 elsewhere) | 1.6rem | 1.9rem | 1.2 | −0.015em |
| Section (h2) | 1.25rem | 1.4rem | 1.25 | |
| Sub (h3) | 1.05rem | 1.1rem | 1.3 | |
| Lede | 1.15rem | 1.25rem | 1.5 | Serif, `--ink-soft` |
| Body | 1rem | 1.0625rem | 1.65 | |
| Small / caption | 0.875rem | 0.9rem | 1.5 | |
| Label / kicker | 0.75rem | 0.78rem | 1.2 | Sans, uppercase, 0.08em tracking |

Spacing follows the same logic: a 4px base with steps at 4/8/12/16/24/32/48/64/96, and vertical margins expressed as multiples so the rhythm survives font changes.

### Fonts — a decision, not a default

| Option | Cost | Gain |
|---|---|---|
| **A. System stack only** (today) | 0 KB | Nothing to load, nothing to break |
| **B. One self-hosted variable serif** for body and headings, system sans for UI | ~28–34 KB woff2, latin subset, one file cached across all pages | Real typographic identity; consistent across platforms |
| C. Two self-hosted families | ~60 KB | Marginal over B |

**Recommendation: B**, with a genuine text face rather than a display one — Source Serif 4, Literata or Newsreader. Self-hosted (no Google Fonts request), `font-display: swap`, preloaded on content pages only. The assessment island can stay on the system stack, since nobody admires typography while answering question 41.

This pushes content pages from ~5 KB to ~8 KB of HTML plus a one-time ~30 KB font. Worth it; the budget in APP-PLAN §10 gets updated rather than quietly broken.

### Hierarchy devices

Long pages need more than heading sizes:

- **Kicker + title + standfirst** at the top of every article, so the reader knows the kind of thing they're reading before the first paragraph.
- **Section rules** — a hairline above h2 with generous space, rather than size alone.
- **Callout blocks** with three variants: *evidence* (what the research shows), *caveat* (what it doesn't), *practical* (what to do). Distinct left borders, no icons.
- **Pull statements** for the one sentence a section turns on. Larger serif, no quotation marks — these are claims, not quotes.
- **A table of contents** on anything over ~1,200 words, sticky on desktop, collapsed `<details>` on mobile.
- **Reading time and last-updated** in the meta line. Both honest, both cheap.

### Rethinking the band display

The current bar must go. Replace with a **dot on a centered track**:

```
   lower ·····························•··········· higher
                    ↑ your other scores
```

The centre tick is the person's own profile mean, the dot is this scale, and the label says so. It cannot be misread as a percentile because there's no filled portion and no endpoint labels beyond "lower/higher". Accessible name: "Drive: slightly above the middle of your own profile."

### Also worth doing

- **Print stylesheet.** People will print or PDF their results. Currently that's a mess: expand every evidence panel, drop interactive controls, keep the caveats.
- **Focus-visible states** styled deliberately, not browser default.
- **`text-wrap: pretty`** on headings and ledes to avoid orphans; `hanging-punctuation` where supported.
- **Dark mode contrast pass** — the current soft ink on dark sits near 4.3:1 in places.

---

## 2. Surfacing the research

Right now `/about/evidence.html` lists body links per scale, and the eight research documents — with roughly 120 sources between them — aren't published at all. That's the most under-used asset in the repo.

### A real bibliography

Add `tools/build-references.mjs`: parse the markdown link lists at the foot of each research doc into a structured `references.json` (id, title, url, year, claim, topics, which docs cite it), then render `/about/sources.html` grouped by topic:

- Dopamine and behavior · Serotonin · Hormones · Setpoints · Dimensional psychopathology · Measurement and validity · The original test

Each entry shows the **claim it supports**, not just the title — the research docs already record that, and it's what makes a bibliography readable rather than decorative.

### Inline citations in articles

Numbered superscripts linking to the bibliography, with the full reference visible on the article page as a footnote block. No hover-cards — they break on touch, and this content deserves a stable footnote.

### Per-scale further reading

Each scale card on the results page gains one line: *"More on what the research says about Drive →"*, pointing at the relevant article. This is the main internal-linking engine and the honest way to expand on a result without inflating the result itself.

---

## 3. Articles

Twelve pieces, in three clusters. The pillar is the Braverman explainer, which already exists in short form and should become the definitive page on the topic.

### Cluster 1 — the original test (highest search intent)

| # | Working title | Intent it serves | Built from |
|---|---|---|---|
| 1 | **The Braverman test, explained — and what it gets wrong** *(pillar, expand existing page)* | "braverman test", "braverman nature assessment" | `versions.md`, `scoring.md`, `natures.md`, `validity.md` |
| 2 | **How the Braverman test is scored** | "braverman test scoring", "how to score braverman" | `scoring.md` — including the tie-break rule and the highest-vs-lowest contradiction between sources |
| 3 | **Which version of the Braverman test is which** | "braverman test 321 questions", "braverman test pdf" | `versions.md` — the 315/314/313 diff, the six questions that don't exist |
| 4 | **"Dopamine dominant" — what that would actually mean** | "dopamine personality type", "am I dopamine dominant" | `neurotransmitters-and-personality.md` |

### Cluster 2 — what the research actually says

| # | Working title | Intent | Built from |
|---|---|---|---|
| 5 | **Can a questionnaire measure your brain chemistry?** | "neurotransmitter test", "how to test neurotransmitter levels" | `validity.md`, `neurotransmitters-and-personality.md` §2 |
| 6 | **Is ADHD a dopamine deficiency?** | "adhd dopamine deficiency" — a very common belief with a clear answer | `PLAN-notes-03-setpoints.md` |
| 7 | **Sensitivity beats level: what PMDD research proved about all of us** | "hormone sensitivity", "pmdd mood" | `chemistry-and-behavior.md` §2 — the single best finding in the folder |
| 8 | **The knobs you can actually check** | "chronotype test", "low ferritin symptoms", "sleep apnea and mood" | `PLAN-notes-03-setpoints.md` — chronotype, iron, thyroid, apnea, ALDH2 |
| 9 | **Everyone is somewhere on these spectrums** | "am I a little autistic", "schizoid personality traits", "hypomanic personality" | `PLAN-notes-04-clinical-spectra.md` |

### Cluster 3 — how to read any test

| # | Working title | Intent | Built from |
|---|---|---|---|
| 10 | **How to tell whether a personality test is any good** | "are personality tests accurate" | `PLAN-06-item-methodology.md` |
| 11 | **Why this test has no percentiles** | supports the product directly | `PLAN-07-no-budget.md` |
| 12 | **Why you can't trust your own answers about some traits** | "self report bias personality" | `PLAN-notes-05-gaps.md` §1 — the informant asymmetry |

Article #7 and #12 are the two I'd write first after the pillar: both are genuinely surprising, both are well sourced, and neither exists elsewhere in readable form.

### Standards each article must meet

1. **A real thesis in the first 100 words.** No throat-clearing.
2. **Sourced claims**, numbered, linking to the bibliography.
3. **States what isn't known** in a caveat callout — every piece.
4. **1,200–2,500 words.** Long enough to be the best page on the question, short enough to be read.
5. **No AI-slop tells**: no "in today's world", no "delve", no bulleted restatement of the intro as a conclusion.
6. **One clear next step** at the end — usually an adjacent article, sometimes the test, never both plus a newsletter.

---

## 4. Content pipeline

Extend the existing generator rather than adding a framework:

```
content/
  articles/*.md        front matter: title, kicker, standfirst, updated, topics, sources
  ↓  tools/build-content.mjs  (markdown → HTML, zero JS)
dist/
  articles/<slug>.html
  about/sources.html
  sitemap.xml
```

Use a small, boring markdown library (`marked` or `markdown-it`) at build time only — it never reaches the client. Front matter drives the meta tags, the article header, and the "further reading" cross-links.

---

## 5. SEO mechanics — the honest subset

Do:

- **One `<title>` per page** that reads like a sentence a human would type, and a `<meta name="description">` that is an actual summary.
- **Canonical URLs**, a **sitemap.xml** generated at build, a **robots.txt** allowing everything except `/assessment/`.
- **JSON-LD `Article`** with `datePublished`/`dateModified` and real author info — nothing invented.
- **Semantic headings** in order, descriptive link text, alt text on any figure.
- **Internal links** that follow the cluster structure: spokes link to the pillar, the pillar links to every spoke, results link to the relevant spoke.
- **OG/Twitter cards** with a static generated image per cluster — text on a plain ground, no stock brain imagery.
- **Speed**, which is already fine: static HTML, no JS, one font.

Don't:

- `FAQPage` schema for questions nobody asked, or `HowTo` on an explainer.
- Doorway pages per keyword variation.
- A "personality test" page that exists only to rank and then dumps you into the assessment.
- Claims in a title the article doesn't support. "The Braverman test is a scam" would rank and would be less accurate than what we're actually saying.

---

## 6. Phases

| Phase | Work | Done when |
|---|---|---|
| ~~**A**~~ ✅ | Type system: tokens, scale, spacing rhythm, shared stylesheet, font implemented | **Done.** `src/design/{tokens,base,components}.css`, Source Serif 4 Variable self-hosted (52 KB roman only — no italic file; our copy uses bold far more than italics), one cached `/assets/site.css` generated from the design sources so the static pages and the app cannot drift. Content pages dropped 5 KB → 3.2 KB. |
| **B** ◐ | Component vocabulary: kicker/lede/callout/pull/TOC/footnotes/grade chip; new band display; print stylesheet | **Partly done.** Kicker, lede, callout variants, pull, grade chips, buttons, source lists, print stylesheet and the new band display are in and verified. TOC and footnote components are written but unused until the article pipeline exists (phase C). |
| ~~**C**~~ ✅ | Markdown pipeline + article template + sitemap + JSON-LD | **Done.** `tools/lib/article.mjs`: front matter, `:::` callout fences, `[^id]` footnotes resolved against the bibliography (an unknown id fails the build), auto TOC, reading time, `Article` JSON-LD with real dates only, canonical URLs, generated `sitemap.xml` and `robots.txt` (assessment disallowed). |
| ~~**D**~~ ✅ | Bibliography build + `/about/sources.html` | **Done.** `tools/build-references.mjs` parses the research docs into **134 sources across 7 topics**, each with the claim it supports and a short stable citation id. Per-scale further-reading links still to do — they need more articles first. |
| ~~**E**~~ ✅ | Pillar rewrite (#1) plus articles #7 and #12 | **Done.** *The Braverman test, explained* (7 min, 11 footnotes, full scoring rules and version differences) now owns `/about/braverman.html` via a front-matter `path`, so the existing inbound links keep their authority. Plus *Sensitivity beats level* (4 min, 7 footnotes) and *The traits you can't see in yourself* (5 min, 6 footnotes). |
| **F** | Remaining nine articles, in cluster order | |

A–D are a few days of focused work. E–F is writing, and should be paced rather than batched — the quality bar above is the whole point, and twelve mediocre articles would actively damage the thing this project is for.

---

## 7. Risks

| Risk | Mitigation |
|---|---|
| Articles drift toward SEO filler | The six standards in §3 are a checklist; if a piece can't meet them, it doesn't ship |
| The font budget creeps | One family, latin subset, measured in CI against a stated budget |
| Bibliography rots as research docs change | Generate it from the docs, never by hand |
| The test becomes an afterthought to the blog | Every article's next step is either the adjacent article or the test — and the pillar always offers the test |
| Ranking for "braverman test" invites people expecting the original | That's the point, and the pillar has to be genuinely useful to someone who came for the original — including reproducing the scoring rules they were looking for |
