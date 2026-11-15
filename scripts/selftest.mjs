#!/usr/bin/env node
// Starts `next start` as a child, waits for readiness, then runs the acceptance script.
// Single foreground process so the harness does not depend on shell backgrounding.
import { spawn } from 'node:child_process';

const PORT = process.env.PORT || '3100';
const BASE = `http://127.0.0.1:${PORT}`;

const server = spawn('./node_modules/.bin/next', ['start', '-H', '127.0.0.1', '-p', PORT], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env },
});

let serverLog = '';
server.stdout.on('data', (d) => { serverLog += d.toString(); });
server.stderr.on('data', (d) => { serverLog += d.toString(); });

const waitReady = async () => {
  for (let i = 0; i < 60; i += 1) {
    try {
      const r = await fetch(`${BASE}/api/release`, { signal: AbortSignal.timeout(4000) });
      if (r.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
};

const ready = await waitReady();
if (!ready) {
  console.error('server never became ready');
  console.error(serverLog.slice(-2000));
  server.kill('SIGKILL');
  process.exit(1);
}

const check = spawn(process.execPath, ['scripts/verify-acceptance.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, BASE_URL: BASE },
});

const code = await new Promise((resolve) => check.on('exit', resolve));
server.kill('SIGKILL');
process.exit(code ?? 1);
