const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles');
const additions = [
  { slug: 'sora-complete-tutorial-2026', src: '/images/sora-homepage.png', alt: 'OpenAI Sora AI视频生成器界面截图' },
  { slug: 'jianying-ai-features-tutorial', src: '/images/capcut-homepage.png', alt: '剪映CapCut AI视频编辑界面截图' },
  { slug: 'veedio-tutorial-2026', src: '/images/veed-homepage.png', alt: 'Veed.io AI视频编辑界面截图' },
  // { slug: 'luma-dream-machine-tutorial', src: '/images/luma-homepage.png', alt: 'Luma Dream Machine' },
];

additions.forEach(({ slug, src, alt }) => {
  const filepath = path.join(articlesDir, `${slug}.html`);
  if (!fs.existsSync(filepath)) return;
  let html = fs.readFileSync(filepath, 'utf8');
  const img = `\n<img src="${src}" alt="${alt}" class="banner-img" loading="lazy" width="800" height="300">`;

  // Insert after h1
  const h1End = html.indexOf('</h1>');
  if (h1End > -1) {
    html = html.slice(0, h1End + 5) + img + html.slice(h1End + 5);
    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`✅ ${slug}.html`);
  }
});
console.log('Done');
