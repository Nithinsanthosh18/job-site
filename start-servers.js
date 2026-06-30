/**
 * ORBIS — Unified Server
 * Starts a single HTTP server on Port 3000 to serve the entire integrated website.
 * - index.html: Served at '/' or '/index.html'
 * - projects.html: Served at '/projects.html'
 * - project-detail.html: Served at '/project-detail.html'
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  // Parse URL and sanitize path
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let reqPath = parsedUrl.pathname;

  // Handle routing fallbacks
  if (reqPath === '/' || reqPath === '/index.html') {
    reqPath = '/index.html';
  } else if (reqPath === '/projects' || reqPath === '/projects.html') {
    reqPath = '/projects.html';
  } else if (reqPath === '/project-detail' || reqPath === '/project-detail.html') {
    reqPath = '/project-detail.html';
  }

  const filePath = path.join(__dirname, reqPath);

  // Security check: ensure path is inside the project directory
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      serveFile(res, filePath);
    }
  });
});

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`500 Internal Server Error: ${err.code}`);
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      });
      res.end(content, 'utf-8');
    }
  });
}

server.listen(PORT, () => {
  console.log(`\x1b[35m[ORBIS SITE] Running at http://localhost:${PORT}\x1b[0m`);
});
