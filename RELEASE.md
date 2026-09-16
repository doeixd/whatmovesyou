# Release

## Live

**https://whatmovesyou.pages.dev** — Cloudflare Pages project `whatmovesyou`, account `07b7e6ea7ffc5a71ca457d194d43083f` (Doeixd).

## One-time setup

**Decide the origin.** Everything canonical — canonical tags, `og:url`, `sitemap.xml`, `robots.txt` — is built from `SITE_ORIGIN`. There is no default that works in production: the placeholder is `https://example.invalid`, and `check-release.mjs` fails the build if it ever reaches `dist`.

```bash
SITE_ORIGIN=https://whatmovesyou.pages.dev pnpm run release
```

If a custom domain is coming later, build with the custom domain from the start. Changing it afterwards means re-issuing every canonical URL and re-submitting the sitemap.

## Commands

| Command | What it does |
|---|---|
| `pnpm run data` | Regenerates typed bank/copy modules, the bibliography, and every static page |
| `pnpm run build` | `data` → typecheck → Vite build into `dist` |
| `pnpm run test` | 23 unit and reactivity tests, including the safety-interrupt path |
| `pnpm run verify` | Item-bank and copy-deck invariants |
| `pnpm run release` | `build` + the pre-release checks below |

## What `check-release.mjs` enforces

Run over the built output, so it catches what a build log hides:

- **No placeholder origin** anywhere in HTML, sitemap or robots.
- **Per page:** title 10–70 chars, description 50–200 chars, `lang`, viewport, favicon, shared stylesheet, font preload, skip link, site header.
- **Per indexable page:** canonical, `og:title`, `og:description`, `og:url`.
- **Exactly one `<h1>`**, and a warning if an `<h3>` precedes any `<h2>`.
- **The assessment must be `noindex`** and must carry a `<noscript>` explanation — it's a form, not a landing page, and it's the only page that needs JS.
- **JSON-LD parses** and contains no invented `author`, `publisher`, `review` or `aggregateRating`.
- **Every internal link resolves** to a real file.
- **No `.html` URLs in links or canonicals.** Cloudflare Pages serves `about/braverman.html` at `/about/braverman` and 308-redirects the `.html` form, so a canonical pointing at `.html` points at a redirect. This was found by curling the first production deploy, and is now checked at build time.
- **Sitemap matches reality**: every indexable page listed, no `noindex` page listed, nothing listed that doesn't exist.
- **`robots.txt`** disallows `/assessment/` and points at the sitemap.
- **`_headers` and `_redirects`** made it into the build.
- **Weight budgets**: 12 KB gzipped per HTML page, 8 KB CSS, 60 KB JS.

## Deploying to Cloudflare

Two accounts are configured, so the account must be explicit. Never run wrangler commands in parallel — concurrent OAuth refreshes invalidate the saved login.

```bash
# 1. Build with the real origin and check it
SITE_ORIGIN=https://whatmovesyou.pages.dev pnpm run release

# 2. Preview deploy first
CLOUDFLARE_ACCOUNT_ID=07b7e6ea7ffc5a71ca457d194d43083f \
  wrangler pages deploy dist --project-name whatmovesyou --branch preview

# 3. Production, once the preview checks out
CLOUDFLARE_ACCOUNT_ID=07b7e6ea7ffc5a71ca457d194d43083f \
  wrangler pages deploy dist --project-name whatmovesyou --branch main --commit-dirty=true
```

**Deploying publishes publicly.** Confirm the account and project name before running it.

## Post-deploy checks, in order

1. **The safety path.** Answer the self-harm item on the production build and confirm the interrupt appears immediately with all four crisis resources and a working "Stop here". This is the one check that is never optional.
2. Load `/` with JavaScript disabled — everything except `/assessment/` must read normally.
3. `/sitemap.xml` and `/robots.txt` show the real origin.
4. A redirect works: `/braverman` → `/about/braverman.html`.
5. A missing URL renders the 404 page.
6. Headers landed: `curl -sI https://<origin>/assets/site.css | grep -i cache-control`.
7. Dark mode, by switching the OS appearance.
8. Submit the sitemap in Search Console.

## What ships

| | |
|---|---|
| Pages | 10 (landing, 3 articles incl. the pillar, evidence, method, sources, article index, 404, assessment) |
| Sources published | 134, each with the claim it supports |
| Items | 65, from a 194-item pool |
| JS | 38 KB gzipped, only on `/assessment/` |
| Font | 52 KB, one file, cached across every page |
| Third-party requests | none |
| Analytics | none |

## Known gaps at launch

Stated here so nobody discovers them as surprises:

- **No OG images.** Cards fall back to `summary` with title and description. Adding images needs a rasteriser, and the honest options all add a heavy dependency for a build that currently has none.
- **No apple-touch-icon PNG.** The favicon is SVG-only, which modern browsers handle and older iOS home-screen bookmarks don't.
- **Narrow-viewport testing was done with a CSS constraint probe**, not a real device or a resized viewport — the browser tooling here wouldn't change the rendering viewport. Layout is fluid and the one fixed-width risk (wide tables) is wrapped in its own scroll container, verified at 390 px.
- **The instrument is unvalidated.** That's stated on the landing page, the results page and the method notes, and it is the main thing distinguishing this from the test it responds to.
