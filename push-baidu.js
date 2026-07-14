#!/usr/bin/env node
/**
 * 百度链接主动推送脚本
 * 使用方式: node push-baidu.js
 * 需要在环境变量中设置 BAIDU_TOKEN
 * 百度站长平台 -> 普通收录 -> 资源提交 -> API提交 -> 获取token
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BAIDU_TOKEN = process.env.BAIDU_TOKEN || 'YOUR_BAIDU_TOKEN';
const SITE = 'hxqsmj.ccwu.cc';
const API_URL = `/ping?site=${SITE}&token=${BAIDU_TOKEN}`;

// Collect all page URLs from sitemap.xml
const sitemapPath = path.join(__dirname, 'sitemap.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');

const urls = [];
const urlRegex = /<loc>(https:\/\/hxqsmj\.ccwu\.cc[^<]+)<\/loc>/g;
let match;
while ((match = urlRegex.exec(sitemap)) !== null) {
  urls.push(match[1]);
}

if (urls.length === 0) {
  console.error('❌ No URLs found in sitemap.xml');
  process.exit(1);
}

console.log(`📤 Sending ${urls.length} URLs to Baidu...`);

function pushUrls(urlList) {
  return new Promise((resolve, reject) => {
    const postData = urlList.join('\n');
    const options = {
      hostname: 'data.zz.baidu.com',
      path: API_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: data });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Baidu API accepts max 1000 URLs per request, split if needed
async function main() {
  const batchSize = 1000;
  let totalSuccess = 0;
  let totalRemain = 0;

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(urls.length / batchSize)}...`);

    try {
      const result = await pushUrls(batch);
      if (result.success) {
        totalSuccess += result.success;
        totalRemain = result.remain;
        console.log(`    ✅ success: ${result.success}, remain: ${result.remain}`);
      } else {
        console.error(`    ❌ Failed:`, result);
      }
    } catch (e) {
      console.error(`    ❌ Error:`, e.message);
    }
  }

  console.log(`\n🎉 Done! Total submitted: ${totalSuccess}, daily quota remaining: ${totalRemain}`);
}

main().catch(console.error);
