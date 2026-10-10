# Public Assets Architecture & Registry

All static media, official academic documents, university brand marks, and search engine assets served by Nuxt Nitro / Vite are located in this directory (`/public`).

> [!IMPORTANT]
> ### Strict Rule: ZERO BROKEN LINKS
> All URLs starting with `/Documents/...`, `/images/...`, `/Logo/...`, `/Lecturer_Avatar/...`, `/Thumbnail/...`, and `/posters/...` are mapped 1:1 to files in this directory. They are referenced in:
> 1. Over 300+ content markdown links across English (`content/`) and Vietnamese (`content/vi/`).
> 2. Hardcoded links in Vue templates (`app/components/` and `app/pages/`).
> 3. External bookmarks, academic flyers, admissions circulars, and search engine indexes.
>
> **Never delete, relocate, or rename existing files in a way that breaks existing paths.** Any new organization must preserve existing URLs through duplicates or aliases.

---

## Directory Organization & Subsystem Guides

```
public/
├── Documents/            # Official academic PDFs, brochures, semester plans, and forms
│   ├── Booklet MSI (updated 06.2026).pdf
│   ├── MODULE CATALOGUE MSI.pdf
│   ├── MSI leaflet 2026.pdf
│   ├── MSI_Scholarships_Brochure.pdf
│   ├── MaterialsScience_Poster.pdf
│   ├── Master Thesis/   # Master thesis topics and guidelines
│   ├── Modules/         # Canonical course chapter PDFs
│   ├── Research/        # Research chair profiles and flyers
│   ├── Scholarships/    # DAAD Sur-Place forms and scholarship circulars
│   ├── Semester Plan/   # Block-modular course schedules (.xlsx)
│   ├── Team Project/    # Team project syllabus and topic guides
│   └── README.md        # Detailed guide for Documents
│
├── images/               # Web photography and graphics
│   ├── academic_activities/ # Event photos, industrial visits, lab training
│   ├── labs/                # 40 equipment photographic directories
│   ├── modules/             # Backwards-compatible course materials (.pdf)
│   ├── research/            # Research chair banners and graphics
│   ├── scholarships/        # Scholarship cards and badges
│   ├── Students_Life_VGU.png
│   ├── ovgu-campus.jpg
│   └── README.md        # Detailed guide for Images
│
├── Lecturer_Avatar/      # High-resolution portraits of German & VGU professors
│   ├── [Lecturer Name].[jpg|png]
│   └── README.md
│
├── Logo/                 # Official university & institutional branding marks
│   ├── LOGO_MSI_Bright.png
│   ├── LOGO_MSI_Dark.png
│   ├── LOGO_MSI_Full_color.png
│   ├── OVGU_Logo.png
│   ├── VGU_Logo.png
│   └── README.md
│
├── posters/              # Vector PDFs and high-res PNG posters for university events
│   ├── msi-seminar-workshop-2026.pdf
│   ├── msi-seminar-workshop-2026.png
│   └── README.md
│
├── Thumbnail/            # OpenGraph and social media preview banners
│   ├── MATERIALS SCIENCE_THUMB.png
│   └── README.md
│
├── favicon.ico           # Browser shortcut icon
├── robots.txt            # Search engine crawler directives
└── sitemap.xml           # Automated XML sitemap generated at prebuild
```

---

## Quality Assurance & Automated Link Verification

To guarantee that no link in the entire codebase breaks, run the link verification script:

```bash
npm run verify:links
```

This scans every `.md`, `.vue`, `.ts`, and `.json` file across the repository and checks every referenced `/Documents/...`, `/images/...`, `/Logo/...`, `/Lecturer_Avatar/...`, and `/posters/...` URL against actual disk files.
