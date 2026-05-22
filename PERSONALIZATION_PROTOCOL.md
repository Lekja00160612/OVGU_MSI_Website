# VGU MSI Website - Content Personalization Protocol
**For Successor AI Coding Assistants & Editors**

This document establishes the official standardization and personalization protocol for all crawled or raw academic activities and content pages added to the **VGU Materials Science and Innovation (MSI)** Master's program website. 

When the user asks you to *"look for crawled but not personalized pages"* or to *"apply the personalized process to raw content"*, you must strictly follow this protocol.

---

## 1. Core Brand Alignment & Tone

Every page must be rewritten to appeal to prospective Master's students, highlighting the academic rigor, prestige, and career opportunities of the program.

*   **The Collaboration**: Always frame the program as a premium partnership between **Vietnamese-German University (VGU)** and **Otto von Guericke University Magdeburg (OVGU), Germany**.
*   **The "Flying Faculty"**: Emphasize that key lectures, lab components, and thesis supervisions are conducted directly by German professors who fly to Vietnam.
*   **Hands-on, High-Tech Labs**: Mention specific state-of-the-art instruments where possible (e.g., Scanning Electron Microscopy (SEM), X-ray Diffraction (XRD), Spark Plasma Sintering, split-Hopkinson bar). Do not just say "laboratory work"; say "advanced characterization in research-grade facilities."
*   **International Mobility**: Highlight opportunities for students to conduct their master's thesis in Germany supported by DAAD scholarships.

---

## 2. Content Personalization Checklist

For every raw crawled page (typically saved under `content/_raw_crawled/`), you must compile a personalized markdown file under `content/_activities/` following these rules:

### A. Frontmatter Schema
Each activity must have the following frontmatter properties matching `content.config.ts`:
```yaml
---
title: "A Student-Centric, Compelling Action Title"
category: "Category Name"          # MUST be one of the four categories listed below
date: "YYYY-MM-DD"                 # Event or publication date
image: "/images/academic_activities/slug-cover.jpg" # Local path to cover thumbnail
description: "A punchy summary under 160 characters for SEO."
---
```

### B. Category Normalization
Classify the activity into one of these four categories (no placeholders or custom tags):
1.  `Achievements & Events` (e.g., DAAD scholarship awards, student awards, orientation days)
2.  `Lab Trainings` (e.g., hands-on SEM/XRD tutorials, heat treatment training)
3.  `Industrial Visits` (e.g., field trips to Knauf, Vina Kraft Paper, Bosch)
4.  `Academic Lectures` (e.g., guest seminars, flying faculty lectures, research presentations)

### C. Body Rewrite Guidelines
*   **Remove Corrupt Characters**: Clean up any en-dashes (`–`) placed between every character, null bytes, or duplicate symbols.
*   **Student Appeal**: Rewrite dry news text into an inspiring story. Start with the *impact* or *experience* before listing names and dates.
*   **Connect to Curriculum**: If the activity is related to a course module (e.g., Materials Characterization, Binders, Polymers), link to it (e.g., `/program-structure`).
*   **Clean List Formats**: Use clean markdown lists (`- Item`) with proper spacing.

---

## 3. Image & Media Optimization

*   **Local Image Paths**: Do not link to external image URLs. Move crawled images to `/public/images/academic_activities/` and rename them descriptively.
*   **Descriptive Filenames**: Use slugs like `vina-kraft-visit-students.jpg` instead of `IMG_1029.jpg`.
*   **Dynamic Captions & Alts**: The website uses a custom [ProseImg.vue](file:///d:/OVGU/OVGU_MSI_Website/app/components/content/ProseImg.vue) component which automatically renders the image's `alt` attribute as an academic caption below the image.
    *   *Incorrect*: `![](/images/...)`
    *   *Correct*: `![MSI students observing polymer tensile strength testing inside VGU Laboratory](/images/academic_activities/polymer-lab-testing.jpg)`
*   **Aesthetics Overlay**: Our custom prose images have a subtle, elegant blue brand overlay by default. If a particular image (e.g. an infocard or logo collage) needs this removed, add `{overlay="false"}` or class `.no-overlay` in markdown.

---

## 4. Search Engine Optimization (SEO) Metrics

*   **Meta Descriptions**: Keep the frontmatter `description` between **120 and 150 characters**. It must contain active verbs (e.g. *Learn*, *Discover*, *Earn*) and target key terms like *Materials Science Master*, *VGU*, *Germany*.
*   **Meta Titles**: The page title combined with the dynamic site title in `[...slug].vue` should form a concise title under 60 characters for search indexers.
*   **Semantic Structure**: Use correct heading hierarchy (`##` for sections, `###` for sub-sections). Never use `#` in the body since that is reserved for the main page title.

---

## 5. Successor AI Evaluation Checklist

Before finalizing your work:
1.  **Check URLs**: Make sure the activity route is registered by Nuxt Content. All activity slugs must be lowercase, short, and contain only letters, numbers, and hyphens.
2.  **Verify Cross-Links**: Update any partner or course links. Use `localePath` helpers in components where applicable.
3.  **Build Validation**: Run `npm run build` to verify that there are no static generation or routing errors.
