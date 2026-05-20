import re
import os

pdf_text_path = '/tmp/pdf_text.txt'
out_dir = 'content/_modules'

with open(pdf_text_path, 'r', encoding='utf-16le') as f:
    text = f.read()

valid_lecturers = [
    'Dr. Nguyen Xuan Thanh', 'Dr.-Ing. Tong Duy Hien', 'Dr. rer. nat. Duong Hieu Linh',
    'Prof. Dr.-Ing. Daniel Juhre', 'Prof. Dr. rer. nat. Jürgen Christen', 'apl. Prof. Dr. rer. nat. habil. Frank Bertram',
    'Prof. Dr.-Ing. Mania Krüger', 'Dr.-Ing. Georg Hasemann', 'Prof. Dr.-Ing. Thorsten Halle', 'Dr.-Ing. Sebastian Hütter',
    'Prof. Dr. rer. nat. Michael Scheffler', 'Dr. rer. nat. Ulf Betke', 'Prof. Dr.-Ing. habil. Dr. h. c. mult. Holm Altenbach',
    'Prof. Dr. Franziska Scheffler', 'Dr. rer. nat. Sven Henning', 'Dr. Dang Cuong Phan', 'Mr. Le Dinh Phi'
]

for f_name in os.listdir(out_dir):
    if f_name.endswith('.md'):
        os.remove(os.path.join(out_dir, f_name))

def extract_lecturers(text_snippet):
    matched = []
    text_snippet = text_snippet.replace('ü', '?').replace('u', 'u')
    for vl in valid_lecturers:
        last_name = vl.split(' ')[-1]
        if last_name in text_snippet:
            matched.append(vl)
    return list(set(matched))

chunks = text.split('Name of module')
count = 0

for idx, chunk in enumerate(chunks[1:]):
    try:
        title = chunk.split('\n')[0].strip()
        if not title or len(title) > 100: continue
        
        lecturer_match = re.search(r'Responsible lecturer\s+([^\n]+(\n[^\n]+)?)', chunk)
        lecturer_text = lecturer_match.group(1).replace('\n', ' ') if lecturer_match else ''
        matched_lecturers = extract_lecturers(lecturer_text)
        
        freq_match = re.search(r'Frequency of provision\s+([^\n]+)', chunk)
        freq = freq_match.group(1).lower() if freq_match else ''
        
        desc_match = re.search(r'Content of the module(.*?)Type of lecture', chunk, re.DOTALL)
        content_text = desc_match.group(1).replace('Content:', '').replace('\n', ' ').strip() if desc_match else 'No description available.'
        
        semester = 1
        if 'summer' in freq: semester = 2
        
        electives = ['Smart Materials', 'Biomaterials', 'Nanotechnology', 'Computational', 'Engineering Ceramics', 'Energy', 'Sensor']
        is_elective = False
        for el in electives:
            if el.lower() in title.lower():
                is_elective = True
                semester = 3
                
        german_lecturer = True if len(matched_lecturers) > 0 and not any(v for v in matched_lecturers if 'Nguyen' in v or 'Tong' in v or 'Duong' in v) else False
        slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
        
        desc_short = content_text[:250].strip()
        if len(content_text) > 250:
             desc_short += "..."
             
        md_content = f'---\n'
        md_content += f'title: "{title}"\n'
        md_content += f'semester: {semester}\n'
        md_content += f'german_lecturer: {"true" if german_lecturer else "false"}\n'
        md_content += f'is_elective: {"true" if is_elective else "false"}\n'
        md_content += f'description: "{desc_short.replace('"', '')}"\n'
        md_content += f'lecturers:\n'
        for ml in matched_lecturers:
            md_content += f'  - "{ml}"\n'
        md_content += f'---\n\n'
        md_content += f'{content_text}\n'
        
        with open(os.path.join(out_dir, f'{slug}.md'), 'w', encoding='utf-8') as mf:
            mf.write(md_content)
        count += 1
    except Exception as e:
        pass

print(f'\nGenerated {count} modules successfully.')
