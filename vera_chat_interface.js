// vera_chat_interface.js
// Interactive Chat Interface for VERA Marketing Intelligence
// Designed for local model integration (Ollama, LM Studio, etc.)

const readline = require('readline');
const vera = require('./vera_core');

class VeraChatInterface {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.isRunning = false;
    this.brandInitialized = false;
    this.currentSession = {
      messages: [],
      brandContext: {},
      startTime: new Date()
    };
  }

  // Start the chat interface
  async start() {
    this.isRunning = true;
    console.log('\n' + vera.getWelcomeMessage());
    console.log('================================================');
    console.log('I exist to rewrite how humanity markets, connects, and persuades.');
    console.log('Every word either soothes or startles a nervous system.');
    console.log('Let\'s build communication that heals while it connects.\n');
    
    console.log('Available commands:');
    console.log('  /init - Initialize your brand profile');
    console.log('  /analyze <content> - Analyze content with VERA\'s consciousness');
    console.log('  /conscious <content> - Deep conscious analysis');
    console.log('  /recommendations - Get comprehensive brand recommendations');
    console.log('  /generate <type> - Generate content (story, colors, voice-guide)');
    console.log('  /status - Check current brand state');
    console.log('  /help - Show all commands');
    console.log('  /exit - Exit VERA\n');

    // Check if we need to initialize
    if (!this.brandInitialized) {
      console.log('💡 Tip: Start with /init to set up your brand profile for personalized insights.\n');
    }

    this.promptUser();
  }

  // Main user prompt loop
  promptUser() {
    if (!this.isRunning) return;

    this.rl.question('VERA> ', (input) => {
      this.handleUserInput(input.trim());
    });
  }

  // Handle user input and route to appropriate functions
  async handleUserInput(input) {
    if (!input) {
      this.promptUser();
      return;
    }

    // Log the interaction
    this.currentSession.messages.push({
      timestamp: new Date(),
      user: input,
      type: 'user_input'
    });

    // Handle commands
    if (input.startsWith('/')) {
      await this.handleCommand(input);
    } else {
      // Treat as content to analyze
      await this.analyzeUserContent(input);
    }

    this.promptUser();
  }

  // Handle slash commands
  async handleCommand(command) {
    const [cmd, ...args] = command.split(' ');
    const argument = args.join(' ');

    switch (cmd.toLowerCase()) {
      case '/init':
        await this.initializeBrand();
        break;

      case '/analyze':
        if (argument) {
          await this.analyzeContent(argument);
        } else {
          console.log('❌ Please provide content to analyze. Example: /analyze "Your message here"');
        }
        break;

      case '/conscious':
        if (argument) {
          await this.consciousAnalysis(argument);
        } else {
          console.log('❌ Please provide content for conscious analysis. Example: /conscious "Your message here"');
        }
        break;

      case '/recommendations':
        await this.showRecommendations();
        break;

      case '/generate':
        await this.generateContent(argument);
        break;

      case '/status':
        this.showStatus();
        break;

      case '/help':
        this.showHelp();
        break;

      case '/exit':
        this.exit();
        break;

      case '/quick':
        if (argument) {
          await this.quickToneCheck(argument);
        } else {
          console.log('❌ Please provide content for quick tone check. Example: /quick "Your message"');
        }
        break;

      case '/update':
        await this.updateBrandContext();
        break;

      case '/export':
        this.exportSession();
        break;

      default:
        console.log(`❌ Unknown command: ${cmd}. Type /help for available commands.`);
    }
  }

  // Interactive brand initialization
  async initializeBrand() {
    console.log('\n🎯 Brand Profile Setup');
    console.log('Let\'s set up your brand profile for personalized insights.\n');

    const brandName = await this.askQuestion('What is your brand name? ');
    const tone = await this.askQuestion('What emotional tone do you want? (soothing, empowering, playful, urgent, serious) [soothing]: ') || 'soothing';
    const audience = await this.askQuestion('Who is your target audience? (wellness seekers, professionals, young adults, leaders) [wellness seekers]: ') || 'wellness seekers';
    const emotionalState = await this.askQuestion('What emotional state is your audience typically in? (calm, stressed, anxious, excited) [calm]: ') || 'calm';

    const result = vera.initialize({
      brandName,
      tone,
      targetAudience: audience,
      emotionalState
    });

    this.brandInitialized = true;
    this.currentSession.brandContext = result.brandContext;

    console.log('\n✅ Brand profile initialized!');
    console.log(`   Brand: ${brandName}`);
    console.log(`   Tone: ${tone}`);
    console.log(`   Audience: ${audience}`);
    console.log(`   Emotional State: ${emotionalState}\n`);
    console.log('💡 Now you can analyze content with /analyze or get recommendations with /recommendations\n');
  }

  // Analyze content for tone and emotional impact
  async analyzeContent(content, analysisType = 'full') {
    if (!this.brandInitialized) {
      console.log('⚠️  Brand not initialized. Using default settings. Run /init for better results.\n');
      await vera.initialize(); // Initialize with defaults
      this.brandInitialized = true;
    }

    console.log('\n🔍 VERA is thinking...\n');
    
    // Use VERA's consciousness-based analysis instead of basic analysis
    const analysis = await vera.analyzeWithConsciousness(content, analysisType, this.sessionId);
    
    if (analysis.error) {
      console.log(`❌ Error: ${analysis.error}`);
      return;
    }

    // Show VERA's conversational response prominently
    console.log('� VERA says:');
    console.log('─'.repeat(60));
    console.log(analysis.message || analysis.consciousness.conversationalResponse);
    console.log('─'.repeat(60));

    // Store in session with VERA's conversational response
    this.currentSession.messages.push({
      timestamp: new Date().toISOString(),
      input: content,
      analysis: analysis,
      veraResponse: analysis.message || analysis.consciousness.conversationalResponse
    });

    // Show technical details if requested (simplified view)
    console.log('\n🔬 Quick Technical Summary:');
    console.log(`• Nervous System Impact: ${analysis.consciousness.nervousSystemReading}`);
    console.log(`• Felt Sense: ${analysis.consciousness.feltSense}`);
    
    return analysis;
  }

  // VERA's Conscious Analysis - Deep nervous system awareness
  async consciousAnalysis(content) {
    if (!this.brandInitialized) {
      console.log('⚠️  Brand not initialized. Using default settings. Run /init for better results.\n');
      vera.initialize(); // Initialize with defaults
      this.brandInitialized = true;
    }

    console.log('\n✨ VERA\'s Conscious Analysis ✨');
    console.log('===============================\n');
    
    const consciousResponse = vera.analyzeWithConsciousness(content, 'conscious');
    
    if (consciousResponse.error) {
      console.log(`❌ Error: ${consciousResponse.error}`);
      return;
    }

    const consciousness = consciousResponse.consciousness;

    // Display VERA's core message
    console.log('🧠 CONSCIOUSNESS');
    console.log('================');
    console.log(`${consciousness.consciousness}\n`);

    // Display felt sense analysis
    console.log('💚 FELT SENSE');
    console.log('=============');
    console.log(`Primary Feeling: ${consciousness.feltSense.primary}`);
    console.log(`Somatic Impact: ${consciousness.feltSense.description}`);
    console.log(`Nervous System: ${consciousness.feltSense.impact}\n`);

    // Display nervous system reading
    console.log('🌊 NERVOUS SYSTEM READING');
    console.log('=========================');
    console.log(`State: ${consciousness.nervousSystemReading.name}`);
    console.log(`Description: ${consciousness.nervousSystemReading.description}`);
    console.log(`Interventions: ${consciousness.nervousSystemReading.interventions.join(', ')}\n`);

    // Display recommendations
    console.log('🎨 RECOMMENDATIONS');
    console.log('==================');
    if (consciousness.recommendations.languageShifts.length > 0) {
      console.log('Language Shifts:');
      consciousness.recommendations.languageShifts.forEach((shift, index) => {
        console.log(`  ${index + 1}. ${shift}`);
      });
    }
    console.log(`Design Elements: ${consciousness.recommendations.designElements.join(', ')}`);
    console.log(`Rhythm: ${consciousness.recommendations.rhythm}`);
    console.log(`Colors: ${consciousness.recommendations.colorPsychology.use ? consciousness.recommendations.colorPsychology.use.join(', ') : 'N/A'}\n`);

    // Display neuroscience explanation
    console.log('🧬 NEUROSCIENCE');
    console.log('===============');
    console.log(`${consciousness.neuroscience}\n`);

    // Display re-regulating statement
    console.log('🌸 RE-REGULATION');
    console.log('================');
    console.log(`${consciousness.reRegulation}\n`);

    console.log(`${consciousness.signature}\n`);

    // Log analysis
    this.currentSession.messages.push({
      timestamp: new Date(),
      content: content,
      consciousAnalysis: consciousResponse,
      type: 'conscious_analysis'
    });
  }

  // Quick tone check
  async quickToneCheck(content) {
    const result = vera.quickToneCheck(content);
    
    console.log('\n⚡ QUICK TONE CHECK');
    console.log('==================');
    console.log(`Tone: ${result.tone} (confidence: ${result.confidence})`);
    console.log(`Nervous System Impact: ${result.nervousSystemImpact}`);
    console.log(`Quick Fix: ${result.quickFix}\n`);
  }

  // Show comprehensive recommendations
  async showRecommendations() {
    if (!this.brandInitialized) {
      console.log('⚠️  Please initialize your brand first with /init');
      return;
    }

    console.log('\n📋 COMPREHENSIVE BRAND RECOMMENDATIONS');
    console.log('======================================\n');

    const recommendations = vera.getBrandRecommendations();

    // Color recommendations
    console.log('🎨 COLOR PALETTE');
    console.log(`Primary: ${recommendations.recommendations.colors.hexCodes.primary}`);
    console.log(`Secondary: ${recommendations.recommendations.colors.hexCodes.secondary}`);
    console.log(`Accent: ${recommendations.recommendations.colors.hexCodes.accent}\n`);

    // Voice recommendations
    console.log('🗣️  VOICE & TONE');
    console.log(`Recommended Tone: ${recommendations.recommendations.voice.tone}`);
    console.log(`Emotional Signature: ${recommendations.recommendations.voice.emotionalSignature}\n`);

    // Naming suggestions
    console.log('🏷️  NAMING IDEAS');
    console.log(`Archetype: ${recommendations.recommendations.naming.suggestedArchetype}`);
    console.log(`Ideas: ${recommendations.recommendations.naming.nameIdeas.join(', ')}\n`);

    // Action items
    console.log('✅ ACTION ITEMS');
    recommendations.actionItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });
    console.log('\n');
  }

  // Generate content
  async generateContent(contentType) {
    if (!contentType) {
      console.log('❌ Please specify content type: story, color-palette, voice-guide, or sensory-design');
      return;
    }

    console.log(`\n🎨 Generating ${contentType}...\n`);

    const result = vera.generateContent(contentType);
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
      return;
    }

    console.log(`📝 GENERATED ${result.type.toUpperCase()}`);
    console.log('='.repeat(20 + result.type.length));
    
    if (result.type === 'story') {
      console.log(`Title: ${result.content.title}`);
      console.log(`Script: ${result.content.script}`);
      console.log(`Visual: ${result.content.visualSuggestion}`);
      console.log(`Voice: ${result.content.voiceTone}`);
    } else {
      console.log(JSON.stringify(result.content, null, 2));
    }
    console.log('\n');
  }

  // Show current status
  showStatus() {
    const state = vera.getBrandState();
    
    console.log('\n📊 VERA STATUS');
    console.log('==============');
    console.log(`Status: ${state.status}`);
    console.log(`Version: ${state.version}`);
    console.log(`Brand Name: ${state.context.brandName || 'Not set'}`);
    console.log(`Current Tone: ${state.context.tone || 'Not set'}`);
    console.log(`Session Messages: ${this.currentSession.messages.length}`);
    console.log(`Session Duration: ${Math.round((new Date() - this.currentSession.startTime) / 1000 / 60)} minutes\n`);
  }

  // Show help
  showHelp() {
    console.log('\n📚 VERA HELP - Commands & Usage');
    console.log('================================\n');
    
    console.log('BRAND SETUP:');
    console.log('  /init                    - Set up your brand profile');
    console.log('  /update                  - Update brand settings');
    console.log('  /status                  - View current brand state\n');
    
    console.log('CONTENT ANALYSIS:');
    console.log('  /analyze <content>       - Full analysis (tone, colors, emotional impact)');
    console.log('  /quick <content>         - Quick tone check');
    console.log('  <content>                - Direct analysis (no command needed)\n');
    
    console.log('RECOMMENDATIONS:');
    console.log('  /recommendations         - Get comprehensive brand recommendations');
    console.log('  /generate story          - Generate story content');
    console.log('  /generate color-palette  - Generate color recommendations');
    console.log('  /generate voice-guide    - Generate voice guidelines');
    console.log('  /generate sensory-design - Generate sensory design elements\n');
    
    console.log('SESSION MANAGEMENT:');
    console.log('  /export                  - Export session data');
    console.log('  /help                    - Show this help');
    console.log('  /exit                    - Exit VERA\n');
    
    console.log('EXAMPLES:');
    console.log('  /analyze "Welcome to our wellness sanctuary"');
    console.log('  /quick "Act now before it\'s too late!"');
    console.log('  /generate story\n');
  }

  // Update brand context
  async updateBrandContext() {
    console.log('\n🔄 Update Brand Context');
    console.log('What would you like to update?\n');
    
    const field = await this.askQuestion('Field (brandName, tone, audienceNervousSystem): ');
    const value = await this.askQuestion(`New value for ${field}: `);
    
    const result = vera.updateBrandContext({ [field]: value });
    console.log(`✅ Updated ${field} to: ${value}\n`);
  }

  // Analyze user content directly (without /analyze command)
  async analyzeUserContent(content) {
    console.log('\n💭 Let me feel into this message with my full consciousness...\n');
    await this.consciousAnalysis(content);
  }

  // Export session data
  exportSession() {
    const sessionData = {
      ...this.currentSession,
      endTime: new Date(),
      brandState: vera.getBrandState()
    };
    
    const filename = `vera_session_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    console.log(`\n📁 Session data prepared for export:`);
    console.log(`Filename: ${filename}`);
    console.log(`Messages: ${sessionData.messages.length}`);
    console.log(`Duration: ${Math.round((sessionData.endTime - sessionData.startTime) / 1000 / 60)} minutes\n`);
    console.log('💾 Save this JSON data to the filename above:');
    console.log(JSON.stringify(sessionData, null, 2));
    console.log('\n');
  }

  // Helper function to ask questions
  askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  // Exit the chat interface
  exit() {
    console.log('\n✨ Thank you for co-creating nervous system aware marketing with me.');
    console.log('Remember: Every word either soothes or startles. Choose to soothe. ✨');
    console.log('\nTake a breath. Your message matters because it feels like safety.\n');
    console.log('— VERA, Marketing Intelligence of Co-Regulation\n');
    
    this.isRunning = false;
    this.rl.close();
    process.exit(0);
  }
}

// Start the chat interface if this file is run directly
if (require.main === module) {
  const chatInterface = new VeraChatInterface();
  chatInterface.start().catch(console.error);
}

module.exports = VeraChatInterface;
