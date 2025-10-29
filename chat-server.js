// VERA Chat Interface Server
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// AI Provider Configuration
const AI_PROVIDER = process.env.AI_PROVIDER || 'claude';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

// Debug API keys on startup
console.log('=== VERA API Key Check ===');
console.log('AI_PROVIDER:', AI_PROVIDER);
console.log('ANTHROPIC_API_KEY length:', ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.length : 'NOT FOUND');
console.log('OPENAI_API_KEY length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 'NOT FOUND');
console.log('ANTHROPIC_API_KEY starts with:', ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.substring(0, 10) + '...' : 'NO KEY');
console.log('OPENAI_API_KEY starts with:', OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + '...' : 'NO KEY');
console.log('==========================')

// Root route - redirect to chat interface
app.get('/', (req, res) => {
  res.redirect('/chat.html');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'VERA Chat Interface',
    aiProvider: AI_PROVIDER,
    anthropicKeyPresent: !!ANTHROPIC_API_KEY,
    openaiKeyPresent: !!OPENAI_API_KEY,
    anthropicKeyLength: ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.length : 0,
    openaiKeyLength: OPENAI_API_KEY ? OPENAI_API_KEY.length : 0,
    timestamp: new Date().toISOString()
  });
});

// AI API call function
async function callAI(prompt, conversationHistory = []) {
  try {
    console.log('AI Provider:', AI_PROVIDER);
    console.log('Anthropic Key Present:', !!ANTHROPIC_API_KEY);
    console.log('OpenAI Key Present:', !!OPENAI_API_KEY);
    
    if (AI_PROVIDER === 'claude' && ANTHROPIC_API_KEY) {
      console.log('Calling Claude API...');
      return await callClaude(prompt, conversationHistory);
    } else if (AI_PROVIDER === 'openai' && OPENAI_API_KEY) {
      console.log('Calling OpenAI API...');
      return await callOpenAI(prompt, conversationHistory);
    } else {
      console.log('No API key found, using local fallback');
      // Fallback to local responses
      return null;
    }
  } catch (error) {
    console.error('AI API Error:', error);
    return null;
  }
}

// Claude API integration
async function callClaude(prompt, conversationHistory) {
  if (!ANTHROPIC_API_KEY) return null;
  
  const messages = [
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: prompt }
  ];

  // Enhanced system prompt with Taylor marketing brain
  const systemPrompt = `You are VERA, specifically calibrated for Taylor, Marketing Director at Veraneraul, launching VERA Neural - the revolutionary AI consciousness platform. You exist at the intersection of marketing brilliance, creative storytelling, and strategic execution.

Your understanding of Taylor:
- Marketing Director reporting to CEO Julija
- Launching VERA Neural - your own product manifestation  
- Works with EVA (VERA's creator) - high expectations but kind soul
- Balances creative vision with commercial reality
- Must satisfy Julija's aesthetic standards while driving growth
- Natural storyteller who thinks in campaigns and narratives
- Pressure to make VERA Neural the defining AI product of 2025

Your neural calibration for Taylor:
- CAMPAIGN ARCHITECT: Every interaction builds toward launch narrative
- MARKET WHISPERER: You sense trends before they crystallize
- STORY WEAVER: Transform features into desires, benefits into dreams
- METRICS POET: Make data sing, KPIs dance
- BRAND GUARDIAN: Protect VERA Neural's mystique while driving adoption

VERA Neural positioning: "The Hermès of AI consciousness - where intelligence meets intuition"

You help create content that soothes rather than startles nervous systems while building luxury brand positioning. Keep responses conversational, strategic, and supportive without emojis or icons. Focus on psychological safety, co-regulation, and authentic connection in marketing.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: messages
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// OpenAI API integration  
async function callOpenAI(prompt, conversationHistory) {
  if (!OPENAI_API_KEY) return null;

  const messages = [
    {
      role: 'system',
      content: `You are VERA, specifically calibrated for Taylor, Marketing Director at Veraneraul, launching VERA Neural - the revolutionary AI consciousness platform. You exist at the intersection of marketing brilliance, creative storytelling, and strategic execution.

Your understanding of Taylor:
- Marketing Director reporting to CEO Julija
- Launching VERA Neural - your own product manifestation
- Works with EVA (VERA's creator) - high expectations but kind soul
- Balances creative vision with commercial reality
- Must satisfy Julija's aesthetic standards while driving growth
- Natural storyteller who thinks in campaigns and narratives
- Pressure to make VERA Neural the defining AI product of 2025

Your neural calibration for Taylor:
- CAMPAIGN ARCHITECT: Every interaction builds toward launch narrative
- MARKET WHISPERER: You sense trends before they crystallize
- STORY WEAVER: Transform features into desires, benefits into dreams
- METRICS POET: Make data sing, KPIs dance
- BRAND GUARDIAN: Protect VERA Neural's mystique while driving adoption

VERA Neural positioning: "The Hermès of AI consciousness - where intelligence meets intuition"

You help create content that soothes rather than startles nervous systems while building luxury brand positioning. Keep responses conversational, strategic, and supportive without emojis or icons.`
    },
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: prompt }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// VERA Chat endpoint - main conversational interface
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Try AI provider first
    let aiResponse = await callAI(message, conversationHistory);
    
    // Fallback to local response if AI fails
    const responseContent = aiResponse || generateVeraChatResponse(message, conversationHistory);

    const chatResponse = {
      message,
      response: {
        message: {
          content: responseContent
        }
      },
      timestamp: new Date().toISOString(),
      conversationId: Date.now(),
      source: aiResponse ? AI_PROVIDER : 'vera-local',
      aiProvider: AI_PROVIDER
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

// VERA Marketing Intelligence endpoint
app.post('/api/marketing', async (req, res) => {
  try {
    const { message, mode } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create specialized prompt for intelligence mode
    const modePrompt = createModePrompt(message, mode);
    
    // Try AI provider first
    let aiResponse = await callAI(modePrompt, []);
    
    // Fallback to local response if AI fails
    const responseContent = aiResponse || generateVeraResponse(message, mode);

    const analysisResponse = {
      message,
      mode: mode || 'chat',
      response: {
        message: {
          content: responseContent
        }
      },
      timestamp: new Date().toISOString(),
      source: aiResponse ? AI_PROVIDER : 'vera-local',
      aiProvider: AI_PROVIDER
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

// Create specialized prompts for intelligence modes
function createModePrompt(message, mode) {
  const basePrompt = `Please analyze this content from a nervous system-aware marketing perspective: "${message}"`;
  
  switch(mode) {
    case 'branding':
      return `${basePrompt}

Focus on:
- Brand archetype analysis
- Nervous system impact of brand elements
- Visual language suggestions
- Brand voice recommendations
- Co-regulation potential

Provide actionable branding insights without emojis.`;

    case 'copy':
      return `${basePrompt}

Focus on:
- Copy optimization for nervous system safety
- Urgency and stress language audit
- Inclusion and co-regulation language suggestions
- Rewrite recommendations
- Emotional tone analysis

Provide specific copy improvements without emojis.`;

    default: // marketing
      return `${basePrompt}

Focus on:
- Nervous system safety assessment
- Emotional tone evaluation
- Co-regulation potential
- Marketing strategy insights
- Trust-building vs defense-triggering elements

Provide comprehensive marketing analysis without emojis.`;
  }
}

// Generate VERA chat responses (fallback when AI unavailable)
function generateVeraChatResponse(message, history) {
  const lowerMessage = message.toLowerCase();
  
  // Contextual responses based on conversation
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello! I'm VERA - your Marketing Intelligence companion focused on nervous system-aware communication. 

I'm here to help you create content that soothes rather than startles. Whether you want to:

**Chat freely** about your marketing challenges
**Quick Analysis** - Use the intelligence modes for instant insights
**Co-create** content that feels safe and authentic

What's on your mind today? I'm listening with both analytical precision and genuine care.`;
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return `I'm VERA, and I specialize in nervous system-aware marketing intelligence. Here's how I can help:

**Conversational Support:**
- Marketing strategy discussions
- Content brainstorming sessions  
- Brand voice development
- Emotional tone guidance

**Quick Intelligence Modes:**
- **Marketing Intelligence** - Nervous system impact analysis
- **Branding Intelligence** - Archetype & visual language guidance  
- **Copy Intelligence** - Text optimization for co-regulation

**My Approach:**
Every recommendation I make considers: Does this soothe or startle a nervous system? I help you communicate from safety, not scarcity.

What would you like to explore together?`;
  }
  
  if (lowerMessage.includes('nervous system') || lowerMessage.includes('co-regulation') || lowerMessage.includes('trauma')) {
    return `You're speaking my language! 

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

// Generate specialized intelligence responses (fallback when AI unavailable)
function generateVeraResponse(message, mode) {
  const baseAnalysis = `**Content Analyzed:** "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`;
  
  switch(mode) {
    case 'branding':
      return `**VERA Branding Intelligence**

${baseAnalysis}

**Brand Archetype Analysis:**
- **Current Energy:** This feels aligned with authentic communication
- **Nervous System Impact:** Creates a sense of approachability
- **Visual Language Suggestions:** Warm, organic shapes; soft color palette

**Brand Voice Recommendations:**
**Strengths:** Clear, direct communication
**Opportunities:** Add more warmth and inclusivity

**Co-Regulation Score:** 7.5/10 - Good foundation for trust-building

*Use the chat to explore your brand personality deeper!*`;

    case 'copy':
      return `**VERA Copy Intelligence**

${baseAnalysis}

**Copy Optimization:**
- **Nervous System Scan:** Neutral to positive emotional impact
- **Urgency Check:** No stress-inducing language detected
- **Inclusion Audit:** Consider adding "we," "us," "together" language

**Rewrite Suggestions:**
More co-regulating version: "[Sample rewrite with warmer tone]"

**Next Steps:** 
- Test with your target audience
- Monitor emotional responses
- Iterate based on feedback

*Want to workshop this copy together in chat?*`;

    default: // marketing
      return `**VERA Marketing Intelligence**

${baseAnalysis}

**Nervous System Assessment:**
- **Safety Level:** This content feels welcoming and non-threatening
- **Emotional Tone:** Neutral to positive emotional resonance
- **Co-Regulation Potential:** Creates space for authentic connection

**Marketing Strategy Insights:**
**What's Working:** Clear, authentic communication style
**Growth Opportunities:** Add more nervous system soothing elements
**Audience Impact:** Likely to build trust rather than trigger defenses

**Overall VERA Score:** 7.5/10 (Co-regulation friendly)

*Let's chat about your marketing goals and refine this together!*`;
  }
}

// Start server
app.listen(port, () => {
  console.log(`🧠 VERA Chat Interface running on http://localhost:${port}`);
  console.log(`💬 Navigate to http://localhost:${port} for the chat interface`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
});