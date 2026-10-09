import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from '../.vercel/output/functions/__server.func/index.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.vercel/output/static');
const host = '127.0.0.1';
const port = Number(process.env.PORT ?? 5187);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.mp3':'audio/mpeg','.mp4':'video/mp4','.pdf':'application/pdf','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.otf':'font/otf'};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${host}:${port}`);
    let file = path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    let info;
    try {
      info = await stat(file);
      if (info.isDirectory()) { file = path.join(file, 'index.html'); info = await stat(file); }
    } catch { info = undefined; }
    if (info?.isFile() && ['GET','HEAD'].includes(req.method)) {
      res.setHeader('Content-Type', mime[path.extname(file).toLowerCase()] ?? 'application/octet-stream');
      res.setHeader('Accept-Ranges', 'bytes');
      const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
      let start = 0, end = info.size - 1, status = 200;
      if (range) {
        start = Number(range[1]); end = range[2] ? Math.min(Number(range[2]), end) : end;
        if (start > end) { res.writeHead(416, {'Content-Range': `bytes */${info.size}`}).end(); return; }
        status = 206; res.setHeader('Content-Range', `bytes ${start}-${end}/${info.size}`);
      }
      res.writeHead(status, {'Content-Length': end - start + 1});
      if (req.method === 'HEAD' || info.size === 0) { res.end(); return; }
      createReadStream(file, {start,end}).on('error', () => res.destroy()).pipe(res);
      return;
    }
    const init = {method:req.method, headers:req.headers};
    if (!['GET','HEAD'].includes(req.method)) { init.body = Readable.toWeb(req); init.duplex = 'half'; }
    const result = await app.fetch(new Request(url, init), {});
    res.writeHead(result.status, Object.fromEntries(result.headers));
    if (req.method === 'HEAD' || !result.body) res.end();
    else Readable.fromWeb(result.body).on('error', () => res.destroy()).pipe(res);
  } catch (error) {
    if (!res.headersSent) res.writeHead(500, {'Content-Type':'text/plain; charset=utf-8'});
    res.end(error instanceof Error ? error.message : 'Preview error');
  }
}).listen(port, host, () => console.log(`Release preview: http://${host}:${port}/`));
