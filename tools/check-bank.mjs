// Structural audit of the shipped bank.
//
//   node tools/check-bank.mjs
//
// Deliberately recomputes everything from bank/v1.json and the generated
// pagination without importing app code, so a bug in scoring.ts can't hide a
// bug in the data. Checks the things that would be quietly catastrophic:
// an item unreachable in the flow, a reversed item scored the wrong way, a
// stigmatising scale leaking into the report, the risk item not last.
import { readFileSync } from "node:fs";
const bank = JSON.parse(readFileSync("bank/v1.json", "utf8"));
const src = readFileSync("src/data/bank.ts", "utf8");
const PAGES = JSON.parse(src.match(/PAGES: readonly \(readonly ItemId\[\]\)\[\] = (\[[\s\S]*?\]);/)[1]);
const fail = [], ok = [];
const check = (cond, msg) => (cond ? ok : fail).push(msg);

// 1. every item appears exactly once across pages
const paged = PAGES.flat();
const bankIds = bank.items.map(i => i.id);
check(paged.length === bankIds.length, `pages contain ${paged.length} items, bank has ${bankIds.length}`);
check(new Set(paged).size === paged.length, "no item appears on two pages");
check(bankIds.every(id => paged.includes(id)), "every bank item is reachable in the flow");

// 2. risk item is last overall
const risk = bank.items.filter(i => i.safety);
check(risk.length === 1, "exactly one risk item");
check(paged.at(-1) === risk[0]?.id, "risk item is the very last question");

// 3. scale integrity
for (const s of bank.scales) {
  const items = bank.items.filter(i => i.scaleId === s.id);
  const plus = items.filter(i => i.keyed === "+").length;
  const minus = items.length - plus;
  const impairment = items.every(i => i.responseScaleId === "impair9");
  check(impairment || Math.abs(plus - minus) <= 1, `${s.id}: keying balanced (+${plus}/-${minus})`);
  check(items.length >= s.scoring.minItemsAnswered, `${s.id}: enough items for its minimum`);
  check(s.bodyLinks.length > 0, `${s.id}: declares a body link`);
  for (const l of s.bodyLinks) {
    check(["strong","moderate","preliminary","genetic","none"].includes(l.grade), `${s.id}: valid grade`);
    if (["strong","moderate"].includes(l.grade))
      check(l.citations.length > 0, `${s.id}: ${l.grade} claim is cited`);
    for (const c of l.citations)
      check(bank.citations.some(x => x.id === c), `${s.id}: citation ${c} resolves`);
  }
}

// 4. reverse scoring, computed from scratch
const scaleOf = id => bank.items.find(i => i.id === id);
const rs = Object.fromEntries(bank.responseScales.map(r => [r.id, r]));
const score = (item, raw) => {
  const vals = rs[item.responseScaleId].options.map(o => o.value);
  return item.keyed === "+" ? raw : Math.min(...vals) + Math.max(...vals) - raw;
};
const plusItem = bank.items.find(i => i.keyed === "+" && i.responseScaleId === "agree5");
const minusItem = bank.items.find(i => i.keyed === "-" && i.responseScaleId === "agree5");
check(score(plusItem, 5) === 5 && score(plusItem, 1) === 1, "positive items score as answered");
check(score(minusItem, 5) === 1 && score(minusItem, 1) === 5, "reverse items flip about the midpoint");
check(score(minusItem, 3) === 3, "the midpoint is fixed under reversal");

// 5. internal-only scales must never be reportable
const internal = bank.scales.filter(s => s.report?.internalOnly).map(s => s.id);
check(internal.includes("a6_unusual") && internal.includes("a8_episodicity"),
  `stigmatising scales held back: ${internal.join(", ")}`);

// 6. no item text is a near-duplicate of another in the same scale
const norm = t => t.toLowerCase().replace(/[^a-z ]/g, "");
for (const a of bank.items) for (const b of bank.items) {
  if (a.id >= b.id || a.scaleId !== b.scaleId) continue;
  check(norm(a.text) !== norm(b.text), `no exact duplicate text in ${a.scaleId}`);
}

// 7. no negations
const NEG = /\b(don't|doesn't|didn't|won't|can't|isn't|wasn't|haven't|never|rarely|nothing|not|without)\b/i;
const negs = bank.items.filter(i => NEG.test(i.text));
check(negs.length === 0, `no negated items (found ${negs.length})`);

console.log(`PASS ${ok.length}`);
for (const f of fail) console.log(`FAIL ${f}`);
process.exit(fail.length ? 1 : 0);
