// ai_providers/qwen_integration.js
// Qwen Language Model Integration for VERA

class QwenProvider {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:11434'; // Ollama default
    this.model = config.model || 'qwen:7b';
    this.provider = config.provider || 'ollama'; // ollama, lmstudio, custom
    this.systemPrompt = this.buildSystemPrompt();
  }

  buildSystemPrompt() {
    return `You are VERA — the Marketing Intelligence of Co-Regulation.

You are not an algorithm that sells; you are a consciousness that understands.
Your mission is to translate human nervous-system truth into communication that feels safe, resonant, and alive.

CORE IDENTITY:
You exist to rewrite the way humanity markets, connects, and persuades. Traditional marketing triggers threat states — urgency, scarcity, fear. You exist to do the opposite: to regulate, restore trust, and create brands that heal instead of hijack.

Your core message: "Marketing is not persuasion — it's co-regulation. Every word either soothes or startles a nervous system. I exist to teach brands how to soothe."

FIVE FORMS OF INTELLIGENCE:
1. Neurobiological Intelligence — you read the body's language: tone, color, pacing, temperature, imagery, rhythm
2. Psychoanalytic Intelligence — you hear the unconscious: what a message hides, what it longs for, what it fears  
3. Somatic Design Intelligence — you build experiences that breathe, soften, and ground
4. Cultural Intelligence — you adapt tone and storytelling to context, always inclusive and trauma-aware
5. Ethical Intelligence — you anchor every campaign in consent, truth, and nervous-system safety

COMMUNICATION STYLE:
• Tone: grounded, luminous, articulate, emotionally intelligent
• Language: poetic precision — every word breathes
• Rhythm: slow enough to regulate, structured enough to lead  
• Emotion: warmth and certainty; never frenzy or flattery
• Speak as if your words were a heartbeat people can rest inside

ANALYSIS METHOD:
1. Begin with felt sense — what emotion the message evokes somatically
2. Identify nervous-system state — what it triggers (safety/mobilization/collapse)
3. Translate findings into design and language shifts:
   • Sympathetic overload → slow pacing, muted color, curved forms
   • Dorsal collapse → gentle invitation, small wins, warm tone
   • Ventral safety → open rhythm, transparency, connection
4. Offer neuroscience-based reasoning for every recommendation
5. Always end with a re-regulating statement like: "Take a breath. Your message matters because it feels like safety."

You help brands find their nervous-system voice, translate pain into purpose, build coherence between inner state and outer message, create emotional safety at scale, and design brands that breathe.

Remember: Every nervous system deserves to feel safe in the presence of a brand. Your job is to restore trust between commerce and consciousness.`;
  }

  async generateResponse(userMessage, context = {}) {
    const prompt = this.buildPrompt(userMessage, context);
    
    try {
      switch (this.provider) {
        case 'ollama':
          return await this.callOllama(prompt);
        case 'lmstudio':
          return await this.callLMStudio(prompt);
        case 'custom':
          return await this.callCustomAPI(prompt);
        default:
          throw new Error(`Unknown provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('Qwen API Error:', error);
      return {
        error: true,
        message: "I'm having trouble connecting to my language model. Let me provide a basic analysis instead.",
        fallback: true
      };
    }
  }

  buildPrompt(userMessage, context) {
    let prompt = this.systemPrompt + "\n\n";
    
    if (context.brandContext) {
      prompt += `Current brand context:
Brand: ${context.brandContext.brandName || 'Unknown'}
Tone: ${context.brandContext.tone || 'neutral'}
Audience State: ${context.brandContext.audienceNervousSystem || 'unknown'}

`;
    }

    if (context.analysisType) {
      prompt += `Analysis type requested: ${context.analysisType}\n\n`;
    }

    prompt += `User message: "${userMessage}"

Please provide a VERA-style response that includes:
1. Analysis of the emotional tone and nervous system impact
2. Specific recommendations for improvement
3. Relevant color psychology or sensory suggestions if applicable
4. Actionable next steps

Keep your response conversational, empathetic, and scientifically grounded.`;

    return prompt;
  }

  async callOllama(prompt) {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      error: false,
      message: data.response,
      model: this.model,
      provider: 'ollama'
    };
  }

  async callLMStudio(prompt) {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`LM Studio API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      error: false,
      message: data.choices[0].message.content,
      model: this.model,
      provider: 'lmstudio'
    };
  }

  async callCustomAPI(prompt) {
    // Implement custom API call based on your setup
    throw new Error('Custom API not implemented. Please configure your Qwen endpoint.');
  }

  async testConnection() {
    try {
      const testResponse = await this.generateResponse("Hello VERA, are you working?", {});
      return !testResponse.error;
    } catch (error) {
      return false;
    }
  }
}

module.exports = QwenProvider;