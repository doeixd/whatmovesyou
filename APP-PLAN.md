# App plan

Build plan for the assessment in [research/SPEC-v1.md](research/SPEC-v1.md), constrained by [research/PLAN-07-no-budget.md](research/PLAN-07-no-budget.md), using [bank/v1.json](bank/v1.json) and [copy/deck.en-US.json](copy/deck.en-US.json).

**Stack: Solid 2.x + Vite. No SolidStart, no SSR framework, no server in phase 1.**

---

## 1. What this choice buys and costs

| | |
|---|---|
| **Buys** | One beta dependency instead of two. `vite-plus` works normally — the pipeline conflict in the earlier draft disappears, so `vp dev`, `vp build`, `vp check` all apply. Deploys as static files. Nothing to run, nothing to pay for, nothing to keep patched. |
| **Costs** | No SSR. A client-rendered SPA is bad for the one page most likely to attract search traffic (`/about/braverman`), and adds a blank-screen moment on slow connections. |

**The fix for the cost: build as a multi-page app, not a single-page app.** Vite handles multiple HTML entry points natively.

- **Content pages** (`/`, `/about/*`) are **real static HTML**, generated at build time from the copy deck by a small Node script. Text, headings and links present in the source. No framework needed to read them.
- **The assessment** is the only genuinely interactive surface, and it's the one Solid island that ships meaningful JS.

That gets us SSR's actual benefits for the pages that need them, without a server or a meta-framework.

---

## 2. Stack

| Choice | Notes |
|---|---|
| **Solid 2.x** | Beta. Verify installed exports before writing against `Loading`, `Errored`, split `createEffect`, or the `@solidjs/*` package moves. |
| **Vite** (via `vite-plus`) | Multi-page config; `vp` for dev, build, format, lint. |
| **Routing** | The assessment has ~4 client views (intro → items → context → results). That does not need a router. Use a plain state machine in a store; use real URLs only for the static content pages, which the browser routes for free. If `@solidjs/router` turns out to be Solid-2-ready and we later want deep links, it can be added — but don't take an ecosystem-lag risk for something four views need. |
| **TypeScript** | Bank and copy deck become typed modules at build time. |
| **Cloudflare** | Static assets. New project, not the existing `whats-left-over`. |
| **Persistence** | `localStorage`, wrapped in try/catch. No account, no server. |
| **Later, optionally** | A separate small Worker + D1 for opt-in contribution, item feedback and the informant module. Deliberately *not* part of the app build — a different deployable with a different risk profile. |

---

## 3. Structure

```
index.html                    landing            ─┐
about/braverman.html          comparison          │ generated at build
about/evidence.html           all body links      │ from the copy deck
about/method.html             how it was built   ─┘
assessment/index.html         the Solid island

src/
  app/            Assessment.tsx, ItemScreen.tsx, Results.tsx, Safety.tsx
  lib/            scoring.ts, storage.ts, session.ts    ← plain TS, no reactivity
  data/           bank.ts, copy.ts                      ← generated, typed
tools/
  build-content.mjs   copy deck + markdown → static HTML
  build-data.mjs      bank/v1.json + copy deck → typed modules
```

**`src/lib` contains no Solid imports.** Scoring is pure functions over a bank and an answer map — unit-testable, reusable by the informant flow later, and it survives any framework change.

---

## 4. Solid 2.x patterns

The places where 1.x habits produce wrong code.

### Answers as a draft-first store

```ts
import { createStore, snapshot } from "solid-js";

const [answers, setAnswers] = createStore<Record<string, number | null>>({});

const answer = (itemId: string, value: number) =>
  setAnswers(draft => {
    draft[itemId] = value;
  });
```

`snapshot(answers)` for serialization — not `unwrap`.

### Progress and scores are memos, never write-back effects

```ts
const answered = createMemo(() => Object.values(answers).filter(v => v != null).length);
const result   = createMemo(() => scoreSession(bank, snapshot(answers)));
```

Writing app state from inside a tracked scope warns in 2.x, and it's the wrong shape regardless.

### Persistence is the one legitimate effect, and it's split

```ts
createEffect(
  () => snapshot(answers),
  current => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(current));
    } catch {
      /* private window or quota — resume is a convenience, not a requirement */
    }
  }
);
```

Compute tracks; apply touches the outside world.

### Microtask batching

Setters don't change what reads return synchronously. Focus management and scroll-to-next must not assume the update applied. `flush()` only where a synchronous settled point is genuinely needed.

### Control flow

```tsx
<For each={page().items} keyed={false}>
  {(item, i) => <ItemCard item={item()} index={i()} />}
</For>
```

`Index` is gone; `For` children receive **accessors**.

### Other

- `onSettled`, not `onMount` — used once, to restore a draft and focus the first unanswered item.
- Context object *is* the provider; no `Context.Provider`.
- `Loading` / `Errored` if any async appears. In phase 1 there is none, which is a feature.

---

## 5. Views

A four-state machine, no router:

```
intro ──▶ items (11 pages) ──▶ context ──▶ results
             ▲       │
             └───────┘ back/forward, resumable
```

State lives in one store; the URL stays `/assessment`. The back button is handled explicitly with `history.pushState` per page so it does what people expect instead of dumping them out of the flow.

---

## 6. UX

### Item screens

- **Six items per screen, 11 screens.** One-at-a-time feels endless at this length; a single long list feels like a tax form.
- **Five-button radiogroup**, real radio semantics, labels visible on desktop and accessible-named on mobile, 44px minimum targets.
- **Keyboard: 1–5 answers, arrows move, Enter continues.** Announced once, quietly.
- **No auto-advance.** It feels slick and produces mis-taps people can't correct without hunting backwards.
- **Honest progress:** "Page 4 of 11 · about 5 minutes left", from measured answer times, not a bar that stalls at 90%.
- **Per-item "unclear?" control**, logging item id and an optional note. This is the free stand-in for the cognitive interviews we can't run — present, but quiet. Stored locally until the feedback endpoint exists.

### Where engagement comes from

Personality-test engagement normally comes from flattery and false precision. Both are banned here, so it has to come from:

- **Writing quality** — the copy deck is the product's main asset.
- **Pace** — everything is local, so nothing should ever spin.
- **The comparison hook** — "here's what the 2005 test got wrong" is genuinely interesting and entirely true.
- **Reveal structure** — headline, then traits, then the evidence underneath.

Not from: streaks, urgency, "only 3% of people score like this", or a share card that flatters.

### Results

1. **Profile shape** — nine scales relative to each other. No percentiles, and no chart that implies population position.
2. **Trait × impairment grid** — the interpretive key.
3. **Per-scale cards** — band sentence, cost, upside, collapsible evidence panel with system, grade, citations.
4. **"What this isn't"** at full size, not in a footer.
5. **Braverman comparison.**
6. **Save/share** — a local link by default; nothing leaves the device unless asked.

### Visual direction

Editorial and quiet, closer to a well-set article than a quiz. Generous type, restrained palette, one accent, dark mode via tokens. No brains, neurons or molecules — the thesis is that the biology talk is overclaimed, so the visuals can't overclaim either.

---

## 7. Accessibility and safety

- Real `radiogroup`/`radio` semantics, not styled divs.
- Focus moves deliberately on page change; never trapped.
- `prefers-reduced-motion` honoured on every transition.
- Contrast ≥ 4.5:1; never colour alone for a band.
- **Safety interrupt:** a positive answer to `a9_imp_10` immediately renders the crisis block from the copy deck — full width, before continuing, with "stop here" as a real option alongside "continue". Never deferred to results, never dismissible by clicking away.
- Severe impairment surfaces the `severe_impairment` copy prominently on results.

Because there's no server, the safety path is pure client code — which means it must be covered by a test that fails loudly if the interrupt stops firing.

---

## 8. Cloudflare

Static assets only. Build output is a directory of HTML, JS and CSS.

```bash
vp build
# confirm account + project name before this — it publishes publicly
CLOUDFLARE_ACCOUNT_ID=07b7e6ea7ffc5a71ca457d194d43083f wrangler pages deploy dist --project-name <new-project>
```

- Account: Doeixd's (`07b7e6ea7ffc5a71ca457d194d43083f`). Two accounts are configured, so it must be set explicitly.
- **New project** — not `whats-left-over`.
- Never run wrangler commands in parallel; concurrent OAuth refreshes invalidate the saved login.
- Preview deploy first; verify the safety interrupt on the deployed build before sharing the URL with anyone.

No Workers, no D1, no bindings until phase 6+.

---

## 9. Privacy

Trivially strong, because there's nothing to be careful with:

- The test sends nothing. No accounts, no cookies, no third-party analytics.
- Answers live in `localStorage` and can be cleared from the UI.
- If contribution ships later, it's a separate opt-in against a separate Worker, with a deletion code returned, and no identifiers stored.

A tracker on a mental-health-adjacent questionnaire would be indefensible, and a static site makes refusing one free.

---

## 10. Performance budget

| Page | Budget | Actual |
|---|---|---|
| Content page HTML | < 6 KB gzipped, zero JS | 1.5–4.5 KB ✓ |
| Shared stylesheet, cached across every page | < 6 KB gzipped | ~4 KB ✓ |
| Web font — one file, cached once, `font-display: swap` | < 55 KB | 52 KB ✓ |
| `/assessment` JS | < 60 KB gzipped | 39.6 KB ✓ |
| Bank payload | < 50 KB — v1's 65 items only; the 194-item pool never reaches the client | ✓ |
| LCP, 4G mobile | < 1.5 s | to measure |
| Interaction latency | < 50 ms (everything is local) | ✓ |

The font is a deliberate addition from [PLAN-content-and-design.md](PLAN-content-and-design.md) §1, and the LCP target moved from 1.2 s to 1.5 s to pay for it. Recorded here rather than quietly broken. Content pages got *smaller* (5 KB → 3.2 KB) because the CSS moved out of every page into one cached file.

---

## 11. Build phases

| Phase | Deliverable | Done when |
|---|---|---|
| **0** | Stack check: Solid 2.x under `vite-plus`, multi-page config | A page renders with a split `createEffect` and `<For keyed={false}>`; `vp dev` and `vp build` both work |
| **1** | Data build: `bank/v1.json` + copy deck → typed modules | Item text and copy are type-safe at the call site; `check-copy.py` still passes |
| **2** | Item flow: 65 items, local scoring, resume, safety interrupt | Full run on a phone; refresh mid-way resumes; risk item interrupts; safety test in place |
| **3** | Results: profile shape, grid, evidence panels, "what this isn't" | Every string renders from the deck, none hardcoded |
| **4** | Static content pages generated from the deck | `/about/braverman` reads well with JS disabled |
| **5** | Cloudflare deploy | Live; safety path verified on production |
| **6+** | *Separate deployable:* Worker + D1 for opt-in contribution, item feedback, informant module | Rows land with no identifiers; deletion codes work |

Phases 0–5 are the product and need no backend at all.

---

## 12. Risks

| Risk | Mitigation |
|---|---|
| Solid 2.x beta churn | Pin exact versions. Keep framework code thin: scoring, storage and the bank are plain TS and survive a rewrite. |
| Ecosystem lag (router, libraries) | Avoid the ecosystem. Four views need a state machine, not a router. |
| SPA hurts search for the comparison page | Content pages are static HTML, generated at build. |
| 65 items is a long form | Six per page, honest progress, resumable. Measure drop-off per page once contribution exists — until then, it's unknown and should be assumed bad. |
| Someone in crisis uses this | Safety interrupt covered by a test; verified on production each deploy; resources are first-class copy. |
| Results feel thin without percentiles | Accurate, and the tradeoff was chosen deliberately. Compensate with writing and the comparison piece, never by inventing a comparison. |

---

## 13. First three actions

1. **Phase 0 stack check.** Install Solid 2.x in this repo, confirm `vp dev`/`vp build` behave with a multi-page config, and render one screen using a split `createEffect` and `<For keyed={false}>`. Everything else assumes this works.
2. **Write `build-data.mjs`** — bank and deck into typed modules, so item ids are checked by the compiler rather than by hope.
3. **Build the item screen first.** It's the riskiest UX and the thing the whole product is judged by. The landing page can wait.
