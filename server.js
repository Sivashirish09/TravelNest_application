const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = parseInt(process.env.PORT, 10) || 3000;
const WEB_APP_DIR = path.join(__dirname, 'web-app');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function createServerOnPort(port) {
  const server = http.createServer((req, res) => {
    let filePath = path.join(WEB_APP_DIR, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          fs.readFile(path.join(WEB_APP_DIR, 'index.html'), (err2, fallback) => {
            if (err2) {
              res.writeHead(404);
              res.end('404 Not Found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(fallback, 'utf-8');
            }
          });
        } else {
          res.writeHead(500);
          res.end(`Server Error: ${err.code}`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[!] Port ${port} is currently in use. Trying port ${port + 1}...`);
      createServerOnPort(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log(`\n==================================================`);
    console.log(`🌍 TravelNest Web Application is LIVE!`);
    console.log(`👉 Access URL: http://localhost:${port}`);
    console.log(`==================================================\n`);
  });
}

createServerOnPort(PORT);
