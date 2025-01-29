import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GET, POST, OPTIONS } from './api/token/route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the project root
app.use(express.static(__dirname));

// Convert Edge Function Response to Express Response
const edgeToExpress = async (edgeResponse, res) => {
  const body = await edgeResponse.json();
  const headers = Object.fromEntries(edgeResponse.headers.entries());
  res.set(headers).status(edgeResponse.status).json(body);
};

// Handle token endpoint using the same handler as production
app.options('/api/token', async (req, res) => {
  const response = await OPTIONS();
  edgeToExpress(response, res);
});

app.get('/api/token', async (req, res) => {
  const response = await GET(req);
  edgeToExpress(response, res);
});

app.post('/api/token', async (req, res) => {
  const response = await POST(req);
  edgeToExpress(response, res);
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'scormcontent', 'index.html'));
});

app.listen(port, () => {
  console.log(`Development server running at http://localhost:${port}`);
}); 