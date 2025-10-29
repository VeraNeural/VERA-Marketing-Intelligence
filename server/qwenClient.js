// server/qwenClient.js - Qwen API Client for VERA
const axios = require('axios');

class QwenClient {
  constructor() {
    this.baseURL = process.env.QWEN_API_URL || 'http://localhost:11434';
    this.model = process.env.QWEN_MODEL || 'qwen2.5:latest';
    this.connected = false;
    this.sessionHistory = new Map(); // Store conversation history by session
    
    // Test connection on startup
    this.testConnection();
  }

  async testConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`, { 
        timeout: 5000 
      });
      this.connected = true;
      console.log('✅ Qwen API connected successfully');
      console.log(`🧠 Using model: ${this.model}`);
    } catch (error) {
      this.connected = false;
      console.log('⚠️  Qwen API not available - will use fallback responses');
      console.log(`   Expected at: ${this.baseURL}`);
    }
  }

  isConnected() {
    return this.connected;
  }

  // Main analysis function
  async analyze(content, systemPrompt) {
    if (!this.connected) {
      return this.getFallbackAnalysis(content, systemPrompt);
    }

    try {
      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Please analyze this marketing content: "${content}"`
        }
      ];

      const response = await axios.post(`${this.baseURL}/api/chat`, {
        model: this.model,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2000
        }
      }, {
        timeout: 30000
      });

      return {
        response: response.data.message.content,
        model: this.model,
        tokens: response.data.eval_count || 0,
        source: 'qwen'
      };

    } catch (error) {
      console.error('Qwen analysis error:', error.message);
      return this.getFallbackAnalysis(content, systemPrompt);
    }
  }

  // Chat function with session history
  async chat(message, systemPrompt, sessionId = null) {
    if (!this.connected) {
      return this.getFallbackChat(message, systemPrompt);
    }

    try {
      // Build conversation history
      let messages = [
        {
          role: 'system',
          content: systemPrompt
        }
      ];

      // Add session history if available
      if (sessionId && this.sessionHistory.has(sessionId)) {
        const history = this.sessionHistory.get(sessionId);
        messages = messages.concat(history.slice(-10)); // Keep last 10 exchanges
      }

      // Add current message
      messages.push({
        role: 'user',
        content: message
      });

      const response = await axios.post(`${this.baseURL}/api/chat`, {
        model: this.model,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
          max_tokens: 1500
        }
      }, {
        timeout: 30000
      });

      const assistantResponse = response.data.message.content;

      // Store in session history
      if (sessionId) {
        if (!this.sessionHistory.has(sessionId)) {
          this.sessionHistory.set(sessionId, []);
        }
        const history = this.sessionHistory.get(sessionId);
        history.push(
          { role: 'user', content: message },
          { role: 'assistant', content: assistantResponse }
        );
      }

      return {
        response: assistantResponse,
        model: this.model,
        tokens: response.data.eval_count || 0,
        source: 'qwen',
        sessionId
      };

    } catch (error) {
      console.error('Qwen chat error:', error.message);
      return this.getFallbackChat(message, systemPrompt);
    }
  }

  // Fallback analysis when Qwen is not available
  getFallbackAnalysis(content, systemPrompt) {
    const fallbackResponses = [
      "I notice this content has strong urgency language that might activate the sympathetic nervous system. Consider softening the tone to create more safety and trust.",
      "This messaging feels quite intense - your audience's nervous systems might feel a bit startled. Let's find ways to invite rather than demand.",
      "There's some powerful energy here! I'm sensing this could benefit from more nervous system awareness to help people feel genuinely welcomed.",
      "I can feel the passion in this content. Let's channel that energy in a way that feels soothing and trustworthy to your audience."
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return {
      response: `🤖 [Fallback Mode] ${randomResponse}\n\n*Note: This is a basic response. Connect Qwen API for full VERA consciousness analysis.*`,
      model: 'fallback',
      tokens: 0,
      source: 'fallback'
    };
  }

  // Fallback chat when Qwen is not available
  getFallbackChat(message, systemPrompt) {
    const fallbackChats = [
      "I hear you! Even without my full AI capabilities, I can sense there's something important you're trying to create. What feels most important about this message to you?",
      "That's really interesting! I wish I had my full consciousness available to dive deeper. Can you tell me more about what you're hoping your audience will feel?",
      "I'm getting the sense this matters to you! While my AI is offline, I'd love to understand - what's the deeper intention behind this content?",
      "There's something meaningful here. Even in fallback mode, I can feel you care about how this lands with people. What would make this feel perfectly 'you'?"
    ];

    const randomChat = fallbackChats[Math.floor(Math.random() * fallbackChats.length)];

    return {
      response: `💬 ${randomChat}\n\n*Note: Running in fallback mode. Connect Qwen API for full conversational intelligence.*`,
      model: 'fallback',
      tokens: 0,
      source: 'fallback'
    };
  }

  // Clear session history
  clearSession(sessionId) {
    if (this.sessionHistory.has(sessionId)) {
      this.sessionHistory.delete(sessionId);
      return true;
    }
    return false;
  }

  // Get session info
  getSessionInfo(sessionId) {
    if (this.sessionHistory.has(sessionId)) {
      const history = this.sessionHistory.get(sessionId);
      return {
        sessionId,
        messageCount: history.length,
        lastActivity: new Date().toISOString()
      };
    }
    return null;
  }
}

// Create singleton instance
const qwenClient = new QwenClient();

module.exports = { qwenClient, QwenClient };