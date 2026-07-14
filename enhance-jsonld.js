const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));

const ogImageUrl = 'https://hxqsmj.ccwu.cc/images/og-image.svg';

files.forEach(filename => {
  const filepath = path.join(articlesDir, filename);
  let html = fs.readFileSync(filepath, 'utf8');

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const desc = descMatch ? descMatch[1] : '';
  const slug = filename.replace('.html', '');
  const cleanUrl = `https://hxqsmj.ccwu.cc/articles/${slug}`;

  // Extract date info from meta or filename
  let datePub = '2026-07-06';
  const dateMatch = html.match(/"datePublished":\s*"([^"]+)"/);
  if (dateMatch) datePub = dateMatch[1];

  // Build rich JSON-LD
  const richLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": desc,
    "image": ogImageUrl,
    "datePublished": datePub,
    "dateModified": datePub,
    "author": {
      "@type": "Organization",
      "name": "AI视频生成器推荐",
      "url": "https://hxqsmj.ccwu.cc/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI视频生成器推荐",
      "url": "https://hxqsmj.ccwu.cc/"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": cleanUrl
    },
    "keywords": title.replace(/[—\-].*/, '').trim() + ',AI视频,AI工具,视频生成'
  };

  const ldStr = JSON.stringify(richLd, null, 2);

  // Replace existing JSON-LD block
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${ldStr}\n</script>`
  );

  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`✅ ${filename}`);
});

console.log('\n🎉 All articles enhanced!');
