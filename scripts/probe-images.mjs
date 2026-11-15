#!/usr/bin/env node
import { spawn } from 'node:child_process';

const PORT = '3100';
const BASE = `http://127.0.0.1:${PORT}`;
const server = spawn('./node_modules/.bin/next', ['start', '-H', '127.0.0.1', '-p', PORT], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
let log = '';
server.stdout.on('data', (d) => (log += d));
server.stderr.on('data', (d) => (log += d));

const wait = async () => {
  for (let i = 0; i < 60; i += 1) {
    try {
      const r = await fetch(`${BASE}/showcase`, { signal: AbortSignal.timeout(3000) });
      if (r.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
};

if (!(await wait())) {
  console.error('not ready', log.slice(-800));
  server.kill('SIGKILL');
  process.exit(1);
}

const targets = [
  '/showcase/home-720.avif',
  '/_next/image?url=%2Fshowcase%2Fhome-720.avif&w=360&q=75',
];
for (const t of targets) {
  const r = await fetch(BASE + t);
  const buf = await r.arrayBuffer();
  console.log(t, r.status, r.headers.get('content-type'), buf.byteLength, 'bytes');
}

const html = await (await fetch(`${BASE}/showcase`)).text();
const m = html.match(/src="(\/_next\/image[^"]+)"/);
console.log('first img src:', m ? m[1].slice(0, 120) : 'NONE');

server.kill('SIGKILL');
