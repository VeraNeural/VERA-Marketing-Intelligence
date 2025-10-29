// content-strategy/voice_tone_calibrator.js

const { getFromMemory } = require('../memory_store');

// Audience types and ideal voice tones
const AUDIENCE_TONES = {
  "young adults": "playful, energetic, authentic, witty",
  "parents": "warm, reassuring, gentle, grounded",
  "professionals": "clear, confident, precise, calm",
  "wellness seekers": "soothing, empathetic, calm, intuitive",
  "leaders": "authoritative, decisive, calm, visionary",
  "emergencies": "urgent, clear, direct, reassuring"
};

// Calibrate voice tone based on audience
function calibrateVoiceTone(audience) {
  const tone = AUDIENCE_TONES[audience] || AUDIENCE_TONES["young adults"];
  return {
    tone: tone,
    emotionalSignature: getEmotionalSignature(tone),
    scriptExamples: [
      `You're not alone. We see you.`,
      `This is your moment. Act.`,
      `We’re here. You’re safe.`
    ]
  };
}

// Map tone to emotional signature
function getEmotionalSignature(tone) {
  if (tone.includes("playful")) return "Joy, connection, lightness";
  if (tone.includes("warm") || tone.includes("reassuring")) return "Safety, empathy, trust";
  if (tone.includes("confident")) return "Empowerment, authority";
  if (tone.includes("calm")) return "Stability, grounding";
  return "Clarity, presence";
}

module.exports = { calibrateVoiceTone };
