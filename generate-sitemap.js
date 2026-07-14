const fs = require('fs');
const path = require('path');

const siteUrl = 'https://hxqsmj.ccwu.cc';
const articlesDir = path.join(__dirname, 'articles');

// Root pages
const urls = [
  { loc: '/', lastmod: '2026-07-14', priority: '1.0' },
  { loc: '/top10', lastmod: '2026-07-14', priority: '0.9' },
  { loc: '/free-text-to-video', lastmod: '2026-07-14', priority: '0.8' },
  { loc: '/comparison', lastmod: '2026-07-14', priority: '0.8' },
  { loc: '/tutorial', lastmod: '2026-07-14', priority: '0.8' },
  { loc: '/free-ai-avatar-video', lastmod: '2026-07-14', priority: '0.7' },
  { loc: '/free-ai-video-translate', lastmod: '2026-07-14', priority: '0.7' },
  { loc: '/resources', lastmod: '2026-07-14', priority: '0.6' },
  { loc: '/about', lastmod: '2026-07-14', priority: '0.5' },
  { loc: '/privacy', lastmod: '2026-07-14', priority: '0.5' },
];

// Add all articles - extract date from JSON-LD if available
const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));
articleFiles.forEach(filename => {
  const filepath = path.join(articlesDir, filename);
  const slug = filename.replace('.html', '');
  const html = fs.readFileSync(filepath, 'utf8');

  // Try to extract datePublished from JSON-LD
  let lastmod = '2026-07-14';
  const dateMatch = html.match(/"datePublished":\s*"([^"]+)"/);
  if (dateMatch) lastmod = dateMatch[1];

  // Determine priority based on content freshness
  let priority = '0.8';
  if (lastmod >= '2026-07-14') priority = '0.85';
  else if (lastmod >= '2026-07-12') priority = '0.82';
  else if (lastmod >= '2026-07-10') priority = '0.80';
  else if (lastmod >= '2026-07-06') priority = '0.78';
  else priority = '0.75';

  urls.push({ loc: `/articles/${slug}`, lastmod, priority });
});

// Generate XML
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

urls.forEach(u => {
  xml += `<url><loc>${siteUrl}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>\n`;
});

xml += '</urlset>';

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml, 'utf8');
console.log(`✅ sitemap.xml generated with ${urls.length} URLs`);
