const https = require('https');
const fs = require('fs');
const path = require('path');
const token = process.env.CLOUDFLARE_API_TOKEN;

function api(method, path, body) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.cloudflare.com',
      path: path,
      method: method,
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
    };
    const req = https.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve(d); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  // Get account ID
  const accts = await api('GET', '/client/v4/accounts');
  if (!accts.success) { console.log('FAIL accounts:', JSON.stringify(accts.errors)); return; }
  const accountId = accts.result[0].id;
  console.log('Account:', accountId);

  // Create Pages project
  const proj = await api('POST', `/client/v4/accounts/${accountId}/pages/projects`, {
    name: 'aivideo-site',
    production_branch: 'main'
  });
  console.log('Project:', proj.success ? proj.result.name : JSON.stringify(proj.errors));
}

main().catch(e => console.log(e));
