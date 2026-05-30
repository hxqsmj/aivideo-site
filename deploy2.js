const https = require('https');
const fs = require('fs');
const path = require('path');
const token = "cfut_FJwbVlx5mFZmKYJrNNZdVpb2b4O8bPIAnPPTYuD5c6cf9b91";
const accountId = "6e875dc1548f2930fd28434e997a1f3b";
const projectName = "aivideo-site";

function api(method, p, body) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'api.cloudflare.com', path: p, method: method,
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } };
    const req = https.request(opts, (res) => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(JSON.parse(d))); });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  // Get deployment from uploaded files - we need to upload via the Pages API
  // Actually for direct upload we use the Pages deployment with manifest endpoint
  
  // First let's try a simpler approach: create a deployment with uploaded files
  // Get list of files
  const dir = 'I:\\aivideosite';
  const allFiles = [];
  
  function walk(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dirPath, e.name);
      if (e.isDirectory()) walk(full);
      else {
        const rel = path.relative(dir, full).replace(/\\/g, '/');
        const content = fs.readFileSync(full);
        const b64 = content.toString('base64');
        allFiles.push({ path: rel, base64: b64 });
      }
    }
  }
  walk(dir);
  
  console.log(`Total files: ${allFiles.length}`);
  
  // We need to batch upload - create the deployment via manifest
  // Create manifest first
  const manifest = {};
  for (const f of allFiles) {
    manifest[f.path] = f.base64;
  }
  
  // Create Pages deployment with direct upload
  const deployData = { manifest };
  
  const result = await api('POST', `/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`, deployData);
  
  if (result.success) {
    console.log('✅ Deployment created!');
    console.log('URL:', result.result.url || result.result.aliases?.[0] || 'check dashboard');
  } else {
    console.log('❌ Failed:', JSON.stringify(result.errors));
    if (result.messages) console.log('Messages:', JSON.stringify(result.messages));
  }
}

main().catch(e => console.log('ERROR:', e));
