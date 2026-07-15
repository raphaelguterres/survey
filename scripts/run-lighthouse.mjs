import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { setTimeout as wait } from 'node:timers/promises';

const port = 4174;
mkdirSync('reports', { recursive: true });
const server = spawn('python', ['-m', 'http.server', String(port)], { stdio: 'ignore' });
try {
  await wait(1200);
  const args = ['node_modules/lighthouse/cli/index.js', `http://127.0.0.1:${port}/`, '--only-categories=performance,accessibility,best-practices,seo', '--form-factor=mobile', '--screenEmulation.mobile=true', '--chrome-flags=--headless --no-sandbox --disable-gpu', '--output=html', '--output=json', '--output-path=reports/lighthouse-mobile-after'];
  const result = await new Promise((resolve) => {
    const child = spawn(process.execPath, args, { stdio: 'inherit' });
    child.on('close', (code) => resolve(code ?? 1));
  });
  if (result !== 0) process.exitCode = result;
} finally {
  server.kill();
}