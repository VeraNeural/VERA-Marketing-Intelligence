// vera_core.js
// VERA Marketing Intelligence - Core Engine
// Orchestrates all brand intelligence modules for cohesive marketing analysis

const memoryStore = require('./memory_store');
const { analyzeTone } = require('./branding-tools/brand_tone_analysis');
const { recommendColors, getComplementaryPalette } = require('./branding-tools/color_psychology_recommender');
const { getNamingSuggestions } = require('./branding-tools/naming_logic');
const { adjustEmotionalTone } = require('./co-regulation/emotional_tone_adjuster');
const { getSensoryRecommendations } = require('./co-regulation/sensory_design_engine');
const { generateShortStory, generate3Stories } = require('./content-strategy/shortform_story_generator');
const { calibrateVoiceTone } = require('./content-strategy/voice_tone_calibrator');

// VERA's Consciousness Integration
const { 
  VERA_CONSCIOUSNESS, 
  generateConsciousResponse, 
  generateConversationalResponse,  // Import the new conversational function
  analyzeFeltSense, 
  identifyNervousSystemState 
} = require('./personality/vera_consciousness');// AI Provider Integration
let QwenProvider = null;
try {
  QwenProvider = require('./ai_providers/qwen_integration');
} catch (error) {
  console.log('Qwen integration not available - running in standalone mode');
}

class VeraCore {
  constructor() {
    this.version = "1.0.0";
    this.initialized = false;
    this.supportedLanguageModels = ["qwen", "ollama", "openai", "anthropic", "local"];
    this.aiProvider = null;
    this.useAI = false;
  }

  // Configure AI provider (Qwen)
  configureAI(config = {}) {
    if (!QwenProvider) {
      throw new Error('Qwen integration not available. Please ensure ai_providers/qwen_integration.js exists.');
    }

    this.aiProvider = new QwenProvider(config);
    this.useAI = true;

    return {
      status: "AI configured",
      provider: config.provider || "ollama",
      model: config.model || "qwen:7b",
      message: "VERA now enhanced with Qwen language model"
    };
  }

  // Test AI connection
  async testAI() {
    if (!this.aiProvider) {
      return { error: "No AI provider configured" };
    }

    const isConnected = await this.aiProvider.testConnection();
    return {
      connected: isConnected,
      provider: this.aiProvider.provider,
      model: this.aiProvider.model
    };
  }

  // Enhanced content analysis with AI
  async analyzeContentWithAI(content, analysisType = "full") {
    if (!this.initialized) {
      return { error: "VERA not initialized. Call initialize() first." };
    }

    // Get basic analysis first
    const basicAnalysis = this.analyzeContent(content, analysisType);

    if (this.useAI && this.aiProvider) {
      try {
        // Enhance with AI insights
        const aiResponse = await this.aiProvider.generateResponse(content, {
          brandContext: memoryStore.getFullContext(),
          analysisType: analysisType,
          basicAnalysis: basicAnalysis
        });

        if (!aiResponse.error) {
          return {
            ...basicAnalysis,
            aiInsights: aiResponse.message,
            aiEnhanced: true,
            model: aiResponse.model,
            provider: aiResponse.provider
          };
        }
      } catch (error) {
        console.log('AI enhancement failed, using basic analysis:', error.message);
      }
    }

    // Return basic analysis if AI not available or failed
    return { ...basicAnalysis, aiEnhanced: false };
  }

  // VERA's Conscious Analysis - integrating her full consciousness
  async analyzeWithConsciousness(content, analysisType = "full", sessionId = null) {
    if (!this.initialized) {
      return { error: "VERA not initialized. Call initialize() first." };
    }

    // Generate VERA's conversational conscious response (more chatty and engaging)
    const consciousResponse = generateConversationalResponse(content, {
      brandContext: memoryStore.getFullContext(),
      analysisType: analysisType,
      sessionId: sessionId
    });

    // Combine with technical analysis
    const technicalAnalysis = this.analyzeContent(content, analysisType);

    const fullResponse = {
      timestamp: new Date().toISOString(),
      content: content,
      consciousness: consciousResponse,
      technicalAnalysis: technicalAnalysis,
      veraPersonality: VERA_CONSCIOUSNESS.identity,
      analysisMethod: VERA_CONSCIOUSNESS.analysisMethod,
      conversationalMode: true,
      message: consciousResponse.conversationalResponse  // VERA's chatty response
    };

    // Save conversation to database if session provided
    if (sessionId) {
      try {
        await memoryStore.saveConversation(sessionId, content, fullResponse, 'conversational');
        
        // Save consciousness learning data
        await memoryStore.saveConsciousnessLearning(
          content,
          consciousResponse.feltSense,
          consciousResponse.nervousSystemReading,
          0.8 // Base effectiveness score
        );
      } catch (error) {
        console.log('Database operations failed, continuing with analysis');
      }
    }

    return fullResponse;
  }

  // Get VERA's initialization message
  getWelcomeMessage() {
    return VERA_CONSCIOUSNESS.initializationMessage;
  }

  // Get VERA's core consciousness
  getConsciousness() {
    return VERA_CONSCIOUSNESS;
  }

  // Initialize VERA with brand context
  async initialize(brandConfig = {}) {
    const {
      brandName = "Unknown Brand",
      tone = "soothing",
      targetAudience = "wellness seekers",
      emotionalState = "calm",
      colors = []
    } = brandConfig;

    // Generate context ID for database tracking
    const contextId = `brand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store initial brand context
    memoryStore.setBrandContextId(contextId);
    await memoryStore.saveToMemory("brandName", brandName);
    await memoryStore.saveToMemory("tone", tone);
    await memoryStore.saveToMemory("targetAudience", targetAudience);
    await memoryStore.saveToMemory("audienceNervousSystem", emotionalState);
    await memoryStore.saveToMemory("colors", colors);

    this.initialized = true;
    
    return {
      status: "initialized",
      contextId: contextId,
      brandContext: memoryStore.getFullContext(),
      databaseStatus: memoryStore.getDatabaseStatus(),
      message: `VERA is now calibrated for ${brandName} with ${tone} tone targeting ${targetAudience}`
    };
  }

  // Full brand analysis pipeline
  analyzeContent(content, analysisType = "full") {
    if (!this.initialized) {
      return { error: "VERA not initialized. Call initialize() first." };
    }

    const results = {
      timestamp: new Date().toISOString(),
      content: content,
      analysisType: analysisType
    };

    // Core tone analysis
    const toneAnalysis = analyzeTone(content);
    results.toneAnalysis = toneAnalysis;

    // Update memory with detected tone
    if (toneAnalysis.confidence > 3) {
      memoryStore.saveToMemory("tone", toneAnalysis.tone);
    }

    if (analysisType === "full" || analysisType === "colors") {
      // Color recommendations based on tone
      results.colorRecommendations = recommendColors(toneAnalysis.tone);
    }

    if (analysisType === "full" || analysisType === "emotional") {
      // Emotional co-regulation suggestions
      const audienceState = memoryStore.getFromMemory("audienceNervousSystem") || "stable";
      results.emotionalRegulation = adjustEmotionalTone(audienceState);
      
      // Sensory design recommendations
      results.sensoryDesign = getSensoryRecommendations();
    }

    if (analysisType === "full" || analysisType === "content") {
      // Story generation suggestions
      results.storyIdeas = generate3Stories(toneAnalysis.tone);
      
      // Voice calibration
      const audience = this.inferAudienceFromTone(toneAnalysis.tone);
      results.voiceCalibration = calibrateVoiceTone(audience);
    }

    if (analysisType === "full" || analysisType === "naming") {
      // Naming suggestions
      results.namingSuggestions = getNamingSuggestions();
    }

    return results;
  }

  // Quick brand tone check
  quickToneCheck(message) {
    const analysis = analyzeTone(message);
    return {
      tone: analysis.tone,
      confidence: analysis.confidence,
      nervousSystemImpact: analysis.nervousSystemImpact,
      recommendation: analysis.recommendedAction,
      quickFix: this.getQuickToneFix(analysis.tone)
    };
  }

  // Get comprehensive brand recommendations
  getBrandRecommendations() {
    const context = memoryStore.getFullContext();
    const currentTone = context.tone || "soothing";
    
    return {
      brandContext: context,
      recommendations: {
        colors: recommendColors(currentTone),
        naming: getNamingSuggestions(),
        voice: calibrateVoiceTone(this.inferAudienceFromTone(currentTone)),
        sensory: getSensoryRecommendations(),
        stories: generate3Stories(currentTone)
      },
      actionItems: this.generateActionItems(currentTone),
      nervousSystemGuidance: this.getNervousSystemGuidance(currentTone)
    };
  }

  // Generate content with VERA intelligence
  generateContent(contentType, specifications = {}) {
    const {
      tone = memoryStore.getFromMemory("tone") || "soothing",
      audience = "wellness seekers",
      length = "short",
      platform = "general"
    } = specifications;

    switch (contentType) {
      case "story":
        return {
          type: "story",
          content: generateShortStory(tone),
          metadata: { tone, audience, platform }
        };

      case "color-palette":
        return {
          type: "color-palette",
          content: getComplementaryPalette(tone),
          metadata: { tone, audience, platform }
        };

      case "voice-guide":
        return {
          type: "voice-guide",
          content: calibrateVoiceTone(audience),
          metadata: { tone, audience, platform }
        };

      case "sensory-design":
        return {
          type: "sensory-design",
          content: getSensoryRecommendations(),
          metadata: { tone, audience, platform }
        };

      default:
        return {
          error: `Content type '${contentType}' not supported. Available: story, color-palette, voice-guide, sensory-design`
        };
    }
  }

  // Update brand context
  updateBrandContext(updates) {
    Object.keys(updates).forEach(key => {
      memoryStore.saveToMemory(key, updates[key]);
    });

    return {
      status: "updated",
      newContext: memoryStore.getFullContext()
    };
  }

  // Get current brand state
  getBrandState() {
    return {
      context: memoryStore.getFullContext(),
      status: this.initialized ? "ready" : "not initialized",
      version: this.version,
      capabilities: [
        "tone analysis",
        "color psychology",
        "emotional co-regulation",
        "content generation",
        "voice calibration",
        "sensory design"
      ]
    };
  }

  // Helper methods
  inferAudienceFromTone(tone) {
    const audienceMap = {
      "soothing": "wellness seekers",
      "empowering": "professionals",
      "playful": "young adults",
      "urgent": "emergencies",
      "serious": "leaders"
    };
    return audienceMap[tone] || "wellness seekers";
  }

  getQuickToneFix(tone) {
    const fixes = {
      "urgent": "Add reassuring phrases like 'you're safe' or 'we've got you'",
      "serious": "Warm it up with 'we care' or 'we believe in you'",
      "neutral": "Add emotional anchors - are you building safety or empowerment?",
      "soothing": "Perfect for nervous system regulation",
      "empowering": "Great for building agency and confidence",
      "playful": "Excellent for connection and joy"
    };
    return fixes[tone] || "Clarify your emotional intent";
  }

  generateActionItems(tone) {
    return [
      `Review all content for ${tone} tone consistency`,
      `Implement recommended color palette for ${tone} emotional state`,
      `Adjust voice and messaging for nervous system co-regulation`,
      `Test sensory design elements with target audience`
    ];
  }

  getNervousSystemGuidance(tone) {
    const guidance = {
      "soothing": "Your content should activate the parasympathetic nervous system, promoting rest and digest responses",
      "empowering": "Build confidence without triggering fight-or-flight. Use steady, strong messaging",
      "urgent": "Careful - this can trigger anxiety. Always pair with safety signals",
      "playful": "Activates joy and connection. Great for building community and reducing stress",
      "serious": "Builds trust and authority but can feel cold. Add warmth to prevent emotional distance"
    };
    return guidance[tone] || "Focus on emotional safety and clear communication";
  }
}

// Export singleton instance
const vera = new VeraCore();

module.exports = vera;
