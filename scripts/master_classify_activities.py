#!/usr/bin/env python3
"""
=============================================================================
VGU MSI Master Activity Classification & Normalization Tool
=============================================================================
Author: VGU MSI Development Team
Location: scripts/master_classify_activities.py

Purpose:
  Accurately categorizes and audits all academic activity posts under
  content/_activities/ according to the official four normalized categories
  specified in PERSONALIZATION_PROTOCOL.md and content.config.ts:
    1. Achievements & Events
    2. Lab Trainings
    3. Industrial Visits
    4. Academic Lectures

Usage:
  # 1. Preview current categories and algorithm recommendations (dry-run):
  python scripts/master_classify_activities.py --check

  # 2. Apply recommendations and update markdown files:
  python scripts/master_classify_activities.py --apply

  # 3. Check a single specific activity file:
  python scripts/master_classify_activities.py --check --file knauf-trip.md

  # 4. Verbose mode (shows scoring breakdown for each candidate):
  python scripts/master_classify_activities.py --check --verbose
=============================================================================
"""

import os
import re
import sys
import argparse

ACTIVITIES_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', '_activities')

# =============================================================================
# SECTION 1: USER-ADJUSTABLE MANUAL OVERRIDES (HIGHEST PRIORITY)
# -----------------------------------------------------------------------------
# If you want a specific file to ALWAYS be assigned a specific category,
# add it here. The algorithm will never overwrite entries in this table.
# =============================================================================
MANUAL_OVERRIDES = {
    # File name -> Exact Canonical Category Name
    "vgu-master-info-day-2026.md": "Achievements & Events",
    "weekly-lab-tour-2026-summer.md": "Achievements & Events",
    "daad-scholarships-2024.md": "Achievements & Events",
    "daad-scholarships.md": "Achievements & Events",
    "gyss-2026.md": "Achievements & Events",
    "biocalorimetry-for-the-biotechnological-use-of-natural-and-synthetic-macromolecules.md": "Achievements & Events",

    "construction-materials-trip.md": "Industrial Visits",
    "knauf-trip.md": "Industrial Visits",
    "vina-kraft-trip.md": "Industrial Visits",

    "flying-faculty.md": "Academic Lectures",
    "engineering-ceramics.md": "Academic Lectures",
    "fracture-mechanics.md": "Academic Lectures",
    "msi-seminar-workshop-2026.md": "Academic Lectures",
    "program-overview.md": "Academic Lectures",

    "heat-treatment.md": "Lab Trainings",
    "micro-nano-scale.md": "Lab Trainings",
    "msi2025-and-gpe2025-explore-the-connection-between-materials-and-production-through-additive-manufacturing.md": "Lab Trainings",
    "non-metallic-binders.md": "Lab Trainings",
    "polymer-labs.md": "Lab Trainings",
    "powder-metallurgy.md": "Lab Trainings",
    "research-labs.md": "Lab Trainings",
    "sem-xrd-tour.md": "Lab Trainings",
}

# =============================================================================
# SECTION 2: INTELLIGENT MULTI-FACTOR SCORING RULES
# -----------------------------------------------------------------------------
# You can tweak keywords and weights below. The category with the highest
# total weighted score wins.
# =============================================================================
CATEGORY_RULES = {
    "Industrial Visits": {
        "positive": [
            ("excursion", 8), ("field trip", 8), ("industrial visit", 9),
            ("factory", 6), ("manufacturing plant", 7), ("plant visit", 7),
            ("knauf", 9), ("vina kraft", 9), ("bosch", 9), ("kraft paper", 7),
            ("mekong concrete", 9), ("vicem", 8), ("long an plant", 8),
            ("nha be", 7), ("paper mill", 7), ("industrial tour", 7),
            ("site visit", 6), ("company visit", 6)
        ],
        "negative": [
            ("lab training", 6), ("on-campus laboratory", 5), ("scholarship award", 8),
            ("master info day", 8), ("lecture room", 5)
        ]
    },

    "Lab Trainings": {
        "positive": [
            ("lab training", 9), ("laboratory training", 9), ("hands-on", 6),
            ("quenching", 8), ("tempering", 8), ("heat treatment", 8),
            ("sem", 6), ("xrd", 6), ("scanning electron", 7), ("x-ray diffraction", 7),
            ("tensile testing", 8), ("rheometry", 8), ("sintering", 8),
            ("powder metallurgy", 8), ("metallography", 8), ("ball milling", 8),
            ("properties testing", 8), ("additive manufacturing", 7),
            ("characterization lab", 7), ("hardness testing", 7), ("polishing", 6),
            ("precipitation hardening", 8), ("mix design", 6), ("binder hydration", 7)
        ],
        "negative": [
            ("field trip", 7), ("excursion", 7), ("master info day", 8),
            ("open day", 7), ("orientation day", 7), ("scholarship award", 8),
            ("fellowship", 6)
        ]
    },

    "Achievements & Events": {
        "positive": [
            ("master info day", 9), ("information day", 8), ("orientation", 7),
            ("open day", 7), ("scholarship", 7), ("daad award", 9), ("daad scholarship", 9),
            ("gyss", 9), ("global young scientists summit", 9), ("nobel", 8),
            ("award", 7), ("awarded", 7), ("winner", 7), ("won", 6),
            ("q1 publication", 8), ("breakthrough", 6), ("ceremony", 6),
            ("competition", 6), ("weekly lab tour", 7), ("info session", 7)
        ],
        "negative": [
            ("hands-on lab training", 5), ("tensile test procedure", 4),
            ("factory floor", 5)
        ]
    },

    "Academic Lectures": {
        "positive": [
            ("flying faculty", 9), ("lecture", 6), ("colloquium", 8),
            ("seminar", 7), ("symposium", 8), ("scientific presentation", 7),
            ("research presentation", 6), ("guest lecture", 8), ("guest speaker", 7),
            ("fracture mechanics", 7), ("constitutive modeling", 8),
            ("continuum mechanics", 6), ("solid state physics", 6),
            ("structural ceramics", 6), ("ministry-level project", 7),
            ("invited talk", 8), ("scientific workshop", 7)
        ],
        "negative": [
            ("field trip", 7), ("factory visit", 7), ("scholarship winner", 6)
        ]
    }
}

VALID_CATEGORIES = list(CATEGORY_RULES.keys())

def extract_frontmatter(content):
    """Parses yaml frontmatter and markdown body from file content."""
    parts = content.split('---', 2)
    if len(parts) >= 3:
        fm_text = parts[1]
        body = parts[2]
        meta = {}
        for line in fm_text.splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            m = re.match(r'^([a-zA-Z0-9_-]+)\s*:\s*(.*)$', line)
            if m:
                key = m.group(1).strip()
                val = m.group(2).strip().strip('"\'')
                meta[key] = val
        return meta, body
    return {}, content

def score_text_against_rules(title, desc, body, slug):
    """Computes a multi-factor score for each category."""
    title_lower = title.lower()
    desc_lower = desc.lower()
    slug_lower = slug.lower()
    body_lower = body.lower()

    scores = {cat: 0.0 for cat in VALID_CATEGORIES}
    breakdown = {cat: [] for cat in VALID_CATEGORIES}

    for cat, rules in CATEGORY_RULES.items():
        # Positive keywords
        for term, weight in rules["positive"]:
            t_term = term.lower()
            if t_term in title_lower:
                scores[cat] += weight * 3.0
                breakdown[cat].append(f"+{weight*3:.0f} (title: '{term}')")
            elif t_term in slug_lower:
                scores[cat] += weight * 2.5
                breakdown[cat].append(f"+{weight*2.5:.0f} (slug: '{term}')")
            elif t_term in desc_lower:
                scores[cat] += weight * 2.0
                breakdown[cat].append(f"+{weight*2:.0f} (desc: '{term}')")
            elif t_term in body_lower:
                scores[cat] += weight * 1.0
                breakdown[cat].append(f"+{weight*1:.0f} (body: '{term}')")

        # Negative penalty keywords
        for term, weight in rules["negative"]:
            t_term = term.lower()
            if t_term in title_lower or t_term in slug_lower:
                scores[cat] -= weight * 3.0
                breakdown[cat].append(f"-{weight*3:.0f} (penalty title/slug: '{term}')")
            elif t_term in desc_lower:
                scores[cat] -= weight * 2.0
                breakdown[cat].append(f"-{weight*2:.0f} (penalty desc: '{term}')")

    return scores, breakdown

def classify_activity(filename, meta, body, verbose=False):
    """Determines the official category for an activity file."""
    # 1. Check manual override first
    if filename in MANUAL_OVERRIDES:
        return MANUAL_OVERRIDES[filename], "Override Table", {}

    title = meta.get('title', '')
    desc = meta.get('description', '')
    slug = filename.replace('.md', '')

    scores, breakdown = score_text_against_rules(title, desc, body, slug)

    # Sort categories by score descending
    sorted_cats = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    best_cat, best_score = sorted_cats[0]

    if best_score <= 0:
        # Fallback to Achievements & Events if no strong signal
        best_cat = "Achievements & Events"
        reason = "Default Fallback (score <= 0)"
    else:
        reason = f"Scoring Engine ({best_score:.1f} pts)"

    return best_cat, reason, breakdown

def audit_and_process(apply_changes=False, target_file=None, verbose=False):
    """Scans and optionally applies category updates across _activities."""
    if not os.path.exists(ACTIVITIES_DIR):
        print(f"Error: Directory not found: {ACTIVITIES_DIR}")
        sys.exit(1)

    files = sorted(os.listdir(ACTIVITIES_DIR))
    if target_file:
        files = [f for f in files if f == target_file]
        if not files:
            print(f"Error: File '{target_file}' not found in {ACTIVITIES_DIR}")
            sys.exit(1)

    print("=" * 110)
    print(f"VGU MSI ACADEMIC ACTIVITIES CLASSIFIER (Mode: {'APPLY CHANGES' if apply_changes else 'CHECK ONLY'})")
    print("=" * 110)
    print(f"{'Filename':<42} | {'Current':<22} | {'Recommended':<22} | {'Status'}")
    print("-" * 110)

    stats = {
        "total": 0,
        "matching": 0,
        "changed": 0,
        "seo_warnings": 0
    }

    for f in files:
        if not f.endswith('.md') or f.startswith('00'):
            continue

        stats["total"] += 1
        path = os.path.join(ACTIVITIES_DIR, f)
        with open(path, 'r', encoding='utf-8') as fh:
            content = fh.read()

        meta, body = extract_frontmatter(content)
        current_cat = meta.get('category', 'MISSING')
        recommended_cat, reason, breakdown = classify_activity(f, meta, body, verbose=verbose)

        is_match = (current_cat == recommended_cat)
        if is_match:
            stats["matching"] += 1
            status = "OK"
        else:
            stats["changed"] += 1
            status = "NEEDS UPDATE" if not apply_changes else "UPDATED"

        print(f"{f:<42} | {current_cat:<22} | {recommended_cat:<22} | {status}")

        if verbose and breakdown:
            for cat, points in breakdown.items():
                if points:
                    print(f"   ↳ {cat:<22}: {', '.join(points)}")

        # Check SEO length warning (description > 160 chars)
        desc = meta.get('description', '')
        if len(desc) > 160:
            stats["seo_warnings"] += 1
            if verbose:
                print(f"   [!] SEO Warning: Description length is {len(desc)} chars (recommended <= 160).")

        # Apply update if requested and necessary
        if apply_changes and not is_match:
            new_content = re.sub(
                r'category:\s*["\']?[^"\']+["\']?',
                f'category: "{recommended_cat}"',
                content,
                count=1
            )
            with open(path, 'w', encoding='utf-8') as fh:
                fh.write(new_content)

    print("-" * 110)
    print(f"Summary: Total: {stats['total']} | Matching: {stats['matching']} | Pending Updates: {stats['changed']}")
    if stats['seo_warnings'] > 0:
        print(f"SEO Quality Notice: {stats['seo_warnings']} files have meta descriptions longer than 160 characters.")
    print("=" * 110)

    if not apply_changes and stats['changed'] > 0:
        print("\nTip: Run with '--apply' to update all files to recommended categories.")

def main():
    parser = argparse.ArgumentParser(description="VGU MSI Academic Activities Classifier & Normalizer")
    parser.add_argument("--check", action="store_true", help="Audit and preview categories without modifying files")
    parser.add_argument("--apply", action="store_true", help="Apply recommended categories directly to markdown files")
    parser.add_argument("--file", type=str, help="Audit a specific file name (e.g. knauf-trip.md)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Display scoring weights and details")

    args = parser.parse_args()

    # Default to check if no arguments given
    apply_mode = args.apply
    audit_and_process(apply_changes=apply_mode, target_file=args.file, verbose=args.verbose)

if __name__ == "__main__":
    main()
