#!/usr/bin/env python3
"""Check a copy deck against a bank.

    python tools/check-copy.py copy/deck.en-US.json bank/v1.json

Enforces the copy-side invariants the JSON Schema can't:
  - every copyId referenced by a bank resolves in the deck
  - every scale has BOTH cost and upside text (no consolation-prize framing)
  - every safety resourceSet referenced by an item exists, with resources
  - no orphan entries in the deck
  - report copy makes no population claim while norms are provisional
"""
from __future__ import annotations

import json
import re
import sys

# Phrases that imply a population comparison. Banned while there are no norms.
POPULATION_CLAIMS = [
    r"\bpercentile\b",
    r"\btop \d+%",
    r"\bbottom \d+%",
    r"\bhigher than (?:most|average|\d+%)",
    r"\blower than (?:most|average|\d+%)",
    r"\bcompared (?:to|with) (?:most people|the population|others)\b",
    r"\bmore than \d+% of\b",
]

errors: list[str] = []
warnings: list[str] = []


def walk_strings(node):
    if isinstance(node, str):
        yield node
    elif isinstance(node, list):
        for v in node:
            yield from walk_strings(v)
    elif isinstance(node, dict):
        for k, v in node.items():
            if k == "url":
                continue
            yield from walk_strings(v)


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    deck = json.load(open(sys.argv[1], encoding="utf-8"))
    bank = json.load(open(sys.argv[2], encoding="utf-8"))

    entries = deck.get("entries", {})
    referenced: set[str] = set()

    # every scale needs both cost and upside
    for s in bank["scales"]:
        copy = s["report"]["copy"]
        for role in ("costId", "upsideId"):
            cid = copy[role]
            referenced.add(cid)
            entry = entries.get(cid)
            if entry is None:
                errors.append(f"{s['id']}: missing deck entry {cid} ({role})")
            elif not entry.get("body", "").strip():
                errors.append(f"{s['id']}: deck entry {cid} has no body")

    # flags and interaction rules may reference copy too
    for flag in bank.get("flags", []):
        for role, cid in flag.get("copy", {}).items():
            referenced.add(cid)
            if cid not in entries:
                errors.append(f"flag {flag['id']}: missing deck entry {cid} ({role})")
    for rule in bank.get("interactionRules", []):
        referenced.add(rule["copyId"])
        if rule["copyId"] not in entries:
            errors.append(f"rule {rule['id']}: missing deck entry {rule['copyId']}")

    # safety resource sets
    safety = deck.get("safety", {})
    for item in bank["items"]:
        trig = item.get("safety")
        if not trig:
            continue
        rs = trig["resourceSet"]
        block = safety.get(rs)
        if block is None:
            errors.append(f"{item['id']}: no safety copy for resourceSet '{rs}'")
        elif not block.get("resources"):
            errors.append(f"{item['id']}: resourceSet '{rs}' lists no resources")
        elif not block.get("trigger_body"):
            errors.append(f"{item['id']}: resourceSet '{rs}' has no trigger_body")

    # orphans
    for cid in entries:
        if cid not in referenced:
            warnings.append(f"deck entry '{cid}' is not referenced by the bank")

    # population claims while norms are provisional
    # Scanned: copy that makes claims about the user (scores, bands, safety).
    # Not scanned: the `framing` block, which exists precisely to explain that we
    # have no population comparison — it has to be able to say "percentile" to
    # disclaim one.
    claim_copy = {k: v for k, v in deck.items() if k != "framing"}
    norms = bank.get("norms", [])
    has_real_norms = any(not n.get("provisional", True) for n in norms)
    if not has_real_norms:
        for text in walk_strings(claim_copy):
            for pat in POPULATION_CLAIMS:
                if re.search(pat, text, flags=re.I):
                    errors.append(
                        f"population claim with no norms: /{pat}/ in \"{text[:70]}...\""
                    )

    for w in warnings:
        print(f"WARN  {w}")
    for e in errors:
        print(f"ERROR {e}")

    scales = len(bank["scales"])
    print(
        f"\n{scales} scales, {len(entries)} deck entries, "
        f"{len(safety)} safety block(s) — {len(errors)} error(s), {len(warnings)} warning(s)"
    )
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
