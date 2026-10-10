import fs from 'fs';
import path from 'path';

function getAllFiles(dir, exts) {
  let res = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name !== 'node_modules' && item.name !== '.git' && item.name !== '.nuxt' && item.name !== '.output' && item.name !== 'dist') {
        res = res.concat(getAllFiles(full, exts));
      }
    } else if (exts.some(ext => item.name.endsWith(ext))) {
      res.push(full);
    }
  }
  return res;
}

const files = getAllFiles('content', ['.md', '.json']).concat(getAllFiles('app', ['.vue', '.ts']));

// Extract links from quotes: "...", '...', `...` or markdown (... )
const regexQuoted = /["'`]((\/(Documents|images|Logo|Lecturer_Avatar|Thumbnail|posters)\/[^"'`]+))["'`]/g;
const regexMd = /\]\(((\/(Documents|images|Logo|Lecturer_Avatar|Thumbnail|posters)\/[^\)]+))\)/g;

const foundLinks = new Set();
const missing = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regexQuoted.exec(content)) !== null) {
    let link = match[1];
    if (link.includes('${')) continue;
    foundLinks.add({ link, source: file });
  }
  while ((match = regexMd.exec(content)) !== null) {
    let link = match[1];
    if (link.includes('${')) continue;
    foundLinks.add({ link, source: file });
  }
}

console.log(`Found ${foundLinks.size} unique asset references.`);

for (const item of foundLinks) {
  let decoded = item.link;
  try { decoded = decodeURIComponent(item.link); } catch(e){}
  
  // Normalize Windows/Unix path
  const relPath = decoded.startsWith('/') ? decoded.slice(1) : decoded;
  const fullPath = path.join(process.cwd(), 'public', relPath);

  if (!fs.existsSync(fullPath)) {
    console.log(`MISSING: "${item.link}" (decoded: "${decoded}") in ${item.source}`);
    missing.push(item);
  }
}

console.log(`\nVerification finished: ${missing.length} missing files out of ${foundLinks.size} tested.`);
