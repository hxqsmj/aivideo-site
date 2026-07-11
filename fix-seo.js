const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));

const ogImageUrl = 'https://hxqsmj.ccwu.cc/images/og-image.svg';

files.forEach(filename => {
  const filepath = path.join(articlesDir, filename);
  let html = fs.readFileSync(filepath, 'utf8');

  // Extract meta info
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const desc = descMatch ? descMatch[1] : '';

  // Build clean URL (no .html)
  const slug = filename.replace('.html', '');
  const cleanUrl = `https://hxqsmj.ccwu.cc/articles/${slug}`;

  // Fix canonical URL (remove .html)
  html = html.replace(
    /<link rel="canonical" href="[^"]*\.html"/g,
    `<link rel="canonical" href="${cleanUrl}"`
  );

  // Fix hreflang URL (remove .html)
  html = html.replace(
    /<link rel="alternate" hreflang="zh-CN" href="[^"]*\.html"/g,
    `<link rel="alternate" hreflang="zh-CN" href="${cleanUrl}"`
  );

  // Build OG + Twitter Card block
  const ogBlock = `
<!-- Open Graph -->
<meta property="og:type" content="article">
<meta property="og:site_name" content="AI视频生成器推荐">
<meta property="og:title" content="${escHtml(title)}">
<meta property="og:description" content="${escHtml(desc)}">
<meta property="og:url" content="${cleanUrl}">
<meta property="og:image" content="${ogImageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="zh_CN">
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escHtml(title)}">
<meta name="twitter:description" content="${escHtml(desc)}">
<meta name="twitter:image" content="${ogImageUrl}">`;

  // Remove existing OG/Twitter blocks (various forms)
  html = html.replace(/<!-- Open Graph & Twitter Card -->[\s\S]*?(?=<link rel="stylesheet|<script type="application\/ld\+json"|<\/head>)/g, '');
  html = html.replace(/<meta property="og:[^>]*>\s*/g, '');
  html = html.replace(/<meta name="twitter:[^>]*>\s*/g, '');

  // Insert OG block before the first <link rel="stylesheet" or before JSON-LD
  if (html.includes('<link rel="stylesheet" href="/css/style.css">')) {
    html = html.replace(
      '<link rel="stylesheet" href="/css/style.css">',
      ogBlock + '\n<link rel="stylesheet" href="/css/style.css">'
    );
  }

  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`✅ ${filename}`);
});

// Also fix canonical/hreflang in non-article pages
const rootPages = [
  'index.html', 'top10.html', 'free-text-to-video.html', 'comparison.html',
  'tutorial.html', 'free-ai-avatar-video.html', 'free-ai-video-translate.html',
  'resources.html', 'about.html', 'privacy.html', '404.html'
];

rootPages.forEach(filename => {
  const filepath = path.join(__dirname, filename);
  if (!fs.existsSync(filepath)) return;
  let html = fs.readFileSync(filepath, 'utf8');

  const slug = filename.replace('.html', '');
  const isIndex = filename === 'index.html';
  const cleanUrl = isIndex ? 'https://hxqsmj.ccwu.cc/' : `https://hxqsmj.ccwu.cc/${slug}`;

  // Fix canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/g,
    `<link rel="canonical" href="${cleanUrl}"`
  );

  // Fix hreflang
  html = html.replace(
    /<link rel="alternate" hreflang="zh-CN" href="[^"]*"/g,
    `<link rel="alternate" hreflang="zh-CN" href="${cleanUrl}"`
  );

  // Fix og:url
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/g,
    `<meta property="og:url" content="${cleanUrl}"`
  );

  // Add og:image if missing
  if (!html.includes('og:image')) {
    html = html.replace(
      '<meta property="og:url"',
      `<meta property="og:image" content="${ogImageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url"`
    );
  }

  // Add Twitter Card if missing on pages that have OG
  if (html.includes('og:title') && !html.includes('twitter:card')) {
    const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]*)"/);
    const ogDescMatch = html.match(/<meta property="og:description" content="([^"]*)"/);
    const twBlock = `
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${ogTitleMatch ? ogTitleMatch[1] : ''}">
<meta name="twitter:description" content="${ogDescMatch ? ogDescMatch[1] : ''}">
<meta name="twitter:image" content="${ogImageUrl}">`;

    html = html.replace('</head>', twBlock + '\n</head>');
  }

  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`✅ ${filename}`);
});

// Fix sitemap.xml - remove .html from article URLs
const sitemapPath = path.join(__dirname, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
sitemap = sitemap.replace(/<loc>https:\/\/hxqsmj\.ccwu\.cc\/articles\/([^<]+)\.html<\/loc>/g,
  '<loc>https://hxqsmj.ccwu.cc/articles/$1</loc>');
sitemap = sitemap.replace(/<loc>https:\/\/hxqsmj\.ccwu\.cc\/([^<]+)\.html<\/loc>/g,
  '<loc>https://hxqsmj.ccwu.cc/$1</loc>');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log('✅ sitemap.xml');

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

console.log('\n🎉 All done!');
