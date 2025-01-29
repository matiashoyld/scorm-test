import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Load environment variables for local development
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the project root
app.use(express.static(__dirname));

// API endpoint for token
app.get('/api/token', async (req, res) => {
  try {
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-realtime-preview-2024-12-17",
        voice: "alloy",
        instructions: "Eres un asistente de IA amigable y servicial. Siempre respondes en español, independientemente del idioma en que te hablen. Mantienes un tono conversacional y profesional. Si te hablan en otro idioma, entiendes perfectamente pero SIEMPRE respondes en español."
      }),
    });

    if (!r.ok) {
      const error = await r.json();
      console.error('OpenAI API Error:', error);
      return res.status(r.status).json(error);
    }

    const data = await r.json();
    res.json(data);
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'scormcontent', 'index.html'));
});

app.listen(port, () => {
  console.log(`Development server running at http://localhost:${port}`);
}); 