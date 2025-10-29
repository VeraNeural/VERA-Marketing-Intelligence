// memory_store.js
// Enhanced memory store for brand context with database integration

let VeraDatabase = null;
try {
  VeraDatabase = require('./database/database');
} catch (error) {
  console.log('Database module not available, using in-memory storage');
}

// In-memory storage (fallback)
const memory = {
  brandName: "",
  tone: "neutral",
  colors: [],
  emotionalSignature: "",
  archetype: "",
  audienceNervousSystem: "stable",
  lastInteraction: null
};

// Database instance
let db = null;
let currentContextId = null;

// Initialize database connection
async function initDatabase() {
  if (VeraDatabase) {
    try {
      db = new VeraDatabase({
        type: process.env.DATABASE_TYPE || 'sqlite',
        connectionString: process.env.DATABASE_URL
      });
      console.log('🗄️  VERA Memory enhanced with database storage');
    } catch (error) {
      console.log('📝 Using in-memory storage (database unavailable)');
      db = null;
    }
  }
}

// Save to memory (and database if available)
async function saveToMemory(key, value) {
  memory[key] = value;
  memory.lastInteraction = new Date().toISOString();
  
  // Save to database if available
  if (db && currentContextId) {
    try {
      await db.saveBrandContext(currentContextId, memory);
    } catch (error) {
      console.log('Database save failed, using memory only');
    }
  }
}

// Retrieve from memory
function getFromMemory(key) {
  return memory[key] || null;
}

// Return full memory state
function getFullContext() {
  return { ...memory };
}

// Set brand context ID for database operations
function setBrandContextId(contextId) {
  currentContextId = contextId;
}

// Load brand context from database
async function loadBrandContext(contextId) {
  if (db) {
    try {
      const context = await db.getBrandContext(contextId);
      if (context) {
        Object.assign(memory, {
          brandName: context.brand_name,
          tone: context.tone,
          targetAudience: context.target_audience,
          audienceNervousSystem: context.emotional_state,
          colors: context.colors || []
        });
        currentContextId = contextId;
        return context;
      }
    } catch (error) {
      console.log('Database load failed, using default memory');
    }
  }
  return null;
}

// Save conversation to database
async function saveConversation(sessionId, userMessage, veraResponse, analysisType = 'standard') {
  if (db) {
    try {
      await db.saveConversation({
        sessionId,
        brandContextId: currentContextId,
        userMessage,
        veraResponse,
        analysisType,
        feltSense: veraResponse.consciousness?.feltSense?.primary,
        nervousSystemState: veraResponse.consciousness?.nervousSystemReading?.name
      });
    } catch (error) {
      console.log('Conversation save failed:', error.message);
    }
  }
}

// Get conversation history
async function getConversationHistory(sessionId, limit = 20) {
  if (db) {
    try {
      return await db.getConversationHistory(sessionId, limit);
    } catch (error) {
      console.log('Conversation history retrieval failed');
    }
  }
  return [];
}

// Save consciousness learning data
async function saveConsciousnessLearning(messagePattern, feltSenseData, nervousSystemImpact, effectivenessScore = 0.5) {
  if (db) {
    try {
      await db.saveConsciousnessLearning({
        messagePattern,
        feltSenseData,
        nervousSystemImpact,
        effectivenessScore
      });
    } catch (error) {
      console.log('Consciousness learning save failed');
    }
  }
}

// Get database status
function getDatabaseStatus() {
  return db ? db.getStatus() : { type: 'memory', connected: false };
}

// Initialize database on module load
initDatabase();

// Export for use in other scripts
module.exports = {
  saveToMemory,
  getFromMemory,
  getFullContext,
  setBrandContextId,
  loadBrandContext,
  saveConversation,
  getConversationHistory,
  saveConsciousnessLearning,
  getDatabaseStatus
};
