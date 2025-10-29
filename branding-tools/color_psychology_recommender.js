// branding-tools/color_psychology_recommender.js

const { getFromMemory } = require('../memory_store');

// Color psychology mapping based on emotional states and nervous system response
const COLOR_PSYCHOLOGY = {
  "soothing": {
    primary: ["#6B8E7A", "#8DB3A6", "#A8C4A2"], // Sage greens
    secondary: ["#E8F4F8", "#F0F8F0", "#F5F9F0"], // Soft whites/creams
    accent: ["#D4B59A", "#C9A96E"], // Warm earth tones
    nervousSystemEffect: "Reduces cortisol, promotes parasympathetic activation",
    insight: "These colors literally calm the nervous system. Green activates the heart chakra and promotes emotional safety."
  },
  "empowering": {
    primary: ["#FF6B35", "#F39C12", "#E74C3C"], // Confident oranges/reds
    secondary: ["#2C3E50", "#34495E"], // Strong navy/charcoal
    accent: ["#F1C40F", "#E67E22"], // Energetic golds
    nervousSystemEffect: "Increases dopamine, activates sympathetic nervous system positively",
    insight: "These colors build confidence and agency. Orange stimulates creativity, red builds power."
  },
  "playful": {
    primary: ["#9B59B6", "#E91E63", "#FF5722"], // Vibrant purples/pinks
    secondary: ["#FFF9C4", "#E8F5E8"], // Light, airy backgrounds
    accent: ["#00BCD4", "#4CAF50"], // Fresh blues/greens
    nervousSystemEffect: "Triggers joy response, releases endorphins",
    insight: "These colors activate the pleasure centers. Purple stimulates imagination, pink creates connection."
  },
  "urgent": {
    primary: ["#E74C3C", "#C0392B"], // Alert reds
    secondary: ["#2C3E50", "#1A1A1A"], // Strong contrasts
    accent: ["#F39C12", "#E67E22"], // Warning oranges
    nervousSystemEffect: "Heightens alertness, activates fight-or-flight carefully",
    insight: "These colors demand attention but can trigger anxiety. Use sparingly with calming elements."
  },
  "serious": {
    primary: ["#2C3E50", "#34495E", "#5D6D7E"], // Professional blues/grays
    secondary: ["#FFFFFF", "#F8F9FA"], // Clean whites
    accent: ["#3498DB", "#2980B9"], // Trust blues
    nervousSystemEffect: "Promotes focus, reduces emotional volatility",
    insight: "These colors build trust and authority. Blue activates the throat chakra for clear communication."
  }
};

// Recommend colors based on emotional tone
function recommendColors(tone = null) {
  const currentTone = tone || getFromMemory("tone") || "soothing";
  const colorScheme = COLOR_PSYCHOLOGY[currentTone] || COLOR_PSYCHOLOGY["soothing"];
  
  return {
    tone: currentTone,
    colorPalette: colorScheme,
    hexCodes: {
      primary: colorScheme.primary[0],
      secondary: colorScheme.secondary[0],
      accent: colorScheme.accent[0]
    },
    applicationSuggestions: {
      backgrounds: colorScheme.secondary,
      callToAction: colorScheme.primary,
      highlights: colorScheme.accent
    },
    psychologicalImpact: colorScheme.nervousSystemEffect,
    designInsight: colorScheme.insight
  };
}

// Get complementary colors for contrast
function getComplementaryPalette(tone) {
  const recommendations = recommendColors(tone);
  const complementary = {
    "soothing": ["#F4E4C1", "#E8D5B7"], // Warm complements to cool greens
    "empowering": ["#4ECDC4", "#45B7B8"], // Cool teals to balance warm oranges
    "playful": ["#FFE66D", "#FF6B6B"], // Warm yellows to balance cool purples
    "urgent": ["#00A8CC", "#0077BE"], // Cool blues to balance hot reds
    "serious": ["#95A5A6", "#BDC3C7"] // Neutral grays
  };
  
  return {
    ...recommendations,
    complementaryColors: complementary[tone] || complementary["soothing"],
    balanceInsight: "Use 60% primary, 30% secondary, 10% accent for optimal nervous system balance"
  };
}

// Analyze existing color scheme
function analyzeColorScheme(hexColors) {
  // Simple color analysis based on dominant hues
  const analysis = {
    dominantMood: "neutral",
    nervousSystemImpact: "unclear",
    recommendations: []
  };
  
  const hasWarmColors = hexColors.some(color => 
    color.toLowerCase().includes('red') || 
    color.toLowerCase().includes('orange') || 
    color.toLowerCase().includes('yellow')
  );
  
  const hasCoolColors = hexColors.some(color => 
    color.toLowerCase().includes('blue') || 
    color.toLowerCase().includes('green') || 
    color.toLowerCase().includes('purple')
  );
  
  if (hasWarmColors && !hasCoolColors) {
    analysis.dominantMood = "energetic";
    analysis.nervousSystemImpact = "Stimulating, may increase arousal";
    analysis.recommendations.push("Add cool accents to provide nervous system rest");
  } else if (hasCoolColors && !hasWarmColors) {
    analysis.dominantMood = "calming";
    analysis.nervousSystemImpact = "Soothing, promotes relaxation";
    analysis.recommendations.push("Consider warm accents for engagement");
  } else {
    analysis.dominantMood = "balanced";
    analysis.nervousSystemImpact = "Neutral, good for broad audiences";
  }
  
  return analysis;
}

module.exports = { 
  recommendColors, 
  getComplementaryPalette, 
  analyzeColorScheme,
  COLOR_PSYCHOLOGY 
};
