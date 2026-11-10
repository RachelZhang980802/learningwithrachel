import { createServer, request } from 'node:http';
import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = '127.0.0.1';
const port = Number(process.env.RACHEL_PREVIEW_PORT ?? 5173);
let backendPort = Number(process.env.RACHEL_BACKEND_PORT ?? 0);
const roots = [path.join(projectDir, 'public'), path.join(projectDir, '.output/public')];
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.pdf': 'application/pdf', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf', '.txt': 'text/plain; charset=utf-8' };
let backend;

async function backendReady() {
  try {
    const response = await fetch(`http://${host}:${backendPort}/`, { signal: AbortSignal.timeout(3000) });
    return response.ok && /<title>Learning with Rachel<\/title>/.test(await response.text());
  } catch { return false; }
}

async function start() {
  {
    await stat(path.join(projectDir, '.output/server/index.mjs'));
    // Each preview owns a fresh backend so another checkout or an older build
    // cannot be mistaken for the current project merely because its title matches.
    if (backendPort === 0) {
      const reservation = createServer();
      await new Promise((resolve, reject) => {
        reservation.once('error', reject);
        reservation.listen(0, host, resolve);
      });
      backendPort = reservation.address().port;
      await new Promise((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
    }
    backend = spawn(process.execPath, [path.join(projectDir, '.output/server/index.mjs')], {
      cwd: projectDir,
      env: { ...process.env, NITRO_HOST: host, NITRO_PORT: String(backendPort) },
      stdio: ['ignore', 'inherit', 'inherit'],
    });
    let failure;
    backend.on('error', error => { failure = error; });
    const deadline = Date.now() + 15000;
    while (!await backendReady()) {
      if (failure) throw failure;
      if (backend.exitCode !== null) throw new Error('网页构建服务启动失败。');
      if (Date.now() > deadline) throw new Error('网页构建服务启动超时。');
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', `http://${host}:${port}`);
      const pathname = decodeURIComponent(url.pathname);
      if (['GET', 'HEAD'].includes(req.method)) {
        for (const root of roots) {
          let file = path.resolve(root, `.${pathname}`);
          if (file !== root && !file.startsWith(root + path.sep)) continue;
          let info;
          try {
            info = await stat(file);
            if (info.isDirectory()) { file = path.join(file, 'index.html'); info = await stat(file); }
          } catch { continue; }
          if (!info.isFile()) continue;
          res.setHeader('Content-Type', types[path.extname(file).toLowerCase()] ?? 'application/octet-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Accept-Ranges', 'bytes');
          const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
          let first = 0, last = info.size - 1, status = 200;
          if (range) {
            first = Number(range[1]);
            last = range[2] ? Math.min(Number(range[2]), last) : last;
            if (first > last) { res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end(); return; }
            status = 206;
            res.setHeader('Content-Range', `bytes ${first}-${last}/${info.size}`);
          }
          res.writeHead(status, { 'Content-Length': Math.max(0, last - first + 1) });
          if (req.method === 'HEAD' || info.size === 0) { res.end(); return; }
          createReadStream(file, { start: first, end: last }).on('error', () => res.destroy()).pipe(res);
          return;
        }
      }
      const upstream = request({ hostname: host, port: backendPort, path: req.url, method: req.method, headers: req.headers }, response => {
        res.writeHead(response.statusCode ?? 502, response.headers);
        response.on('error', () => res.destroy()).pipe(res);
      });
      upstream.on('error', () => { if (!res.headersSent) res.writeHead(502); res.end('网页服务暂未就绪。'); });
      req.on('aborted', () => upstream.destroy());
      req.pipe(upstream);
    } catch (error) {
      if (!res.headersSent) res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(error instanceof Error ? error.message : 'Preview error');
    }
  });
  server.on('error', error => { console.error(error.message); backend?.kill(); process.exitCode = 1; });
  server.listen(port, host, () => console.log(`最新本地网页：http://${host}:${port}/#text`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { backend?.kill(); server.close(() => process.exit()); });
}
start().catch(error => { console.error(error.message); backend?.kill(); process.exitCode = 1; });
