# AI视频生成器推荐 (aivideo-site)

2026年最全免费AI视频工具评测与排名网站，部署于 Cloudflare Pages。

## 目录结构

```
aivideo-site/
├── index.html              # 首页（FAQ结构化数据）
├── top10.html              # TOP 10 排名
├── free-text-to-video.html # 免费文字转视频
├── comparison.html         # 工具对比
├── tutorial.html           # 使用教程
├── articles/               # 48篇AI视频工具文章
├── css/style.css           # 样式表
├── images/                 # 图片资源
├── llms.txt                # AI爬虫数据源
├── robots.txt              # 爬虫规则（含AI白名单）
├── sitemap.xml             # 站点地图（47个URL）
├── feed.xml                # RSS订阅
└── *.js                    # 工具脚本
```

## 部署

```bash
# 1. 设置环境变量
set CLOUDFLARE_API_TOKEN=your_token_here
set CLOUDFLARE_ACCOUNT_ID=6e875dc1548f2930fd28434e997a1f3b

# 2. 使用 wrangler 部署
npx wrangler pages deploy . --project-name=aivideo-site --branch=main

# 或使用 deploy.js
node deploy.js
```

## SEO 优化清单

✅ llms.txt - AI爬虫数据源
✅ robots.txt - AI爬虫白名单（GPTBot/ClaudeBot/Google-Extended）
✅ JSON-LD - FAQPage + Article 结构化数据
✅ 百度站长验证
✅ Google Search Console 验证
✅ Bing 站点验证
✅ IndexNow 快速收录
✅ 百度主动推送脚本
✅ 内链网络（相关文章推荐）
✅ sitemap.xml（47 URL）
✅ RSS Feed
✅ Open Graph / Twitter Card
✅ canonical / hreflang

## 推送百度

```bash
# 先获取百度站长平台 token，然后运行：
set BAIDU_TOKEN=your_token_here
node push-baidu.js
```

## 再生成本地数据

```bash
node generate-sitemap.js      # 重新生成站点地图
node add-verification.js      # 添加验证信息到所有页面
node enhance-jsonld.js        # 增强 JSON-LD 结构化数据
node add-internal-links.js    # 添加相关文章内链
node fix-seo.js               # 修复 SEO 标签
```
