import { spawn } from 'node:child_process';
import { closeSync, existsSync, mkdirSync, openSync, writeFileSync } from 'node:fs';
import { get } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const address = 'http://127.0.0.1:5173/';
const stateDir = path.join(projectDir, '.local-preview');
const logPath = path.join(stateDir, 'server.log');
const vitePath = path.join(projectDir, 'node_modules/vite/bin/vite.js');

// A reachable port alone is insufficient: it must serve this website.
function probe() {
  return new Promise(resolve => {
    let settled = false;
    const finish = result => { if (!settled) { settled = true; resolve(result); } };
    const request = get(address, response => {
      let html = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { if (html.length < 256_000) html += chunk; });
      response.on('end', () => finish({
        connected: true,
        ready: response.statusCode === 200 && /<title>Close Reading Archive<\/title>/.test(html),
      }));
      response.on('error', () => finish({ connected: true, ready: false }));
    });
    request.setTimeout(4000, () => request.destroy());
    request.on('error', () => finish({ connected: false, ready: false }));
  });
}

async function main() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 13)) throw new Error('需要 Node.js 22.13 或更高版本。');
  const existing = await probe();
  if (existing.ready) {
    console.log(`网页服务已在运行：${address}#text`);
    return;
  }
  if (existing.connected) throw new Error('5173 端口已有服务，但未返回本网站的正常页面；请检查已有服务，避免启动到错误的端口。');
  if (!existsSync(vitePath)) throw new Error('项目依赖缺失，未找到 Vite。请先恢复项目依赖。');

  mkdirSync(stateDir, { recursive: true });
  const logFd = openSync(logPath, 'a');
  let child;
  try {
    child = spawn(process.execPath, [vitePath, '--host', '127.0.0.1', '--port', '5173', '--strictPort'], {
      cwd: projectDir,
      detached: true,
      stdio: ['ignore', logFd, logFd],
      env: {
        ...process.env,
        PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH ?? ''}`,
        WRANGLER_WRITE_LOGS: 'false',
        WRANGLER_LOG_PATH: path.join(stateDir, 'wrangler'),
        MINIFLARE_REGISTRY_PATH: path.join(stateDir, 'registry'),
      },
    });
  } finally {
    closeSync(logFd);
  }
  let startupError;
  child.on('error', error => { startupError = error; });
  child.unref();
  if (child.pid) writeFileSync(path.join(stateDir, 'server.pid'), `${child.pid}\n`);
  console.log('正在启动本地网页，请稍候……');
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (startupError) throw startupError;
    if ((await probe()).ready) {
      console.log(`网页已就绪：${address}#text`);
      console.log('服务已在后台运行；关闭启动窗口不会关闭网页服务。');
      return;
    }
    if (child.exitCode !== null) throw new Error(`网页服务启动失败，日志：${logPath}`);
    await delay(500);
  }
  throw new Error(`网页未在 60 秒内就绪，请查看日志：${logPath}`);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
