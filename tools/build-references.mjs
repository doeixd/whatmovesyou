// Builds a bibliography from the research documents.
//
//   node tools/build-references.mjs
//
// The research folder cites ~130 sources, each with a one-line description of
// the claim it supports. That description is the valuable part — a list of
// titles is decoration, a list of claims is readable. This parses them out so
// /about/sources.html can never drift from the notes it came from.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const RESEARCH = join(ROOT, "research");

/** Which cluster each research document belongs to, and how to describe it. */
const TOPICS = {
  "neurotransmitters-and-personality.md": "Neurotransmitters and personality",
  "chemistry-and-behavior.md": "Drugs, hormones and behaviour",
  "PLAN-notes-03-setpoints.md": "Setpoints you can actually check",
  "PLAN-notes-04-clinical-spectra.md": "Traits that run into clinical territory",
  "PLAN-notes-05-gaps.md": "Measurement and its limits",
  "PLAN-06-item-methodology.md": "Measurement and its limits",
  "related-research.md": "Frameworks that came before",
  "validity.md": "The Braverman test",
  "versions.md": "The Braverman test",
  "scoring.md": "The Braverman test",
  "natures.md": "The Braverman test",
  "README.md": "The Braverman test"
};

const TOPIC_ORDER = [
  "The Braverman test",
  "Neurotransmitters and personality",
  "Drugs, hormones and behaviour",
  "Setpoints you can actually check",
  "Traits that run into clinical territory",
  "Frameworks that came before",
  "Measurement and its limits"
];

/** `- Label: https://url` and `- [Label](https://url)` */
const PLAIN = /^-\s+(.+?):\s+(https?:\/\/\S+?)\s*$/;
const LINKED = /^-\s+\[(.+?)\]\((https?:\/\/[^)]+)\)\s*(?:—\s*(.+))?$/;

const clean = s =>
  s
    .replace(/\*\*/g, "")
    .replace(/\s*\(PDF\)\s*$/i, "")
    .replace(/[.\s]+$/, "")
    .trim();

/** Pull a year out of the label when the author wrote one. */
const yearOf = label => {
  const m = label.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : undefined;
};

/**
 * A short, stable, writable id so articles can cite with [^schmidt-2017].
 * Derived from the first meaningful words of the label plus the year.
 */
const idFor = (label, year) => {
  const words = label
    .toLowerCase()
    // Fold diacritics first: without this "Høgsted" strips to "gsted", which
    // is both wrong and impossible to guess when writing a citation.
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ø/g, "o")
    .replace(/[đð]/g, "d")
    .replace(/[ł]/g, "l")
    .replace(/[æ]/g, "ae")
    .replace(/[ß]/g, "ss")
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP.has(w));
  const head = words.slice(0, 2);
  // Don't append a year the label already contains ("tang-2009-2009").
  const needsYear = year && !head.some(w => w === String(year));
  return [...head, needsYear ? year : null].filter(Boolean).join("-");
};

const STOP = new Set([
  "the", "and", "for", "with", "study", "from", "その", "a", "an", "of", "in",
  "on", "to", "et", "al", "new", "data", "vs", "versus", "using"
]);

const byUrl = new Map();

for (const file of readdirSync(RESEARCH).filter(f => f.endsWith(".md"))) {
  const topic = TOPICS[file];
  if (!topic) continue; // planning docs with no source lists

  const lines = readFileSync(join(RESEARCH, file), "utf8").split(/\r?\n/);
  let subTopic = null;

  // Every `- label: url` bullet counts, not just the ones under a Sources
  // heading: several documents cite inline, and those are sources too.
  for (const line of lines) {
    if (/^#{2,3}\s/.test(line)) {
      subTopic = null;
      continue;
    }
    // Bold run-in headings inside a source list, e.g. **Dopamine**
    const bold = line.match(/^\*\*(.+?)\*\*\s*$/);
    if (bold) {
      subTopic = clean(bold[1]);
      continue;
    }
    if (!line.startsWith("-")) continue;

    const m = line.match(LINKED) ?? line.match(PLAIN);
    if (!m) continue;

    const [, rawLabel, url, trailing] = m;
    const label = clean(rawLabel);
    const claim = trailing ? clean(trailing) : label;
    const key = url.replace(/[).,]+$/, "");

    const existing = byUrl.get(key);
    if (existing) {
      if (!existing.citedIn.includes(file)) existing.citedIn.push(file);
      if (!existing.topics.includes(topic)) existing.topics.push(topic);
      // Prefer the longest description — it carries the most claim detail.
      if (claim.length > existing.claim.length) existing.claim = claim;
    } else {
      byUrl.set(key, {
        id: idFor(label, yearOf(label)),
        url: key,
        title: label,
        claim,
        year: yearOf(label),
        topics: [topic],
        subTopic,
        citedIn: [file]
      });
    }
  }
}

const references = [...byUrl.values()].sort((a, b) => a.title.localeCompare(b.title));

// Ids must be unique, because articles cite by id and a collision would
// silently point a footnote at the wrong paper.
const seen = new Map();
for (const ref of references) {
  const base = ref.id || "source";
  let id = base;
  let n = 2;
  while (seen.has(id)) id = `${base}-${n++}`;
  ref.id = id;
  seen.set(id, ref);
}

const grouped = TOPIC_ORDER.map(topic => ({
  topic,
  entries: references
    .filter(r => r.topics[0] === topic)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title))
})).filter(g => g.entries.length);

const orphans = references.filter(r => !TOPIC_ORDER.includes(r.topics[0]));
if (orphans.length) {
  for (const o of orphans) console.error(`ERROR untopiced source: ${o.url}`);
  process.exit(1);
}

writeFileSync(
  join(ROOT, "content", "references.json"),
  JSON.stringify({ generated: new Date().toISOString().slice(0, 10), grouped }, null, 2)
);

writeFileSync(
  join(ROOT, "content", "reference-ids.txt"),
  references
    .map(r => `${r.id.padEnd(34)} ${r.title}`)
    .sort()
    .join("\n") + "\n"
);

console.log(
  `wrote content/references.json: ${references.length} sources across ${grouped.length} topics ` +
    `(${grouped.map(g => `${g.topic.split(" ")[0]} ${g.entries.length}`).join(", ")})`
);
