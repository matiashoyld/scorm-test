import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import tokenHandler from './api/token.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from scormcontent directory
app.use(express.static('scormcontent'));

// API endpoint for token
app.get('/api/token', async (req, res) => {
  const response = await tokenHandler(req);
  const data = await response.json();
  res.status(response.status).json(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 