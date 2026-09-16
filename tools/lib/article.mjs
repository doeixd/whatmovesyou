// Markdown → article HTML. Build-time only; `marked` never reaches the client.
//
// Supports the pieces the design system already has components for:
//   - front matter (title, kicker, standfirst, updated, topics, next)
//   - [^ref-id] footnote markers resolved against content/references.json
//   - :::evidence / :::caveat / :::practical callout fences
//   - > pull statements written as blockquotes
//   - an automatic table of contents for longer pieces

import { marked } from "marked";

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const slug = s =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

/** Minimal YAML front matter: `key: value` and `key: [a, b]`. */
export function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error("article is missing front matter");
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    meta[key] =
      value.startsWith("[") && value.endsWith("]")
        ? value
            .slice(1, -1)
            .split(",")
            .map(v => v.trim().replace(/^["']|["']$/g, ""))
            .filter(Boolean)
        : value.replace(/^["']|["']$/g, "");
  }
  return { meta, body: m[2] };
}

const CALLOUT_TITLES = {
  evidence: "What the research shows",
  caveat: "What it doesn't show",
  practical: "What to do with this"
};

/**
 * ::: fences → callout components. An optional title on the fence line
 * overrides the default.
 *
 * The title group matches horizontal whitespace only — `\s+` would swallow the
 * newline and promote the callout's first line of body text into the heading.
 * The inner markdown is parsed here rather than left for the main pass, because
 * marked treats a raw HTML block as opaque and would emit it unrendered.
 */
function callouts(md) {
  return md.replace(
    /^:::(evidence|caveat|practical)(?:[ \t]+([^\r\n]+))?\r?\n([\s\S]*?)^:::[ \t]*$/gm,
    (_, kind, title, inner) =>
      `<div class="callout callout-${kind}">\n<h4>${esc(title || CALLOUT_TITLES[kind])}</h4>\n` +
      `${marked.parse(inner.trim())}</div>\n`
  );
}

/**
 * [^source-id] → numbered superscript, collected into a footnote list.
 * Ids are matched against the bibliography, so a typo fails the build rather
 * than rendering a dead marker.
 */
function footnotes(md, references) {
  const used = [];
  const html = md.replace(/\[\^([\w.-]+)\]/g, (_, id) => {
    const ref = references.get(id);
    if (!ref) throw new Error(`unknown reference id: ${id}`);
    let index = used.findIndex(u => u.id === id);
    if (index === -1) {
      used.push({ id, ...ref });
      index = used.length - 1;
    }
    const n = index + 1;
    return `<a class="fn" id="fnref-${n}" href="#fn-${n}" aria-label="Footnote ${n}">${n}</a>`;
  });
  return { html, used };
}

function tableOfContents(headings) {
  if (headings.length < 4) return "";
  return `<nav class="toc" aria-label="Contents">
<h4>Contents</h4>
<ol>
${headings.map(h => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join("\n")}
</ol>
</nav>`;
}

const WORDS_PER_MINUTE = 220;

export function renderArticle(raw, { references }) {
  const { meta, body } = parseFrontMatter(raw);
  for (const required of ["title", "description", "standfirst", "updated"]) {
    if (!meta[required]) throw new Error(`article "${meta.title ?? "?"}" is missing ${required}`);
  }
  // `path` lets an article claim a URL that already exists and is already
  // linked — the pillar keeps /about/braverman.html rather than splitting its
  // inbound links across two pages.

  const withCallouts = callouts(body);
  const { html: withNotes, used } = footnotes(withCallouts, references);

  const headings = [];
  const renderer = new marked.Renderer();
  renderer.heading = ({ tokens, depth }) => {
    const text = tokens.map(t => t.raw).join("");
    const id = slug(text);
    if (depth === 2) headings.push({ id, text });
    return `<h${depth} id="${id}">${marked.parseInline(text)}</h${depth}>\n`;
  };
  renderer.blockquote = ({ tokens }) =>
    `<div class="pull">${marked.parser(tokens)}</div>\n`;
  // Wrapped so a wide table scrolls inside its own box instead of forcing the
  // whole page sideways on a phone.
  const baseTable = renderer.table.bind(renderer);
  renderer.table = token => `<div class="table-wrap">${baseTable(token)}</div>\n`;

  const content = marked.parse(withNotes, { renderer, mangle: false, headerIds: false });
  const words = body.split(/\s+/).length;
  const minutes = Math.max(2, Math.round(words / WORDS_PER_MINUTE));

  const footnoteList = used.length
    ? `<section class="footnotes" aria-label="Sources">
<h4>Sources</h4>
<ol>
${used
  .map(
    (u, i) =>
      `<li id="fn-${i + 1}"><a href="${esc(u.url)}" rel="noreferrer">${esc(u.title)}</a>` +
      `<span class="claim">${esc(u.claim)}</span> <a class="fn" href="#fnref-${i + 1}" aria-label="Back to text">↩</a></li>`
  )
  .join("\n")}
</ol>
</section>`
    : "";

  const html = `<p class="kicker">${esc(meta.kicker ?? "Explainer")}</p>
<h1 class="display">${esc(meta.title)}</h1>
<p class="lede">${esc(meta.standfirst)}</p>
<p class="meta"><span>${minutes} min read</span><span class="sep">Updated ${esc(meta.updated)}</span></p>
${tableOfContents(headings)}
${content}
${footnoteList}`;

  return { meta, html, minutes, words, sources: used.length };
}
