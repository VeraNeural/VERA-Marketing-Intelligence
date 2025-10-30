// Test VERA with Qwen Training Mode
import fetch from 'node-fetch';

async function testVeraWithQwenTraining() {
    console.log('🧪 Testing VERA with Qwen Training Mode...\n');
    
    const testMessage = {
        message: "Hello VERA! I need help creating a marketing campaign for a luxury AI product launch. What's your approach?",
        conversationHistory: []
    };
    
    try {
        console.log('📤 Sending marketing request to VERA...');
        const response = await fetch('http://localhost:8080/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testMessage)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        console.log('✅ VERA Response:');
        console.log('Source:', result.source);
        console.log('AI Provider:', result.aiProvider);
        console.log('Response Length:', result.response.message.content.length, 'characters');
        console.log('\n📝 Marketing Response:');
        console.log('================================');
        console.log(result.response.message.content);
        console.log('================================\n');
        
        console.log('🎓 Qwen Training Status:');
        console.log('- Qwen should have received this conversation for training');
        console.log('- Check server logs for "🎓 Training Qwen" messages');
        console.log('- Training happens in background (non-blocking)');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testVeraWithQwenTraining();