import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://msi.vgu.edu.vn';
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const CONTENT_DIR = path.join(process.cwd(), 'content');

// Function to format date to YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Get last modified date of a file or fallback to now
function getFileMtime(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return formatDate(stats.mtime);
  } catch (e) {
    return formatDate(new Date());
  }
}

// Generate sitemap structure
async function generateSitemap() {
  const urls = [];

  // 1. Root-level pages in content/
  const files = fs.readdirSync(CONTENT_DIR);
  const staticPages = [];
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const slug = file.replace('.md', '');
      staticPages.push(slug);
    }
  }

  for (const page of staticPages) {
    const isHome = page === 'index';
    const pathSegment = isHome ? '' : `/${page}`;
    const enFile = path.join(CONTENT_DIR, `${page}.md`);
    const viFile = path.join(CONTENT_DIR, 'vi', `${page}.md`);

    const hasEn = fs.existsSync(enFile);
    const hasVi = fs.existsSync(viFile);

    const mtimeEn = getFileMtime(enFile);
    const mtimeVi = getFileMtime(viFile);
    const lastmod = hasEn ? mtimeEn : mtimeVi;

    const alternates = [];
    if (hasEn) alternates.push({ lang: 'en', url: `${BASE_URL}${pathSegment}` });
    if (hasVi) alternates.push({ lang: 'vi', url: `${BASE_URL}/vi${pathSegment}` });
    if (hasEn) alternates.push({ lang: 'x-default', url: `${BASE_URL}${pathSegment}` });

    // Add English URL if it exists
    if (hasEn) {
      urls.push({
        loc: `${BASE_URL}${pathSegment}`,
        lastmod,
        changefreq: 'weekly',
        priority: isHome ? '1.0' : '0.8',
        alternates
      });
    }

    // Add Vietnamese URL if it exists
    if (hasVi) {
      urls.push({
        loc: `${BASE_URL}/vi${pathSegment}`,
        lastmod,
        changefreq: 'weekly',
        priority: isHome ? '1.0' : '0.8',
        alternates
      });
    }
  }

  // 2. Dynamic activities in content/_activities/
  const activitiesDir = path.join(CONTENT_DIR, '_activities');
  if (fs.existsSync(activitiesDir)) {
    const activityFiles = fs.readdirSync(activitiesDir);
    for (const file of activityFiles) {
      if (file.endsWith('.md') && !file.startsWith('00-template')) {
        const slug = file.replace('.md', '');
        const activityFile = path.join(activitiesDir, file);
        const lastmod = getFileMtime(activityFile);

        const alternates = [
          { lang: 'en', url: `${BASE_URL}/academic-activities/${slug}` },
          { lang: 'vi', url: `${BASE_URL}/vi/academic-activities/${slug}` },
          { lang: 'x-default', url: `${BASE_URL}/academic-activities/${slug}` }
        ];

        // Add English
        urls.push({
          loc: `${BASE_URL}/academic-activities/${slug}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.6',
          alternates
        });

        // Add Vietnamese
        urls.push({
          loc: `${BASE_URL}/vi/academic-activities/${slug}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.6',
          alternates
        });
      }
    }
  }

  // Build the XML content
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const url of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    
    for (const alt of url.alternates) {
      xml += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.url}" />\n`;
    }
    
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';

  // Write to public/sitemap.xml
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`Successfully generated sitemap.xml with ${urls.length} entries at ${sitemapPath}`);
}

generateSitemap().catch(console.error);
