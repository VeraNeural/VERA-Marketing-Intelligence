// co-regulation/emotional_tone_adjuster.js

const { getFromMemory } = require('../memory_store');

// Emotional state mapping (nervous system tone)
const NERVOUS_SYSTEM_STATES = {
  "high stress": "calm, safe, grounded",
  "low confidence": "empowering, hopeful, visible",
  "anxious": "soothing, predictable, safe",
  "overwhelm": "structured, clear, calm",
  "joy": "vibrant, lively, expansive"
};

// Adjust brand tone to match emotional state
function adjustEmotionalTone(emotionalState) {
  const state = emotionalState.toLowerCase();
  const targetTone = NERVOUS_SYSTEM_STATES[state] || NERVOUS_SYSTEM_STATES["high stress"];
  
  return {
    currentEmotionalState: emotionalState,
    recommendedTone: targetTone,
    coRegulationInsight: `When your audience feels ${emotionalState}, the brand must shift into a tone of ${targetTone} to restore nervous system balance. This isn't just messaging — it's sensory and emotional co-regulation.`,
    suggestedActions: [
      "Use soft transitions and predictable rhythm",
      "Include grounding language (e.g., 'you are safe')",
      "Avoid abrupt changes or high-intensity pacing"
    ]
  };
}

// Get current brand tone from memory
function getCurrentTone() {
  return getFromMemory("tone") || "calm";
}

module.exports = { adjustEmotionalTone };
