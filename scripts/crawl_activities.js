import fs from 'fs';
import path from 'path';

// Target URL and Directories
const TARGET_URL = 'https://vgu.edu.vn/vi/academic-activities';
const OUTPUT_DIR = 'content/_activities';
const IMAGES_DIR = 'public/images/academic_activities';
const CACHE_FILE = 'scripts/activities_cache.json';
const MODULES_DIR = 'content/_modules';

// Weighted category keyword maps for fallback
const FALLBACK_CATEGORIES = [
  {
    name: 'Industry Adventures',
    keywords: [
      { term: 'field trip', weight: 4 },
      { term: 'excursion', weight: 4 },
      { term: 'visit', weight: 3 },
      { term: 'factory', weight: 3 },
      { term: 'plant', weight: 3 },
      { term: 'company', weight: 3 },
      { term: 'knauf', weight: 5 },
      { term: 'kraft', weight: 5 },
      { term: 'bosch', weight: 5 },
      { term: 'corporation', weight: 3 },
      { term: 'guest speaker', weight: 3 }
    ]
  },
  {
    name: 'Lab Works',
    keywords: [
      { term: 'lab', weight: 3 },
      { term: 'laboratory', weight: 3 },
      { term: 'sem', weight: 3 },
      { term: 'xrd', weight: 3 },
      { term: 'microscopy', weight: 3 },
      { term: 'characterization', weight: 3 },
      { term: 'hands-on', weight: 3 },
      { term: 'training', weight: 2 },
      { term: 'equipment', weight: 2 }
    ]
  },
  {
    name: 'Academic Lectures',
    keywords: [
      { term: 'colloquium', weight: 3 },
      { term: 'seminar', weight: 3 },
      { term: 'lecture', weight: 3 },
      { term: 'presentation', weight: 2 },
      { term: 'talk', weight: 3 },
      { term: 'scholarship', weight: 3 },
      { term: 'daad', weight: 4 },
      { term: 'gyss', weight: 4 },
      { term: 'presentation skills', weight: 3 },
      { term: 'soft skills', weight: 2 }
    ]
  }
];

// Weighted modules keyword maps for fallback
const FALLBACK_MODULES = {
  'continuum-mechanics': {
    positive: [
      { term: 'continuum', weight: 3 },
      { term: 'stress', weight: 2 },
      { term: 'strain', weight: 2 },
      { term: 'elasticity', weight: 2 },
      { term: 'plasticity', weight: 2 },
      { term: 'tensor', weight: 3 },
      { term: 'finite element', weight: 3 },
      { term: 'fem', weight: 3 }
    ],
    negative: []
  },
  'engineering-ceramics': {
    positive: [
      { term: 'ceramic', weight: 4 },
      { term: 'alumina', weight: 2 },
      { term: 'zirconia', weight: 2 },
      { term: 'carbide', weight: 2 },
      { term: 'nitride', weight: 2 },
      { term: 'scheffler', weight: 5 }
    ],
    negative: []
  },
  'glass': {
    positive: [
      { term: 'glass', weight: 4 },
      { term: 'silica', weight: 2 },
      { term: 'vitreous', weight: 3 },
      { term: 'amorphous', weight: 2 },
      { term: 'optical fiber', weight: 3 }
    ],
    negative: []
  },
  'heat-treatment-of-materials': {
    positive: [
      { term: 'heat treatment', weight: 5 },
      { term: 'annealing', weight: 3 },
      { term: 'quenching', weight: 3 },
      { term: 'tempering', weight: 3 },
      { term: 'hardening', weight: 3 },
      { term: 'metallurgy', weight: 1 },
      { term: 'microstructure', weight: 1 }
    ],
    negative: [
      { term: 'powder metallurgy', weight: 4 }
    ]
  },
  'inorganic-non-metallic-binders': {
    positive: [
      { term: 'binder', weight: 3 },
      { term: 'cement', weight: 4 },
      { term: 'concrete', weight: 4 },
      { term: 'mortar', weight: 3 },
      { term: 'gypsum', weight: 3 },
      { term: 'aac', weight: 4 },
      { term: 'knauf', weight: 4 },
      { term: 'long an', weight: 3 },
      { term: 'vicem', weight: 4 }
    ],
    negative: []
  },
  'materials-characterization': {
    positive: [
      { term: 'characterization', weight: 3 },
      { term: 'sem', weight: 3 },
      { term: 'xrd', weight: 3 },
      { term: 'tem', weight: 3 },
      { term: 'spectroscopy', weight: 3 },
      { term: 'diffraction', weight: 3 },
      { term: 'microscopy', weight: 2 },
      { term: 'characterization lab', weight: 4 },
      { term: 'scanning electron', weight: 3 }
    ],
    negative: []
  },
  'mechanics-of-materials-and-fracture-mechanics': {
    positive: [
      { term: 'fracture', weight: 4 },
      { term: 'fatigue', weight: 2 },
      { term: 'crack', weight: 3 },
      { term: 'failure', weight: 2 },
      { term: 'j-integral', weight: 5 },
      { term: 'stress intensity', weight: 4 },
      { term: 'fracture mechanics', weight: 5 }
    ],
    negative: []
  },
  'metals': {
    positive: [
      { term: 'metals', weight: 3 },
      { term: 'alloy', weight: 2 },
      { term: 'steel', weight: 2 },
      { term: 'titanium', weight: 2 },
      { term: 'aluminum', weight: 2 },
      { term: 'iron', weight: 2 },
      { term: 'casting', weight: 3 },
      { term: 'metallurgy', weight: 1 },
      { term: 'microstructure', weight: 1 }
    ],
    negative: [
      { term: 'powder metallurgy', weight: 4 },
      { term: 'vina kraft', weight: 4 },
      { term: 'paper', weight: 3 },
      { term: 'cement', weight: 3 },
      { term: 'glass', weight: 3 },
      { term: 'ceramic', weight: 3 }
    ]
  },
  'micro-nano-fabrication-technology': {
    positive: [
      { term: 'micro-fabrication', weight: 4 },
      { term: 'nano-fabrication', weight: 4 },
      { term: 'lithography', weight: 3 },
      { term: 'cleanroom', weight: 3 },
      { term: 'sputtering', weight: 3 },
      { term: 'etching', weight: 3 },
      { term: 'wafer', weight: 3 },
      { term: 'micro and nano scale', weight: 4 }
    ],
    negative: []
  },
  'polymers': {
    positive: [
      { term: 'polymer', weight: 4 },
      { term: 'rubber', weight: 2 },
      { term: 'plastic', weight: 2 },
      { term: 'elastomer', weight: 3 },
      { term: 'resin', weight: 2 },
      { term: 'polymerization', weight: 3 },
      { term: 'composite', weight: 2 },
      { term: 'vina kraft', weight: 4 },
      { term: 'paper', weight: 3 }
    ],
    negative: []
  },
  'powder-metallurgy-and-sintered-materials': {
    positive: [
      { term: 'powder metallurgy', weight: 5 },
      { term: 'sintering', weight: 4 },
      { term: 'sintered', weight: 3 },
      { term: 'powder', weight: 1 }
    ],
    negative: [
      { term: 'cement', weight: 3 },
      { term: 'concrete', weight: 3 },
      { term: 'glass', weight: 3 }
    ]
  },
  'research-lab-properties-testing-and-analytics': {
    positive: [
      { term: 'research lab', weight: 3 },
      { term: 'testing', weight: 2 },
      { term: 'analytics', weight: 2 },
      { term: 'mechanical properties', weight: 3 },
      { term: 'lab works', weight: 2 },
      { term: 'lab trainings', weight: 3 }
    ],
    negative: []
  },
  'solid-state-physics': {
    positive: [
      { term: 'physics', weight: 3 },
      { term: 'quantum', weight: 3 },
      { term: 'band structure', weight: 3 },
      { term: 'crystal structure', weight: 2 },
      { term: 'semiconductor', weight: 3 },
      { term: 'lattice', weight: 2 },
      { term: 'solid state', weight: 3 }
    ],
    negative: []
  },
  'team-project': {
    positive: [
      { term: 'team project', weight: 4 },
      { term: 'group project', weight: 4 },
      { term: 'collaborative', weight: 2 },
      { term: 'presentation', weight: 1 }
    ],
    negative: []
  }
};

// Helper: Slugify title
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD') // remove accents
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}

// Helper: HTML to Markdown
function htmlToMarkdown(html) {
  if (!html) return '';
  let md = html;
  
  // Replace strong/b tags
  md = md.replace(/<(?:strong|b)>(.*?)<\/(?:strong|b)>/gi, '**$1**');
  
  // Replace em/i tags
  md = md.replace(/<(?:em|i)>(.*?)<\/(?:em|i)>/gi, '*$1*');
  
  // Replace img tags (which we will have modified the src for)
  md = md.replace(/<img[^>]+alt="([^"]*)"[^>]+src="([^"]+)"[^>]*>/gi, '![$1]($2)');
  md = md.replace(/<img[^>]+src="([^"]+)"[^>]+alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]+src="([^"]+)"[^>]*>/gi, '![image]($1)');
  
  // Replace a tags
  md = md.replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Replace list items
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<\/?(?:ul|ol)[^>]*>/gi, '\n');
  
  // Replace headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n');
  
  // Replace paragraphs and line breaks
  md = md.replace(/<p[^>]*>/gi, '\n\n');
  md = md.replace(/<\/p>/gi, '\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  
  // Strip all other HTML tags
  md = md.replace(/<[^>]+>/g, '');
  
  // Unescape HTML entities
  md = md.replace(/&nbsp;/g, ' ')
           .replace(/&amp;/g, '&')
           .replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>')
           .replace(/&quot;/g, '"')
           .replace(/&#39;/g, "'");
  
  // Normalize newlines
  md = md.replace(/\n{3,}/g, '\n\n');
  
  return md.trim();
}

// Helper: Get keyword frequency score, supporting word boundaries for short terms
function getTermScore(text, term) {
  if (!text) return 0;
  const isShortWord = term.length < 5 && /^[a-z]+$/i.test(term);
  if (isShortWord) {
    const regex = new RegExp('\\b' + term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  } else {
    const regex = new RegExp(term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }
}

// Helper: Classify category and match modules using weighted keyword mapping
function classifyFallback(title, bodyText) {
  const combinedText = title + '\n\n' + bodyText;

  // 1. Classify Category
  let bestCategory = 'Other Activities';
  let maxCatScore = 0;
  const categoryThreshold = 2;

  for (const cat of FALLBACK_CATEGORIES) {
    let score = 0;
    for (const kw of cat.keywords) {
      const bodyCount = getTermScore(bodyText, kw.term);
      const titleCount = getTermScore(title, kw.term);
      score += (bodyCount * kw.weight) + (titleCount * kw.weight * 2);
    }
    if (score > maxCatScore && score >= categoryThreshold) {
      maxCatScore = score;
      bestCategory = cat.name;
    }
  }

  // 2. Classify Modules
  const moduleScores = [];
  const moduleThreshold = 3;

  for (const [moduleKey, mapping] of Object.entries(FALLBACK_MODULES)) {
    let score = 0;
    // Positive terms
    for (const kw of mapping.positive) {
      const bodyCount = getTermScore(bodyText, kw.term);
      const titleCount = getTermScore(title, kw.term);
      score += (bodyCount * kw.weight) + (titleCount * kw.weight * 2);
    }
    // Negative terms
    for (const kw of mapping.negative) {
      const bodyCount = getTermScore(bodyText, kw.term);
      const titleCount = getTermScore(title, kw.term);
      score -= (bodyCount * kw.weight) + (titleCount * kw.weight * 2);
    }

    if (score >= moduleThreshold) {
      moduleScores.push({ key: moduleKey, score });
    }
  }

  moduleScores.sort((a, b) => b.score - a.score);
  const selectedModules = moduleScores.slice(0, 2).map(m => m.key);

  return {
    category: bestCategory,
    modules: selectedModules
  };
}

// Helper: Classify using Gemini API
async function classifyWithGemini(title, bodyText, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const prompt = `You are an AI classifier for an academic website. Classify the following academic activity (title and body content) into one of the categories and match it to one or more relevant modules.

Categories:
- "Academic Lectures": Seminars, lectures, academic talks, colloquiums, presentation skills, scholarships (DAAD, GYSS, etc.).
- "Industry Adventures": Excursions, field trips, company/factory visits, guest speakers from industry.
- "Lab Works": Hands-on lab work, experimental training, operating specific instruments (SEM, XRD, TEM), characterization labs.
- "Other Activities": Any other activity that doesn't fit the above.

Modules (match only if the activity is directly relevant, max 2 modules):
- "continuum-mechanics": Continuum mechanics, stress, strain, elasticity, plasticity, tensor, finite element method (FEM)
- "engineering-ceramics": Ceramics, alumina, zirconia, carbides, nitrides, Scheffler/thermal barrier coatings
- "glass": Glass, silica, vitreous, amorphous materials, optical fibers
- "heat-treatment-of-materials": Heat treatment, annealing, quenching, tempering, hardening, metallography
- "inorganic-non-metallic-binders": Binders, cement, concrete, mortar, gypsum, AAC, visits/trainings at cement/binder companies (e.g., Knauf, Long An)
- "materials-characterization": Materials characterization, SEM, XRD, TEM, spectroscopy, diffraction, microscopy, characterization labs
- "mechanics-of-materials-and-fracture-mechanics": Fracture mechanics, fatigue, crack propagation, failure analysis, J-integral, stress intensity
- "metals": Metals, alloys, steel, titanium, aluminum, iron, casting, metallurgy, microstructure
- "micro-nano-fabrication-technology": Micro/nano fabrication, lithography, cleanroom processes, sputtering, etching, silicon wafers
- "polymers": Polymers, rubber, plastics, elastomers, resins, polymerization, polymer-matrix composites, visits to paper/packaging plants (e.g. Vina Kraft Paper)
- "powder-metallurgy-and-sintered-materials": Powder metallurgy, sintering, sintered materials, powder synthesis
- "research-lab-properties-testing-and-analytics": General testing of mechanical properties, research labs, analytics, SEM/XRD when used for general student lab work/training
- "solid-state-physics": Solid state physics, quantum mechanics, band structure, crystal structure, semiconductors, lattices
- "team-project": Team projects, group projects, collaborative studies, soft skills presentations

Activity Title: ${title}
Activity Content:
${bodyText}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          category: {
            type: "STRING",
            enum: ["Academic Lectures", "Industry Adventures", "Lab Works", "Other Activities"]
          },
          modules: {
            type: "ARRAY",
            items: {
              type: "STRING",
              enum: [
                "continuum-mechanics",
                "engineering-ceramics",
                "glass",
                "heat-treatment-of-materials",
                "inorganic-non-metallic-binders",
                "materials-characterization",
                "mechanics-of-materials-and-fracture-mechanics",
                "metals",
                "micro-nano-fabrication-technology",
                "polymers",
                "powder-metallurgy-and-sintered-materials",
                "research-lab-properties-testing-and-analytics",
                "solid-state-physics",
                "team-project"
              ]
            }
          }
        },
        required: ["category", "modules"]
      }
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText} (${response.status})`);
  }

  const json = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No response text returned from Gemini API");
  }

  const result = JSON.parse(text);
  if (result.modules && result.modules.length > 2) {
    result.modules = result.modules.slice(0, 2);
  }
  return result;
}

// Unified Classification Function (Gemini with weighted fallback)
async function classifyActivity(title, bodyText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      console.log(`Classifying "${title.substring(0, 50)}..." using Gemini AI...`);
      const result = await classifyWithGemini(title, bodyText, apiKey);
      console.log(`Gemini AI result: category="${result.category}", modules=[${result.modules.join(', ')}]`);
      return result;
    } catch (err) {
      console.warn('Gemini AI classification failed, using weighted fallback:', err.message);
    }
  } else {
    console.log('GEMINI_API_KEY not found in environment. Using weighted fallback...');
  }
  
  const result = classifyFallback(title, bodyText);
  console.log(`Weighted fallback result: category="${result.category}", modules=[${result.modules.join(', ')}]`);
  return result;
}

// Helper: Clear activity links from all module markdown files
function clearModuleLinks() {
  console.log('Clearing old activity links from all modules...');
  const files = fs.readdirSync(MODULES_DIR);
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const filePath = path.join(MODULES_DIR, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    const parts = content.split('---');
    if (parts.length < 3) continue;
    
    let frontmatter = parts[1];
    const rest = parts.slice(2).join('---');
    
    const lines = frontmatter.split('\n');
    const linksIndex = lines.findIndex(line => line.trim().startsWith('links:'));
    if (linksIndex !== -1) {
      const newLines = lines.slice(0, linksIndex);
      newLines.push('links: []');
      frontmatter = newLines.join('\n');
    } else {
      frontmatter += '\nlinks: []';
    }
    
    if (!frontmatter.endsWith('\n')) {
      frontmatter += '\n';
    }
    
    content = `---${frontmatter}---${rest}`;
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Cleared links in: ${file}`);
  }
}

// Helper: Rebuild all module links by processing existing markdown files
async function rebuildAllLinks() {
  console.log('\n--- Rebuilding All Activity Links ---');
  clearModuleLinks();
  
  const files = fs.readdirSync(OUTPUT_DIR);
  for (const file of files) {
    if (!file.endsWith('.md') || file === '00-template.md') continue;
    
    const filePath = path.join(OUTPUT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const parts = content.split('---');
    if (parts.length < 3) continue;
    
    const frontmatter = parts[1];
    const body = parts.slice(2).join('---').trim();
    
    const titleMatch = /title:\s*"([^"]+)"/.exec(frontmatter) || /title:\s*([^\n]+)/.exec(frontmatter);
    const dateMatch = /date:\s*"([^"]+)"/.exec(frontmatter) || /date:\s*([^\n]+)/.exec(frontmatter);
    
    if (!titleMatch) continue;
    const title = titleMatch[1].replace(/\\"/g, '"');
    const publishDate = dateMatch ? dateMatch[1] : '2026-05-19';
    
    console.log(`Re-classifying: "${title}"`);
    const classification = await classifyActivity(title, body);
    
    // Update the activity's category in the markdown file
    let updatedFrontmatter = frontmatter;
    const categoryMatch = /category:\s*"([^"]+)"/.exec(frontmatter) || /category:\s*([^\n]+)/.exec(frontmatter);
    if (categoryMatch) {
      updatedFrontmatter = frontmatter.replace(categoryMatch[0], `category: "${classification.category}"`);
    } else {
      updatedFrontmatter += `\ncategory: "${classification.category}"`;
    }
    
    if (!updatedFrontmatter.endsWith('\n')) {
      updatedFrontmatter += '\n';
    }
    
    fs.writeFileSync(filePath, `---${updatedFrontmatter}---${parts.slice(2).join('---')}`, 'utf-8');
    
    // Add links to respective modules
    const slug = file.replace('.md', '');
    for (const moduleName of classification.modules) {
      const moduleFileName = `${moduleName}.md`;
      const relativeActivityUrl = `/academic-activities/${slug}`;
      addLinkToModule(moduleFileName, title, relativeActivityUrl, `Activity from ${publishDate}`);
    }
  }
  console.log('--- Rebuild Complete ---\n');
}

// Helper: Add link to related modules
function addLinkToModule(moduleFileName, title, url, description) {
  const filePath = path.join(MODULES_DIR, moduleFileName);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const parts = content.split('---');
  if (parts.length < 3) return;
  
  let frontmatter = parts[1];
  const rest = parts.slice(2).join('---');
  
  if (frontmatter.includes(url)) {
    console.log(`Link ${url} already exists in module ${moduleFileName}`);
    return;
  }
  
  const escapedTitle = title.replace(/"/g, '\\"');
  const escapedDesc = description.replace(/"/g, '\\"');
  
  if (frontmatter.includes('links: []')) {
    frontmatter = frontmatter.replace('links: []', `links:\n  - title: "${escapedTitle}"\n    url: "${url}"\n    description: "${escapedDesc}"`);
  } else {
    const lines = frontmatter.split('\n');
    const linksIndex = lines.findIndex(line => line.trim().startsWith('links:'));
    if (linksIndex !== -1) {
      lines.splice(linksIndex + 1, 0, `  - title: "${escapedTitle}"`, `    url: "${url}"`, `    description: "${escapedDesc}"`);
      frontmatter = lines.join('\n');
    } else {
      frontmatter += `\nlinks:\n  - title: "${escapedTitle}"\n    url: "${url}"\n    description: "${escapedDesc}"`;
    }
  }
  
  if (!frontmatter.endsWith('\n')) {
    frontmatter += '\n';
  }
  
  content = `---${frontmatter}---${rest}`;
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Linked to module: ${moduleFileName}`);
}

// Helper: Download image using cookies
async function downloadImage(url, destName, cookieString, headers) {
  try {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    const fullUrl = url.startsWith('http') ? url : `https://vgu.edu.vn${url}`;
    
    const res = await fetch(fullUrl, {
      headers: {
        ...headers,
        'Cookie': cookieString
      }
    });
    
    if (!res.ok) {
      console.warn(`Failed to download image ${fullUrl}: ${res.statusText}`);
      return null;
    }
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const contentType = res.headers.get('content-type');
    let ext = 'jpg';
    if (contentType) {
      if (contentType.includes('png')) ext = 'png';
      else if (contentType.includes('gif')) ext = 'gif';
      else if (contentType.includes('webp')) ext = 'webp';
      else if (contentType.includes('jpeg')) ext = 'jpg';
    }
    
    const finalName = `${destName}.${ext}`;
    const filePath = path.join(IMAGES_DIR, finalName);
    fs.writeFileSync(filePath, buffer);
    console.log(`Downloaded image to ${filePath}`);
    return `/images/academic_activities/${finalName}`;
  } catch (err) {
    console.error(`Error downloading image ${url}:`, err);
    return null;
  }
}

async function main() {
  console.log('Starting VGU Academic Activities Scraper...');
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
  };

  try {
    // 1. Fetch main page to retrieve cookies
    console.log('1. Cookie handshake...');
    const res0 = await fetch(TARGET_URL, { headers });
    const setCookieHeaders = res0.headers.getSetCookie();
    const cookies = setCookieHeaders.map(c => c.split(';')[0]);
    const cookieString = cookies.join('; ');
    console.log('Cookies retrieved:', cookieString);

    // 2. Fetch main page HTML
    console.log('2. Fetching list page HTML...');
    const res1 = await fetch(TARGET_URL, {
      headers: {
        ...headers,
        'Cookie': cookieString
      }
    });
    const html = await res1.text();

    // 3. Extract mapBaiViet from page
    const mapBaiVietRegex = /mapBaiViet:\s*(\[[[\s\S]+?\]\s*,\s*|\[[\s\S]+?\])/g;
    const match = mapBaiVietRegex.exec(html);
    if (!match) {
      console.error('Could not find mapBaiViet list in page!');
      return;
    }
    
    let arrayText = match[1].trim();
    if (arrayText.endsWith(',')) {
      arrayText = arrayText.substring(0, arrayText.length - 1).trim();
    }
    
    // Evaluate the array safely (since it's raw JS formatting)
    // We replace escaped unicodes first to prevent parse issues
    const cleanedArrayText = arrayText.replace(/\\u([0-9a-fA-F]{4})/g, (m, grp) => String.fromCharCode(parseInt(grp, 16)));
    // We can evaluate it by wrapping in JSON-like structure or using a Function evaluator since it's an array literal
    const mapBaiViet = new Function(`return ${cleanedArrayText}`)();
    console.log(`Successfully parsed ${mapBaiViet.length} activities from list page.`);

    // 4. Load cache
    let cache = [];
    if (fs.existsSync(CACHE_FILE)) {
      try {
        cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      } catch (err) {
        console.warn('Failed to parse cache, starting fresh:', err);
      }
    }
    console.log(`Cache has ${cache.length} processed articles.`);

    // Find JSF/PrimeFaces form configurations for A3331:frm
    const formStart = html.indexOf('id="A3331:frm"');
    if (formStart === -1) {
      console.error('Form A3331:frm not found on page!');
      return;
    }
    const formEnd = html.indexOf('</form>', formStart);
    const formHtml = html.substring(formStart, formEnd);

    // Get ViewState
    const viewStateMatch = /name="javax\.faces\.ViewState"\s+id="[^"]*"\s+value="([^"]+)"/.exec(formHtml) ||
                           /name="javax\.faces\.ViewState"\s+value="([^"]+)"/.exec(formHtml);
    if (!viewStateMatch) {
      console.error('ViewState not found inside A3331:frm!');
      return;
    }
    const viewState = viewStateMatch[1];
    console.log('ViewState for A3331:frm:', viewState);

    // Get encoded URL
    const encodedUrlMatch = /name="javax\.faces\.encodedURL"\s+value="([^"]+)"/.exec(formHtml);
    if (!encodedUrlMatch) {
      console.error('javax.faces.encodedURL not found inside A3331:frm!');
      return;
    }
    const encodedUrlVal = encodedUrlMatch[1].replace(/&amp;/g, '&');
    console.log('javax.faces.encodedURL value:', encodedUrlVal);

    // Extract PrimeFaces Ajax details
    const preciseMatch = /rmXemChiTiet_(CmsHienThiBaiViet_WAR_cmsportlet_INSTANCE_[a-zA-Z0-9_]+)=function\(a,b\)\{PrimeFaces\.ab\(\{s:"([^"]+)",f:"([^"]+)",[^}]+u:"([^"]+)"/.exec(html);
    if (!preciseMatch) {
      console.error('Could not find PrimeFaces.ab config for CmsHienThiBaiViet.');
      return;
    }
    const sourceId = preciseMatch[2];
    const formId = preciseMatch[3];
    const renderId = preciseMatch[4];
    console.log(`Ajax configs: sourceId="${sourceId}", formId="${formId}", renderId="${renderId}"`);

    // 5. Process new items (starting with oldest or just in order of list)
    // Note: We reverse the array to process older items first so that newer items are written/processed last (better chronologically)
    const reversedList = [...mapBaiViet].reverse();
    
    for (const item of reversedList) {
      const ja_id = String(item.ja_id);
      if (cache.includes(ja_id)) {
        console.log(`Skipping cached article ${ja_id}: ${item.context.tieude}`);
        continue;
      }

      console.log(`\nProcessing new article: [${ja_id}] "${item.context.tieude}"`);

      // Call AJAX POST for details
      const bodyParams = new URLSearchParams();
      bodyParams.append('javax.faces.partial.ajax', 'true');
      bodyParams.append('javax.faces.source', sourceId);
      bodyParams.append('javax.faces.partial.execute', sourceId);
      bodyParams.append('javax.faces.partial.render', renderId);
      bodyParams.append(sourceId, sourceId);
      bodyParams.append(`${sourceId}_ja_id`, ja_id);
      bodyParams.append(`${sourceId}_pagesdown`, '0');
      bodyParams.append(formId, formId);
      bodyParams.append('javax.faces.encodedURL', encodedUrlVal);
      bodyParams.append('javax.faces.ViewState', viewState);

      const postHeaders = {
        ...headers,
        'Cookie': cookieString,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Faces-Request': 'partial/ajax',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://vgu.edu.vn',
        'Referer': TARGET_URL,
      };

      const detailRes = await fetch(encodedUrlVal, {
        method: 'POST',
        headers: postHeaders,
        body: bodyParams.toString()
      });

      if (!detailRes.ok) {
        console.error(`Failed to fetch details for ${ja_id}: ${detailRes.statusText}`);
        continue;
      }

      const xmlResponse = await detailRes.text();
      
      // Extract CDATA
      const updateRegex = /<update id="[^"]+"><!\[CDATA\[([\s\S]*?)\]\]><\/update>/;
      const updateMatch = updateRegex.exec(xmlResponse);
      if (!updateMatch) {
        console.error(`No CDATA update found in detail response for ${ja_id}`);
        continue;
      }

      const detailHtml = updateMatch[1];
      
      // Extract the htbvct JSON variable
      const htbvctRegex = /data:\s*\{\s*'htbvct'\s*:\s*(\{[\s\S]+?\})\s*\}/;
      const htbvctMatch = htbvctRegex.exec(detailHtml);
      if (!htbvctMatch) {
        console.error(`Could not find htbvct JSON details in HTML for ${ja_id}`);
        continue;
      }

      const rawJson = htbvctMatch[1].trim();
      let details;
      try {
        details = new Function(`return ${rawJson}`)();
      } catch (err) {
        console.error(`Failed to parse htbvct JSON for ${ja_id}:`, err);
        continue;
      }

      const title = details.tieude;
      const publishDate = details.ngayxuatban || '2026-05-19';
      const slug = slugify(title);
      console.log(`Extracted metadata: title="${title}", date="${publishDate}", slug="${slug}"`);

      // Download Cover Image
      let coverImgPath = '/images/academic_activities/placeholder-cover.jpg';
      if (details.imghinhdaidien) {
        const coverDownload = await downloadImage(details.imghinhdaidien, `${slug}-cover`, cookieString, headers);
        if (coverDownload) {
          coverImgPath = coverDownload;
        }
      }

      // Extract and Download Inline Images in Content Body
      let bodyHtml = details.txtnoidung || '';
      const inlineImgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
      let inlineIdx = 1;
      let matchImg;
      const processedSrcs = {}; // prevent downloading duplicates in same post

      // We need a non-exec loop because we'll replace matches. We can find all matches first.
      const imgSrcMatches = [];
      while ((matchImg = inlineImgRegex.exec(bodyHtml)) !== null) {
        imgSrcMatches.push(matchImg[1]);
      }

      for (const rawSrc of imgSrcMatches) {
        if (processedSrcs[rawSrc]) continue;

        // Strip HTML entity encodings if any
        const cleanSrc = rawSrc.replace(/&amp;/g, '&');
        console.log(`Downloading body image: ${cleanSrc}`);

        const localPath = await downloadImage(cleanSrc, `${slug}-img-${inlineIdx}`, cookieString, headers);
        if (localPath) {
          processedSrcs[rawSrc] = localPath;
          inlineIdx++;
        }
      }

      // Replace URLs in body HTML
      for (const [remote, local] of Object.entries(processedSrcs)) {
        bodyHtml = bodyHtml.replaceAll(remote, local);
      }

      // Convert Body to Markdown
      const markdownBody = htmlToMarkdown(bodyHtml);

      // Classify category and get related modules
      const classification = await classifyActivity(title, markdownBody);

      // Build SEO-friendly description (fallback if summary is empty)
      let description = details.txtnoidungtomtat || '';
      if (!description) {
        // Grab first ~150 chars of text body
        const plainText = markdownBody.replace(/[#*`_\[\]()\-]/g, ' ').replace(/\s+/g, ' ').trim();
        description = plainText.substring(0, 150);
        if (plainText.length > 150) description += '...';
      }
      description = description.replace(/"/g, '\\"').replace(/\n/g, ' ').trim();

      // Write Markdown file
      const finalMarkdownContent = `---
title: "${title.replace(/"/g, '\\"')}"
category: "${classification.category}"
date: "${publishDate}"
image: "${coverImgPath}"
description: "${description}"
---

# ${title}

${markdownBody}
`;

      const outputFilePath = path.join(OUTPUT_DIR, `${slug}.md`);
      fs.writeFileSync(outputFilePath, finalMarkdownContent, 'utf-8');
      console.log(`Saved Markdown file to ${outputFilePath}`);

      // Update Cache
      cache.push(ja_id);
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
      console.log(`Updated cache file with article ${ja_id}`);
    }

    console.log('\nScraping job completed successfully.');
    
    // Rebuild all module links to ensure complete consistency
    await rebuildAllLinks();
  } catch (err) {
    console.error('An error occurred during crawling:', err);
  }
}

main();
