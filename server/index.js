// server/index.js
import express from "express";
import fetch from "node-fetch";
import { VERA_MARKETING, VERA_BRANDING, VERA_COPY } from "../lib/system_prompts.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint (ES module fix deployed)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.1-es-module-fix'
  });
});

// Main VERA marketing intelligence endpoint
app.post("/api/marketing", async (req, res) => {
  try {
    const { message, mode } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt =
      mode === "branding"
        ? VERA_BRANDING
        : mode === "copy"
        ? VERA_COPY
        : VERA_MARKETING;

    const response = await fetch(process.env.VERA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen3-30b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    res.json({
      message,
      mode,
      response: data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Marketing API error:', error);
    res.status(500).json({ 
      error: 'Analysis failed', 
      details: error.message 
    });
  }
});

// Get available VERA modes
app.get("/api/modes", (req, res) => {
  res.json({
    modes: [
      { key: "marketing", name: "VERA Marketing Intelligence", description: "Nervous-system tone, brand resonance, and creative coherence" },
      { key: "branding", name: "VERA Branding Intelligence", description: "Archetypes, tone systems, and visual languages that match biological truth" },
      { key: "copy", name: "VERA Copy Resonance Intelligence", description: "Text rewriting with nervous-system precision and linguistic grace" }
    ]
  });
});

app.listen(8080, () => console.log("VERA Marketing Intelligence API running on port 8080"));

export default app;