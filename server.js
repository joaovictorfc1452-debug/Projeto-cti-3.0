// Planta Elétrica BIM — servidor para o Render (Web Service).
// Serve o index.html e a pasta assets. Não tem dependências: só Node 18 ou mais novo.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};
const COMPRIMIR = /^(text\/|application\/(javascript|json)|image\/svg)/;

function texto(res, status, msg) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(msg);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }
  let caminho;
  try {
    caminho = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (e) {
    return texto(res, 400, 'Endereço inválido');
  }
  if (caminho === '/healthz') return texto(res, 200, 'ok');
  if (caminho === '/' || caminho === '/index.html') caminho = '/index.html';

  // Só o index.html e o que está dentro de assets/ são públicos
  const relativo = path.normalize(caminho).replace(/^[\\/]+/, '');
  const publico = relativo === 'index.html' || relativo.startsWith('assets' + path.sep);
  const arquivo = path.join(ROOT, relativo);
  if (!publico || !arquivo.startsWith(ROOT + path.sep)) return texto(res, 404, 'Página não encontrada');

  // Se os arquivos foram enviados ao GitHub sem as pastas (tudo na raiz), procura pelo nome na raiz
  const SOLTOS = ['style.css', 'app.js', 'engine.js', 'favicon.svg'];
  const alternativo = SOLTOS.includes(path.basename(relativo)) ? path.join(ROOT, path.basename(relativo)) : null;
  const servir = (arq, st) => entregar(req, res, arq, st);
  fs.stat(arquivo, (err, st) => {
    if (!err && st.isFile()) return servir(arquivo, st);
    if (!alternativo) return texto(res, 404, 'Página não encontrada');
    fs.stat(alternativo, (err2, st2) => {
      if (err2 || !st2.isFile()) return texto(res, 404, 'Página não encontrada: ' + relativo);
      servir(alternativo, st2);
    });
  });
});

function entregar(req, res, arquivo, st) {
  {
    const tipo = TYPES[path.extname(arquivo).toLowerCase()] || 'application/octet-stream';
    const etag = `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
    const cab = {
      'Content-Type': tipo,
      'ETag': etag,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, cab);
      return res.end();
    }
    const gzip = COMPRIMIR.test(tipo) && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    if (gzip) { cab['Content-Encoding'] = 'gzip'; cab['Vary'] = 'Accept-Encoding'; }
    else cab['Content-Length'] = st.size;
    res.writeHead(200, cab);
    if (req.method === 'HEAD') return res.end();
    const leitura = fs.createReadStream(arquivo);
    leitura.on('error', () => res.destroy());
    (gzip ? leitura.pipe(zlib.createGzip()) : leitura).pipe(res);
  }
}

server.listen(PORT, () => {
  console.log(`Planta Elétrica BIM no ar na porta ${PORT}`);
});
