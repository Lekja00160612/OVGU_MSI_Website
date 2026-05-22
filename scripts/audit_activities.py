import os
import yaml

def audit():
    activities_dir = r"d:\OVGU\OVGU_MSI_Website\content\_activities"
    for f in sorted(os.listdir(activities_dir)):
        if f.endswith('.md') and not f.startswith('00'):
            path = os.path.join(activities_dir, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            # Split frontmatter
            parts = content.split('---')
            if len(parts) >= 3:
                fm_text = parts[1]
                try:
                    fm = yaml.safe_load(fm_text)
                    print(f"File: {f}")
                    print(f"  Title: {fm.get('title')}")
                    print(f"  Category: {fm.get('category')}")
                    print(f"  Desc Length: {len(fm.get('description', ''))}")
                    print(f"  Desc: {fm.get('description')}")
                except Exception as e:
                    print(f"Error parsing frontmatter in {f}: {e}")

if __name__ == "__main__":
    audit()
