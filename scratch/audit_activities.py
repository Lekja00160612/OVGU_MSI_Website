import os
import yaml

activities_dir = 'content/_activities'
files = [f for f in os.listdir(activities_dir) if f.endswith('.md')]

print(f"Found {len(files)} activity files.")
print(f"{'Filename':<50} | {'Category':<20} | {'Date':<12} | {'Title'}")
print("-" * 120)

categories = set()
for file in sorted(files):
    file_path = os.path.join(activities_dir, file)
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # extract yaml frontmatter
            if content.startswith('---'):
                parts = content.split('---')
                if len(parts) >= 3:
                    metadata = yaml.safe_load(parts[1])
                    title = metadata.get('title', '')
                    category = metadata.get('category', '')
                    date = metadata.get('date', '')
                    categories.add(category)
                    print(f"{file:<50} | {str(category):<20} | {str(date):<12} | {title}")
    except Exception as e:
        print(f"Error reading {file}: {e}")

print("\nAll Unique Categories:")
print(categories)
