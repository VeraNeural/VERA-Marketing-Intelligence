// Test VERA's local AI integration
import fetch from 'node-fetch';

async function testVeraAI() {
    console.log('🧪 Testing VERA Local AI Integration...\n');
    
    const testMessage = {
        message: "Hello VERA! Please introduce yourself as a marketing intelligence AI and demonstrate your Taylor marketing brain capabilities by outlining a quick campaign strategy for a luxury brand launch."
    };
    
    try {
        console.log('📤 Sending test message to VERA...');
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
        
        console.log('✅ VERA Response Status:', response.status);
        console.log('📝 VERA Response:');
        console.log('================================');
        console.log(result.response || result.message || JSON.stringify(result, null, 2));
        console.log('================================\n');
        
        // Check if it's using AI vs fallback
        if (result.response && result.response.includes('Hello')) {
            console.log('🎉 AI Integration appears to be working!');
        } else {
            console.log('⚠️  Might be using fallback responses - check API keys');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure chat-server.js is running on port 8080');
        console.log('2. Check that API keys are properly configured in .env');
        console.log('3. Verify network connectivity to Claude/OpenAI APIs');
    }
}

// Run the test
testVeraAI();