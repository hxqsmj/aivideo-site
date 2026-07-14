const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .replace(/[^\w一-鿿]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function addToc(html) {
  // Find all h2 elements
  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/g;
  const headings = [];
  let match;
  while ((match = h2Regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text) {
      headings.push({ text, id: slugify(text), full: match[0] });
    }
  }

  if (headings.length < 3) return html; // Skip short articles

  // Add id to h2 tags
  headings.forEach(h => {
    const newH2 = `<h2 id="${h.id}">${h.full.slice(4)}`; // replace <h2 with <h2 id="..."
    html = html.replace(h.full, newH2);
  });

  // Build TOC HTML
  const tocItems = headings.map((h, i) =>
    `        <li><a href="#${h.id}">${h.text}</a></li>`
  ).join('\n');

  const tocHtml = `
    <nav class="article-toc" style="background:#f7fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      <strong style="display:block;margin-bottom:10px;color:#1a1a2e;font-size:1rem;">📑 目录</strong>
      <ol style="margin:0;padding-left:20px;line-height:2.2;font-size:0.92rem;color:#2563eb;">
${tocItems}
      </ol>
    </nav>`;

  // Insert TOC after h1
  html = html.replace('</h1>', '</h1>' + tocHtml);

  return html;
}

const articlesDir = path.join(__dirname, 'articles');
fs.readdirSync(articlesDir).filter(f => f.endsWith('.html')).forEach(filename => {
  const filepath = path.join(articlesDir, filename);
  let html = fs.readFileSync(filepath, 'utf8');
  const result = addToc(html);
  if (result !== html) {
    fs.writeFileSync(filepath, result, 'utf8');
    console.log(`✅ articles/${filename}`);
  }
});

console.log('\n🎉 Done!');
