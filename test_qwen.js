// test_qwen.js
// Test VERA's Qwen AI integration

const vera = require('./vera_core');

async function testQwenIntegration() {
  console.log('🧠 Testing VERA + Qwen Integration...\n');

  // Test 1: Basic initialization
  console.log('Test 1: Basic VERA Initialization');
  console.log('==================================');
  const initResult = vera.initialize({
    brandName: "Wellness Sanctuary",
    tone: "soothing",
    targetAudience: "stressed professionals",
    emotionalState: "anxious"
  });
  console.log('✅ VERA initialized:', initResult.status);
  console.log('');

  // Test 2: Configure Qwen
  console.log('Test 2: Qwen AI Configuration');
  console.log('=============================');
  try {
    const aiConfig = vera.configureAI({
      provider: 'ollama',
      model: 'qwen:7b',
      baseUrl: 'http://localhost:11434'
    });
    console.log('✅ AI configured:', aiConfig.status);
    console.log('🤖 Model:', aiConfig.model);
    console.log('');
  } catch (error) {
    console.log('⚠️  AI configuration failed:', error.message);
    console.log('💡 Make sure Ollama is running with: ollama serve');
    console.log('💡 And Qwen is installed with: ollama pull qwen:7b');
    console.log('');
  }

  // Test 3: Test AI connection
  console.log('Test 3: AI Connection Test');
  console.log('==========================');
  try {
    const connectionTest = await vera.testAI();
    if (connectionTest.connected) {
      console.log('✅ AI connection successful!');
      console.log('🤖 Provider:', connectionTest.provider);
      console.log('🧠 Model:', connectionTest.model);
    } else {
      console.log('❌ AI connection failed');
      console.log('💡 Check if Ollama is running: ollama serve');
    }
    console.log('');
  } catch (error) {
    console.log('❌ AI connection error:', error.message);
    console.log('');
  }

  // Test 4: Enhanced content analysis
  console.log('Test 4: Enhanced Content Analysis');
  console.log('=================================');
  const testContent = "Act now! This exclusive wellness retreat is almost sold out!";
  console.log('📝 Test content:', `"${testContent}"`);
  console.log('');

  try {
    console.log('🔍 Running AI-enhanced analysis...');
    const enhancedAnalysis = await vera.analyzeContentWithAI(testContent, 'full');
    
    console.log('📊 Basic Analysis:');
    console.log('  Tone:', enhancedAnalysis.toneAnalysis.tone);
    console.log('  Confidence:', enhancedAnalysis.toneAnalysis.confidence);
    console.log('  Impact:', enhancedAnalysis.toneAnalysis.nervousSystemImpact);
    console.log('');
    
    if (enhancedAnalysis.aiEnhanced) {
      console.log('🧠 AI Enhancement: ✅ SUCCESS');
      console.log('🤖 Model:', enhancedAnalysis.model);
      console.log('🎯 AI Insights:');
      console.log(enhancedAnalysis.aiInsights);
    } else {
      console.log('🧠 AI Enhancement: ❌ Using basic analysis');
      console.log('💡 This is normal if Qwen is not running');
    }
    console.log('');
    
  } catch (error) {
    console.log('❌ Analysis error:', error.message);
    console.log('');
  }

  // Test 5: Show setup instructions if AI not working
  console.log('📚 Setup Instructions');
  console.log('=====================');
  console.log('If Qwen is not working, follow these steps:');
  console.log('');
  console.log('1. Install Ollama: https://ollama.ai/');
  console.log('2. Pull Qwen model: ollama pull qwen:7b');
  console.log('3. Start Ollama: ollama serve');
  console.log('4. Test manually: ollama run qwen:7b "Hello"');
  console.log('5. Run this test again: npm run test-ai');
  console.log('');
  console.log('🎉 VERA works great with or without AI!');
  console.log('💡 Qwen just makes her much more conversational and intelligent.');
  console.log('');
  console.log('📖 See QWEN_SETUP.md for detailed instructions');
}

// Run the test
testQwenIntegration().catch(console.error);