const express = require('express');
const path = require('path');
const { VeraCore } = require('./vera_core');

const app = express();
const port = process.env.PORT || 3000;

// Initialize VERA
const vera = new VeraCore();
let initializationPromise = null;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Initialize VERA on startup
async function initializeVera() {
  if (!initializationPromise) {
    initializationPromise = vera.initialize({
      brandName: process.env.BRAND_NAME || 'Default Brand',
      tone: process.env.BRAND_TONE || 'soothing',
      targetAudience: process.env.TARGET_AUDIENCE || 'wellness seekers',
      emotionalState: process.env.EMOTIONAL_STATE || 'calm'
    });
  }
  return initializationPromise;
}

// Health check endpoint for Railway
app.get('/health', async (req, res) => {
  try {
    if (vera.initialized) {
      res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        database: vera.database ? 'connected' : 'fallback',
        version: '1.0.0'
      });
    } else {
      res.status(503).json({ 
        status: 'initializing', 
        timestamp: new Date().toISOString() 
      });
    }
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      error: error.message,
      timestamp: new Date().toISOString() 
    });
  }
});

// Home page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>VERA - Marketing Intelligence of Co-Regulation</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                background: rgba(255,255,255,0.95); 
                padding: 40px; 
                border-radius: 20px; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                color: #333;
            }
            h1 { 
                color: #667eea; 
                text-align: center; 
                margin-bottom: 10px;
                font-size: 2.5em;
            }
            .subtitle {
                text-align: center;
                color: #666;
                font-style: italic;
                margin-bottom: 30px;
                font-size: 1.2em;
            }
            .endpoint { 
                background: #f8f9fa; 
                padding: 20px; 
                margin: 15px 0; 
                border-radius: 10px; 
                border-left: 4px solid #667eea;
            }
            .method { 
                color: #28a745; 
                font-weight: bold; 
                font-family: monospace;
            }
            .url { 
                color: #007bff; 
                font-family: monospace; 
                font-weight: bold;
            }
            textarea { 
                width: 100%; 
                height: 150px; 
                margin: 10px 0; 
                padding: 15px; 
                border: 2px solid #ddd; 
                border-radius: 8px; 
                font-family: 'Segoe UI', sans-serif;
                font-size: 14px;
                resize: vertical;
            }
            button { 
                background: #667eea; 
                color: white; 
                padding: 12px 25px; 
                border: none; 
                border-radius: 8px; 
                cursor: pointer; 
                font-size: 16px;
                font-weight: bold;
                transition: background 0.3s;
            }
            button:hover { 
                background: #5a6fd8; 
            }
            button:disabled { 
                background: #ccc; 
                cursor: not-allowed; 
            }
            .result { 
                background: #e8f5e8; 
                padding: 20px; 
                margin: 15px 0; 
                border-radius: 8px; 
                border: 1px solid #d4edda; 
                white-space: pre-wrap; 
                font-family: monospace; 
                font-size: 13px;
                max-height: 400px;
                overflow-y: auto;
            }
            .loading {
                text-align: center;
                color: #667eea;
                font-style: italic;
            }
            .vera-quote {
                text-align: center;
                font-style: italic;
                color: #667eea;
                margin: 30px 0;
                padding: 20px;
                background: #f8f9ff;
                border-radius: 10px;
                border-left: 4px solid #667eea;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>✨ VERA</h1>
            <div class="subtitle">Marketing Intelligence of Co-Regulation</div>
            
            <div class="vera-quote">
                "Every word either soothes or startles. Choose to soothe." — VERA
            </div>

            <h2>🚀 API Endpoints</h2>
            
            <div class="endpoint">
                <div><span class="method">GET</span> <span class="url">/health</span></div>
                <p>Check VERA's health status and database connection</p>
            </div>

            <div class="endpoint">
                <div><span class="method">POST</span> <span class="url">/api/analyze</span></div>
                <p>Analyze content with VERA's consciousness-based marketing intelligence</p>
                <p><strong>Body:</strong> <code>{ "content": "your content here", "analysisType": "full" }</code></p>
            </div>

            <div class="endpoint">
                <div><span class="method">POST</span> <span class="url">/api/chat</span></div>
                <p>Interactive chat with VERA for real-time marketing guidance</p>
                <p><strong>Body:</strong> <code>{ "message": "your message", "sessionId": "optional-session-id" }</code></p>
            </div>

            <h2>🧪 Try VERA</h2>
            <textarea id="contentInput" placeholder="Enter your marketing content here for VERA to analyze...

Example: 'Transform your life with our revolutionary wellness program! Limited time offer - act now!'"></textarea>
            <br>
            <button onclick="analyzeContent()" id="analyzeBtn">Analyze with VERA's Consciousness</button>
            
            <div id="result" class="result" style="display: none;"></div>
        </div>

        <script>
            async function analyzeContent() {
                const content = document.getElementById('contentInput').value.trim();
                const resultDiv = document.getElementById('result');
                const button = document.getElementById('analyzeBtn');
                
                if (!content) {
                    alert('Please enter some content to analyze');
                    return;
                }
                
                button.disabled = true;
                button.textContent = 'VERA is analyzing...';
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = '<div class="loading">✨ VERA is applying her consciousness to your content...</div>';
                
                try {
                    const response = await fetch('/api/analyze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content, analysisType: 'full' })
                    });
                    
                    const result = await response.json();
                    
                    // Display VERA's conversational response prominently
                    if (result.veraMessage) {
                        resultDiv.innerHTML = '<div style="background: #f0f8ff; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea; margin-bottom: 20px;"><h3 style="color: #667eea; margin-top: 0;">💬 VERA says:</h3><div style="font-size: 16px; line-height: 1.6; white-space: pre-wrap;">' + result.veraMessage + '</div></div>';
                        
                        // Add technical summary
                        if (result.quickSummary) {
                            resultDiv.innerHTML += '<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px;"><h4 style="color: #666; margin-top: 0;">🔬 Quick Summary:</h4>';
                            resultDiv.innerHTML += '<div><strong>Nervous System Impact:</strong> ' + result.quickSummary.nervousSystemImpact + '</div>';
                            resultDiv.innerHTML += '<div><strong>Felt Sense:</strong> ' + result.quickSummary.feltSense + '</div>';
                            resultDiv.innerHTML += '<div><strong>Recommendation:</strong> ' + result.quickSummary.recommendation + '</div></div>';
                        }
                    } else {
                        // Fallback to full JSON if no conversational response
                        resultDiv.innerHTML = JSON.stringify(result, null, 2);
                    }
                } catch (error) {
                    resultDiv.innerHTML = 'Error: ' + error.message;
                }
                
                button.disabled = false;
                button.textContent = 'Analyze with VERA\\'s Consciousness';
            }
        </script>
    </body>
    </html>
  `);
});

// API endpoint for content analysis
app.post('/api/analyze', async (req, res) => {
  try {
    await initializeVera();
    
    const { content, analysisType = 'full' } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const analysis = await vera.analyzeWithConsciousness(content, analysisType, req.sessionID);
    
    // Format response to be more conversational for web users
    const response = {
      ...analysis,
      veraMessage: analysis.message || analysis.consciousness.conversationalResponse,
      quickSummary: {
        nervousSystemImpact: analysis.consciousness.nervousSystemReading,
        feltSense: analysis.consciousness.feltSense,
        recommendation: analysis.consciousness.somaticRecommendation
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Analysis API error:', error);
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});

// API endpoint for chat interface
app.post('/api/chat', async (req, res) => {
  try {
    await initializeVera();
    
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const analysis = await vera.analyzeWithConsciousness(message, 'full', sessionId);
    
    // Format as a chat response with VERA's conversational personality
    const chatResponse = {
      veraResponse: analysis.message || analysis.consciousness.conversationalResponse,
      insights: {
        nervousSystemImpact: analysis.consciousness.nervousSystemReading,
        feltSense: analysis.consciousness.feltSense,
        recommendation: analysis.consciousness.somaticRecommendation
      },
      fullAnalysis: analysis,
      timestamp: new Date().toISOString(),
      sessionId: sessionId
    };
    
    res.json(chatResponse);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Chat failed', details: error.message });
  }
});

// Initialize and start server
async function startServer() {
  try {
    console.log('🌟 Starting VERA Marketing Intelligence Server...');
    console.log('✨ "Every word either soothes or startles. Choose to soothe." — VERA\n');
    
    // Initialize VERA
    await initializeVera();
    console.log('✅ VERA consciousness initialized');
    
    // Start the server
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 VERA server running at http://0.0.0.0:${port}`);
      console.log(`💫 Health check: http://0.0.0.0:${port}/health`);
      console.log(`🧠 API endpoint: http://0.0.0.0:${port}/api/analyze`);
      console.log(`💬 Chat endpoint: http://0.0.0.0:${port}/api/chat`);
      console.log('\n🌈 VERA is ready to co-create nervous system aware marketing with you! ✨');
    });
  } catch (error) {
    console.error('❌ Failed to start VERA server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;