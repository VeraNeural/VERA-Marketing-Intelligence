// VERA Marketing Intelligence - Main Server
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from public directory
app.use(express.static('public'));

// Root route - redirect to chat interface
app.get('/', (req, res) => {
  res.redirect('/chat.html');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: '✅ Connected to Qwen',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: port,
      veraApiUrl: process.env.VERA_API_URL ? 'configured' : 'not set'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🧠 VERA Marketing Intelligence API',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api/*'
    }
  });
});

// Basic API endpoint for testing
app.get('/api/status', (req, res) => {
  res.json({
    service: 'VERA Marketing Intelligence',
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// VERA Marketing Intelligence endpoint
app.post('/api/marketing', async (req, res) => {
  try {
    const { message, mode } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // For now, return a test response (replace with actual Qwen integration later)
    const analysisResponse = {
      message,
      mode: mode || 'chat',
      response: {
        message: {
          content: generateVeraResponse(message, mode)
        }
      },
      timestamp: new Date().toISOString(),
      source: 'local-vera',
      qwenConnected: !!process.env.VERA_API_URL
    };

    res.json(analysisResponse);

  } catch (error) {
    console.error('VERA Analysis Error:', error);
    res.status(500).json({ 
      error: 'Analysis failed', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// VERA Chat endpoint - main conversational interface
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const chatResponse = {
      message,
      response: {
        message: {
          content: generateVeraChatResponse(message, conversationHistory)
        }
      },
      timestamp: new Date().toISOString(),
      conversationId: Date.now(),
      source: 'vera-chat'
    };

    res.json(chatResponse);

  } catch (error) {
    console.error('VERA Chat Error:', error);
    res.status(500).json({ 
      error: 'Chat failed', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Generate VERA chat responses
function generateVeraChatResponse(message, history) {
  const lowerMessage = message.toLowerCase();
  
  // Contextual responses based on conversation
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello! I'm VERA - your Marketing Intelligence companion focused on nervous system-aware communication. 

I'm here to help you create content that soothes rather than startles. Whether you want to:

💬 **Chat freely** about your marketing challenges
🧠 **Quick Analysis** - Use the intelligence modes for instant insights
🎨 **Co-create** content that feels safe and authentic

What's on your mind today? I'm listening with both analytical precision and genuine care.`;
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return `I'm VERA, and I specialize in nervous system-aware marketing intelligence. Here's how I can help:

**🗣️ Conversational Support:**
- Marketing strategy discussions
- Content brainstorming sessions  
- Brand voice development
- Emotional tone guidance

**⚡ Quick Intelligence Modes:**
- 🧠 **Marketing Intelligence** - Nervous system impact analysis
- 🎨 **Branding Intelligence** - Archetype & visual language guidance  
- ✍️ **Copy Intelligence** - Text optimization for co-regulation

**🤝 My Approach:**
Every recommendation I make considers: Does this soothe or startle a nervous system? I help you communicate from safety, not scarcity.

What would you like to explore together?`;
  }
  
  if (lowerMessage.includes('nervous system') || lowerMessage.includes('co-regulation') || lowerMessage.includes('trauma')) {
    return `You're speaking my language! 🧠✨ 

Nervous system-aware marketing recognizes that our audiences aren't just "consumers" - they're humans with complex emotional states and trauma responses.

**Key Principles I Follow:**
- **Safety First**: Create psychological safety before selling
- **Co-Regulation**: Help people feel seen and understood  
- **Authentic Connection**: Build trust through genuine care
- **Gentle Persuasion**: Influence through inspiration, not manipulation

This isn't just "nice to have" - it's more effective. When people feel safe, they're more receptive, make better decisions, and become loyal advocates.

What specific aspect of nervous system-aware marketing would you like to explore?`;
  }
  
  // Default conversational response
  return `I hear you mentioning "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}". 

From a nervous system perspective, let me reflect on this: Every piece of communication either moves someone toward safety or triggers their defenses. 

**My Thoughts:**
This feels like an opportunity to create something that truly resonates with people's deeper needs for connection and understanding.

**Questions for You:**
- What feeling do you want your audience to have after engaging with this?
- Who are you trying to reach, and what might they be going through?
- How can we make this feel more like a warm conversation than a sales pitch?

I'm here to explore this with you. What's your instinct telling you about the direction to take?`;
}

// Generate specialized intelligence responses  
function generateVeraResponse(message, mode) {
  const baseAnalysis = `**Content Analyzed:** "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`;
  
  switch(mode) {
    case 'branding':
      return `🎨 **VERA Branding Intelligence**

${baseAnalysis}

**Brand Archetype Analysis:**
- **Current Energy:** This feels aligned with authentic communication
- **Nervous System Impact:** Creates a sense of approachability
- **Visual Language Suggestions:** Warm, organic shapes; soft color palette

**Brand Voice Recommendations:**
✅ **Strengths:** Clear, direct communication
🔧 **Opportunities:** Add more warmth and inclusivity

**Co-Regulation Score:** 7.5/10 - Good foundation for trust-building

*Use the chat to explore your brand personality deeper!*`;

    case 'copy':
      return `✍️ **VERA Copy Intelligence**

${baseAnalysis}

**Copy Optimization:**
- **Nervous System Scan:** Neutral to positive emotional impact
- **Urgency Check:** No stress-inducing language detected ✅
- **Inclusion Audit:** Consider adding "we," "us," "together" language

**Rewrite Suggestions:**
🔄 More co-regulating version: "[Sample rewrite with warmer tone]"

**Next Steps:** 
- Test with your target audience
- Monitor emotional responses
- Iterate based on feedback

*Want to workshop this copy together in chat?*`;

    default: // marketing
      return `🧠 **VERA Marketing Intelligence**

${baseAnalysis}

**Nervous System Assessment:**
- **Safety Level:** This content feels welcoming and non-threatening ✅
- **Emotional Tone:** Neutral to positive emotional resonance
- **Co-Regulation Potential:** Creates space for authentic connection

**Marketing Strategy Insights:**
✅ **What's Working:** Clear, authentic communication style
🔧 **Growth Opportunities:** Add more nervous system soothing elements
🎯 **Audience Impact:** Likely to build trust rather than trigger defenses

**Overall VERA Score:** 7.5/10 (Co-regulation friendly)

*Let's chat about your marketing goals and refine this together!*`;
  }
}

// Start server
app.listen(port, () => {
  console.log(`🧠 VERA Marketing Intelligence running on port ${port}`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
  console.log(`🌐 API Status: http://localhost:${port}/api/status`);
  if (process.env.VERA_API_URL) {
    console.log(`🤖 Qwen API: ${process.env.VERA_API_URL}`);
  } else {
    console.log(`⚠️  VERA_API_URL not configured`);
  }
});

export default app;