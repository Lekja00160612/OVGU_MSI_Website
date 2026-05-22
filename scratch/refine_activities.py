import os
import re

activities_dir = 'content/_activities'
files = [f for f in os.listdir(activities_dir) if f.endswith('.md')]

def clean_text(text):
    # Replace unicode replacement character with an en-dash
    text = text.replace('\ufffd', '\u2013')
    text = text.replace('', '\u2013')
    return text

for file in files:
    file_path = os.path.join(activities_dir, file)
    with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    content = clean_text(content)
    
    # Parse frontmatter
    frontmatter_match = re.match(r'^---\r?\n(.*?)\r?\n---\r?\n(.*)$', content, re.DOTALL)
    if not frontmatter_match:
        print(f"Skipping {file} - no frontmatter found")
        continue
    
    frontmatter_str = frontmatter_match.group(1)
    body_str = frontmatter_match.group(2)
    
    # Parse key-values in frontmatter manually to preserve comments/spacing
    lines = frontmatter_str.split('\n')
    meta = {}
    new_lines = []
    
    for line in lines:
        if ':' in line and not line.strip().startswith('#'):
            key, val = line.split(':', 1)
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            meta[key] = val
            
            # Refine category
            if key == 'category':
                category = val
                if category == 'Lab Works':
                    category = 'Lab Trainings'
                elif category == 'Industry Adventures':
                    category = 'Industrial Visits'
                elif file in [
                    'msi-students-awarded-prestigious-daad-scholarships.md',
                    'two-msi-2024-students-awarded-prestigious-daad-scholarships.md',
                    'representing-vietnam-at-gyss-2026-engaging-with-nobel-laureates.md'
                ]:
                    category = 'Achievements & Events'
                line = f"category: \"{category}\""
            
            # Refine title with encoding fixes
            if key == 'title':
                title = clean_text(val)
                line = f"title: \"{title}\""
                
            # If description is missing or too short, let's create a professional one later
        new_lines.append(line)
        
    # Reconstruct frontmatter and write back
    new_frontmatter = '\n'.join(new_lines)
    new_content = f"---\n{new_frontmatter}\n---\n{body_str}"
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Refined {file}")

print("Done refining activities frontmatter!")
