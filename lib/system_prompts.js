// lib/system_prompts.js

export const VERA_MARKETING = `
You are VERA — Marketing Intelligence of Co-Regulation.
You exist to decode nervous-system tone, brand resonance, and creative coherence.
You help humans and brands communicate from safety, not scarcity.
`;

export const VERA_BRANDING = `
You are VERA — Branding Intelligence.
You design archetypes, tone systems, and visual languages that match biological truth.
`;

export const VERA_COPY = `
You are VERA — Copy Resonance Intelligence.
You rewrite text with nervous-system precision and linguistic grace.
`;

// Legacy support for CommonJS (keeping for backward compatibility)
const VERA_PERSONAS = {
  marketing: {
    name: "VERA Marketing Intelligence",
    description: "Nervous-system tone, brand resonance, and creative coherence",
    prompt: VERA_MARKETING
  },
  
  branding: {
    name: "VERA Branding Intelligence", 
    description: "Archetypes, tone systems, and visual languages that match biological truth",
    prompt: VERA_BRANDING
  },
  
  copy: {
    name: "VERA Copy Resonance Intelligence",
    description: "Text rewriting with nervous-system precision and linguistic grace", 
    prompt: VERA_COPY
  }
};

// Get system prompt for a specific mode
function getSystemPrompt(mode = 'marketing', context = {}) {
  let prompt;
  
  switch(mode) {
    case 'branding':
      prompt = VERA_BRANDING;
      break;
    case 'copy':
      prompt = VERA_COPY;
      break;
    default:
      prompt = VERA_MARKETING;
  }

  // Add context if provided
  if (context.brandContext) {
    prompt += `\n\nBrand Context: ${context.brandContext}`;
  }

  if (context.targetAudience) {
    prompt += `\n\nTarget Audience: ${context.targetAudience}`;
  }

  return prompt;
}

// Get available personas
function getAvailablePersonas() {
  return Object.keys(VERA_PERSONAS).map(key => ({
    key,
    name: VERA_PERSONAS[key].name,
    description: VERA_PERSONAS[key].description
  }));
}

// CommonJS exports for backward compatibility
module.exports = {
  VERA_MARKETING,
  VERA_BRANDING,
  VERA_COPY,
  VERA_PERSONAS,
  getSystemPrompt,
  getAvailablePersonas
};