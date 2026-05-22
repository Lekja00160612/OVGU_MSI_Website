import os

def clean_file_content(content):
    # Support both en-dash (\u2013) and em-dash (\u2014)
    en_dash = '\u2013'
    em_dash = '\u2014'
    
    # Check if either dash has a high frequency in the file
    dash_to_remove = None
    if content.count(en_dash) > len(content) * 0.1:
        dash_to_remove = en_dash
    elif content.count(em_dash) > len(content) * 0.1:
        dash_to_remove = em_dash
        
    if dash_to_remove:
        cleaned = content.replace(dash_to_remove, '')
        
        # Tidy up double dots or other artifacts left by removing dashes
        cleaned = cleaned.replace('Dr..', 'Dr.')
        cleaned = cleaned.replace('Mr..', 'Mr.')
        cleaned = cleaned.replace('Prof..', 'Prof.')
        cleaned = cleaned.replace('..', '.')
        cleaned = cleaned.replace(' ,', ',')
        cleaned = cleaned.replace(' .', '.')
        
        # Fix frontmatter delimiters if they were corrupted (e.g. they became '-' instead of '---')
        lines = cleaned.split('\n')
        if lines:
            if lines[0].strip() == '---' or lines[0].strip() == '-':
                lines[0] = '---'
            # Look for the closing delimiter
            for i in range(1, min(15, len(lines))):
                if lines[i].strip() == '---' or lines[i].strip() == '-':
                    lines[i] = '---'
                    break
            cleaned = '\n'.join(lines)
            
        return cleaned
    return content

def main():
    activities_dir = r"d:\OVGU\OVGU_MSI_Website\content\_activities"
    for f in os.listdir(activities_dir):
        if f.endswith('.md'):
            path = os.path.join(activities_dir, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            cleaned = clean_file_content(content)
            if cleaned != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(cleaned)
                print(f"Cleaned {f}")

if __name__ == "__main__":
    main()
