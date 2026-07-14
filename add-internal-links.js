const fs = require('fs');
const path = require('path');

// Define article categories and related articles
const relatedMap = {
  'sora-complete-tutorial-2026': ['sora-review-2026', 'ai-text-to-video-tools-recommendation-2026', 'sora-alternatives-free', 'ai-video-generator-comparison-2026'],
  'sora-review-2026': ['sora-complete-tutorial-2026', 'ai-text-to-video-tools-recommendation-2026', 'ai-video-generator-comparison-2026'],
  'sora-alternatives-free': ['sora-complete-tutorial-2026', 'hailuo-ai-free-video', 'free-ai-text-to-video-tools-2026', 'ai-text-to-video-tools-recommendation-2026'],
  'invideo-ai-tutorial-2026': ['pictory-ai-tutorial-2026', 'veedio-tutorial-2026', 'ai-video-editing-tools-2026', 'free-ai-video-editing-tools'],
  'pictory-ai-tutorial-2026': ['invideo-ai-tutorial-2026', 'veedio-tutorial-2026', 'ai-video-editing-tools-2026', 'free-ai-video-editing-tools'],
  'veedio-tutorial-2026': ['invideo-ai-tutorial-2026', 'pictory-ai-tutorial-2026', 'ai-video-editing-tools-2026'],
  'jianying-ai-features-tutorial': ['ai-video-dubbing-tools-2026', 'ai-video-subtitle-tools-2026', 'ai-short-video-tutorial-2026'],
  'viddyoze-tutorial-2026': ['invideo-ai-tutorial-2026', 'ai-video-editing-tools-2026', 'ai-video-tool-buying-guide-2026'],
  'kling-2-tutorial': ['kling-tutorial-complete', 'ai-text-to-video-tools-recommendation-2026', 'runway-vs-pika-vs-kling', 'ai-video-generator-comparison-2026'],
  'kling-tutorial-complete': ['kling-2-tutorial', 'ai-text-to-video-tools-recommendation-2026', 'runway-vs-pika-vs-kling'],
  'runway-tutorial': ['pika-tutorial', 'runway-vs-pika-vs-kling', 'ai-video-generator-comparison-2026', 'ai-animation-video-tools-2026'],
  'pika-tutorial': ['runway-tutorial', 'runway-vs-pika-vs-kling', 'ai-animation-video-tools-2026', 'ai-video-generator-comparison-2026'],
  'runway-vs-pika-vs-kling': ['runway-tutorial', 'pika-tutorial', 'kling-2-tutorial', 'ai-video-generator-comparison-2026', 'ai-video-tool-buying-guide-2026'],
  'luma-dream-machine-tutorial': ['ai-text-to-video-tools-recommendation-2026', 'ai-video-generator-comparison-2026'],
  'hailuo-ai-free-video': ['free-ai-text-to-video-tools-2026', 'ai-text-to-video-tools-recommendation-2026', 'sora-alternatives-free', 'how-to-make-ai-video-free'],
  'ai-text-to-video-tools-recommendation-2026': ['ai-video-generator-comparison-2026', 'free-ai-text-to-video-tools-2026', 'ai-video-tool-buying-guide-2026', 'sora-complete-tutorial-2026'],
  'free-ai-text-to-video-tools-2026': ['ai-text-to-video-tools-recommendation-2026', 'ai-video-generator-comparison-2026', 'hailuo-ai-free-video', 'how-to-make-ai-video-free'],
  'ai-video-generator-comparison-2026': ['ai-text-to-video-tools-recommendation-2026', 'ai-video-tool-buying-guide-2026', 'free-ai-text-to-video-tools-2026', 'sora-complete-tutorial-2026'],
  'ai-animation-video-tools-2026': ['ai-text-to-video-tools-recommendation-2026', 'runway-tutorial', 'pika-tutorial', 'ai-video-generator-comparison-2026'],
  'ai-video-enhancement-tools-2026': ['ai-video-editing-tools-2026', 'ai-video-dubbing-tools-2026', 'ai-video-subtitle-tools-2026', 'free-ai-video-editing-tools'],
  'ai-video-subtitle-tools-2026': ['ai-video-dubbing-tools-2026', 'ai-video-enhancement-tools-2026', 'jianying-ai-features-tutorial', 'ai-video-editing-tools-2026'],
  'ai-video-dubbing-tools-2026': ['ai-video-subtitle-tools-2026', 'ai-video-enhancement-tools-2026', 'jianying-ai-features-tutorial', 'ai-video-editing-tools-2026'],
  'ai-video-script-writer-tools-2026': ['ai-short-video-tutorial-2026', 'ai-video-tool-buying-guide-2026', 'ai-youtube-video-automation', 'ai-video-ads-ecommerce'],
  'ai-video-background-remover-tools-2026': ['ai-video-editing-tools-2026', 'ai-video-enhancement-tools-2026', 'jianying-ai-features-tutorial', 'free-ai-video-editing-tools'],
  'ai-short-video-tutorial-2026': ['ai-video-script-writer-tools-2026', 'ai-youtube-video-automation', 'ai-video-money-making', 'how-to-make-ai-video-free'],
  'ai-ecommerce-video-ads-batch-2026': ['ai-video-ads-ecommerce', 'ai-short-video-tutorial-2026', 'ai-youtube-video-automation', 'ai-video-money-making'],
  'ai-video-ads-ecommerce': ['ai-ecommerce-video-ads-batch-2026', 'ai-short-video-tutorial-2026', 'ai-youtube-video-automation', 'ai-video-script-writer-tools-2026'],
  'ai-youtube-video-automation': ['ai-short-video-tutorial-2026', 'ai-video-money-making', 'ai-video-script-writer-tools-2026', 'ai-ecommerce-video-ads-batch-2026'],
  'ai-video-tool-buying-guide-2026': ['ai-video-generator-comparison-2026', 'ai-text-to-video-tools-recommendation-2026', 'free-ai-text-to-video-tools-2026', 'sora-complete-tutorial-2026'],
  'ai-video-money-making': ['ai-youtube-video-automation', 'ai-short-video-tutorial-2026', 'ai-video-ads-ecommerce', 'ai-ecommerce-video-ads-batch-2026'],
  'ai-video-prompt-examples': ['ai-text-to-video-tools-recommendation-2026', 'sora-complete-tutorial-2026', 'ai-video-generator-comparison-2026', 'ai-animation-video-tools-2026'],
  'ai-avatar-video-tools-2026': ['ai-video-dubbing-tools-2026', 'ai-video-editing-tools-2026', 'free-ai-video-editing-tools'],
  'ai-video-translation-tools': ['ai-video-dubbing-tools-2026', 'ai-video-subtitle-tools-2026', 'ai-video-editing-tools-2026'],
  'ai-video-editing-tools-2026': ['ai-video-enhancement-tools-2026', 'free-ai-video-editing-tools', 'jianying-ai-features-tutorial', 'ai-video-subtitle-tools-2026'],
  'free-ai-video-editing-tools': ['ai-video-editing-tools-2026', 'ai-video-enhancement-tools-2026', 'jianying-ai-features-tutorial', 'ai-video-subtitle-tools-2026'],
  'how-to-make-ai-video-free': ['hailuo-ai-free-video', 'free-ai-text-to-video-tools-2026', 'ai-text-to-video-tools-recommendation-2026', 'ai-video-tool-buying-guide-2026'],
  'open-source-ai-video-generators': ['free-ai-text-to-video-tools-2026', 'ai-video-generator-comparison-2026', 'ai-video-tool-buying-guide-2026'],
};

// Friendly title mapping
const titleMap = {
  'sora-complete-tutorial-2026': 'Sora AI完整使用教程',
  'sora-review-2026': 'Sora 2026年完整评测',
  'sora-alternatives-free': '免费Sora替代工具推荐',
  'invideo-ai-tutorial-2026': 'InVideo AI教程',
  'pictory-ai-tutorial-2026': 'Pictory AI教程',
  'veedio-tutorial-2026': 'Veed.io教程',
  'jianying-ai-features-tutorial': '剪映AI功能全教程',
  'viddyoze-tutorial-2026': 'Viddyoze教程',
  'kling-2-tutorial': 'Kling 2.0教程',
  'kling-tutorial-complete': 'Kling完整教程',
  'runway-tutorial': 'Runway教程',
  'pika-tutorial': 'Pika教程',
  'runway-vs-pika-vs-kling': 'Runway vs Pika vs Kling对比',
  'luma-dream-machine-tutorial': 'Luma Dream Machine教程',
  'hailuo-ai-free-video': 'Hailuo AI免费视频生成',
  'ai-text-to-video-tools-recommendation-2026': 'AI文字转视频工具推荐',
  'free-ai-text-to-video-tools-2026': '免费文字转视频工具',
  'ai-video-generator-comparison-2026': 'AI视频生成器终极对比',
  'ai-animation-video-tools-2026': 'AI动画视频生成工具',
  'ai-video-enhancement-tools-2026': 'AI视频画质增强工具',
  'ai-video-subtitle-tools-2026': 'AI视频字幕生成工具',
  'ai-video-dubbing-tools-2026': 'AI视频配音工具',
  'ai-video-script-writer-tools-2026': 'AI视频脚本生成工具',
  'ai-video-background-remover-tools-2026': 'AI视频背景移除工具',
  'ai-short-video-tutorial-2026': 'AI制作短视频教程',
  'ai-ecommerce-video-ads-batch-2026': 'AI批量电商广告视频',
  'ai-video-ads-ecommerce': 'AI电商广告素材制作',
  'ai-youtube-video-automation': 'AI自动化YouTube频道',
  'ai-video-tool-buying-guide-2026': 'AI视频工具选购指南',
  'ai-video-money-making': 'AI视频赚钱方法',
  'ai-video-prompt-examples': '50个AI视频Prompt示例',
  'ai-avatar-video-tools-2026': '免费AI数字人视频工具',
  'ai-video-translation-tools': 'AI视频翻译工具',
  'ai-video-editing-tools-2026': 'AI视频剪辑工具',
  'free-ai-video-editing-tools': '免费AI视频编辑工具',
  'how-to-make-ai-video-free': '免费制作AI视频教程',
  'open-source-ai-video-generators': '开源AI视频生成器',
};

const articlesDir = path.join(__dirname, 'articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));

files.forEach(filename => {
  const slug = filename.replace('.html', '');
  const filepath = path.join(articlesDir, filename);
  let html = fs.readFileSync(filepath, 'utf8');

  const related = relatedMap[slug];
  if (!related || related.length < 2) return;

  // Check if related articles section already exists
  if (html.includes('相关推荐文章')) return;

  // Build related articles HTML
  const links = related.slice(0, 4).map(relSlug => {
    const relTitle = titleMap[relSlug] || relSlug;
    return `        <li><a href="/articles/${relSlug}">${relTitle}</a></li>`;
  }).join('\n');

  const relatedHtml = `
    <section class="related-articles" style="margin-top:40px;padding-top:30px;border-top:2px solid #eee">
        <h3 style="font-size:1.3em;margin-bottom:16px">📎 相关推荐文章</h3>
        <ul style="line-height:2.2;padding-left:20px">
${links}
        </ul>
    </section>`;

  // Insert before footer or at end of main content
  if (html.includes('</main>')) {
    html = html.replace('</main>', relatedHtml + '\n    </main>');
  } else if (html.includes('</article>')) {
    html = html.replace('</article>', '</article>' + relatedHtml);
  } else {
    // Insert before footer
    html = html.replace('</footer>', relatedHtml + '\n    </footer>');
  }

  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`✅ ${filename} + related articles`);
});

console.log('\n🎉 All articles updated with related links!');
