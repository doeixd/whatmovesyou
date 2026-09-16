# What moves you

An evidence-graded personality assessment, built as a response to the [Braverman test](https://whatmovesyou.pages.dev/about/braverman).

**Live: [whatmovesyou.pages.dev](https://whatmovesyou.pages.dev)**

Sixty-five questions across nine dimensions that run from ordinary personality into clinical territory. Every biological claim is labelled by how good the research behind it actually is — *strong*, *moderate*, *preliminary* or *none* — and there are 134 cited sources. Nothing you answer leaves your device.

---

## Why it exists

It started as a response to the Braverman Nature Assessment, a 315-question questionnaire from a 2005 book that sorts people into dopamine, acetylcholine, GABA and serotonin "natures". That test has no published evidence of reliability or validity, and two of its four types don't correspond to any measurable trait.

The interesting part isn't that it's wrong. It's that the underlying intuition — that real physical differences shape how people behave — is right, and there is good research on it. It just doesn't say what that test says.

So this is the same territory, built the other way round: start from what the evidence supports, and label the strength of everything you can't.

## What it deliberately does not do

| | |
|---|---|
| **No percentile** | There is no norm sample, so there is nothing honest to compare you against. Scores are relative to your own other scores. We haven't earned a population comparison yet. |
| **No diagnosis** | Nine dimensions, not nine disorders. Mental-illness traits are treated as dimensions, in the HiTOP/PID-5 sense. |
| **No neurotransmitter levels** | No questionnaire can measure those. |
| **No supplement recommendations** | |
| **No analytics, accounts or cookies** | No third-party requests of any kind. Answers live in `localStorage` and are scored on your device. |

## Honesty about the instrument

**The instrument is unvalidated.** The questions were written by one author and no pilot study has been run. That is stated on the landing page, on the results page and in the method notes, because it is the main thing separating this from the test it responds to.

## Safety

One item — the only risk-disclosure item in the bank — trips an immediate interrupt when answered at or above "Slightly". It brings up region-aware crisis resources (988, Crisis Text Line, Samaritans, Find a Helpline) with a working way out. It is never deferred to the results page, and it is covered by tests, because it is the one path that must not fail.

---

## How it is put together

A multi-page static site, not an SPA. The content pages are real HTML generated at build time; the assessment is the only JavaScript island on the site.

| | |
|---|---|
| **Framework** | Solid 2 (`2.0.0-rc.8`) — the only runtime dependency |
| **Build** | Vite via [Vite+](https://viteplus.dev) (`vp`), TypeScript |
| **Hosting** | Cloudflare Pages, static assets only |
| **Server** | None. No SSR framework, no database, no API |

The trade-off is deliberate. No SSR means a client-rendered SPA would be bad for the one page most likely to attract search traffic (`/about/braverman`) — so that page, and every other content page, is plain generated HTML that reads fine with JavaScript disabled, in a crawler, or in a text browser.

Scoring is pure TypeScript in `src/lib`, with no Solid imports: unit-testable, and it survives a framework change.

```
index.html                      landing            ─┐
about/braverman.html            comparison          │
about/evidence.html             evidence by scale   │ generated at build
about/method.html               how it was built    │ from the copy deck
about/sources.html              every source        │
articles/*.html                 3 explainers       ─┘
assessment/index.html           the Solid island
404.html

src/
  app/     Assessment.tsx, ItemScreen.tsx, Results.tsx, SafetyInterrupt.tsx, advance.ts, session.ts
  lib/     scoring.ts, storage.ts                  ← plain TS, no reactivity
  data/    bank.ts, copy.ts                        ← generated, typed
  design/  tokens.css, base.css, components.css    ← one design system, static pages and app
tools/
  build-data.mjs        bank + copy deck → typed modules
  build-content.mjs     copy deck + markdown → static HTML and the shared stylesheet
  build-references.mjs  sources → bibliography
  build-images.mjs      social cards
  check-*.{mjs,py}      the invariants below
bank/     194-item pool and the 65 selected for v1, with the review notes
copy/     the copy deck — every string the site renders
research/ the design work behind it (see the caveat below)
```

## Commands

Node 24.18.0 and pnpm 12.4.2, both pinned via `devEngines`.

| Command | What it does |
|---|---|
| `pnpm run data` | Regenerates the typed bank/copy modules, the bibliography and every static page |
| `pnpm run dev` | `data` → Vite dev server |
| `pnpm run build` | `data` → typecheck → Vite build into `dist` |
| `pnpm run test` | 32 unit and reactivity tests, including the safety-interrupt path |
| `pnpm run verify` | Item-bank and copy-deck invariants (Python) |
| `pnpm run release` | `build` + the pre-release checks over `dist` |

`SITE_ORIGIN` must be set for a real build, because every canonical URL, `og:url`, `sitemap.xml` and `robots.txt` line is derived from it:

```bash
SITE_ORIGIN=https://whatmovesyou.pages.dev pnpm run release
```

There is no default that works in production. The placeholder is `https://example.invalid`, and `check-release.mjs` fails the build if it ever reaches `dist`.

### What `check-release.mjs` enforces

It runs over the built output, so it catches what a build log hides: no placeholder origin anywhere; per-page title/description/language/viewport/favicon/skip-link budgets; canonical and `og:*` on every indexable page; exactly one `<h1>`; the assessment `noindex` with a `<noscript>` explanation; JSON-LD that parses and invents no `author`, `publisher`, `review` or `aggregateRating`; every internal link resolving; no `.html` URLs in links or canonicals (Cloudflare 308-redirects those, so a canonical pointing at one points at a redirect); a sitemap that matches reality in both directions; `robots.txt`; and gzipped weight budgets of 12 KB per HTML page, 8 KB CSS, 60 KB JS.

## Deploying

Two Cloudflare accounts are configured, so the account must always be explicit, and wrangler commands must never run in parallel — concurrent OAuth refreshes invalidate the saved login. See [RELEASE.md](RELEASE.md) for the full command sequence and the post-deploy checks.

---

## Status

Work in progress. The bank is version 0.9.0 and the instrument is unvalidated by design; the honest claims are the point of the project rather than a caveat on it.

## Third-party material and licensing

`research/` documents the work behind the design, and it includes material this project does not own:

- `research/questions.json` — all 315 items of the Braverman Nature Assessment, transcribed from publicly circulated clinic handouts
- `research/sources/` — the source PDFs and their text extractions, plus a scrape of bravermantest.com

The Braverman test's questions are copyrighted material from *The Edge Effect* (Braverman, Sterling, 2005), and `research/README.md` notes that they are reproduced for research, and that licensing or rewording is needed before shipping anything public. They are **not** used by the app: every item in `bank/v1.json` is original writing, and none of the Braverman items ship in the build. Treat the two directories as research notes with unresolved licensing, not as redistributable content.

No licence has been chosen for this project yet.
