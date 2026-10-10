# VGU MSI Website — Design System & Component Governance Protocol
**For Successor AI Coding Assistants, Engineers & Editors**

This document establishes the mandatory architectural rules, component reuse standards, responsive design principles, and unified styling governance for the **VGU Materials Science and Innovation (MSI)** Master's program website.

When you are asked to build, modify, or extend any feature, page, or layout on this website, you must **strictly adhere** to this protocol.

---

## 1. Golden Rules of Governance

1. **Standard Component Stack: Nuxt UI + Tailwind CSS v4**:
   - The canonical UI stack is **Nuxt 4**, **Nuxt UI (v3)**, and **Tailwind CSS (v4)**.
   - All interactive controls (buttons, badges, inputs, modals, tabs, slide-overs) must use **Nuxt UI primitives** (`<UButton>`, `<UBadge>`, `<UCard>`, `<UModal>`, `<USlideover>`, `<UTabs>`, `<UInput>`).
   - Layout, grid structures, spacing, and typography derive strictly from standard **Tailwind CSS v4 utility classes**.
   - **Zero Custom Scoped CSS Rule**: Do NOT create ad-hoc `<style scoped>` blocks with custom classes (`.custom-btn`, `.my-card`, etc.). All styling must be expressed through component props or Tailwind utility classes.

2. **Reuse First, Extend Second, Never Spawn Random Components**:
   - **Do NOT** create a new `.vue` component for a feature if an existing component can be used or extended.
   - If an existing component covers 80% of what you need, add optional props or slots to that component rather than duplicating it.
   - For standard text/media layouts, use **Markdown + Nuxt Content** with global typography classes rather than creating a heavy one-off `.vue` component.

3. **Standard Component Anatomy (Comprehensibility First)**:
   Every `.vue` component must follow the 3-tier structure so both humans and AI agents can comprehend it in seconds:
   - **Component Metadata Header**: JSDoc/comment banner at the top describing purpose, data sources, and Nuxt UI components used.
   - **Clean & Typed Script**: Strict TypeScript interfaces for data models, explicit grouping of composables, state, computed properties, and methods.
   - **Semantically Demarcated Template**: Clear visual section comments (`<!-- === SECTION: Header === -->`, `<!-- === SECTION: Filters === -->`, etc.).

4. **Mobile-First & Responsiveness Guarantee**:
   - Every element must look clean, breathable, and usable on screens from 360px (mobile) up to 1920px (ultrawide).
   - Never use fixed pixel widths on layout containers (e.g., use `max-w-4xl w-full mx-auto`, never `width: 800px`).
   - Touch targets for interactive elements (buttons, links, tabs) must be at least 44px in height.

5. **Document & Static Asset Handling**:
   - Files stored in `/public/Documents/` are served statically.
   - In markdown, links to `.pdf`, `.pptx`, `.docx`, or `/Documents/` are automatically routed natively by [`ProseA.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ProseA.vue) with `target="_blank"` and `:external="true"`. Never strip these attributes.

---

## 2. Design System Tokens (Defined in `main.css` & `app.config.ts`)

### Brand Colors
```css
/* Primary Brand (Orange): Main CTAs, Highlights, Active States */
--color-primary-500: #E87722;
--color-primary-600: #EA580C;

/* Secondary Brand (Cyan): OVGU Magdeburg Partnership Accents */
--color-secondary-500: #009FDF;
--color-secondary-600: #0284C7;

/* Neutral Scale: Clean Slate */
--color-neutral-50 to --color-neutral-950 (Slate)

/* Institutional Navy */
--color-msi-navy: #1E3A5F;
--color-msi-dark: #0F2240;
```

### Typography Scale
- **Font Family**: `'Be Vietnam Pro', system-ui, -apple-system, sans-serif`
- **Headings**: `h1` to `h6` automatically inherit display styling, deep navy color, and tight letter-spacing.

---

## 3. Standard UI Primitives & Nuxt UI Component Patterns

Always use Nuxt UI primitives and Tailwind utilities instead of creating ad-hoc CSS classes:

### Buttons (`<UButton>`)
```vue
<!-- Primary Action (Orange Solid, High-Contrast White Text) -->
<UButton color="primary" variant="solid" size="md" class="font-bold rounded-xl shadow-xs">
  Apply Now
</UButton>

<!-- Secondary / Outlined Action -->
<UButton color="primary" variant="outline" size="md" class="font-bold rounded-xl">
  Explore Curriculum
</UButton>

<!-- Neutral Ghost / Action Link -->
<UButton color="neutral" variant="ghost" size="sm" icon="i-lucide-arrow-left">
  Back
</UButton>

<!-- Document Download Link (External PDF) -->
<UButton
  href="/Documents/Brochure.pdf"
  target="_blank"
  external
  download
  icon="i-lucide-download"
  color="primary"
  variant="solid"
  size="md"
  class="font-bold rounded-xl shadow-xs"
>
  Download Brochure (PDF)
</UButton>
```

### Badges (`<UBadge>`)
```vue
<!-- Category / Term Pill -->
<UBadge color="primary" variant="subtle" size="sm" class="font-bold rounded-full">
  Winter Semester
</UBadge>

<!-- OVGU Partnership Accent -->
<UBadge color="secondary" variant="subtle" size="sm" class="font-semibold">
  OVGU Magdeburg
</UBadge>
```

### Cards & Surfaces
```vue
<!-- Standard Content Card -->
<div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all">
  ...
</div>

<!-- Highlighted / Active Card -->
<div class="bg-white rounded-2xl border-2 border-orange-500/80 p-6 shadow-sm">
  ...
</div>
```

### Responsive Grids
```vue
<!-- 2-Column Responsive Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">...</div>

<!-- 3-Column Responsive Grid (Default Cards) -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">...</div>

<!-- 4-Column Responsive Grid (Partners / Stats) -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">...</div>
```

---

## 4. Component Catalog & Inventory

Before coding, check this inventory to find the exact component for your task:

### A. Academic Programs & Curriculum
- [`SemesterTimetable.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/SemesterTimetable.vue): The definitive visual schedule with calendar view, week blocks, cohorts (Intake 2025, 2026, All Cohorts), and dynamic module schedule data.
- [`ElectivesCarousel.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ElectivesCarousel.vue): Carousel showcasing elective course offerings.
- [`ThesisTopicsExplorer.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ThesisTopicsExplorer.vue): Searchable catalog of open Master's thesis topics.

### B. Student Experience & Admissions
- [`InteractivePathway.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/InteractivePathway.vue): Interactive career & study pathway selector with animated connector lines.
- [`RelocationRoadmap.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/RelocationRoadmap.vue): Step-by-step guidance for student relocation to VGU and Germany.
- [`DaadScholarshipCard.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/DaadScholarshipCard.vue): Official card for DAAD Sur-Place & Mobility scholarships with key facts and download buttons.

### C. Laboratories, Facilities & Research
- [`EquipmentExplorer.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/EquipmentExplorer.vue): Filterable catalog of high-tech laboratory equipment (SEM, XRD, SPS, etc.).
- [`ResearchChairs.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ResearchChairs.vue): Profiles of OVGU and VGU partner research chairs.
- [`PartnersGrid.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/PartnersGrid.vue): Logos and profiles of German academic and industrial partners.

### D. Activities & Media
- [`ActivitiesExplorer.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ActivitiesExplorer.vue): Categorized, searchable feed of academic activities normalized across 4 official categories (`Achievements & Events`, `Lab Trainings`, `Industrial Visits`, `Academic Lectures`).
- [`MsiDocuments.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/MsiDocuments.vue): Resource download grid for program booklets, leaflets, and general brochures.
- [`QrCode.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/QrCode.vue): Clean, scalable SVG QR code generator widget.

### E. Markdown & Content Primitives
- [`PageHeader.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/PageHeader.vue): Standardized hero banner header for inner pages.
- [`ProseA.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ProseA.vue): Global anchor link handler ensuring document links open externally without vue-router hijacking.
- [`ProseImg.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ProseImg.vue): Automatic image framing with subtle navy gradient overlay and auto-captions from `alt` text.

---

## 5. Mobile Responsiveness Checklist

Whenever modifying or reviewing a page:
1. **Viewport Verification**: Check `360px` (small mobile), `768px` (tablet portrait), and `1024px` (tablet landscape/laptop).
2. **Table Wrapping**: All data tables must be wrapped in an `overflow-x-auto` container with horizontal scrolling on mobile.
3. **Card Stacking**: Action button containers must have `flex-wrap: wrap` and `gap: 0.75rem` so buttons wrap cleanly on mobile without clipping.
4. **No Horizontal Scroll on Body**: Verify that no element exceeds `100vw`.

---

## 6. Deprecated / Pruned Files (Do Not Use or Re-create)
- `CurriculumExplorer.vue`: Replaced by `ProgramStructure` and `SemesterTimetable.vue`.
- `HeroSection.vue`, `FeatureCard.vue`: Legacy one-off components replaced by Home components.
- `PathwaySelector.vue`: Obsolete duplicate replaced by `InteractivePathway.vue`.
- `VguMasterInfoDay2026Facebook.vue`: Replaced by standard markdown activity page.
