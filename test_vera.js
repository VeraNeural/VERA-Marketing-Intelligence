// test_vera.js
// Simple test to verify VERA is working correctly

const vera = require('./vera_core');

console.log('🧠 Testing VERA Marketing Intelligence...\n');

// Test 1: Basic initialization
console.log('Test 1: Initialization');
console.log('=====================');
const initResult = vera.initialize({
  brandName: "Test Wellness Co",
  tone: "soothing",
  targetAudience: "wellness seekers",
  emotionalState: "anxious"
});
console.log('✅ Initialization:', initResult.status);
console.log('📊 Brand context:', initResult.brandContext.brandName);
console.log('');

// Test 2: Quick tone analysis
console.log('Test 2: Quick Tone Analysis');
console.log('===========================');
const quickTest = vera.quickToneCheck("Welcome to our calming wellness sanctuary where you are safe");
console.log('📝 Content: "Welcome to our calming wellness sanctuary where you are safe"');
console.log('🎯 Detected tone:', quickTest.tone);
console.log('📈 Confidence:', quickTest.confidence);
console.log('🧘 Nervous system impact:', quickTest.nervousSystemImpact);
console.log('');

// Test 3: Full content analysis
console.log('Test 3: Full Content Analysis');
console.log('==============================');
const fullAnalysis = vera.analyzeContent("Act now before this exclusive offer expires!");
console.log('📝 Content: "Act now before this exclusive offer expires!"');
console.log('🎯 Detected tone:', fullAnalysis.toneAnalysis.tone);
console.log('⚠️  Recommendation:', fullAnalysis.toneAnalysis.recommendedAction);
console.log('');

// Test 4: Color recommendations
console.log('Test 4: Color Recommendations');
console.log('=============================');
const colorRecs = fullAnalysis.colorRecommendations;
if (colorRecs) {
  console.log('🎨 Primary color:', colorRecs.hexCodes.primary);
  console.log('🎨 Secondary color:', colorRecs.hexCodes.secondary);
  console.log('🎨 Accent color:', colorRecs.hexCodes.accent);
  console.log('🧠 Psychological impact:', colorRecs.psychologicalImpact);
}
console.log('');

// Test 5: Content generation
console.log('Test 5: Content Generation');
console.log('==========================');
const storyContent = vera.generateContent("story", { tone: "soothing" });
console.log('📖 Generated story title:', storyContent.content.title);
console.log('✍️  Story script:', storyContent.content.script);
console.log('');

// Test 6: Brand recommendations
console.log('Test 6: Brand Recommendations');
console.log('=============================');
const brandRecs = vera.getBrandRecommendations();
console.log('🏷️  Suggested archetype:', brandRecs.recommendations.naming.suggestedArchetype);
console.log('💭 Name ideas:', brandRecs.recommendations.naming.nameIdeas.join(', '));
console.log('');

// Test 7: Brand state
console.log('Test 7: System Status');
console.log('====================');
const state = vera.getBrandState();
console.log('⚡ Status:', state.status);
console.log('🔧 Version:', state.version);
console.log('🎯 Current tone:', state.context.tone);
console.log('✨ Capabilities:', state.capabilities.length, 'modules loaded');
console.log('');

console.log('🎉 All tests completed successfully!');
console.log('💡 Try running: npm start');
console.log('💬 Or start the chat interface with: node vera_chat_interface.js');