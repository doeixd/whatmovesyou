// Generates the favicon raster fallbacks and a social card per page.
//
//   node tools/build-images.mjs
//
// Output is committed to public/, so the images ship as static files and the
// site build itself stays dependency-free. Re-run this only when the mark or a
// page title changes.
//
// Text is set in a system serif stack rather than Source Serif: librsvg has no
// @font-face support, so a web font would silently fall back anyway. The mark
// carries the identity; the type just has to be well set.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT = join(ROOT, "public");
mkdirSync(join(OUT, "og"), { recursive: true });

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ── palette, matching src/design/tokens.css (light) ────────────────────────
const INK = "#17181b";
const SOFT = "#4d5058";
const FAINT = "#767981";
const PAPER = "#fbfaf8";
const RULE = "#cfccc5";
const ACCENT = "#2d5b4e";

/** The band display reduced to a mark: a track, a centre tick, an off-centre dot. */
const mark = (x, y, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <line x1="-90" y1="0" x2="90" y2="0" stroke="${RULE}" stroke-width="6" stroke-linecap="round"/>
    <line x1="0" y1="-22" x2="0" y2="22" stroke="${FAINT}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="62" cy="0" r="17" fill="${ACCENT}"/>
  </g>`;

/**
 * Wrap a title to a fixed width. Rough metrics are fine: these are display
 * sizes with generous margins, and being a character out never shows.
 */
function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', system-ui, sans-serif";

function card({ kicker, title, tagline }) {
  const lines = wrap(title, 26);
  const size = lines.length > 2 ? 76 : 88;
  const startY = 300 - ((lines.length - 1) * size * 1.12) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="1200" height="10" fill="${ACCENT}"/>
  <text x="90" y="128" font-family="${SANS}" font-size="26" letter-spacing="3.4"
        fill="${FAINT}">${esc(kicker.toUpperCase())}</text>
${lines
  .map(
    (l, i) =>
      `  <text x="90" y="${startY + i * size * 1.12}" font-family="${SERIF}" font-size="${size}" fill="${INK}">${esc(l)}</text>`
  )
  .join("\n")}
  <text x="90" y="470" font-family="${SERIF}" font-size="34" fill="${SOFT}">${esc(tagline)}</text>
  ${mark(140, 556, 0.62)}
  <text x="238" y="568" font-family="${SANS}" font-size="28" fill="${FAINT}">whatmovesyou.pages.dev</text>
</svg>`;
}

// One card per page that people might share.
const CARDS = {
  default: {
    kicker: "What moves you",
    title: "A personality test that says what it doesn't know",
    tagline: "65 questions · every claim graded by evidence"
  },
  braverman: {
    kicker: "The original test",
    title: "The Braverman test, explained",
    tagline: "The scoring rules, and what the research supports"
  },
  "sensitivity-not-level": {
    kicker: "Explainer",
    title: "Sensitivity beats level",
    tagline: "Same hormones, opposite effects — what that undoes"
  },
  "self-report-blind-spots": {
    kicker: "Explainer",
    title: "The traits you can't see in yourself",
    tagline: "Where self-report fails, and how predictably"
  },
  evidence: {
    kicker: "Evidence",
    title: "The evidence behind each dimension",
    tagline: "Graded strong, moderate, preliminary — or none"
  },
  method: {
    kicker: "Method",
    title: "How this was built, and what wasn't done",
    tagline: "194 items written, 65 kept, nothing validated yet"
  },
  sources: {
    kicker: "Bibliography",
    title: "Every source behind this",
    tagline: "134 papers, each with the claim it supports"
  }
};

const made = [];
for (const [name, spec] of Object.entries(CARDS)) {
  const file = join(OUT, "og", `${name}.png`);
  await sharp(Buffer.from(card(spec)))
    .png({ compressionLevel: 9, palette: true })
    .toFile(file);
  made.push(`og/${name}.png`);
}

// ── favicon raster fallbacks ───────────────────────────────────────────────
// The SVG favicon is the primary; these cover older browsers and iOS home
// screens, which ignore SVG icons.
const iconSvg = readFileSync(join(OUT, "favicon.svg"), "utf8")
  // Strip the dark-mode block: a touch icon is composited on an unknown
  // background, so it needs to be legible on its own.
  .replace(/@media[^}]*\{[\s\S]*?\}\s*\}/g, "");

for (const [file, size] of [["favicon-32.png", 32], ["apple-touch-icon.png", 180]]) {
  await sharp(Buffer.from(iconSvg), { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, file));
  made.push(file);
}

writeFileSync(
  join(OUT, "og", "README.txt"),
  "Generated by tools/build-images.mjs. Do not edit by hand — re-run the script.\n"
);

console.log(`wrote ${made.length} images: ${made.join(", ")}`);
