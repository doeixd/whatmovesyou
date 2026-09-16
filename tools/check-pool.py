#!/usr/bin/env python3
"""Blueprint conformance checks for an item pool.

Covers the invariants JSON Schema can't express (see schema/README.md).
Run alongside schema validation:

    python tools/check-pool.py bank/pool-a1-drive.json

Exit code 1 on any ERROR. WARNs are advisory.
"""
from __future__ import annotations

import json
import sys
from collections import Counter, defaultdict

SEVERITIES = ("severity:mild", "severity:moderate", "severity:extreme")

errors: list[str] = []
warnings: list[str] = []


def err(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


def severity_of(item: dict) -> str | None:
    tags = [t for t in item.get("tags", []) if t.startswith("severity:")]
    if len(tags) > 1:
        err(f"{item['id']}: multiple severity tags {tags}")
    return tags[0] if tags else None


def check(bank: dict) -> None:
    items = bank["items"]
    scales = {s["id"]: s for s in bank["scales"]}
    rs_by_id = {r["id"]: r for r in bank["responseScales"]}
    response_scales = set(rs_by_id)
    citations = {c["id"] for c in bank["citations"]}
    blocks = {b["id"] for b in bank["blocks"]}

    # 1. referential integrity
    for it in items:
        if it["scaleId"] not in scales:
            err(f"{it['id']}: unknown scaleId {it['scaleId']}")
        if it["responseScaleId"] not in response_scales:
            err(f"{it['id']}: unknown responseScaleId {it['responseScaleId']}")
        if it["block"] not in blocks:
            err(f"{it['id']}: unknown block {it['block']}")
        facet = it.get("facetId")
        if facet:
            # 5. facet belongs to its scale
            if not facet.startswith(it["scaleId"] + "."):
                err(f"{it['id']}: facet {facet} not under scale {it['scaleId']}")
            known = {f["id"] for f in scales.get(it["scaleId"], {}).get("facets", [])}
            if known and facet not in known:
                err(f"{it['id']}: facet {facet} not declared on the scale")

    for s in bank["scales"]:
        for link in s["bodyLinks"]:
            for c in link["citations"]:
                if c not in citations:
                    err(f"scale {s['id']}: unknown citation {c}")

    # 2. no duplicate ids or texts
    for field in ("id", "text"):
        dupes = [v for v, n in Counter(i[field] for i in items).items() if n > 1]
        for d in dupes:
            err(f"duplicate {field}: {d!r}")

    # 4. no cross-loading: an item belongs to exactly one scale (enforced by shape,
    #    but catch near-duplicate text across scales, which is the same failure)
    by_scale: dict[str, list[dict]] = defaultdict(list)
    for it in items:
        by_scale[it["scaleId"]].append(it)

    for scale_id, group in by_scale.items():
        live = [i for i in group if i["status"] != "retired"]
        n = len(live)
        scale = scales.get(scale_id, {})

        # 3. minimum items answerable
        min_needed = scale.get("scoring", {}).get("minItemsAnswered", 0)
        if n < min_needed:
            err(f"{scale_id}: {n} live items < minItemsAnswered {min_needed}")

        # Keying balance, within ±1 overall.
        # Exempt: scales answered entirely on an 'impairment' response scale.
        # Severity formats are conventionally same-keyed, and reversing them
        # ("my work has NOT suffered") is a known source of respondent error.
        rs_types = {
            rs_by_id.get(i["responseScaleId"], {}).get("type") for i in live
        }
        keying_exempt = rs_types == {"impairment"}
        keys = Counter(i["keyed"] for i in live)
        if keying_exempt:
            print(f"{scale_id}: keying balance waived (impairment format)")
        elif abs(keys["+"] - keys["-"]) > 1:
            err(f"{scale_id}: keying imbalance +{keys['+']} / -{keys['-']}")

        # facet spread, within ±2
        facets = Counter(i.get("facetId", "(none)") for i in live)
        if len(facets) > 1 and (max(facets.values()) - min(facets.values())) > 2:
            warn(f"{scale_id}: uneven facet spread {dict(facets)}")

        # severity spread: every band represented, extremes present
        sev = Counter(s for s in (severity_of(i) for i in live) if s)
        missing = [s for s in SEVERITIES if not sev.get(s)]
        if missing:
            err(f"{scale_id}: no items at {', '.join(missing)}")
        untagged = [i["id"] for i in live if not severity_of(i)]
        if untagged:
            warn(f"{scale_id}: {len(untagged)} items without a severity tag: {untagged[:4]}")
        if sev.get("severity:extreme", 0) < 2:
            err(f"{scale_id}: fewer than 2 extreme-severity items")

        # keying balance within each severity band, within ±2
        for band in SEVERITIES:
            if keying_exempt:
                break
            k = Counter(i["keyed"] for i in live if severity_of(i) == band)
            if k and abs(k["+"] - k["-"]) > 2:
                warn(f"{scale_id}: {band} keying skew +{k['+']} / -{k['-']}")

        # informant wording: required at pilot, expected always
        for i in live:
            if not i.get("informantText"):
                (err if i["status"] == "piloted" else warn)(
                    f"{i['id']}: no informantText"
                )

        # readability
        hard = [i["id"] for i in live if i["review"]["readabilityGrade"] > 8]
        if hard:
            warn(f"{scale_id}: reading grade > 8: {hard}")

        # 10. licence check
        for i in live:
            lic = i["provenance"].get("licence", "")
            if "TO VERIFY" in lic.upper() and i["status"] == "piloted":
                err(f"{i['id']}: piloted with unverified licence")

        # 9. piloted items carry psychometrics
        for i in live:
            if i["status"] == "piloted" and not i.get("psychometrics"):
                err(f"{i['id']}: piloted without psychometrics")

        # high cultural load must carry a justification
        for i in live:
            if i["review"]["culturalLoad"] == "high" and not i["review"].get("notes"):
                err(f"{i['id']}: culturalLoad=high without review notes")

        print(
            f"{scale_id}: {n} items | keying +{keys['+']}/-{keys['-']} | "
            f"facets {dict(facets)} | severity "
            f"{sev.get('severity:mild',0)}/{sev.get('severity:moderate',0)}/"
            f"{sev.get('severity:extreme',0)} | "
            f"flagged for review {sum(1 for i in live if i['review'].get('notes'))}"
        )


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    for path in sys.argv[1:]:
        with open(path, encoding="utf-8") as fh:
            check(json.load(fh))
    for w in warnings:
        print(f"WARN  {w}")
    for e in errors:
        print(f"ERROR {e}")
    print(f"\n{len(errors)} error(s), {len(warnings)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
