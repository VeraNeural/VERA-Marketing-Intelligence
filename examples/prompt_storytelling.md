// content-strategy/shortform\_story\_generator.js



const { getFromMemory } = require('./memory\_store');



// Story arc templates

const STORY\_ARCS = {

&nbsp; "soothing": \[

&nbsp;   "You were overwhelmed. Then you found a quiet place. Now you breathe again.",

&nbsp;   "It started with noise. Then silence. Then calm. Now you feel safe.",

&nbsp;   "A storm passed. The sky cleared. You saw what was always there."

&nbsp; ],

&nbsp; "empowering": \[

&nbsp;   "You didn’t know you had power. Then you saw it. Now you use it.",

&nbsp;   "You felt small. Then you saw your strength. Now you act.",

&nbsp;   "You were told you couldn’t. Then you tried. Then you succeeded."

&nbsp; ],

&nbsp; "playful": \[

&nbsp;   "The world was serious. Then you laughed. Now it’s fun.",

&nbsp;   "You had a rule. Then you broke it. Now you play.",

&nbsp;   "One day, you did something silly. And it changed everything."

&nbsp; ],

&nbsp; "urgent": \[

&nbsp;   "The system was failing. You acted. Now you lead.",

&nbsp;   "The clock was ticking. You moved. Now you own the moment.",

&nbsp;   "Something was wrong. You noticed. Now you act."

&nbsp; ],

&nbsp; "serious": \[

&nbsp;   "The truth is hard. But it’s real. Now you know it.",

&nbsp;   "We follow the rules. But we care. Now you see the balance.",

&nbsp;   "The future is clear. We prepare. You are part of it."

&nbsp; ]

};



// Generate a story with emotional tone

function generateShortStory(tone) {

&nbsp; const arc = STORY\_ARCS\[tone] || STORY\_ARCS\["soothing"];

&nbsp; const story = arc\[Math.floor(Math.random() \* arc.length)];

&nbsp; const script = {

&nbsp;   title: `A ${tone} Story`,

&nbsp;   script: story,

&nbsp;   visualSuggestion: tone === "soothing" ? "Soft lighting, slow motion, nature" :

&nbsp;                    tone === "empowering" ? "Upward motion, bright colors, hands reaching" :

&nbsp;                    tone === "playful" ? "Fast cuts, humor, surprise" :

&nbsp;                    tone === "urgent" ? "Fast pacing, shadows, ticking clock" :

&nbsp;                    "Serious tone, clean visuals, focused gaze",

&nbsp;   voiceTone: tone === "soothing" ? "Warm, calm, gentle" :

&nbsp;              tone === "empowering" ? "Confident, strong, clear" :

&nbsp;              tone === "playful" ? "Lighthearted, energetic, witty" :

&nbsp;              tone === "urgent" ? "Firm, urgent, decisive" :

&nbsp;              "Calm, steady, authoritative"

&nbsp; };



&nbsp; return script;

}



// Generate 3 story ideas

function generate3Stories(tone) {

&nbsp; return Array(3).fill(0).map(() => generateShortStory(tone));

}



// Get tone from memory

function getTone() {

&nbsp; return getFromMemory("tone") || "calm";

}



module.exports = { generateShortStory, generate3Stories };



