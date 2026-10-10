# Public Documents Directory (`/Documents`)

This directory houses all official academic documents, syllabi, brochures, thesis templates, and scholarship applications for the **VGU-OVGU Master of Science in Materials Science and Innovation (MSI)** program.

> [!IMPORTANT]
> **Zero Broken Links Guarantee**:
> All paths in this directory are directly exposed at `/Documents/...` on the production server. Links to these files are referenced across English and Vietnamese markdown collections (`content/` and `content/vi/`), Vue components, and external academic circulars. **Never rename or delete existing files.**

---

## Directory Organization

```
public/Documents/
├── Booklet MSI (updated 06.2026).pdf     # Comprehensive Master Program Booklet
├── MODULE CATALOGUE MSI.pdf              # Official OVGU-VGU Module Handbook & ECTS Syllabi
├── MSI leaflet 2026.pdf                  # 2-page Admissions Leaflet for Prospective Students
├── MSI_Scholarships_Brochure.pdf         # Complete DAAD & VGU Scholarship Overview
├── MaterialsScience_Poster.pdf           # Program Recruitment Overview Poster
│
├── Master Thesis/                        # Master thesis guidelines & topic proposals
│   └── Master Thesis for Module Glass.docx
│
├── Modules/                              # Canonical repository for course chapter slides & materials
│   ├── Ceramic Engineering_*.pdf
│   ├── Materials Mechanics_*.pdf
│   ├── Metals_*.pdf
│   ├── Polymers_*.pdf
│   ├── Powder Metullurgy_*.pdf
│   └── Team Project_*.pdf
│
├── Research/                             # Specialized research group profiles & flyers
│   ├── Comp_Mech.pdf                     # Computational Mechanics Chair Profile
│   └── Metallic.pdf                      # Metallic Materials Chair Profile
│
├── Scholarships/                         # Official scholarship application calls and forms
│   ├── MATERIALS SCIENCE_SCHOLARSHIPS_Application_2026.pdf  # (Space variant)
│   ├── MATERIALS_SCIENCE_SCHOLARSHIPS_Application_2026.pdf  # (Underscore variant)
│   ├── Mobility_Scholarship Brochure MSI_Thanh_Marc.pdf      # Semester 4 Germany Mobility Flyer
│   ├── MSI Sur_Place_scholarship_brochure.pdf               # DAAD Sur-Place Vietnam Stipend
│   └── MSI Sur_Place_scholarship_brochure.pptx              # Presentation deck variant
│
├── Semester Plan/                        # Block-modular course schedules & timeline templates
│   ├── SemesterPlanung 26_27.xlsx        # 2026-2027 Academic Schedule
│   └── Semester_Plan_Template_Guide.xlsx # Guide for course registration
│
└── Team Project/                         # Team project instructions & topic guides
    └── TEAM PROJECT.pdf                  # Guidelines, deliverables, and assessment criteria
```

---

## Download Behavior & Link Handling

When referencing any document from this directory in Markdown files:
```markdown
[Download Module Catalogue](/Documents/MODULE%20CATALOGUE%20MSI.pdf)
```

The application's `ProseA.vue` component automatically:
1. Detects that the URL targets `/Documents/` (or has a `.pdf`/`.docx`/`.xlsx` extension).
2. Sets `:external="true"`, `target="_blank"`, and `rel="noopener noreferrer"`.
3. Triggers native browser downloading in a separate tab without disturbing SPA navigation.
