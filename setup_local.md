# VERA Local Setup Guide 🔧

This guide helps you set up VERA Marketing Intelligence on your local machine for optimal performance with local AI models.

## 🖥️ System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 14.0 or higher
- **RAM**: 4GB minimum (8GB recommended for local AI integration)
- **Storage**: 100MB for VERA core (additional space needed for AI models)

### Recommended for AI Integration
- **RAM**: 16GB+ for running local AI models alongside VERA
- **CPU**: Multi-core processor (AI models benefit from more cores)
- **GPU**: Optional but recommended for faster AI inference

## 📥 Installation Steps

### Step 1: Install Node.js
If you don't have Node.js installed:

**Windows:**
```powershell
# Download from https://nodejs.org/
# Or use Chocolatey:
choco install nodejs

# Verify installation
node --version
npm --version
```

**macOS:**
```bash
# Download from https://nodejs.org/
# Or use Homebrew:
brew install node

# Verify installation
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Download VERA
```bash
# If using git
git clone https://github.com/your-org/vera-marketing-intelligence.git
cd vera-marketing-intelligence

# Or download and extract ZIP file, then navigate to folder
cd vera-marketing-intelligence
```

### Step 3: Install Dependencies
```bash
# Install VERA dependencies (lightweight!)
npm install

# Verify installation
npm run help
```

### Step 4: Test Installation
```bash
# Run a quick test
node -e "const vera = require('./vera_core'); console.log('✅ VERA installed successfully!');"

# Start the chat interface
npm start
```

## 🤖 Local AI Model Setup (Optional)

VERA works great standalone, but integrating local AI models enhances its capabilities.

### Option 1: Ollama (Recommended)

**Install Ollama:**
```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows (PowerShell as Administrator)
winget install Ollama.Ollama
```

**Download a model:**
```bash
# Install a lightweight model for VERA
ollama pull llama2:7b

# Or a larger model for better performance
ollama pull llama2:13b

# Start Ollama service
ollama serve
```

**Test integration:**
```bash
# In another terminal, test the model
ollama run llama2:7b "Analyze this marketing message: Welcome to our wellness sanctuary"
```

### Option 2: LM Studio

1. Download LM Studio from https://lmstudio.ai/
2. Install a compatible model (GGUF format)
3. Start the local server
4. Note the server URL (usually http://localhost:1234)

### Option 3: Other Local Models

VERA can integrate with any local AI service that provides an HTTP API:
- **OpenAI-compatible APIs**
- **Hugging Face Transformers**
- **Custom model servers**

## ⚙️ Configuration

### Basic VERA Configuration
Create a `.env` file in your VERA directory (optional):
```bash
# .env file
VERA_DEFAULT_TONE=soothing
VERA_DEFAULT_AUDIENCE=wellness_seekers
VERA_LOG_LEVEL=info
```

### AI Model Configuration
For future AI integration, configure in `config.json`:
```json
{
  "aiProvider": "ollama",
  "ollamaConfig": {
    "baseUrl": "http://localhost:11434",
    "model": "llama2:7b"
  },
  "fallbackMode": "standalone"
}
```

## 🚀 Quick Start Commands

### Basic Usage
```bash
# Start interactive chat
npm start

# Quick analysis from command line
npm run analyze "Your marketing message here"

# Run demonstration
npm run demo

# Show all available commands
npm run help
```

### Chat Interface
Once started with `npm start`:
```
VERA> /init                          # Set up your brand
VERA> /analyze "Welcome to our app"  # Analyze content
VERA> /recommendations               # Get brand recommendations  
VERA> /generate story                # Generate content
VERA> /help                          # Show all commands
VERA> /exit                          # Exit VERA
```

## 🔧 Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Permission errors on Windows:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Memory issues with large analyses:**
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 vera_chat_interface.js
```

### Performance Optimization

**For better performance:**
1. **Close unnecessary applications** when running local AI models
2. **Use SSD storage** for faster model loading
3. **Increase swap space** if you have limited RAM
4. **Use smaller AI models** (7B parameters vs 13B+) for faster responses

### Debugging Mode
```bash
# Enable verbose logging
DEBUG=vera:* npm start

# Or check individual modules
node -e "
const vera = require('./vera_core');
console.log(vera.getBrandState());
"
```

## 📁 File Structure After Setup

```
vera-marketing-intelligence/
├── 📄 package.json              # Project configuration
├── 🧠 vera_core.js             # Main VERA engine
├── 💬 vera_chat_interface.js   # Interactive chat
├── 💾 memory_store.js          # Brand context storage
├── 📚 README.md               # Documentation
├── ⚙️ setup_local.md          # This file
├── 🔧 branding-tools/         # Brand analysis modules
├── 🧘 co-regulation/          # Emotional regulation
├── ✍️ content-strategy/       # Content generation
├── 📖 examples/               # Usage examples
└── 🗂️ node_modules/          # Dependencies (after npm install)
```

## 🌐 Network Configuration

### Firewall Settings
If using local AI models, ensure these ports are open:
- **Ollama**: 11434
- **LM Studio**: 1234 (default)
- **VERA**: No external ports needed (runs locally)

### Offline Usage
VERA core features work completely offline:
- ✅ Tone analysis
- ✅ Color psychology  
- ✅ Emotional co-regulation
- ✅ Content generation
- ✅ Brand recommendations

Only AI model integration requires internet (for initial model download).

## 📊 Performance Benchmarks

**VERA Core Performance:**
- Analysis speed: ~10ms per message
- Memory usage: ~50MB baseline
- Cold start time: <1 second

**With Local AI (Ollama llama2:7b):**
- Enhanced analysis: ~2-5 seconds
- Memory usage: ~4GB additional
- Model loading: ~30 seconds (first time)

## 🔄 Updates & Maintenance

### Updating VERA
```bash
# Pull latest changes (if using git)
git pull origin main

# Update dependencies
npm update

# Test after update
npm run help
```

### Backing Up Your Data
```bash
# Export your session data
# (Use /export command in chat interface)

# Or backup the entire directory
cp -r vera-marketing-intelligence vera-backup
```

## 💡 Tips for Optimal Use

### 1. Brand Initialization
Always start with `/init` to set up your brand profile for personalized insights.

### 2. Iterative Analysis
Use VERA iteratively:
1. Analyze existing content
2. Get recommendations
3. Generate new content
4. Re-analyze improvements

### 3. Emotional Context
Pay attention to your audience's emotional state when using VERA - it significantly affects recommendations.

### 4. Local AI Benefits
- **Privacy**: Your brand data stays local
- **Speed**: No network latency
- **Cost**: No API fees
- **Customization**: Train on your specific brand data

## 🆘 Getting Help

### Built-in Help
```bash
# In chat interface
VERA> /help

# Command line help
npm run help
```

### Troubleshooting Checklist
- [ ] Node.js version 14+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] No permission errors
- [ ] Sufficient disk space (100MB+)
- [ ] For AI: Model downloaded and service running

### Community Support
- GitHub Issues: Report bugs and feature requests
- Documentation: Check README.md for detailed usage
- Examples: Review examples/ directory for code samples

---

🎉 **You're ready to use VERA!** Start with `npm start` and begin creating nervous system aware marketing content.

Remember: VERA helps you build marketing that doesn't just persuade—it co-regulates and supports your audience's well-being. 🧠💚
