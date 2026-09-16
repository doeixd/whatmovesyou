#!/usr/bin/env node
// Pre-release checks over the built output.
//
//   node tools/check-release.mjs dist
//
// Catches the things that are invisible in a build log and embarrassing in
// public: placeholder origins, missing metadata, broken internal links,
// unreferenced pages, an indexable assessment, oversized payloads.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep, posix } from "node:path";
import { gzipSync } from "node:zlib";

const DIST = process.argv[2] ?? "dist";
const errors = [];
const warnings = [];
const err = m => errors.push(m);
const warn = m => warnings.push(m);

if (!existsSync(DIST)) {
  console.error(`ERROR no build at ${DIST} — run the build first`);
  process.exit(1);
}

// ── collect ────────────────────────────────────────────────────────────────
const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else files.push(full);
  }
})(DIST);

const urlOf = file => "/" + relative(DIST, file).split(sep).join(posix.sep);
const htmlFiles = files.filter(f => f.endsWith(".html"));
const pages = htmlFiles.map(f => ({ file: f, url: urlOf(f), html: readFileSync(f, "utf8") }));

/**
 * The URL a file is actually served at. Cloudflare Pages serves
 * `about/braverman.html` at `/about/braverman` and 308-redirects the `.html`
 * form, so the served URL — the one canonicals and links must use — is the
 * extensionless one.
 */
const asServed = url => url.replace(/index\.html$/, "").replace(/\.html$/, "");

// ── per-page metadata ──────────────────────────────────────────────────────
const BUDGET_GZIP_KB = { ".html": 12, ".css": 8, ".js": 60 };

for (const p of pages) {
  const noindex = /name="robots" content="noindex/.test(p.html);
  const isAssessment = p.url.startsWith("/assessment/");

  const need = (re, label) => {
    if (!re.test(p.html)) err(`${p.url}: missing ${label}`);
  };

  need(/<title>[^<]{10,70}<\/title>/, "a title of 10–70 characters");
  need(/<meta name="description" content="[^"]{50,200}"/, "a description of 50–200 characters");
  need(/<html lang="en">/, "lang attribute");
  need(/<meta name="viewport"/, "viewport");

  if (!isAssessment) {
    need(/<link rel="icon"/, "favicon link");
    need(/rel="stylesheet" href="\/assets\/site\.css"/, "the shared stylesheet");
    need(/rel="preload"[^>]+source-serif/, "font preload");
    need(/class="skip"/, "skip link");
    need(/<header class="site-head">/, "site header");
  }

  if (!noindex && !isAssessment) {
    need(/<link rel="canonical" href="https?:\/\/[^"]+"/, "canonical URL");
    need(/<meta property="og:title"/, "og:title");
    need(/<meta property="og:description"/, "og:description");
    need(/<meta property="og:url"/, "og:url");
  }

  // The assessment is a form, not a landing page.
  if (isAssessment && !noindex) err(`${p.url}: the assessment must be noindex`);

  // Placeholder origin must never ship.
  if (/example\.invalid/.test(p.html)) {
    err(`${p.url}: still contains the placeholder origin — set SITE_ORIGIN and rebuild`);
  }

  // Heading order: exactly one h1, and no h3 before an h2. The assessment is
  // exempt — its markup is rendered by Solid at runtime, so the shipped HTML is
  // just a mount point. It carries a <noscript> explanation instead, which is
  // checked below.
  if (!isAssessment) {
    const h1s = (p.html.match(/<h1[\s>]/g) ?? []).length;
    if (h1s !== 1) err(`${p.url}: expected exactly one <h1>, found ${h1s}`);
  } else if (!/<noscript>/.test(p.html)) {
    err(`${p.url}: the JS island must explain itself in a <noscript>`);
  }
  const firstH2 = p.html.search(/<h2[\s>]/);
  const firstH3 = p.html.search(/<h3[\s>]/);
  if (firstH3 !== -1 && (firstH2 === -1 || firstH3 < firstH2)) {
    warn(`${p.url}: an <h3> appears before any <h2>`);
  }

  // JSON-LD must parse, and must not claim things we don't know.
  for (const m of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      for (const banned of ["aggregateRating", "review", "author", "publisher"]) {
        if (banned in data) err(`${p.url}: JSON-LD contains invented "${banned}"`);
      }
    } catch {
      err(`${p.url}: JSON-LD does not parse`);
    }
  }
}

// ── internal links ─────────────────────────────────────────────────────────
const served = new Set(pages.map(p => asServed(p.url)));
const assets = new Set(files.map(urlOf));

for (const p of pages) {
  for (const m of p.html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const target = m[1];
    if (served.has(target) || served.has(target + "/") || assets.has(target)) continue;
    if (assets.has(target.replace(/\/$/, "/index.html"))) continue;
    err(`${p.url}: broken internal link → ${target}`);
  }

  // A link ending in .html would 308-redirect on Pages. Canonicals pointing at
  // a redirect are an SEO defect, and it is invisible until you curl the live
  // site — which is how this was found the first time.
  for (const m of p.html.matchAll(/(?:href|content)="(?:https?:\/\/[^"]+)?(\/[^"]*\.html)"/g)) {
    err(`${p.url}: link or canonical uses a .html URL that redirects → ${m[1]}`);
  }
}

// ── sitemap ────────────────────────────────────────────────────────────────
const sitemapPath = join(DIST, "sitemap.xml");
if (!existsSync(sitemapPath)) err("no sitemap.xml");
else {
  const xml = readFileSync(sitemapPath, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  if (/example\.invalid/.test(xml)) err("sitemap.xml still uses the placeholder origin");

  const listed = new Set(locs.map(l => new URL(l).pathname));
  for (const p of pages) {
    const url = asServed(p.url);
    const noindex = /name="robots" content="noindex/.test(p.html);
    if (noindex) {
      if (listed.has(url)) err(`sitemap lists a noindex page: ${url}`);
      continue;
    }
    if (!listed.has(url)) err(`sitemap is missing an indexable page: ${url}`);
  }
  for (const url of listed) {
    if (!served.has(url)) err(`sitemap lists a page that doesn't exist: ${url}`);
  }
}

// ── robots ─────────────────────────────────────────────────────────────────
const robotsPath = join(DIST, "robots.txt");
if (!existsSync(robotsPath)) err("no robots.txt");
else {
  const robots = readFileSync(robotsPath, "utf8");
  if (!/Disallow: \/assessment\//.test(robots)) err("robots.txt does not disallow /assessment/");
  if (!/Sitemap: https?:\/\//.test(robots)) err("robots.txt has no sitemap line");
  if (/example\.invalid/.test(robots)) err("robots.txt still uses the placeholder origin");
}

// ── Cloudflare config ──────────────────────────────────────────────────────
for (const f of ["_headers", "_redirects"]) {
  if (!existsSync(join(DIST, f))) err(`${f} was not copied into the build`);
}

// ── weight ─────────────────────────────────────────────────────────────────
let heaviest = { url: "", kb: 0 };
for (const f of files) {
  const ext = f.slice(f.lastIndexOf("."));
  const budget = BUDGET_GZIP_KB[ext];
  if (!budget) continue;
  const kb = gzipSync(readFileSync(f)).length / 1024;
  if (kb > heaviest.kb) heaviest = { url: urlOf(f), kb };
  if (kb > budget) warn(`${urlOf(f)}: ${kb.toFixed(1)} KB gzipped, over the ${budget} KB budget`);
}

// ── report ─────────────────────────────────────────────────────────────────
for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);

console.log(
  `\n${pages.length} pages, ${files.length} files. ` +
    `Heaviest: ${heaviest.url} at ${heaviest.kb.toFixed(1)} KB gzipped.\n` +
    `${errors.length} error(s), ${warnings.length} warning(s).`
);

process.exit(errors.length ? 1 : 0);
