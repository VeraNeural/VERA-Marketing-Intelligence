// server/index.js
import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import express from "express";
import fetch from "node-fetch";
import { VERA_MARKETING, VERA_BRANDING, VERA_COPY } from "../lib/system_prompts.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint (ES module fix deployed)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.1-es-module-fix',
    environment: {
      hasVeraApiUrl: !!process.env.VERA_API_URL,
      hasQwenModel: !!process.env.QWEN_MODEL,
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT
    }
  });
});

// Debug endpoint for environment check
app.get('/debug/env', (req, res) => {
  res.json({
    VERA_API_URL: process.env.VERA_API_URL ? 'SET' : 'MISSING',
    QWEN_MODEL: process.env.QWEN_MODEL || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    PORT: process.env.PORT || 'NOT SET'
  });
});

// Test Qwen API connectivity
app.get('/debug/qwen-test', async (req, res) => {
  try {
    if (!process.env.VERA_API_URL) {
      return res.json({ error: 'VERA_API_URL not set' });
    }

    const response = await fetch(process.env.VERA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.QWEN_MODEL || "qwen3-30b",
        messages: [
          { role: "system", content: "You are a test." },
          { role: "user", content: "Say hello" },
        ],
      }),
    });

    const responseText = await response.text();
    
    res.json({
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      responseBody: responseText.substring(0, 500) + (responseText.length > 500 ? '...' : '')
    });
  } catch (error) {
    res.json({
      error: error.message,
      stack: error.stack
    });
  }
});

// Main VERA marketing intelligence endpoint
app.post("/api/marketing", async (req, res) => {
  try {
    const { message, mode } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if VERA_API_URL is configured
    if (!process.env.VERA_API_URL) {
      return res.status(500).json({ 
        error: 'VERA_API_URL environment variable not configured',
        details: 'Please set VERA_API_URL in Railway environment variables'
      });
    }

    const systemPrompt =
      mode === "branding"
        ? VERA_BRANDING
        : mode === "copy"
        ? VERA_COPY
        : VERA_MARKETING;

    console.log('Making request to:', process.env.VERA_API_URL);
    
    const response = await fetch(process.env.VERA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.QWEN_MODEL || "qwen3-30b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🚨 VERA_API_URL CONNECTION FAILED:', process.env.VERA_API_URL);
      console.error('📋 Status:', response.status, response.statusText);
      console.error('📄 Error Response:', errorText);
      
      // Don't fall back silently - throw clear error
      throw new Error(`VERA_API_URL failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    res.json({
      message,
      mode,
      response: data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Marketing API error:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Analysis failed', 
      details: error.message,
      timestamp: new Date().toISOString()
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

app.listen(8080, () => {
  console.log("🧠 VERA Marketing Intelligence API running on port 8080");
  console.log("🔗 VERA_API_URL:", process.env.VERA_API_URL || 'NOT SET');
  console.log("🤖 QWEN_MODEL:", process.env.QWEN_MODEL || 'NOT SET');
});

export default app;