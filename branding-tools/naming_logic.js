// branding-tools/naming_logic.js

const { getFromMemory } = require('../memory_store');

// Emotional archetypes & naming styles
const ARCHETYPES = {
  "Guardian": ["Safe", "Shield", "Haven", "Benevolent", "Guard"],
  "Creator": ["Spark", "Origin", "Flow", "Nova", "Awake"],
  "Healer": ["Calm", "Bloom", "Reclaim", "Still", "Tend"],
  "Explorer": ["Path", "Edge", "Forward", "Boundless", "Unseen"],
  "Empowerer": ["You", "Power", "Own", "Strong", "Bold"],
  "Sage": ["Wisdom", "Still", "Deep", "Clear", "Truth"]
};

// Generate 3 name ideas based on archetype
function generateNames(archetype) {
  if (!ARCHETYPES[archetype]) {
    return ["Unknown", "Untitled", "Unnamed"];
  }

  const options = ARCHETYPES[archetype];
  const names = [];
  for (let i = 0; i < 3; i++) {
    const index = Math.floor(Math.random() * options.length);
    names.push(options[index]);
  }

  return names;
}

// Get archetype based on tone
function inferArchetype(tone) {
  if (tone === "soothing" || tone === "calm" || tone.includes("safe")) {
    return "Guardian";
  } else if (tone === "empowering" || tone.includes("you")) {
    return "Empowerer";
  } else if (tone === "growth" || tone.includes("heal")) {
    return "Healer";
  } else if (tone === "urgent" || tone.includes("action")) {
    return "Explorer";
  } else {
    return "Sage";
  }
}

// Generate naming suggestions
function getNamingSuggestions() {
  const archetype = inferArchetype(getFromMemory("tone") || "calm");
  return {
    suggestedArchetype: archetype,
    nameIdeas: generateNames(archetype),
    insight: `The ${archetype} archetype aligns with your brand's emotional tone. Names should reflect safety, presence, or agency.`
  };
}

module.exports = { generateNames, inferArchetype, getNamingSuggestions };
