#!/usr/bin/env node
const BASE = process.env.BASE_URL || 'http://127.0.0.1:3100';
let fail = 0;
const ok = (label, pass, extra = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'} ${label}${extra ? ' :: ' + extra : ''}`);
  if (!pass) fail++;
};
const get = async (p) => {
  const r = await fetch(BASE + p, { headers: { 'cache-control': 'no-cache' } });
  return { status: r.status, html: await r.text(), headers: r.headers };
};

const home = await get('/');
const apiRes = await get('/api/release');
const api = JSON.parse(apiRes.html);

ok('api responds 200', apiRes.status === 200, String(apiRes.status));
ok('#1 home shows the API tag', home.html.includes(api.tag), api.tag);
ok('#1 sizes present', home.html.includes('26,8 MB'));
ok(
  'api cache header',
  (apiRes.headers.get('cache-control') || '').includes('s-maxage=300'),
  apiRes.headers.get('cache-control') || 'missing',
);
ok('three variants in payload', api.variants.length === 3, String(api.variants.length));

for (const p of ['/', '/download', '/showcase', '/changelog', '/faq', '/privacy']) {
  const { status, html } = await get(p);
  ok(`200 ${p}`, status === 200, String(status));
  ok(`single h1 ${p}`, (html.match(/<h1[\s>]/g) || []).length === 1);
  ok(`no placeholder text ${p}`, !/lorem ipsum|coming soon|TODO:/i.test(html));
}

const dl = await get('/download');
ok('/download has comparison table', dl.html.includes('<table'));
ok('/download lists Cast asset', /Chromecast|Cast/.test(dl.html));
ok('/download shows permission list', dl.html.includes('android.permission.RECORD_AUDIO'));
ok('/download handles missing checksum honestly', /belum menyertakan SHA256SUMS/i.test(dl.html));

const sc = await get('/showcase');
const flat = sc.html.replace(/%2F/gi, '/');
const shots = (flat.match(/showcase\/[a-z-]+-720\.(?:avif|webp)/g) || []).length;
ok('#5 six showcase images', shots >= 6, String(shots));

ok(
  'nav has no dead links',
  ['/download', '/showcase', '/changelog', '/faq'].every((h) => home.html.includes(`href="${h}"`)),
);

const unavailable = api.variants.some((v) => !v.available);
if (unavailable) {
  ok('#3 unavailable card text', dl.html.includes('tidak ada di rilis terbaru'));
}
if (api.source === 'snapshot') {
  ok('#2 snapshot badge on home', home.html.includes('Versi tersimpan, mungkin belum terbaru'));
}

if (api.source === 'live') {
  ok('no snapshot badge when live', !home.html.includes('Versi tersimpan, mungkin belum terbaru'));
}

console.log(fail ? `\n${fail} FAILED` : '\nALL PASS');
process.exit(fail ? 1 : 0);
