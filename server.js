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

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PUBLISHABLE_KEY = process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_travelnest_gateway_placeholder';

let stripeClient = null;
try {
  const Stripe = require('stripe');
  stripeClient = Stripe(STRIPE_SECRET_KEY);
} catch (e) {
  // Stripe optional fallback
}

function createServerOnPort(port) {
  const server = http.createServer(async (req, res) => {
    // API: Stripe Config
    if (req.url === '/api/stripe-config' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ publishableKey: STRIPE_PUBLISHABLE_KEY }));
    }

    // API: Create Stripe Payment Intent
    if (req.url === '/api/create-payment-intent' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const data = JSON.parse(body || '{}');
          const amountInPaise = Math.round((data.amount || 1000) * 100);

          if (stripeClient) {
            try {
              const paymentIntent = await stripeClient.paymentIntents.create({
                amount: amountInPaise,
                currency: data.currency || 'inr',
                metadata: {
                  bookingRef: data.bookingRef || 'TN-TEST',
                  guestName: data.guestName || 'Guest'
                }
              });
              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id }));
            } catch (stripeErr) {
              console.warn('Stripe Live API Notice (fallback to simulated intent):', stripeErr.message);
            }
          }

          // Fallback mock intent
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            clientSecret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
            id: `pi_mock_${Date.now()}`
          }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

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
