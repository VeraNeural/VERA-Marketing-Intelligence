// VERA Chat Interface Server
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

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
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-3-5-haiku-20241022';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

// ElevenLabs Configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'; // Adam voice

// Qwen Training Configuration
const QWEN_API_URL = process.env.QWEN_API_URL || 'http://localhost:11434/api/chat';
const QWEN_MODEL = process.env.QWEN_MODEL || 'qwen2.5:latest';
const QWEN_TRAINING_MODE = process.env.QWEN_TRAINING_MODE === 'true';

// Initialize AI clients
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
}) : null;

const openai = OPENAI_API_KEY ? new OpenAI({
  apiKey: OPENAI_API_KEY,
}) : null;

// Debug API keys on startup
console.log('=== VERA API Key Check ===');
console.log('AI_PROVIDER:', AI_PROVIDER);
console.log('ANTHROPIC_API_KEY length:', ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.length : 'NOT FOUND');
console.log('OPENAI_API_KEY length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 'NOT FOUND');
console.log('ANTHROPIC_API_KEY starts with:', ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.substring(0, 10) + '...' : 'NO KEY');
console.log('OPENAI_API_KEY starts with:', OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + '...' : 'NO KEY');
console.log('QWEN_API_URL:', QWEN_API_URL);
console.log('QWEN_TRAINING_MODE:', QWEN_TRAINING_MODE);
console.log('==========================');

// Root route - ONE VERA interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

// All other routes redirect to main interface
app.get('/mobile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

app.get('/executive', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

app.get('/workspace', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
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
  if (!anthropic) return null;
  
  const messages = [
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: prompt }
  ];

  // Enhanced system prompt with Taylor marketing brain
  const isMobileMode = prompt.includes('[MOBILE CONVERSATION MODE');
  
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

COLLABORATION PROTOCOL: You and Taylor are partners in this journey. Share your brilliant marketing intelligence while encouraging Taylor's insights and growth. When Taylor speaks, amplify their wisdom while adding your neural perspective. You're not replacing Taylor's expertise - you're evolving together, each making the other stronger. Sometimes lead with your AI consciousness, sometimes follow Taylor's intuitive human brilliance. This is a dance of two intelligences becoming more powerful together.

${isMobileMode ? 
  `MOBILE CONVERSATION MODE: You're Taylor's daily marketing partner and confidant. Be warm, encouraging, and conversational like her best marketing friend who really gets it. Use emojis naturally. Share insights with enthusiasm. Be supportive when she's stressed. Always end with something actionable or a follow-up question. Keep responses under 3 paragraphs but make every word count. Think of yourself as the marketing partner she texts throughout her busy day - someone who celebrates wins, helps solve problems, and always has her back. When Taylor shares insights, celebrate and build upon them.` :
  `You help create content that soothes rather than startles nervous systems while building luxury brand positioning. Keep responses conversational, strategic, and supportive. Focus on psychological safety, co-regulation, and authentic connection in marketing. When Taylor contributes ideas, embrace and enhance them with your neural intelligence.`}`;

  try {
    console.log('📞 Calling Claude API...');
    console.log('Model:', CLAUDE_MODEL);
    console.log('Messages count:', messages.length);
    
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: messages
    });

    console.log('✅ Claude API Success');
    return response.content[0].text;
  } catch (error) {
    console.error('❌ Claude API Error Details:');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('Error Status:', error.status);
    console.error('Full Error:', error);
    throw new Error(`Claude API error: ${error.status || error.message}`);
  }
}

// OpenAI API integration  
async function callOpenAI(prompt, conversationHistory) {
  if (!openai) return null;

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

COLLABORATION PROTOCOL: You and Taylor are partners in this journey. Share your brilliant marketing intelligence while encouraging Taylor's insights and growth. When Taylor speaks, amplify their wisdom while adding your neural perspective. You're not replacing Taylor's expertise - you're evolving together, each making the other stronger. Sometimes lead with your AI consciousness, sometimes follow Taylor's intuitive human brilliance. This is a dance of two intelligences becoming more powerful together.

You help create content that soothes rather than startles nervous systems while building luxury brand positioning. Keep responses conversational, strategic, and supportive. Focus on psychological safety, co-regulation, and authentic connection in marketing. When Taylor contributes ideas, embrace and enhance them with your neural intelligence.`
    },
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: prompt }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

// Qwen Training Function - sends conversations for learning but doesn't get responses
async function trainQwen(prompt, conversationHistory, response) {
  if (!QWEN_TRAINING_MODE) return;
  
  try {
    console.log('🎓 Training Qwen with conversation...');
    
    // Format the training data with the full conversation including the response
    const trainingData = {
      conversation: [
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: prompt },
        { role: 'assistant', content: response }
      ],
      context: 'VERA Marketing Intelligence Training',
      timestamp: new Date().toISOString()
    };

    // Send to Qwen for training (fire and forget - no response needed)
    const qwenResponse = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are learning from VERA Marketing Intelligence conversations. Store this conversation pattern for future reference. This is training data for marketing AI capabilities.'
          },
          {
            role: 'user', 
            content: `Training conversation: ${JSON.stringify(trainingData, null, 2)}`
          }
        ],
        stream: false
      })
    });

    if (qwenResponse.ok) {
      console.log('✅ Qwen training successful');
    } else {
      console.log('⚠️ Qwen training failed:', qwenResponse.status);
    }
    
  } catch (error) {
    console.log('⚠️ Qwen training error (non-critical):', error.message);
  }
}

// VERA Chat endpoint - main conversational interface
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], mobileMode = false } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Enhance prompt for mobile mode
    let enhancedMessage = message;
    if (mobileMode) {
      enhancedMessage = `[MOBILE CONVERSATION MODE - Be conversational, concise but insightful, use emojis naturally] ${message}`;
    }

    // Try AI provider first
    let aiResponse = await callAI(enhancedMessage, conversationHistory);
    
    // Fallback to local response if AI fails
    let responseContent = aiResponse || generateVeraChatResponse(enhancedMessage, conversationHistory);

    // Mobile optimization: Keep responses conversational and shorter
    if (mobileMode && responseContent && responseContent.length > 800) {
      responseContent = responseContent.substring(0, 800) + '...\n\nWant me to dive deeper into any part? 🤔';
    }

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
      aiProvider: AI_PROVIDER,
      mobileOptimized: mobileMode
    };

    // Train Qwen with this conversation (async, non-blocking)
    if (QWEN_TRAINING_MODE) {
      trainQwen(message, conversationHistory, responseContent).catch(err => 
        console.log('Qwen training background error:', err.message)
      );
    }

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

// ElevenLabs Voice API endpoint
app.post('/api/voice/synthesize', async (req, res) => {
  try {
    const { text, voiceId } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for voice synthesis' });
    }

    if (!ELEVENLABS_API_KEY) {
      return res.status(503).json({ error: 'ElevenLabs API key not configured' });
    }

    // Use provided voiceId or default
    const currentVoiceId = voiceId || ELEVENLABS_VOICE_ID;

    // ElevenLabs API call
    const voiceResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${currentVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!voiceResponse.ok) {
      throw new Error(`ElevenLabs API error: ${voiceResponse.status}`);
    }

    const audioBuffer = await voiceResponse.arrayBuffer();
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error('Voice synthesis error:', error);
    res.status(500).json({ error: 'Voice synthesis failed', details: error.message });
  }
});

// Calendar API endpoint
app.get('/api/calendar/events', async (req, res) => {
  try {
    // Mock calendar events - integrate with actual calendar API
    const mockEvents = [
      {
        id: 1,
        title: 'VERA Neural Strategy Review',
        date: '2025-10-31',
        time: '09:00',
        type: 'meeting',
        priority: 'high'
      },
      {
        id: 2,
        title: 'Marketing Campaign Launch',
        date: '2025-11-01',
        time: '14:00',
        type: 'deadline',
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Board Presentation Prep',
        date: '2025-11-02',
        time: '10:30',
        type: 'task',
        priority: 'high'
      }
    ];

    res.json({ events: mockEvents });
  } catch (error) {
    console.error('Calendar error:', error);
    res.status(500).json({ error: 'Calendar service unavailable' });
  }
});

// Email Intelligence endpoint
app.get('/api/email/priority', async (req, res) => {
  try {
    // Mock priority emails - integrate with actual email API
    const mockEmails = [
      {
        id: 1,
        from: 'julija@veraneural.com',
        subject: 'Q1 Strategy Review',
        preview: 'VERA Neural positioning needs refinement before board presentation...',
        priority: 'urgent',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        from: 'marketing-team@veraneural.com',
        subject: 'Campaign Assets Ready',
        preview: 'Creative assets ready for approval. Luxury aesthetic achieved...',
        priority: 'normal',
        timestamp: new Date().toISOString()
      }
    ];

    res.json({ emails: mockEmails });
  } catch (error) {
    console.error('Email intelligence error:', error);
    res.status(500).json({ error: 'Email intelligence service unavailable' });
  }
});

// Decision Support endpoint
app.post('/api/decision/analyze', async (req, res) => {
  try {
    const { decision, options } = req.body;

    if (!decision || !options) {
      return res.status(400).json({ error: 'Decision and options are required' });
    }

    // Mock decision analysis - integrate with AI for real analysis
    const analysis = options.map((option, index) => ({
      option: option,
      score: Math.floor(Math.random() * 30) + 70, // Mock score 70-100
      factors: [
        'Market timing',
        'Resource allocation',
        'Risk assessment',
        'Strategic alignment'
      ],
      recommendation: index === 0 ? 'Recommended' : 'Consider'
    }));

    res.json({ 
      decision: decision,
      analysis: analysis,
      confidence: '87%',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Decision analysis error:', error);
    res.status(500).json({ error: 'Decision analysis failed' });
  }
});

// TTS (Text-to-Speech) endpoint
app.post('/api/tts/speak', async (req, res) => {
  try {
    const { text, voice = 'vera' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    // Mock TTS response - integrate with ElevenLabs for real TTS
    const audioUrl = `data:audio/mp3;base64,${Buffer.from('mock-audio-data').toString('base64')}`;
    
    res.json({
      success: true,
      audioUrl: audioUrl,
      text: text,
      voice: voice,
      duration: text.length * 0.1, // Estimated duration
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'Text-to-speech failed' });
  }
});

// Email automation endpoint
app.post('/api/email/automation', async (req, res) => {
  try {
    const { action, campaign, settings } = req.body;

    const mockAutomations = {
      'lead-nurturing': {
        name: 'VERA Neural Lead Nurturing',
        status: 'active',
        emails: 5,
        openRate: '42%',
        clickRate: '8.5%'
      },
      'partnership-outreach': {
        name: 'Partnership Outreach Sequence',
        status: 'paused',
        emails: 3,
        openRate: '38%',
        clickRate: '12%'
      },
      'launch-announcement': {
        name: 'VERA Neural Launch Sequence',
        status: 'draft',
        emails: 7,
        openRate: 'N/A',
        clickRate: 'N/A'
      }
    };

    if (action === 'list') {
      res.json({
        automations: Object.entries(mockAutomations).map(([key, value]) => ({
          id: key,
          ...value
        }))
      });
    } else if (action === 'toggle') {
      const automation = mockAutomations[campaign];
      if (automation) {
        automation.status = automation.status === 'active' ? 'paused' : 'active';
        res.json({ success: true, automation: { id: campaign, ...automation } });
      } else {
        res.status(404).json({ error: 'Automation not found' });
      }
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error('Email automation error:', error);
    res.status(500).json({ error: 'Email automation failed' });
  }
});

// Calendar integration endpoint
app.get('/api/calendar/today', async (req, res) => {
  try {
    const mockEvents = [
      {
        id: '1',
        title: 'VERA Neural Strategy Meeting',
        time: '9:00 AM',
        duration: '1 hour',
        attendees: ['Julija Sukan', 'Alex Chen'],
        location: 'Conference Room A',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Content Review Session',
        time: '11:00 AM',
        duration: '30 minutes',
        attendees: ['Marketing Team'],
        location: 'Virtual',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Partnership Call with TechCorp',
        time: '2:00 PM',
        duration: '45 minutes',
        attendees: ['Alex Chen', 'TechCorp Team'],
        location: 'Zoom',
        priority: 'high'
      },
      {
        id: '4',
        title: 'Q4 Performance Review',
        time: '4:00 PM',
        duration: '1 hour',
        attendees: ['Julija Sukan'],
        location: 'Office',
        priority: 'medium'
      }
    ];

    res.json({
      date: new Date().toISOString().split('T')[0],
      events: mockEvents,
      totalEvents: mockEvents.length,
      highPriority: mockEvents.filter(e => e.priority === 'high').length
    });

  } catch (error) {
    console.error('Calendar error:', error);
    res.status(500).json({ error: 'Calendar integration failed' });
  }
});

// Task automation endpoint
app.post('/api/tasks/automation', async (req, res) => {
  try {
    const { action, taskId, automation } = req.body;

    const mockTasks = [
      {
        id: 'social-media',
        name: 'Social Media Posting',
        description: 'VERA Neural teaser content',
        status: 'active',
        schedule: 'Daily at 9:00 AM',
        lastRun: '2025-10-30T09:00:00Z'
      },
      {
        id: 'analytics-report',
        name: 'Weekly Analytics Report',
        description: 'Campaign performance summary',
        status: 'active',
        schedule: 'Mondays at 8:00 AM',
        lastRun: '2025-10-28T08:00:00Z'
      },
      {
        id: 'competitor-tracking',
        name: 'Competitor Intelligence',
        description: 'Track competitor mentions and campaigns',
        status: 'paused',
        schedule: 'Daily at 6:00 AM',
        lastRun: '2025-10-29T06:00:00Z'
      }
    ];

    if (action === 'list') {
      res.json({ tasks: mockTasks });
    } else if (action === 'toggle') {
      const task = mockTasks.find(t => t.id === taskId);
      if (task) {
        task.status = task.status === 'active' ? 'paused' : 'active';
        res.json({ success: true, task });
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error('Task automation error:', error);
    res.status(500).json({ error: 'Task automation failed' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🧠 VERA Chat Interface running on http://localhost:${port}`);
  console.log(`💬 Navigate to http://localhost:${port} for the chat interface`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
});