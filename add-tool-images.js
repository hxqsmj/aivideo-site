const fs = require('fs');
const path = require('path');

// Map tool screenshots to articles
const toolImages = {
  'runway-tutorial': { src: '/images/runway-homepage.png', alt: 'Runway Gen-4 AI视频生成器界面截图' },
  'pika-tutorial': { src: '/images/pika-homepage.png', alt: 'Pika 2.0 AI视频生成器界面截图' },
  'kling-2-tutorial': { src: '/images/kling-homepage.png', alt: 'Kling 2.0可灵AI视频生成器界面截图' },
  'kling-tutorial-complete': { src: '/images/kling-homepage.png', alt: 'Kling可灵AI视频生成器界面截图' },
  'sora-complete-tutorial-2026': { src: '/images/sora-homepage.png', alt: 'OpenAI Sora AI视频生成器界面截图' },
  'sora-review-2026': { src: '/images/sora-homepage.png', alt: 'OpenAI Sora AI视频生成器界面截图' },
  'sora-alternatives-free': { src: '/images/sora-homepage.png', alt: 'OpenAI Sora界面截图' },
  'capcut-homepage': { src: '/images/capcut-homepage.png', alt: '剪映CapCut AI视频编辑界面截图' },
  'jianying-ai-features-tutorial': { src: '/images/capcut-homepage.png', alt: '剪映CapCut AI视频编辑界面截图' },
  'veedio-tutorial-2026': { src: '/images/veed-homepage.png', alt: 'Veed.io AI视频编辑界面截图' },
  'free-ai-video-editing-tools': { src: '/images/capcut-homepage.png', alt: 'AI视频剪辑工具界面截图' },
  'runway-vs-pika-vs-kling': { src: '/images/runway-homepage.png', alt: 'Runway vs Pika vs Kling AI视频工具对比' },
};

const articlesDir = path.join(__dirname, 'articles');

Object.entries(toolImages).forEach(([slug, img]) => {
  const filepath = path.join(articlesDir, `${slug}.html`);
  if (!fs.existsSync(filepath)) return;

  let html = fs.readFileSync(filepath, 'utf8');
  const imgHtml = `\n<img src="${img.src}" alt="${img.alt}" class="banner-img" loading="lazy" width="800" height="300">`;

  // Insert after the h1/meta paragraph (after the first <p class="meta">)
  const metaMatch = html.match(/<p class="meta">.*?<\/p>/);
  if (metaMatch) {
    const idx = html.indexOf(metaMatch[0]) + metaMatch[0].length;
    html = html.slice(0, idx) + imgHtml + html.slice(idx);
    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`✅ ${slug}.html`);
  }
});

console.log('\n🎉 Done!');
