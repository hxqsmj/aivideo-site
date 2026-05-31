const https = require('https');
const token = '***';
const acct = '6e875dc1548f2930fd28434e997a1f3b';
function api(m, p) {
  return new Promise((resolve) => {
    const req = https.request({hostname:'api.cloudflare.com',path:p,method:m,headers:{'Authorization':'***'+token,'Content-Type':'application/json'}}, (res) => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(JSON.parse(d))); });
    req.on('error',e=>resolve({success:false})); req.end();
  });
}
async function main() {
  const recs = await api('GET', 'https://api.cloudflare.com/client/v4/zones/2d69c62b8a76196aba36f4be4d9b1207/dns_records?per_page=10');
  if (recs.result) recs.result.forEach(r => console.log('DNS:', r.type, r.name, '->', r.content));
  else console.log(JSON.stringify(recs.errors||recs).substring(0,200));
}
main();
