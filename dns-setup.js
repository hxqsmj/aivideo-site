const https = require('https');
const token = 'cfut_F…9b91';
const acct = '6e875dc1548f2930fd28434e997a1f3b';

function api(m, p, body) {
  return new Promise((resolve) => {
    const opts = { hostname: 'api.cloudflare.com', path: p, method: m,
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } };
    const req = https.request(opts, (res) => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>{ try{resolve(JSON.parse(d))}catch(e){resolve({success:false,errors:[{message:'parse err: '+e.message}]})} }); });
    req.on('error',e=>resolve({success:false,errors:[{message:e.message}]}));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  // Get zone for ccwu.cc
  const zones = await api('GET', '/client/v4/zones?name=ccwu.cc');
  if (!zones.success) { console.log('Zone err:', JSON.stringify(zones.errors)); return; }
  const zoneId = zones.result[0].id;
  console.log('Zone ID:', zoneId);

  // Check existing DNS for hxqsmj.ccwu.cc
  const recs = await api('GET', '/client/v4/zones/' + zoneId + '/dns_records?name=hxqsmj.ccwu.cc');
  console.log('Existing DNS records:');
  if (recs.result) recs.result.forEach(r => console.log('  -', r.type, r.name, '->', r.content));
  
  // Add custom domain to Pages project
  console.log('\nAdding custom domain hxqsmj.ccwu.cc to aivideo-site...');
  const custom = await api('POST', '/client/v4/accounts/' + acct + '/pages/projects/aivideo-site/domains/custom', {
    name: 'hxqsmj.ccwu.cc'
  });
  if (custom.success) {
    console.log('✅ Custom domain added! Status:', custom.result.status);
  } else {
    console.log('Add domain result:', JSON.stringify(custom.errors || custom));
  }
}

main();
