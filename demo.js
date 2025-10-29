// demo.js
// VERA Marketing Intelligence Demonstration

const vera = require('./vera_core');

console.log('🧠 VERA Marketing Intelligence Demo');
console.log('===================================\n');

// Simulate a wellness brand setup
console.log('📋 Setting up a wellness brand...');
const brand = vera.initialize({
  brandName: "Serenity Wellness",
  tone: "soothing", 
  targetAudience: "wellness seekers",
  emotionalState: "stressed"
});

console.log(`✅ Brand initialized: ${brand.brandContext.brandName}`);
console.log(`🎯 Target tone: ${brand.brandContext.tone}`);
console.log(`😌 Audience state: ${brand.brandContext.audienceNervousSystem}\n`);

// Demo different content types
const contentExamples = [
  {
    type: "Urgent Marketing",
    content: "LIMITED TIME! Act now before this deal expires forever!",
    analysis: "full"
  },
  {
    type: "Wellness Message", 
    content: "Welcome to your sanctuary. You are safe here. Take a deep breath.",
    analysis: "emotional"
  },
  {
    type: "Empowerment Content",
    content: "You have everything within you to create the life you desire.",
    analysis: "content"
  }
];

console.log('🔍 Analyzing different content types...\n');

contentExamples.forEach((example, index) => {
  console.log(`${index + 1}. ${example.type}`);
  console.log('   Content:', `"${example.content}"`);
  
  const analysis = vera.analyzeContent(example.content, example.analysis);
  
  console.log('   🎯 Tone:', analysis.toneAnalysis.tone);
  console.log('   📊 Confidence:', analysis.toneAnalysis.confidence);
  console.log('   🧠 Impact:', analysis.toneAnalysis.nervousSystemImpact);
  console.log('   💡 Tip:', analysis.toneAnalysis.recommendedAction);
  
  if (analysis.colorRecommendations) {
    console.log('   🎨 Recommended colors:', analysis.colorRecommendations.hexCodes.primary);
  }
  
  console.log('');
});

// Show comprehensive recommendations
console.log('📋 Comprehensive Brand Recommendations');
console.log('=====================================');

const recommendations = vera.getBrandRecommendations();

console.log('🎨 Color Palette:');
console.log(`   Primary: ${recommendations.recommendations.colors.hexCodes.primary}`);
console.log(`   Secondary: ${recommendations.recommendations.colors.hexCodes.secondary}`);
console.log(`   Accent: ${recommendations.recommendations.colors.hexCodes.accent}`);
console.log(`   Impact: ${recommendations.recommendations.colors.psychologicalImpact}\n`);

console.log('🗣️  Voice & Tone:');
console.log(`   Recommended: ${recommendations.recommendations.voice.tone}`);
console.log(`   Emotional signature: ${recommendations.recommendations.voice.emotionalSignature}\n`);

console.log('🏷️  Brand Naming:');
console.log(`   Archetype: ${recommendations.recommendations.naming.suggestedArchetype}`);
console.log(`   Name ideas: ${recommendations.recommendations.naming.nameIdeas.join(', ')}\n`);

console.log('✨ Sensory Design:');
const sensory = recommendations.recommendations.sensory;
console.log(`   Elements: ${sensory.sensory_design.join(', ')}`);
console.log(`   Insight: ${sensory.insight}\n`);

// Generate sample content
console.log('📝 Generated Content Examples');
console.log('=============================');

const story = vera.generateContent("story", { tone: "soothing" });
console.log('📖 Story:');
console.log(`   Title: ${story.content.title}`);
console.log(`   Script: ${story.content.script}`);
console.log(`   Visual style: ${story.content.visualSuggestion}`);
console.log(`   Voice tone: ${story.content.voiceTone}\n`);

// Show nervous system guidance
console.log('🧘 Nervous System Guidance');
console.log('==========================');
console.log(recommendations.nervousSystemGuidance);
console.log('');

// Action items
console.log('✅ Recommended Actions');
console.log('======================');
recommendations.actionItems.forEach((action, index) => {
  console.log(`${index + 1}. ${action}`);
});

console.log('\n🎉 Demo complete!');
console.log('💡 Start the interactive chat with: npm start');
console.log('🔧 Or explore the API programmatically with the examples above.');