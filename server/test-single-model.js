const axios = require('axios');

// Explicitly set the API key
const HF_API_KEY = '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';

async function testModel() {
    console.log('Testing with API key:', `${HF_API_KEY.slice(0, 8)}...${HF_API_KEY.slice(-4)}`);
    
    // Test with the simplest model first
    const model = {
        name: 'tinyllama',
        url: 'https://api-inference.huggingface.co/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0'
    };
    
    const prompt = 'Write a simple hello world function in Python';
    
    try {
        console.log(`\nTesting ${model.name} model...`);
        console.log('URL:', model.url);
        console.log('\nSending request...');
        
        const response = await axios.post(
            model.url,
            { 
                inputs: prompt,
                max_length: 100,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );
        
        console.log('\n✅ Success!');
        console.log('\nResponse:');
        console.log('-------------------');
        if (Array.isArray(response.data)) {
            console.log(response.data[0].generated_text);
        } else {
            console.log(response.data.generated_text || response.data);
        }
        console.log('-------------------');
    } catch (error) {
        console.log('❌ Error:', error.response?.status, error.response?.statusText);
        console.log('Error details:', error.response?.data || error.message);
    }
}

console.log('Starting single model test...\n');
testModel().catch(console.error);
