import os
import re

brand_colors = {
    '#1e3a5f', '#0f2240', '#2e5280', '#eef3fb', '#cddaee',
    '#e87722', '#c95e0a', '#ffa855', '#fff4eb', '#009fdf',
    '#007bb5', '#ffffff', '#fff', '#000000', '#000',
    '#f8f9fa', '#f1f3f5', '#e9ecef', '#dee2e6', '#ced4da',
    '#adb5bd', '#6c757d', '#495057', '#343a40', '#212529',
    '#f3f4f6', '#e5e7eb', '#9ca3af', '#4b5563', '#1f2937',
    '#374151', '#111827'
}

hex_pattern = re.compile(r'#([0-9a-fA-F]{3,6})\b')

results = []

for root, dirs, files in os.walk('.'):
    # ignore node_modules, .nuxt, .git, public, etc.
    if any(p in root for p in ['node_modules', '.nuxt', '.git', 'public']):
        continue
    for file in files:
        if file.endswith(('.vue', '.css', '.md', '.ts', '.json')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    for line_num, line in enumerate(f, 1):
                        matches = hex_pattern.findall(line)
                        for match in matches:
                            full_color = '#' + match.lower()
                            if full_color not in brand_colors:
                                results.append({
                                    'file': filepath,
                                    'line': line_num,
                                    'color': full_color,
                                    'content': line.strip()
                                })
            except Exception as e:
                pass

print(f"Found {len(results)} non-palette hex colors:")
for r in results[:100]:
    clean_content = r['content'].encode('ascii', errors='ignore').decode('ascii')
    print(f"{r['file']}:{r['line']} - {r['color']} -> {clean_content}")
