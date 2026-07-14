const fs = require('fs');
const path = require('path');

// Pages to update
const rootPages = [
  'index.html', 'top10.html', 'free-text-to-video.html', 'comparison.html',
  'tutorial.html', 'free-ai-avatar-video.html', 'free-ai-video-translate.html',
  'resources.html', 'about.html', 'privacy.html'
];

const articlesDir = path.join(__dirname, 'articles');
const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== 1. Update root page titles and add verification meta =====
rootPages.forEach(filename => {
  const filepath = path.join(__dirname, filename);
  if (!fs.existsSync(filepath)) return;
  let html = fs.readFileSync(filepath, 'utf8');

  // Add verification meta before </head>
  const verifMeta = `  <meta name="google-site-verification" content="GOOGLE_VERIFICATION_CODE" />
    <meta name="baidu-site-verification" content="codeva-BAIDU_VERIFICATION_CODE" />`;

  html = html.replace('</head>', verifMeta + '\n</head>');

  // Update title format - add site name suffix
  const isIndex = filename === 'index.html';
  if (!isIndex) {
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
    if (titleMatch) {
      const oldTitle = titleMatch[1].trim();
      if (!oldTitle.includes('AI视频生成器推荐') && !oldTitle.includes('404')) {
        const newTitle = `${oldTitle} - AI视频生成器推荐2026`;
        html = html.replace(`<title>${escHtml(oldTitle)}</title>`, `<title>${escHtml(newTitle)}</title>`);
        // Also update OG title
        html = html.replace(
          `<meta property="og:title" content="${escHtml(oldTitle)}"`,
          `<meta property="og:title" content="${escHtml(newTitle)}"`
        );
        // Update Twitter title
        html = html.replace(
          `<meta name="twitter:title" content="${escHtml(oldTitle)}"`,
          `<meta name="twitter:title" content="${escHtml(newTitle)}"`
        );
      }
    }
  }

  // Add meta keywords if missing
  if (!html.includes('name="keywords"')) {
    const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
    const desc = descMatch ? descMatch[1] : '';
    const kw = desc.split('，').slice(0, 8).join(',') + ',AI视频生成器,AI视频工具';
    html = html.replace(
      '<meta name="description"',
      `<meta name="keywords" content="${escHtml(kw)}" />\n    <meta name="description"`
    );
  }

  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`✅ ${filename}`);
});

// ===== 2. Update article page titles =====
articleFiles.forEach(filename => {
  const filepath = path.join(articlesDir, filename);
  let html = fs.readFileSync(filepath, 'utf8');

  // Add verification meta if missing
  if (!html.includes('google-site-verification')) {
    const verifMeta = `  <meta name="google-site-verification" content="GOOGLE_VERIFICATION_CODE" />
    <meta name="baidu-site-verification" content="codeva-BAIDU_VERIFICATION_CODE" />`;
    html = html.replace('</head>', verifMeta + '\n</head>');
  }

  // Update title format
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  if (titleMatch) {
    const oldTitle = titleMatch[1].trim();
    if (!oldTitle.includes('AI视频生成器推荐')) {
      const newTitle = `${oldTitle} - AI视频生成器推荐2026`;
      html = html.replace(
        `<title>${escHtml(oldTitle)}</title>`,
        `<title>${escHtml(newTitle)}</title>`
      );
      // Update OG title
      html = html.replace(
        `<meta property="og:title" content="${escHtml(oldTitle)}"`,
        `<meta property="og:title" content="${escHtml(newTitle)}"`
      );
      // Update Twitter title
      html = html.replace(
        `<meta name="twitter:title" content="${escHtml(oldTitle)}"`,
        `<meta name="twitter:title" content="${escHtml(newTitle)}"`
      );
    }
  }

  // Add meta keywords if missing
  if (!html.includes('name="keywords"')) {
    const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
    const desc = descMatch ? descMatch[1] : '';
    const titleMatch2 = html.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleMatch2 ? titleMatch2[1] : '';
    const kw = (title.replace(/[—\-].*/, '').trim() || desc.split('，')[0] || '') + ',AI视频教程,AI视频工具,免费AI视频生成器';
    html = html.replace(
      '<meta name="description"',
      `<meta name="keywords" content="${escHtml(kw)}" />\n    <meta name="description"`
    );
  }

  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`📄 articles/${filename}`);
});

console.log('\n🎉 All pages updated!');
