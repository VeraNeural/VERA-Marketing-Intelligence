# VERA + Qwen Setup Guide 🧠🤖

## Quick Setup for Qwen Integration

### Step 1: Install Qwen via Ollama
```bash
# Install Ollama if you haven't already
# Windows: Download from https://ollama.ai/
# macOS/Linux: curl -fsSL https://ollama.ai/install.sh | sh

# Pull Qwen model (choose one based on your system)
ollama pull qwen:7b        # Faster, 4GB RAM
ollama pull qwen:14b       # Better quality, 8GB RAM
ollama pull qwen:32b       # Best quality, 16GB+ RAM

# Start Ollama service
ollama serve
```

### Step 2: Enable Qwen in VERA
```javascript
const vera = require('./vera_core');

// Configure VERA with Qwen
vera.configureAI({
  provider: 'ollama',
  model: 'qwen:7b',          // or qwen:14b, qwen:32b
  baseUrl: 'http://localhost:11434'
});

// Test the connection
const aiStatus = await vera.testAI();
console.log('AI Status:', aiStatus);

// Use enhanced analysis
const analysis = await vera.analyzeContentWithAI("Your marketing message here");
```

### Step 3: Chat with Enhanced VERA
```bash
# Start VERA with AI enhancement
npm run chat-ai

# Or web interface with AI
npm run web-ai
```

## What Qwen Adds to VERA

### Enhanced Capabilities:
- 🧠 **Deeper conversational intelligence**
- 💬 **Natural language explanations** of nervous system science
- 🎯 **Context-aware recommendations** based on full conversation history
- 📝 **Better content generation** with your brand voice
- 🔍 **More nuanced tone analysis** with cultural sensitivity
- 💡 **Creative problem-solving** for marketing challenges

### Example Enhanced Response:
**Before (Basic VERA):** "Detected tone: urgent. Recommendation: Add safety signals."

**After (VERA + Qwen):** "I can sense the urgency in this message, which might trigger your audience's fight-or-flight response. The phrase 'limited time' activates stress hormones like cortisol. For your wellness audience who are already in an anxious state, this could push them into nervous system dysregulation. 

Instead, try: 'We've saved a special spot for you' - this builds belonging rather than scarcity anxiety. The color palette should shift to more grounding greens (#6B8E7A) to physiologically calm their nervous system while they read."

## Configuration Options

Edit `config.json` to customize:
```json
{
  "ai": {
    "provider": "ollama",     // ollama, lmstudio, custom
    "model": "qwen:7b",       // qwen:7b, qwen:14b, qwen:32b
    "baseUrl": "http://localhost:11434",
    "enabled": true
  }
}
```

## Troubleshooting

### Qwen Not Responding?
```bash
# Check if Ollama is running
ollama list

# Restart Ollama service
ollama serve

# Test Qwen directly
ollama run qwen:7b "Hello, are you working?"
```

### Performance Tips:
- **Use qwen:7b** for fast responses (4GB RAM)
- **Use qwen:14b** for balanced quality/speed (8GB RAM)  
- **Use qwen:32b** for best quality (16GB+ RAM)
- **Close other apps** when running larger models
- **Use SSD storage** for faster model loading

## System Requirements

### Minimum (qwen:7b):
- 8GB RAM
- 4GB VRAM (optional)
- 5GB free storage

### Recommended (qwen:14b):
- 16GB RAM
- 8GB VRAM (optional)
- 10GB free storage

### Optimal (qwen:32b):
- 32GB+ RAM
- 16GB+ VRAM
- 20GB+ free storage

---

🚀 **Ready to enhance VERA with Qwen?** Follow the steps above and experience much more intelligent, empathetic marketing analysis!