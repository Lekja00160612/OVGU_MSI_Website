# VGU MSI Website — Automation & Data Scripts

This directory contains production utilities for maintaining content, updating academic activities, verifying assets, and generating search engine assets for the **VGU Materials Science and Innovation (MSI)** website.

---

## Quick Reference (NPM Commands)

| Command | Script File | Purpose |
| :--- | :--- | :--- |
| `npm run prebuild` | `scripts/generate_sitemap.js` | Fast, deterministic, offline-safe sitemap generation |
| `npm run verify:links` | `scripts/verify_links.js` | Scans all code & markdown to guarantee zero broken links |
| `npm run crawl` | `scripts/crawl_activities.js` | On-demand scraper to pull new news from VGU portal |
| `npm run classify:check` | `scripts/master_classify_activities.py --check` | Dry-run audit of academic activity categories |
| `npm run classify` | `scripts/master_classify_activities.py --apply` | Normalizes categories across markdown files |
| `npm run sitemap` | `scripts/generate_sitemap.js` | Standalone sitemap XML builder |

---

## Script Inventory

### 1. `master_classify_activities.py` (Master Classification & Normalizer)
The primary tool for categorizing, validating, and normalizing all posts in `content/_activities/`.

- **Categories Handled**:
  1. `Achievements & Events` (e.g. Info days, DAAD scholarships, awards)
  2. `Lab Trainings` (e.g. SEM/XRD characterization, heat treatment, testing)
  3. `Industrial Visits` (e.g. field trips to Bosch, Knauf, Vina Kraft Paper)
  4. `Academic Lectures` (e.g. flying faculty lectures, scientific colloquia)
- **Features**:
  - **Manual Overrides Table**: Top of file (`MANUAL_OVERRIDES`) allows you to lock any file's category permanently so it is never modified automatically.
  - **Multi-Factor Scoring Engine**: Uses weighted positive & negative keyword analysis across title, slug, meta description, and body.
  - **SEO Validation**: Alerts if meta descriptions exceed 160 characters.
- **Commands**:
  ```bash
  # Check status & algorithm recommendations (dry-run):
  python scripts/master_classify_activities.py --check

  # Apply recommendations to markdown files:
  python scripts/master_classify_activities.py --apply

  # Inspect a single post with verbose scoring:
  python scripts/master_classify_activities.py --check --file knauf-trip.md --verbose
  ```

---

### 2. `verify_links.js` (Automated Link & Static Asset Verifier)
Automated test suite that extracts every document, image, logo, avatar, and poster URL from all markdown files and Vue components, cross-referencing them against actual disk files in `public/`.

- **Guarantee**: Ensures 0 missing or broken links before deployment.
- **Commands**:
  ```bash
  npm run verify:links
  ```

---

### 3. `crawl_activities.js` (VGU Portal Crawler)
Node.js web scraper that extracts newly published MSI news and events from the official Vietnamese-German University portal (`vgu.edu.vn`).

- **Cache File**: Uses `activities_cache.json` to prevent re-crawling existing articles.
- **Image Pipeline**: Downloads inline and cover photos into `/public/images/academic_activities/`.
- **Safety**: Does NOT clobber manually edited frontmatters or module linkages during builds.
- **Commands**:
  ```bash
  npm run crawl
  ```

---

### 4. `generate_sitemap.js` (SEO Sitemap Generator)
Generates `public/sitemap.xml` with priority weighting and change frequencies across all English and Vietnamese routes.

- **Commands**:
  ```bash
  npm run sitemap
  ```
