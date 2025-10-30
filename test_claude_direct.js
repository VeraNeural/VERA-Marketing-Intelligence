// Direct Claude API test
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testClaude() {
  console.log('🧪 Testing Claude API directly...');
  console.log('API Key present:', !!process.env.ANTHROPIC_API_KEY);
  
  // Try multiple model names to find the right one
  const modelsToTry = [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-latest',
    'claude-3-5-sonnet',
    'claude-3-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-haiku',
    'claude-3-opus',
    'claude-3-sonnet',
    'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307'
  ];
  
  // Continue testing - don't return immediately, test all models
  for (const model of modelsToTry) {
    console.log(`\n🔍 Trying model: ${model}`);
    
    try {
      const response = await anthropic.messages.create({
        model: model,
        max_tokens: 100,
        messages: [
          { role: 'user', content: 'Say hello as VERA' }
        ]
      });
      
      console.log(`✅ SUCCESS with model: ${model}`);
      console.log('Response:', response.content[0].text.substring(0, 100) + '...');
      
    } catch (error) {
      console.log(`❌ Failed with ${model}: ${error.message.substring(0, 50)}...`);
    }
  }
  
  console.log('\n❌ No working models found!');
}

testClaude();