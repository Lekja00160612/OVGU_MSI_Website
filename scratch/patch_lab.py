filepath = 'app/pages/laboratories-research.vue'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the doc-icon background and text colors
old_icon_style = '.doc-icon { background: #fee2e2; color: #dc2626; padding: 0.6rem; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }'
new_icon_style = '.doc-icon { background: var(--color-danger-bg); color: var(--color-danger-text); padding: 0.6rem; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }'

if old_icon_style in content:
    content = content.replace(old_icon_style, new_icon_style)
    print("Success: Patched old_icon_style")
else:
    print("Warning: old_icon_style not found!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
