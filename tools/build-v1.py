#!/usr/bin/env python3
"""Assemble the v1 bank from the pools plus a selection file.

    python tools/build-v1.py bank/v1-selection.json bank/v1.json

Merges the selected items, their scales, response scales and cited sources into
a single schema-valid bank. Fails loudly if a selected id doesn't exist or a
citation is missing, so the selection file can't silently drift from the pools.
"""
from __future__ import annotations

import glob
import json
import sys
from collections import Counter


def load_pools(pattern: str = "bank/pool-*.json") -> tuple[dict, dict, dict, dict, dict]:
    items, scales, rscales, citations, blocks = {}, {}, {}, {}, {}
    for path in sorted(glob.glob(pattern)):
        bank = json.load(open(path, encoding="utf-8"))
        for i in bank["items"]:
            items[i["id"]] = i
        for s in bank["scales"]:
            scales[s["id"]] = s
        for r in bank["responseScales"]:
            rscales[r["id"]] = r
        for c in bank["citations"]:
            citations[c["id"]] = c
        for b in bank["blocks"]:
            blocks[b["id"]] = b
    return items, scales, rscales, citations, blocks


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    sel_path, out_path = sys.argv[1], sys.argv[2]
    sel = json.load(open(sel_path, encoding="utf-8"))
    items, scales, rscales, citations, blocks = load_pools()

    chosen, missing = [], []
    for scale_id, ids in sel["selection"].items():
        if scale_id not in scales:
            missing.append(f"scale {scale_id}")
        for item_id in ids:
            item = items.get(item_id)
            if item is None:
                missing.append(item_id)
                continue
            if item["scaleId"] != scale_id:
                missing.append(f"{item_id} is on {item['scaleId']}, listed under {scale_id}")
                continue
            chosen.append(item)

    if missing:
        for m in missing:
            print(f"ERROR unresolved: {m}")
        return 1

    used_scales = [scales[s] for s in sel["selection"]]
    used_rscales = sorted({i["responseScaleId"] for i in chosen})
    used_citations = sorted({c for s in used_scales for link in s["bodyLinks"] for c in link["citations"]})
    used_blocks = sorted({i["block"] for i in chosen})

    out = {
        "version": sel["bankVersion"],
        "updatedAt": "2026-09-16T00:00:00Z",
        "locale": "en-US",
        "blocks": [blocks[b] for b in used_blocks],
        "responseScales": [rscales[r] for r in used_rscales],
        "scales": used_scales,
        "items": chosen,
        "citations": [citations[c] for c in used_citations],
    }
    json.dump(out, open(out_path, "w", encoding="utf-8"), indent=2, ensure_ascii=False)

    print(f"wrote {out_path}: {len(chosen)} items, {len(used_scales)} scales")
    for s in used_scales:
        group = [i for i in chosen if i["scaleId"] == s["id"]]
        keys = Counter(i["keyed"] for i in group)
        sev = Counter(
            t.split(":")[1]
            for i in group
            for t in i.get("tags", [])
            if t.startswith("severity:")
        )
        facets = Counter(i.get("facetId", "(none)").split(".")[-1] for i in group)
        print(
            f"  {s['id']:18} {len(group):2} items  +{keys['+']}/-{keys['-']}  "
            f"{sev['mild']}/{sev['moderate']}/{sev['extreme']}  {dict(facets)}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
