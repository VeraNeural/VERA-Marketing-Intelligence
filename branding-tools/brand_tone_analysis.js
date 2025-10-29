// branding-tools/brand_tone_analysis.js

const { getFromMemory } = require('../memory_store');

// Emotional tone map: how tone affects nervous system
const EMOTIONAL_TONE_MAP = {
  "calm": "low cortisol, high trust, safe",
  "empowering": "increased agency, confidence, active engagement",
  "urgent": "high alertness, potential anxiety, action-driven",
  "soothing": "deep relaxation, safety, emotional grounding",
  "playful": "joy, lightness, connection, low pressure",
  "serious": "authority, focus, reliability, but may feel cold"
};

// Analyze a message for emotional tone
function analyzeTone(message) {
  const lower = message.toLowerCase();
  const keywords = [
    "safe", "calm", "peace", "trust", "relax", "grounded", "safe space",
    "empower", "you can", "belong", "your power", "strong", "capable",
    "urgent", "act now", "immediate", "danger", "crisis", "alert",
    "play", "fun", "laugh", "joy", "light", "easy", "simple",
    "serious", "expert", "authority", "decision", "critical"
  ];

  let tone = "neutral";
  let confidence = 0;

  for (const word of keywords) {
    if (lower.includes(word)) {
      confidence += 1;
      if (word.includes("safe") || word.includes("calm") || word.includes("soothing")) {
        tone = "soothing";
      } else if (word.includes("empower") || word.includes("you can")) {
        tone = "empowering";
      } else if (word.includes("urgent") || word.includes("act now")) {
        tone = "urgent";
      } else if (word.includes("play") || word.includes("fun")) {
        tone = "playful";
      } else if (word.includes("serious")) {
        tone = "serious";
      }
    }
  }

  // If confidence > 30%, we have a clear tone
  if (confidence > 3) {
    return {
      tone: tone,
      confidence: confidence,
      nervousSystemImpact: EMOTIONAL_TONE_MAP[tone],
      recommendedAction: getRecommendedAction(tone)
    };
  }

  return {
    tone: "neutral",
    confidence: 0,
    nervousSystemImpact: "Ambiguous — needs emotional clarity",
    recommendedAction: "Add emotional anchors (e.g., 'you are safe', 'this is your space')"
  };
}

// Recommended action based on tone
function getRecommendedAction(tone) {
  switch (tone) {
    case "soothing":
      return "This tone reduces stress — great for wellness or recovery audiences. Add sensory details (e.g., 'like warm water', 'soft light').";
    case "empowering":
      return "This builds agency — perfect for growth or self-development. Use active verbs and 'you' statements.";
    case "urgent":
      return "This may trigger anxiety — use cautiously. Add reassurance phrases (e.g., 'we’ve got you').";
    case "playful":
      return "This builds connection — ideal for youth or community. Add humor and lightness.";
    case "serious":
      return "This feels authoritative — great for B2B or compliance. But avoid sounding cold. Add warmth with 'we believe' or 'we care'.";
    default:
      return "Clarify your emotional intent — are you building safety? Empowerment? Clarity?";
  }
}

// Export
module.exports = { analyzeTone };
