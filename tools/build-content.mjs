// Generates the static content pages from the copy deck and the bank.
//
//   node tools/build-content.mjs
//
// These pages are plain HTML with inlined CSS and no JavaScript at all. The
// assessment is the only Solid island (APP-PLAN.md §1): /about/braverman.html
// is the page most likely to attract search traffic, and it should be readable
// with JS disabled, by a crawler, or in a text browser.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, existsSync } from "node:fs";
import { renderArticle } from "./lib/article.mjs";
import { join } from "node:path";

const ROOT = process.cwd();
const bank = JSON.parse(readFileSync(join(ROOT, "bank", "v1.json"), "utf8"));
const deck = JSON.parse(readFileSync(join(ROOT, "copy", "deck.en-US.json"), "utf8"));
const refs = JSON.parse(readFileSync(join(ROOT, "content", "references.json"), "utf8"));
const REFS_BY_ID = new Map(refs.grouped.flatMap(g => g.entries).map(e => [e.id, e]));

/**
 * Canonical origin. Override at build time:
 *   SITE_ORIGIN=https://example.com pnpm run build
 * `tools/check-release.mjs` refuses to pass while this is still the placeholder.
 */
const SITE = (process.env.SITE_ORIGIN ?? "https://example.invalid").replace(/\/$/, "");
const SITE_NAME = "What moves you";
const urls = [];

const esc = s =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The deck uses **bold** and *italics* sparingly; nothing else is interpreted. */
const md = s =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");

// One stylesheet for the whole site, assembled from the design sources so the
// static pages and the app can never drift apart. Written into public/ so Vite
// ships it verbatim at a stable, cacheable URL - no JS, no hashed filename.
const DESIGN = ["tokens.css", "base.css", "components.css"]
  .map(f => readFileSync(join(ROOT, "src", "design", f), "utf8"))
  .join("\n");

mkdirSync(join(ROOT, "public", "fonts"), { recursive: true });
mkdirSync(join(ROOT, "public", "assets"), { recursive: true });
writeFileSync(join(ROOT, "public", "assets", "site.css"), DESIGN);
copyFileSync(
  join(ROOT, "node_modules", "@fontsource-variable", "source-serif-4", "files",
       "source-serif-4-latin-wght-normal.woff2"),
  join(ROOT, "public", "fonts", "source-serif-4-latin.woff2")
);

/**
 * Cloudflare Pages serves `about/braverman.html` at `/about/braverman` and
 * 308-redirects the `.html` form. Canonical URLs, og:url, the sitemap and every
 * internal link therefore have to use the extensionless shape — otherwise every
 * canonical points at a URL that immediately redirects, which is exactly the
 * kind of thing that quietly costs you rankings.
 */
const publicPath = p => p.replace(/index\.html$/, "").replace(/\.html$/, "");

/** Strip `.html` from internal links in generated markup, same reason. */
const cleanLinks = html => html.replace(/(href=")(\/[^"]*?)\.html(")/g, "$1$2$3");

const OG_CARDS = new Set(
  existsSync(join(ROOT, "public", "og"))
    ? readdirSync(join(ROOT, "public", "og")).filter(f => f.endsWith(".png")).map(f => f.replace(/\.png$/, ""))
    : []
);

const NAV = [
  { href: "/about/braverman.html", label: "The Braverman test" },
  { href: "/articles/", label: "Explainers" },
  { href: "/about/evidence.html", label: "Evidence" },
  { href: "/about/method.html", label: "Method" },
  { href: "/about/sources.html", label: "Sources" }
];

const page = ({
  title,
  description,
  body,
  noindex = false,
  path = null,
  jsonLd = null,
  lastmod = null,
  type = "website"
}) => {
  const pretty = path ? publicPath(path) : null;
  if (pretty && !noindex) urls.push({ path: pretty, lastmod });
  const canonical = pretty ? `${SITE}${pretty}` : null;
  // Social cards come from tools/build-images.mjs, named after the page's file.
  const card = path?.match(/([^/]+)\.html$/)?.[1];
  const ogImage = `${SITE}/og/${card && OG_CARDS.has(card) ? card : "default"}.png`;

  return cleanLinks(`<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#fbfaf8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#131419" media="(prefers-color-scheme: dark)">
${noindex ? '<meta name="robots" content="noindex,follow">\n' : ""}${canonical ? `<link rel="canonical" href="${canonical}">\n` : ""}<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/source-serif-4-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
${canonical ? `<meta property="og:url" content="${canonical}">\n` : ""}<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n` : ""}</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-head">
  <a class="wordmark" href="/">${esc(SITE_NAME)}</a>
  <nav aria-label="Main">
${NAV.map(n => `    <a href="${n.href}"${path === n.href ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`).join("\n")}
  </nav>
</header>
<main class="wrap" id="main">
${body}
</main>
<footer class="wrap site-foot">
  <nav class="foot-nav" aria-label="Footer">
    <a href="/">Home</a>
    <a href="/assessment/">Take the test</a>
${NAV.map(n => `    <a href="${n.href}">${esc(n.label)}</a>`).join("\n")}
  </nav>
  <p class="colophon">Item bank ${esc(bank.version)} · not independently validated · not a diagnosis · nothing you answer is sent anywhere</p>
</footer>
</body>
</html>
`);
};

// ── landing ────────────────────────────────────────────────────────────────
const landing = page({
  path: "/",
  // WebSite only — no Organization, because there isn't one, and no
  // SearchAction, because there's no site search to point it at.
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE}/`,
    inLanguage: "en",
    description:
      "A personality test built on dimensional trait research, with every biological claim graded by evidence strength."
  },
  title: "A personality test that says what it doesn't know",
  description:
    "Sixty-five questions across nine dimensions, with the evidence behind each one graded honestly. No percentiles, no diagnosis, nothing sent anywhere.",
  body: `
<p class="kicker">Work in progress</p>
<h1 class="display">A personality test that says what it doesn't know</h1>
<p class="lede">Sixty-five questions. Nine dimensions that run from ordinary personality into clinical territory. Every biological claim graded by how good the evidence actually is.</p>

<a class="btn btn-primary" href="/assessment/">Take it — about 8 minutes</a>

<div class="callout callout-evidence">
<p><strong>Nothing is sent anywhere.</strong> Your answers stay in your browser. There is no account, no tracking, and no analytics.</p>
</div>

<h2>Why it exists</h2>
<p>It started as a response to the <a href="/about/braverman.html">Braverman test</a>, a 315-question questionnaire from a 2005 book that sorts people into dopamine, acetylcholine, GABA and serotonin "natures". That test has no published evidence of reliability or validity, and two of its four types don't correspond to any measurable trait.</p>
<p>The interesting part isn't that it's wrong. It's that the underlying intuition — that real physical differences shape how people behave — is right, and there is good research on it. It just doesn't say what that test says.</p>

<h2>What you get</h2>
<ul>
<li>Where you sit on nine dimensions, <strong>relative to your own other scores</strong> — not to a population, because we don't have the data to make that comparison honestly.</li>
<li>What each one costs you and what it's good for. Both, always.</li>
<li>The research linking each dimension to a biological system, labelled <em>strong</em>, <em>moderate</em>, <em>preliminary</em>, or <em>none</em>.</li>
<li>A separate reading of how much your life is currently being affected, which changes what the rest of it means.</li>
</ul>

<h2>What you don't get</h2>
<ul>
<li>A percentile. <a href="/about/method.html">We haven't earned one yet.</a></li>
<li>A diagnosis, or a disorder name attached to you.</li>
<li>A claim about your neurotransmitter levels. No questionnaire can measure those.</li>
<li>Supplement recommendations.</li>
</ul>

<div class="callout callout-evidence">
<p><strong>This instrument has not been independently validated.</strong> The questions were written by one author and no pilot study has been run. That's stated here, on the results page, and in the <a href="/about/method.html">method notes</a>, because it's the main thing separating this from the test it was built in response to.</p>
</div>
`
});

// The Braverman comparison used to be generated from the copy deck here. It is
// now the pillar article (content/articles/braverman-test-explained.md), which
// claims the same URL via front matter so the existing links keep working.

// ── evidence ───────────────────────────────────────────────────────────────
const scaleSections = bank.scales
  .map(s => {
    const links = s.bodyLinks
      .map(
        l => `
  <p><span class="grade grade-${l.grade}">${esc(l.grade)}</span> <strong>${esc(l.system)}</strong></p>
  <p class="soft">${esc(l.mechanism)}</p>
  ${l.verification ? `<p class="soft"><em>Verification:</em> ${esc(l.verification)}</p>` : ""}
  <ul class="sources">${l.citations
    .map(id => {
      const c = bank.citations.find(x => x.id === id);
      return c
        ? `<li><a href="${esc(c.url)}" rel="noreferrer">${esc(c.title)}</a><span class="claim">${esc(c.claim)}</span></li>`
        : "";
    })
    .join("")}</ul>`
      )
      .join("\n");
    return `<div class="scale">
  <h3>${esc(s.name)} <span class="soft">· ${esc(s.poles.low)} ↔ ${esc(s.poles.high)}</span></h3>
  <p class="soft">${esc(s.definition)}</p>
  ${links}
</div>`;
  })
  .join("\n");

const evidence = page({
  path: "/about/evidence.html",
  title: "The evidence behind each dimension",
  description:
    "Every biological claim this test makes, with its evidence grade and sources. Including the ones graded 'none'.",
  body: `
<p class="kicker">Evidence</p>
<h1 class="display">The evidence behind each dimension</h1>
<p class="lede">Every biological link this test claims, graded. Including the ones where the honest grade is <em>none</em>.</p>

<h2>What the grades mean</h2>
<ul>${deck.framing.evidence_grades.body.map(b => `<li>${md(b)}</li>`).join("")}</ul>

<h2>By dimension</h2>
${scaleSections}
`
});

// ── method ─────────────────────────────────────────────────────────────────
const method = page({
  path: "/about/method.html",
  title: "How this was built, and what wasn't done",
  description:
    "Construct definitions, a 194-item pool cut to 65, and an honest account of the validation steps that were skipped.",
  body: `
<p class="kicker">Method</p>
<h1 class="display">How this was built — and what wasn't done</h1>
<p class="lede">The short version: the construction was careful, and the validation hasn't happened. Both halves matter.</p>

<h2>What was done</h2>
<ul>
<li><strong>Constructs defined first.</strong> Each dimension has a written definition with explicit out-of-scope boundaries and pre-decided edge cases, so items couldn't drift toward whatever sounded good.</li>
<li><strong>A blueprint before writing.</strong> Each scale was allocated a fixed number of items per facet and per severity level — mild, moderate and extreme — so the test discriminates across the range rather than only in the middle.</li>
<li><strong>194 items written, 65 kept.</strong> Roughly three times what was needed, so the selection could cut anything carrying a known confound.</li>
<li><strong>Recorded confounds.</strong> Items that might track culture, religion, income or circumstance rather than the construct are flagged in the source data with the reasoning attached.</li>
<li><strong>Cost and upside for every dimension.</strong> Enforced by a build check: a scale missing either half fails the build.</li>
</ul>

<h2>What wasn't done</h2>
<ul>
<li><strong>No independent review.</strong> Nobody but the author checked whether the items measure what the definitions say.</li>
<li><strong>No cognitive interviews.</strong> No item has been read aloud to a stranger to find out what they think it's asking.</li>
<li><strong>No pilot study.</strong> There are no reliability figures, no factor analysis, and no evidence the nine dimensions separate as intended.</li>
<li><strong>No norms.</strong> Which is why there are no percentiles anywhere in the results.</li>
<li><strong>No differential item functioning testing.</strong> Items that may behave differently for religious respondents, or across cultures, haven't been checked. The most affected dimension is deliberately withheld from the report entirely.</li>
</ul>

<div class="callout callout-evidence">
<p>Those five gaps exist because this was built without a budget, and participant panels cost money. They are stated rather than hidden, which is the difference between an honest instrument in development and a test that claims more than it has earned.</p>
</div>

<h2>What would change that</h2>
<p>Everything above is recoverable from ordinary use: reliability figures, factor structure and item performance all fall out of enough responses. If a contribution option is added later, it will be explicit, optional, identifier-free, and reversible with a deletion code.</p>
`
});

// ── articles ───────────────────────────────────────────────────────────────
const ARTICLES = join(ROOT, "content", "articles");
const articles = readdirSync(ARTICLES)
  .filter(f => f.endsWith(".md"))
  .map(file => {
    const slug = file.replace(/\.md$/, "");
    const raw = readFileSync(join(ARTICLES, file), "utf8");
    const { meta, html, minutes } = renderArticle(raw, { references: REFS_BY_ID });
    // An article may claim an existing URL via front matter, so the pillar can
    // keep /about/braverman.html instead of splitting its inbound links.
    const path = meta.path ?? `/articles/${slug}.html`;
    return { slug, path, meta, html, minutes };
  })
  .sort((a, b) => (a.meta.updated < b.meta.updated ? 1 : -1));

const articlePages = articles.map(a => ({
  path: a.path,
  html: page({
    path: a.path,
    title: a.meta.title,
    description: a.meta.description,
    type: "article",
    lastmod: a.meta.updated,
    // Article schema with real dates only. No invented author, publisher logo,
    // rating or image — every field here is something we actually know.
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.meta.title,
      description: a.meta.description,
      dateModified: a.meta.updated,
      datePublished: a.meta.updated,
      inLanguage: "en",
      isAccessibleForFree: true,
      mainEntityOfPage: `${SITE}${a.path}`
    },
    body: `${a.html}
<nav class="read-next" aria-label="Read next">
  <a class="btn" href="${a.meta.next ?? "/"}">Read next</a>
  <a class="btn" href="/about/sources.html">All sources</a>
  <a class="btn btn-primary" href="/assessment/">Take the test</a>
</nav>`
  })
}));

// ── sources ────────────────────────────────────────────────────────────────
const sourceSections = refs.grouped
  .map(
    g => `<div class="section">
<h2>${esc(g.topic)}</h2>
<ul class="sources">
${g.entries
  .map(
    e =>
      `<li><a href="${esc(e.url)}" rel="noreferrer">${esc(e.title)}</a>` +
      `<span class="claim">${esc(e.claim)}</span></li>`
  )
  .join("\n")}
</ul>
</div>`
  )
  .join("\n");

const total = refs.grouped.reduce((n, g) => n + g.entries.length, 0);

const sources = page({
  path: "/about/sources.html",
  title: "Every source behind this test",
  description: `All ${total} sources used to build this instrument, grouped by topic, each with the specific claim it supports.`,
  body: `
<p class="kicker">Bibliography</p>
<h1 class="display">Every source behind this</h1>
<p class="lede">All ${total} papers, reviews and datasets used to build this test — each one listed with the specific claim it supports, rather than just a title.</p>

<div class="callout callout-caveat">
<h4>How to read this</h4>
<p>Inclusion here means a source informed the design. It does not mean the finding is settled: several entries are listed precisely because they <em>failed</em> to replicate, and the <a href="/about/evidence.html">evidence page</a> grades each claim.</p>
</div>

${sourceSections}
`
});

// ── article index, linked from the landing page ────────────────────────────
const articleIndex = page({
  path: "/articles/",
  title: "Explainers",
  description:
    "Plain explanations of what the research actually shows about neurotransmitters, hormones and personality — with the sources attached.",
  body: `
<p class="kicker">Writing</p>
<h1 class="display">Explainers</h1>
<p class="lede">What the research actually shows, written out properly, with every claim sourced.</p>
${articles
  .map(
    a => `<div class="section">
<h2><a href="${a.path}">${esc(a.meta.title)}</a></h2>
<p>${esc(a.meta.standfirst)}</p>
<p class="meta"><span>${a.minutes} min read</span><span class="sep">Updated ${esc(a.meta.updated)}</span></p>
</div>`
  )
  .join("\n")}
`
});

const notFound = page({
  noindex: true,
  title: "Page not found",
  description:
    "That page doesn't exist. Here is everything that does: the test itself, the Braverman explainer, the evidence behind each dimension, and the full source list.",
  body: `
<p class="kicker">404</p>
<h1 class="display">That page doesn't exist</h1>
<p class="lede">It may have moved, or the link may be wrong. Here's everything that does exist.</p>
<ul>
  <li><a href="/">Home</a></li>
  <li><a href="/assessment/">Take the test</a> — 65 questions, about 8 minutes</li>
  <li><a href="/about/braverman.html">The Braverman test, explained</a></li>
  <li><a href="/articles/">Explainers</a></li>
  <li><a href="/about/evidence.html">Evidence behind each dimension</a></li>
  <li><a href="/about/method.html">How this was built</a></li>
  <li><a href="/about/sources.html">Every source</a></li>
</ul>
`
});

mkdirSync(join(ROOT, "about"), { recursive: true });
writeFileSync(join(ROOT, "index.html"), landing);
writeFileSync(join(ROOT, "about", "evidence.html"), evidence);
writeFileSync(join(ROOT, "about", "method.html"), method);
writeFileSync(join(ROOT, "about", "sources.html"), sources);
writeFileSync(join(ROOT, "404.html"), notFound);

mkdirSync(join(ROOT, "articles"), { recursive: true });
writeFileSync(join(ROOT, "articles", "index.html"), articleIndex);
for (const a of articlePages) {
  const dest = join(ROOT, ...a.path.replace(/^\//, "").split("/"));
  mkdirSync(join(dest, ".."), { recursive: true });
  writeFileSync(dest, a.html);
}

writeFileSync(
  join(ROOT, "public", "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    u =>
      `  <url><loc>${SITE}${u.path}</loc>` +
      (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "") +
      `</url>`
  )
  .join("\n")}
</urlset>
`
);

// The assessment is deliberately not indexed: it is an interactive form, not
// a page anyone should land on from search.
writeFileSync(
  join(ROOT, "public", "robots.txt"),
  `User-agent: *
Disallow: /assessment/
Sitemap: ${SITE}/sitemap.xml
`
);

const sizes = [
  ["articles", `${articles.length} article(s)`],
  ["about/sources.html", sources],
  ["index.html", landing],
  ["about/evidence.html", evidence],
  ["about/method.html", method]
].map(([name, html]) =>
  typeof html === "string" && html.startsWith("<")
    ? `${name} ${(Buffer.byteLength(html) / 1024).toFixed(1)}KB`
    : `${name} ${html}`
);

console.log(`wrote ${sizes.join(", ")}`);
