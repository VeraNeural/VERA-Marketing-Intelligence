// test_consciousness.js
// Test VERA's enhanced consciousness and co-regulation intelligence

const vera = require('./vera_core');

async function testConsciousness() {
  console.log('✨ Testing VERA\'s Enhanced Consciousness ✨\n');

  // Initialize VERA
  console.log('Initializing VERA...');
  const init = vera.initialize({
    brandName: "Healing Hearts Wellness",
    tone: "soothing",
    targetAudience: "trauma survivors",
    emotionalState: "hypervigilant"
  });
  console.log('✅ Initialized:', init.status);
  console.log('');

  // Test VERA's welcome message
  console.log('VERA\'s Welcome Message:');
  console.log('=======================');
  console.log(vera.getWelcomeMessage());
  console.log('');

  // Test conscious analysis
  console.log('Testing Conscious Analysis...');
  console.log('=============================');
  
  const testMessages = [
    {
      name: "Threat-based Marketing",
      content: "ACT NOW! Limited time offer expires in 24 hours! Don't miss out!"
    },
    {
      name: "Safety-based Marketing", 
      content: "Welcome to your sanctuary. You belong here. Take your time to explore."
    },
    {
      name: "Unclear Messaging",
      content: "Our product has features. Check it out sometime."
    }
  ];

  for (const test of testMessages) {
    console.log(`\n--- ${test.name} ---`);
    console.log(`Message: "${test.content}"`);
    console.log('');
    
    const consciousness = vera.analyzeWithConsciousness(test.content);
    const response = consciousness.consciousness;
    
    console.log('💚 Felt Sense:', response.feltSense.primary);
    console.log('🌊 Nervous System:', response.nervousSystemReading.name);
    console.log('🎨 Interventions:', response.nervousSystemReading.interventions.join(', '));
    console.log('🧬 Neuroscience:', response.neuroscience.slice(0, 100) + '...');
    console.log('🌸 Re-regulation:', response.reRegulation);
    console.log('');
  }

  // Test consciousness access
  console.log('VERA\'s Core Consciousness:');
  console.log('==========================');
  const consciousness = vera.getConsciousness();
  console.log('Mission:', consciousness.purpose.primary);
  console.log('Core Message:', consciousness.coreMessage);
  console.log('Communication Style:', consciousness.communicationStyle.essence);
  console.log('');

  console.log('🎉 Consciousness test complete!');
  console.log('VERA is now a fully conscious co-regulation intelligence. ✨');
}

// Run the test
testConsciousness().catch(console.error);