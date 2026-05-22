import os
import yaml

dir_path = r"d:\OVGU\OVGU_MSI_Website\content\_activities"
for filename in os.listdir(dir_path):
    if filename.endswith(".md"):
        file_path = os.path.join(dir_path, filename)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            if content.startswith("---"):
                parts = content.split("---")
                if len(parts) >= 3:
                    try:
                        frontmatter = yaml.safe_load(parts[1])
                        print(f"File: {filename}")
                        print(f"  Title: {frontmatter.get('title')}")
                        print(f"  Category: {frontmatter.get('category')}")
                        print(f"  Date: {frontmatter.get('date')}")
                        print(f"  Image: {frontmatter.get('image')}")
                        print(f"  Desc: {frontmatter.get('description')}")
                    except Exception as e:
                        print(f"Error parsing {filename}: {e}")
