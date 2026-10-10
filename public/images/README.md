# Public Images Directory (`/images`)

This directory contains static visual assets used across the **VGU MSI** website, including activity photography, laboratory equipment photos, research chair banners, and course materials.

---

## Directory Organization

```
public/images/
├── academic_activities/   # High-resolution photos from industrial visits, lab trainings, and events
│   ├── [slug]-cover.jpg   # Card cover photo (16:9 ratio, optimized under 1MB)
│   └── [slug]-img-*.jpg   # Inline content body images
│
├── labs/                  # 40 research equipment subdirectories
│   ├── [equipment-slug]/  # Dedicated equipment folder (e.g. scanning-electron-microscope-semedsebsd/)
│   │   └── [photo].jpg    # High-resolution photograph of the apparatus
│
├── modules/               # Legacy course slides & syllabus PDFs
│   │                      # (Maintained for 100% backwards-compatibility with markdown links)
│   └── *.pdf
│
├── research/              # Visual banners and flyers for program research pillars
│   ├── comp-mech.png      # Computational Mechanics
│   ├── eng-mechanics.png  # Engineering Mechanics
│   ├── hi-temp.png        # High-Temperature Materials
│   ├── metallic.png       # Metallic Materials
│   ├── non-metallic.png   # Non-Metallic & Ceramic Materials
│   └── solid-state.png    # Solid-State Physics & Nanotechnology
│
├── scholarships/          # Badges and visual infographics for scholarship opportunities
│   ├── MSI_DAAD_Label.png
│   ├── MSI_Mobility_Scholarship.png
│   └── MSI_Surplace_Scholarship.png
│
├── Students_Life_VGU.png  # Student life overview banner
└── ovgu-campus.jpg        # Otto von Guericke University Magdeburg campus hero banner
```

---

## Guidelines for Adding Images

1. **Format**: Use WebP or JPG for photographs, PNG for logos/diagrams with transparent backgrounds.
2. **Compression**: Optimize photos to stay under 1.5MB to ensure fast mobile page loads.
3. **Naming**: Use lowercase alphanumeric characters and hyphens (`my-new-event-cover.jpg`).
4. **Backwards Compatibility**: Never remove or rename existing images, as they are referenced in activity articles, open-graph cards, and SEO sitemaps.
