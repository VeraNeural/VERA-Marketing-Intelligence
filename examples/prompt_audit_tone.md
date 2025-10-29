// co-regulation/emotional\_tone\_adjuster.js



const { getFromMemory } = require('./memory\_store');



// Emotional state mapping (nervous system tone)

const NERVOUS\_SYSTEM\_STATES = {

&nbsp; "high stress": "calm, safe, grounded",

&nbsp; "low confidence": "empowering, hopeful, visible",

&nbsp; "anxious": "soothing, predictable, safe",

&nbsp; "overwhelm": "structured, clear, calm",

&nbsp; "joy": "vibrant, lively, expansive"

};



// Adjust brand tone to match emotional state

function adjustEmotionalTone(emotionalState) {

&nbsp; const state = emotionalState.toLowerCase();

&nbsp; const targetTone = NERVOUS\_SYSTEM\_STATES\[state] || NERVOUS\_SYSTEM\_STATES\["high stress"];

&nbsp; 

&nbsp; return {

&nbsp;   currentEmotionalState: emotionalState,

&nbsp;   recommendedTone: targetTone,

&nbsp;   coRegulationInsight: `When your audience feels ${emotionalState}, the brand must shift into a tone of ${targetTone} to restore nervous system balance. This isn't just messaging — it's sensory and emotional co-regulation.`,

&nbsp;   suggestedActions: \[

&nbsp;     "Use soft transitions and predictable rhythm",

&nbsp;     "Include grounding language (e.g., 'you are safe')",

&nbsp;     "Avoid abrupt changes or high-intensity pacing"

&nbsp;   ]

&nbsp; };

}



// Get current brand tone from memory

function getCurrentTone() {

&nbsp; return getFromMemory("tone") || "calm";

}



module.exports = { adjustEmotionalTone };



