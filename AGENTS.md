# VGU MSI Website — AI Assistant Guidelines & Protocols

Welcome to the **Materials Science and Innovation (MSI)** Master's program website repository (Vietnamese-German University & Otto von Guericke University Magdeburg).

All AI coding assistants and developers working on this codebase must adhere to the following mandatory protocols:

---

## 1. Core Protocols (MUST READ)

1. **Design System & Component Governance Protocol**:
   👉 Read [`DESIGN_AND_COMPONENT_PROTOCOL.md`](file:///d:/OVGU/OVGU_MSI_Website/DESIGN_AND_COMPONENT_PROTOCOL.md)
   - **Do NOT spawn new one-off components.** Always check the Component Catalog first.
   - Canonical stack: **Nuxt UI primitives** (`<UButton>`, `<UBadge>`, `<UCard>`, `<UModal>`) and standard **Tailwind CSS v4** utility classes. Zero custom scoped CSS rule.
   - All pages and components must be **100% responsive on mobile** (tested down to 360px).

2. **Content Personalization Protocol**:
   👉 Read [`PERSONALIZATION_PROTOCOL.md`](file:///d:/OVGU/OVGU_MSI_Website/PERSONALIZATION_PROTOCOL.md)
   - Standards for rewriting crawled or raw academic activities into compelling student-centric stories.
   - Four normalized categories: `Achievements & Events`, `Lab Trainings`, `Industrial Visits`, `Academic Lectures`.
   - Media and image optimization standards.

---

## 2. Technical Stack & Environment

- **Framework**: Nuxt 4 (with Vite 7, Nitro 2, Vue 3.5, and `@nuxt/content`)
- **Styling Architecture**:
  - Global CSS entry: `app/assets/css/main.css`
  - Color theme: MSI Deep Navy (`#1E3A5F`), VGU Orange (`#E87722`), OVGU Cyan (`#009FDF`)
  - Typography: `Be Vietnam Pro`
- **Internationalization**: Bilingual (`en` default, `vi` under `/vi/`)
- **Document Downloads**: All official files are located in `/public/Documents/`. In markdown, links are automatically handled by [`ProseA.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ProseA.vue) with native browser download behavior (`:external="true"`, `target="_blank"`).

---

## 3. Workflow Rules

- **Preserve Bilingual Parity**: Any content or UI change made to English pages must be mirrored in the Vietnamese equivalent (`content/` and `content/vi/`).
- **No Redundant Components**: Before creating any component, consult Section 4 of `DESIGN_AND_COMPONENT_PROTOCOL.md`. If a component exists, extend it using props/slots rather than duplicating.
- **Maintain High Aesthetics**: Follow modern web design standards: clean typography, smooth transitions, proper whitespace, and vibrant brand colors.
