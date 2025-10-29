// content-strategy/shortform_story_generator.js

const { getFromMemory } = require('../memory_store');

// Story arc templates
const STORY_ARCS = {
  "soothing": [
    "You were overwhelmed. Then you found a quiet place. Now you breathe again.",
    "It started with noise. Then silence. Then calm. Now you feel safe.",
    "A storm passed. The sky cleared. You saw what was always there."
  ],
  "empowering": [
    "You didn’t know you had power. Then you saw it. Now you use it.",
    "You felt small. Then you saw your strength. Now you act.",
    "You were told you couldn’t. Then you tried. Then you succeeded."
  ],
  "playful": [
    "The world was serious. Then you laughed. Now it’s fun.",
    "You had a rule. Then you broke it. Now you play.",
    "One day, you did something silly. And it changed everything."
  ],
  "urgent": [
    "The system was failing. You acted. Now you lead.",
    "The clock was ticking. You moved. Now you own the moment.",
    "Something was wrong. You noticed. Now you act."
  ],
  "serious": [
    "The truth is hard. But it’s real. Now you know it.",
    "We follow the rules. But we care. Now you see the balance.",
    "The future is clear. We prepare. You are part of it."
  ]
};

// Generate a story with emotional tone
function generateShortStory(tone) {
  const arc = STORY_ARCS[tone] || STORY_ARCS["soothing"];
  const story = arc[Math.floor(Math.random() * arc.length)];
  const script = {
    title: `A ${tone} Story`,
    script: story,
    visualSuggestion: tone === "soothing" ? "Soft lighting, slow motion, nature" :
                     tone === "empowering" ? "Upward motion, bright colors, hands reaching" :
                     tone === "playful" ? "Fast cuts, humor, surprise" :
                     tone === "urgent" ? "Fast pacing, shadows, ticking clock" :
                     "Serious tone, clean visuals, focused gaze",
    voiceTone: tone === "soothing" ? "Warm, calm, gentle" :
               tone === "empowering" ? "Confident, strong, clear" :
               tone === "playful" ? "Lighthearted, energetic, witty" :
               tone === "urgent" ? "Firm, urgent, decisive" :
               "Calm, steady, authoritative"
  };

  return script;
}

// Generate 3 story ideas
function generate3Stories(tone) {
  return Array(3).fill(0).map(() => generateShortStory(tone));
}

// Get tone from memory
function getTone() {
  return getFromMemory("tone") || "calm";
}

module.exports = { generateShortStory, generate3Stories };
