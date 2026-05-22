import os
import re

# Path definitions
ROOT_DIR = r"d:\OVGU\OVGU_MSI_Website"
ACTIVITIES_DIR = os.path.join(ROOT_DIR, "content", "_activities")
MODULES_DIR = os.path.join(ROOT_DIR, "content", "_modules")
EQUIPMENTS_DIR = os.path.join(ROOT_DIR, "content", "_equipments")

# Slug mappings from old to new
SLUG_MAP = {
    "elevate-your-expertise-the-vgu-master-of-materials-science-program": "vgu-msi-program-overview",
    "engineering-ceramics-advanced-materials-science-with-prof-scheffler-michael": "engineering-ceramics-lecture",
    "exploring-materials-at-the-micro-and-nano-scale-msi-course-highlight": "micro-nano-scale-materials",
    "field-trip-to-vina-kraft-paper-msi-students": "vina-kraft-paper-trip",
    "hands-on-learning-in-inorganic-non-metallic-binders-msi-students-in-action": "non-metallic-binders-labs",
    "laboratory-activities-of-the-heat-treatment-course-msi-programs-intake-2024-2025": "heat-treatment-labs",
    "laboratory-activities-of-the-polymer-course-msi-intake-2024": "polymer-course-labs",
    "msi-students-awarded-prestigious-daad-scholarships": "daad-scholarships-msi",
    "msi-students-conclude-fracture-mechanics-course-with-presentations-and-insightful-discussions": "fracture-mechanics-presentations",
    "msi-students-dive-deep-into-materials-characterization-with-sem-and-xrd-lab-tour": "sem-xrd-lab-tour",
    "msi-students-dive-into-hands-on-learning-in-research-labs": "hands-on-research-labs",
    "msi-students-explore-powder-metallurgy-and-material-testing-in-state-of-the-art-labs": "powder-metallurgy-testing",
    "msi-students-gain-comprehensive-insights-into-construction-materials-through-field-trips-to-acc-factory-and-ready-mixed-concrete-plant-in-long-an": "construction-materials-field-trip",
    "msi-students-visit-knauf-vietnam-exploring-the-science-behind-lightweight-gypsum-construction": "knauf-vietnam-field-trip",
    "representing-vietnam-at-gyss-2026-engaging-with-nobel-laureates": "gyss-2026-nobel-laureates",
    "two-msi-2024-students-awarded-prestigious-daad-scholarships": "daad-scholarships-2024",
    "vgu-welcomes-three-flying-faculty-members-from-germany-for-msi-courses": "flying-faculty-germany",
    "06-seminar-nano-crystals": "micro-nano-scale-materials"
}

category_map = {
    "Lab Works": "Lab Trainings",
    "Industry Adventures": "Industrial Visits",
    "Academic Lectures": "Academic Lectures"  # default
}

# Category adjustments for specific pages
specific_categories = {
    "vgu-msi-program-overview": "Achievements & Events",
    "daad-scholarships-msi": "Achievements & Events",
    "daad-scholarships-2024": "Achievements & Events",
    "gyss-2026-nobel-laureates": "Achievements & Events",
    "flying-faculty-germany": "Academic Lectures"
}

def clean_text(text):
    # Replace  with en-dash or space or quotes depending on context
    # Usually it is used where em-dash or en-dash or apostrophe was present
    text = text.replace("", "–")
    text = text.replace("Materials Science MSI", "Materials Science (MSI)")
    text = text.replace("Vietnamese German University VGU", "Vietnamese-German University (VGU)")
    return text

def migrate_and_clean_files():
    # 1. Process files in _activities
    for filename in os.listdir(ACTIVITIES_DIR):
        if not filename.endswith(".md") or filename == "00-template.md":
            continue
        
        old_slug = filename[:-3]
        if old_slug not in SLUG_MAP:
            print(f"Warning: slug '{old_slug}' not found in SLUG_MAP. Skipping.")
            continue
        
        new_slug = SLUG_MAP[old_slug]
        new_filename = new_slug + ".md"
        
        old_path = os.path.join(ACTIVITIES_DIR, filename)
        new_path = os.path.join(ACTIVITIES_DIR, new_filename)
        
        with open(old_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Split frontmatter
        parts = content.split("---")
        if len(parts) >= 3:
            frontmatter_raw = parts[1]
            body = "---".join(parts[2:])
            
            # Extract frontmatter keys
            title = re.search(r'title:\s*"([^"]+)"', frontmatter_raw)
            category = re.search(r'category:\s*"([^"]+)"', frontmatter_raw)
            date = re.search(r'date:\s*"([^"]+)"', frontmatter_raw)
            image = re.search(r'image:\s*"([^"]+)"', frontmatter_raw)
            description = re.search(r'description:\s*"([^"]+)"', frontmatter_raw)
            
            title_val = clean_text(title.group(1)) if title else ""
            category_val = category.group(1) if category else "Other Activities"
            date_val = date.group(1) if date else ""
            image_val = image.group(1) if image else ""
            desc_val = clean_text(description.group(1)) if description else ""
            
            # Clean body
            body = clean_text(body)
            
            # Adjust category
            if new_slug in specific_categories:
                category_val = specific_categories[new_slug]
            elif category_val in category_map:
                category_val = category_map[category_val]
            
            # Generate personalized meta description for prospective students
            if not desc_val or len(desc_val) < 30:
                desc_val = f"Read about {title_val} at VGU's Materials Science & Innovation master's program, highlighting research collaborations and student growth."
            
            # Reconstruct frontmatter
            new_frontmatter = f"\ntitle: \"{title_val}\"\ncategory: \"{category_val}\"\ndate: \"{date_val}\"\nimage: \"{image_val}\"\ndescription: \"{desc_val}\"\n"
            
            new_content = f"---{new_frontmatter}---{body}"
            
            # Write to new path (delete old one if different)
            with open(new_path, "w", encoding="utf-8") as f:
                f.write(new_content)
                
            if old_path != new_path:
                os.remove(old_path)
                print(f"Migrated & Cleaned: {filename} -> {new_filename}")
            else:
                print(f"Cleaned (in-place): {filename}")
        else:
            print(f"Error: {filename} does not contain valid frontmatter.")

def update_references():
    # 2. Update references in other directories
    directories = [MODULES_DIR, EQUIPMENTS_DIR, os.path.join(ROOT_DIR, "content")]
    
    for directory in directories:
        if not os.path.exists(directory):
            continue
        for root, _, files in os.walk(directory):
            for file in files:
                if not file.endswith(".md"):
                    continue
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                original_content = content
                
                # Replace old activity paths with new ones
                for old_slug, new_slug in SLUG_MAP.items():
                    # Match /academic-activities/old-slug and /_activities/old-slug
                    content = content.replace(f"/academic-activities/{old_slug}", f"/academic-activities/{new_slug}")
                    content = content.replace(f"/_activities/{old_slug}", f"/_activities/{new_slug}")
                
                # Replace mock index highlights
                content = content.replace("/_activities/01-bosch-visit", "/_activities/vina-kraft-paper-trip")
                content = content.replace("/_activities/02-sem-training", "/_activities/sem-xrd-lab-tour")
                content = content.replace("/_activities/03-guest-seminar", "/_activities/flying-faculty-germany")
                content = content.replace("/_activities/crawled-0-international-colloquium-on-advanced-smart-materials", "/_activities/daad-scholarships-msi")
                
                if content != original_content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"Updated references in: {os.path.relpath(file_path, ROOT_DIR)}")

if __name__ == "__main__":
    migrate_and_clean_files()
    update_references()
    print("Migration complete!")
