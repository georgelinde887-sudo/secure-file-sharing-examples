const http = require('node:http');

/**
 * Node.js Recipe: Webhook Listener for Document Viewing & Download Events
 */
function createWebhookServer(port = 9000, onEvent = console.log) {
  const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/webhooks/document-events') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const event = JSON.parse(body);
          onEvent(event);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'received', eventId: event.id }));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    res.writeHead(404);
    res.end();
  });
  return server;
}

if (require.main === module) {
  const server = createWebhookServer(9000, (event) => {
    console.log(`[ALERT] Recipient ${event.viewerEmail} viewed document ${event.documentId} (Dwell: ${event.dwellSeconds}s)`);
  });
  server.listen(9000, () => {
    console.log('Document Webhook Listener running on http://localhost:9000/webhooks/document-events');
  });
}

module.exports = { createWebhookServer };
