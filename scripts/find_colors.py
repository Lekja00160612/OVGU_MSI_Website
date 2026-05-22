import os
import re

HEX_REGEX = re.compile(r'#[0-9a-fA-F]{3,8}')

def find_colors():
    root_dir = r"d:\OVGU\OVGU_MSI_Website\app"
    color_map = {}
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for f in filenames:
            if f.endswith(('.vue', '.css', '.ts')):
                path = os.path.join(dirpath, f)
                with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                    for line_num, line in enumerate(file, 1):
                        matches = HEX_REGEX.findall(line)
                        for match in matches:
                            # Skip #fff, #ffffff, #000, #000000, #0000
                            norm = match.lower()
                            if norm in ('#fff', '#ffffff', '#000', '#000000', '#0000'):
                                continue
                            if norm not in color_map:
                                color_map[norm] = []
                            color_map[norm].append(f"{os.path.relpath(path, root_dir)}:L{line_num}")
    
    for color, locations in sorted(color_map.items()):
        print(f"Color: {color}")
        for loc in locations[:10]:
            print(f"  {loc}")
        if len(locations) > 10:
            print(f"  ... and {len(locations) - 10} more locations")

if __name__ == "__main__":
    find_colors()
