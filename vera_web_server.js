// vera_web_server.js
// Web-based chat interface for VERA Marketing Intelligence

const express = require('express');
const path = require('path');
const vera = require('./vera_core');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'VERA Marketing Intelligence',
    version: vera.getBrandState().version,
    timestamp: new Date().toISOString()
  });
});

// Store chat sessions
const sessions = new Map();

// Serve the main chat page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize VERA for a session
app.post('/api/init', (req, res) => {
  const { sessionId, brandConfig } = req.body;
  
  const result = vera.initialize(brandConfig || {
    brandName: "Default Brand",
    tone: "soothing",
    targetAudience: "wellness seekers",
    emotionalState: "calm"
  });
  
  sessions.set(sessionId, {
    initialized: true,
    brandContext: result.brandContext,
    messages: []
  });
  
  res.json({ 
    success: true, 
    message: "VERA initialized successfully!",
    brandContext: result.brandContext
  });
});

// Chat endpoint
app.post('/api/chat', (req, res) => {
  const { sessionId, message, command } = req.body;
  
  if (!sessionId) {
    return res.json({ error: "Session ID required" });
  }
  
  let session = sessions.get(sessionId);
  if (!session) {
    // Auto-initialize with defaults
    const initResult = vera.initialize();
    session = {
      initialized: true,
      brandContext: initResult.brandContext,
      messages: []
    };
    sessions.set(sessionId, session);
  }
  
  // Handle different types of requests
  let response;
  
  try {
    if (command) {
      response = handleCommand(command, message);
    } else {
      // Direct content analysis - use conscious analysis for deeper insights
      response = vera.analyzeWithConsciousness(message, 'full');
      response.type = 'conscious_analysis';
    }
    
    // Store the interaction
    session.messages.push({
      timestamp: new Date(),
      user: message,
      response: response,
      type: command || 'analysis'
    });
    
    res.json({ success: true, response });
    
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Handle commands
function handleCommand(command, argument) {
  switch (command) {
    case 'quick':
      return vera.quickToneCheck(argument);
      
    case 'conscious':
      return vera.analyzeWithConsciousness(argument || "Please provide content to analyze", 'conscious');
      
    case 'recommendations':
      return vera.getBrandRecommendations();
      
    case 'generate':
      return vera.generateContent(argument || 'story');
      
    case 'status':
      return vera.getBrandState();
      
    default:
      return { error: `Unknown command: ${command}` };
  }
}

// Get session info
app.get('/api/session/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (session) {
    res.json(session);
  } else {
    res.json({ error: "Session not found" });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🧠 VERA Web Interface running on port ${port}`);
  console.log('✨ Marketing Intelligence of Co-Regulation is live!');
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Local access: http://localhost:${port}`);
  }
});

module.exports = app;