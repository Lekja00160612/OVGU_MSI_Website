import os
import sys
import urllib.request
import re
from html.parser import HTMLParser

class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.result = []
        self.ignore_tags = {'script', 'style', 'header', 'footer', 'nav', 'aside', 'head'}
        self.current_tag = ''
        self.ignore_depth = 0

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag.lower()
        if self.current_tag in self.ignore_tags:
            self.ignore_depth += 1

    def handle_endtag(self, tag):
        if tag.lower() in self.ignore_tags:
            self.ignore_depth = max(0, self.ignore_depth - 1)

    def handle_data(self, data):
        if self.ignore_depth == 0:
            cleaned = data.strip()
            if cleaned:
                # Add line breaks for headers or block elements to preserve readability
                if self.current_tag in {'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'div', 'tr'}:
                    self.result.append('\n' + cleaned)
                else:
                    self.result.append(' ' + cleaned)

    def get_text(self):
        text = ''.join(self.result)
        # Clean up excessive whitespace
        text = re.sub(r'\n\s*\n+', '\n\n', text)
        return text.strip()

def crawl_raw(url, output_dir="content/_raw_crawled"):
    print(f"Crawling URL: {url}")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode('utf-8', errors='ignore')
        
        # Extract title using simple regex
        title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
        title = title_match.group(1).strip() if title_match else "Untitled Page"
        
        # Clean title for filename
        filename_base = re.sub(r'[^a-zA-Z0-9\-]', '_', title.lower()).strip('_')
        filename_base = re.sub(r'_+', '_', filename_base)[:60]
        if not filename_base:
            filename_base = "crawled_page"
        
        # Extract body text
        extractor = HTMLTextExtractor()
        extractor.feed(html)
        raw_text = extractor.get_text()
        
        # Create output dir
        os.makedirs(output_dir, exist_ok=True)
        out_path = os.path.join(output_dir, f"{filename_base}.txt")
        
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(f"Source URL: {url}\n")
            f.write(f"Original Title: {title}\n")
            f.write("-" * 80 + "\n\n")
            f.write(raw_text)
            
        print(f"Successfully saved raw crawl output to: {out_path}")
        return out_path
        
    except Exception as e:
        print(f"Error crawling URL: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/crawl_raw.py <URL>")
        sys.exit(1)
    crawl_raw(sys.argv[1])
