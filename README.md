# VGU Materials Science and Innovation (MSI) — Master's Program Website

The official website for the **Master of Science in Materials Science and Innovation (MSI)**, a premier joint academic partnership between **Vietnamese-German University (VGU)** and **Otto von Guericke University Magdeburg (OVGU)**, Germany.

---

## 📋 Protocols & Guidelines for Developers & AI Assistants

To maintain clean code governance, prevent component duplication, and ensure high design quality across this project, all contributors and AI assistants must follow these protocols:

1. **[Design System & Component Governance Protocol](file:///d:/OVGU/OVGU_MSI_Website/DESIGN_AND_COMPONENT_PROTOCOL.md)**:
   - **Component Catalog & Reuse Rules**: Prevent spawning redundant components; reuse or extend existing components.
   - **Unified CSS Architecture**: Design tokens, global classes (`.btn`, `.card`, `.badge`, `.grid-responsive-*`), and mobile-first rules in [`app/assets/css/main.css`](file:///d:/OVGU/OVGU_MSI_Website/app/assets/css/main.css).
   - **Mobile Responsiveness**: Rules for fluid typography, touch targets, and responsive tables/cards.

2. **[Content Personalization Protocol](file:///d:/OVGU/OVGU_MSI_Website/PERSONALIZATION_PROTOCOL.md)**:
   - Rules for transforming raw or crawled academic activities into student-centric, compelling stories under `content/_activities/`.
   - Category normalization and media optimization standards.

3. **[AI Assistant Instructions (AGENTS.md)](file:///d:/OVGU/OVGU_MSI_Website/AGENTS.md)**:
   - Quick reference for newly spawned AI agents.

---

## 🛠️ Technology Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3.5, Nitro 2, Vite 7)
- **Content Engine**: [@nuxt/content](https://content.nuxt.com/) with custom MDC components ([`ProseA.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ProseA.vue), [`ProseImg.vue`](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ProseImg.vue))
- **Design System**: Vanilla CSS design tokens in [`app/assets/css/main.css`](file:///d:/OVGU/OVGU_MSI_Website/app/assets/css/main.css) layered with Nuxt UI and Tailwind utility integration.
- **Internationalization**: Nuxt i18n (Bilingual English / Vietnamese).

---

## 🚀 Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

# Build for production
npm run build

# Preview production build locally
npm run preview
```
