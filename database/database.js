// database/database.js
// Database integration for VERA - supports multiple database types

const fs = require('fs');
const path = require('path');

class VeraDatabase {
  constructor(config = {}) {
    this.type = config.type || process.env.DATABASE_TYPE || 'sqlite';
    this.connectionString = config.connectionString || process.env.DATABASE_URL;
    this.connected = false;
    this.db = null;
    
    this.initDatabase();
  }

  async initDatabase() {
    try {
      switch (this.type) {
        case 'postgresql':
        case 'postgres':
          await this.initPostgreSQL();
          break;
        case 'mysql':
          await this.initMySQL();
          break;
        case 'sqlite':
        default:
          await this.initSQLite();
          break;
      }
      
      await this.createTables();
      this.connected = true;
      console.log('🗄️  VERA Database connected:', this.type);
      
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('💡 Falling back to file-based storage');
      this.type = 'file';
      this.connected = false;
    }
  }

  async initSQLite() {
    const sqlite3 = await this.loadOptionalDependency('sqlite3');
    if (!sqlite3) {
      throw new Error('SQLite3 not available');
    }
    
    const dbPath = path.join(__dirname, 'vera_memory.db');
    this.db = new sqlite3.Database(dbPath);
  }

  async initPostgreSQL() {
    const { Pool } = await this.loadOptionalDependency('pg');
    if (!Pool) {
      throw new Error('PostgreSQL driver not available');
    }
    
    this.db = new Pool({
      connectionString: this.connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    // Test connection
    await this.db.query('SELECT NOW()');
  }

  async initMySQL() {
    const mysql = await this.loadOptionalDependency('mysql2/promise');
    if (!mysql) {
      throw new Error('MySQL driver not available');
    }
    
    this.db = await mysql.createConnection(this.connectionString);
  }

  async loadOptionalDependency(packageName) {
    try {
      return require(packageName);
    } catch (error) {
      console.log(`📦 ${packageName} not installed - install with: npm install ${packageName}`);
      return null;
    }
  }

  async createTables() {
    const tables = {
      brand_contexts: `
        CREATE TABLE IF NOT EXISTS brand_contexts (
          id VARCHAR(255) PRIMARY KEY,
          brand_name VARCHAR(255),
          tone VARCHAR(100),
          target_audience VARCHAR(255),
          emotional_state VARCHAR(100),
          colors JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `,
      
      conversations: `
        CREATE TABLE IF NOT EXISTS conversations (
          id VARCHAR(255) PRIMARY KEY,
          session_id VARCHAR(255),
          brand_context_id VARCHAR(255),
          user_message TEXT,
          vera_response JSON,
          analysis_type VARCHAR(100),
          felt_sense VARCHAR(100),
          nervous_system_state VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `,
      
      consciousness_learnings: `
        CREATE TABLE IF NOT EXISTS consciousness_learnings (
          id VARCHAR(255) PRIMARY KEY,
          message_pattern TEXT,
          felt_sense_data JSON,
          nervous_system_impact JSON,
          effectiveness_score DECIMAL(3,2),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `,
      
      brand_analytics: `
        CREATE TABLE IF NOT EXISTS brand_analytics (
          id VARCHAR(255) PRIMARY KEY,
          brand_context_id VARCHAR(255),
          metric_type VARCHAR(100),
          metric_value JSON,
          date_recorded DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    };

    for (const [tableName, sql] of Object.entries(tables)) {
      await this.executeQuery(sql);
    }
  }

  async executeQuery(sql, params = []) {
    if (!this.connected && this.type !== 'file') {
      throw new Error('Database not connected');
    }

    try {
      switch (this.type) {
        case 'postgresql':
        case 'postgres':
          const pgResult = await this.db.query(sql, params);
          return pgResult.rows;
          
        case 'mysql':
          const [mysqlRows] = await this.db.execute(sql, params);
          return mysqlRows;
          
        case 'sqlite':
          return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
              if (err) reject(err);
              else resolve(rows);
            });
          });
          
        case 'file':
        default:
          return this.fileBasedOperation(sql, params);
      }
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // File-based fallback
  fileBasedOperation(operation, data) {
    const dataDir = path.join(__dirname, 'file_storage');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Simple file-based storage for when database is not available
    const filename = path.join(dataDir, 'vera_memory.json');
    let storage = {};
    
    try {
      if (fs.existsSync(filename)) {
        storage = JSON.parse(fs.readFileSync(filename, 'utf8'));
      }
    } catch (error) {
      console.log('Creating new file storage');
    }
    
    return storage;
  }

  // VERA-specific methods
  async saveBrandContext(contextId, brandData) {
    const sql = `
      INSERT OR REPLACE INTO brand_contexts 
      (id, brand_name, tone, target_audience, emotional_state, colors, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    
    const params = [
      contextId,
      brandData.brandName,
      brandData.tone,
      brandData.targetAudience,
      brandData.emotionalState,
      JSON.stringify(brandData.colors || [])
    ];
    
    return await this.executeQuery(sql, params);
  }

  async getBrandContext(contextId) {
    const sql = 'SELECT * FROM brand_contexts WHERE id = ?';
    const results = await this.executeQuery(sql, [contextId]);
    
    if (results && results.length > 0) {
      const context = results[0];
      context.colors = JSON.parse(context.colors || '[]');
      return context;
    }
    
    return null;
  }

  async saveConversation(conversationData) {
    const sql = `
      INSERT INTO conversations 
      (id, session_id, brand_context_id, user_message, vera_response, analysis_type, felt_sense, nervous_system_state)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      conversationData.id || this.generateId(),
      conversationData.sessionId,
      conversationData.brandContextId,
      conversationData.userMessage,
      JSON.stringify(conversationData.veraResponse),
      conversationData.analysisType,
      conversationData.feltSense,
      conversationData.nervousSystemState
    ];
    
    return await this.executeQuery(sql, params);
  }

  async getConversationHistory(sessionId, limit = 50) {
    const sql = `
      SELECT * FROM conversations 
      WHERE session_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    
    const results = await this.executeQuery(sql, [sessionId, limit]);
    
    return results.map(row => ({
      ...row,
      vera_response: JSON.parse(row.vera_response || '{}')
    }));
  }

  async saveConsciousnessLearning(learningData) {
    const sql = `
      INSERT INTO consciousness_learnings 
      (id, message_pattern, felt_sense_data, nervous_system_impact, effectiveness_score)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const params = [
      this.generateId(),
      learningData.messagePattern,
      JSON.stringify(learningData.feltSenseData),
      JSON.stringify(learningData.nervousSystemImpact),
      learningData.effectivenessScore
    ];
    
    return await this.executeQuery(sql, params);
  }

  async getBrandAnalytics(brandContextId, days = 30) {
    const sql = `
      SELECT * FROM brand_analytics 
      WHERE brand_context_id = ? 
      AND date_recorded >= DATE('now', '-${days} days')
      ORDER BY date_recorded DESC
    `;
    
    const results = await this.executeQuery(sql, [brandContextId]);
    
    return results.map(row => ({
      ...row,
      metric_value: JSON.parse(row.metric_value || '{}')
    }));
  }

  generateId() {
    return 'vera_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async close() {
    if (this.db && this.connected) {
      switch (this.type) {
        case 'postgresql':
        case 'postgres':
          await this.db.end();
          break;
        case 'mysql':
          await this.db.end();
          break;
        case 'sqlite':
          this.db.close();
          break;
      }
    }
  }

  getStatus() {
    return {
      type: this.type,
      connected: this.connected,
      hasConnection: !!this.db
    };
  }
}

module.exports = VeraDatabase;