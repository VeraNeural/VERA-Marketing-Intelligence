// Quick Claude test with working model
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function quickTest() {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 200,
      messages: [
        { role: 'user', content: 'As VERA, a marketing AI, briefly introduce yourself and your capabilities.' }
      ]
    });
    
    console.log('✅ Claude Working!');
    console.log('Model: claude-3-5-haiku-20241022');
    console.log('Response:', response.content[0].text);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickTest();