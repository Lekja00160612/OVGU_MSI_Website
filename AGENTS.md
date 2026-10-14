# VGU MSI Website — AI Assistant Guidelines & Protocols

Welcome to the **Materials Science and Innovation (MSI)** Master's program website repository (Vietnamese-German University & Otto von Guericke University Magdeburg).

All AI coding assistants and developers working on this codebase must adhere to the following mandatory protocols:

---

## 1. Core Protocols (MUST READ)

1. **Design System & Component Governance Protocol**:
   👉 Read [`DESIGN_AND_COMPONENT_PROTOCOL.md`](file:///d:/OVGU/OVGU_MSI_Website/DESIGN_AND_COMPONENT_PROTOCOL.md)
   - **Do NOT spawn new one-off components.** Always check the Component Catalog first.
   - Canonical stack: **Nuxt UI v4 primitives** (`<UButton>`, `<UBadge>`, `<UCard>`, `<UModal>`, `<UTabs>`) and standard **Tailwind CSS v4** utility classes. Zero custom scoped CSS rule.
   - All pages and components must be **100% responsive on mobile** (tested down to 360px).

2. **Content Personalization Protocol**:
   👉 Read [`PERSONALIZATION_PROTOCOL.md`](file:///d:/OVGU/OVGU_MSI_Website/PERSONALIZATION_PROTOCOL.md)
   - Standards for rewriting crawled or raw academic activities into compelling student-centric stories.
   - Four strictly normalized categories: `Achievements & Events`, `Lab Trainings`, `Industrial Visits`, `Academic Lectures`.
   - Media and image optimization standards with descriptive captions via [`ProseImg.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ProseImg.vue).

---

## 2. Technical Stack & Environment

- **Framework**: Nuxt 4 (Nuxt 4.6.1, Nitro 2.13.4, Vite 8.3.4, Vue 3.5.44, `@nuxt/content` 3.16.2)
- **UI & Icons**: `@nuxt/ui` 4.11.3 (Tailwind CSS v4) with local Lucide icon bundle (`icon.serverBundle.collections: ['lucide']`)
- **Typography & Fonts**: `@nuxt/fonts` 1.0.1 serving `Be Vietnam Pro` locally with zero CLS layout shifting
- **Node Environment**: Node.js `24.15.0` (pinned via [`.node-version`](file:///d:/OVGU/OVGU_MSI_Website/.node-version) and [`.nvmrc`](file:///d:/OVGU/OVGU_MSI_Website/.nvmrc))
- **Styling Architecture**:
  - Global CSS entry: `app/assets/css/main.css`
  - Color theme: MSI Deep Navy (`#1E3A5F`), VGU Orange (`#E87722`), OVGU Cyan (`#009FDF`)
- **Internationalization**: Bilingual (`en` default, `vi` under `/vi/`)
- **Document Downloads**: All official files are located in `/public/Documents/`. In markdown, links are automatically handled by [`ProseA.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ProseA.vue) with native browser download behavior (`:external="true"`, `target="_blank"`).

---

## 3. Cloudflare Pages Deployment & Build Governance (CRITICAL)

- **Production Cloudflare Build Settings**:
  - **Build Command**: `npm run build` *(MUST be `npm run build`)*
  - **Build Output Directory**: `dist`
- **Pure Static Site Rendering Architecture (SSG on Cloudflare Pages)**:
  - In `nuxt.config.ts`, `$production: { nitro: { preset: 'cloudflare_pages' } }` compiles into `dist/`.
  - `npm run build` runs `nuxt build`, which prerenders all 171+ HTML routes, compiles all `_nuxt/` CSS/JS bundles, and transfers all 1,400+ static assets (`Documents/`, `images/`, `Logo/`, etc.) into `dist/`.
  - Automatically following `nuxt build`, the `postbuild` script (`scripts/specialize_cloudflare_pages.js`) strips `_worker.js` and `_routes.json` from `dist/`.
  - **Why this specialization is vital**:
    - Cloudflare Pages detects that `dist` has no worker code, deploying the entire site as **100% Pure Static Edge CDN Assets**.
    - Eliminates Cloudflare Worker execution limits, eliminates cold-start delays, and completely prevents the missing D1 database warning (`Deploying to Cloudflare requires using D1 database`).
    - Every page hit (`/`, `/vi`, `/program-structure`, etc.) is served directly from Cloudflare's global edge cache with sub-20ms TTFB.

---

## 4. Automation Scripts & Quality Gates

Before pushing or completing any task, run the full verification suite:

```bash
# Run all quality checks (link verifier + category audit + sitemap):
npm run check

# Verify zero missing local documents, images, or assets (394/394 checked):
npm run verify:links

# Audit and normalize academic activity categories:
npm run classify:check    # Dry-run audit
npm run classify          # Apply category updates

# Crawl new activities from VGU portal:
npm run crawl

# Rebuild sitemap:
npm run sitemap
```

---

## 5. Workflow Rules

- **Preserve Bilingual Parity**: Any content or UI change made to English pages must be mirrored in the Vietnamese equivalent (`content/` and `content/vi/`).
- **No Redundant Components**: Before creating any component, consult Section 4 of `DESIGN_AND_COMPONENT_PROTOCOL.md`. If a component exists, extend it using props/slots rather than duplicating.
- **Maintain High Aesthetics**: Follow modern web design standards: clean typography, smooth transitions, proper whitespace, floating cards, and vibrant brand colors.
