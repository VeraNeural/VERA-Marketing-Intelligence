// co-regulation/sensory_design_engine.js

const { getFromMemory } = require('../memory_store');

// Sensory design elements for co-regulation
const SENSORY_ELEMENTS = {
  "soothing": ["soft lighting", "gentle textures", "nature sounds", "warm colors"],
  "empowering": ["bright colors", "upward motion", "clear audio", "strong visuals"],
  "urgent": ["sharp contrasts", "pulsing rhythms", "high energy", "tight pacing"],
  "joyful": ["vibrant colors", "lively music", "dynamic movement", "sparkle"],
  "anxious": ["fading transitions", "slow pacing", "soft tones", "repetition"]
};

function generateSensoryDesign(emotionalState) {
  const state = emotionalState.toLowerCase();
  const elements = SENSORY_ELEMENTS[state] || SENSORY_ELEMENTS["soothing"];
  
  // Randomly select 3 elements
  const selected = [];
  const elementsCopy = [...elements];
  const numElements = Math.min(3, elementsCopy.length);
  
  for (let i = 0; i < numElements; i++) {
    const randomIndex = Math.floor(Math.random() * elementsCopy.length);
    selected.push(elementsCopy.splice(randomIndex, 1)[0]);
  }
  
  return {
    emotional_state: emotionalState,
    sensory_design: selected,
    insight: `To co-regulate the nervous system during ${emotionalState}, use sensory elements that promote balance and safety. These elements help ground the audience and reduce physiological arousal.`,
    design_suggestions: [
      `Use ${selected[0]} in visuals`,
      `Pair with ${selected[1]} in audio`,
      `Introduce ${selected[2]} through pacing`
    ]
  };
}

// Get sensory recommendations based on current brand tone
function getSensoryRecommendations() {
  const tone = getFromMemory("tone") || "soothing";
  return generateSensoryDesign(tone);
}

module.exports = { generateSensoryDesign, getSensoryRecommendations };
