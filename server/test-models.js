// Force reload environment variables
delete require.cache[require.resolve('dotenv')];
require('dotenv').config();
const aiProvider = require('./services/aiProvider');

async function testModels() {
    console.log('API Key:', `${process.env.HF_API_KEY?.slice(0, 8)}...${process.env.HF_API_KEY?.slice(-4)}`);
    const testPrompt = 'Write a simple function to check if a number is prime in Python';
    
    console.log('🚀 Testing AI Models Integration\n');
    
    // Test each model individually
    for (const model of aiProvider.models) {
        console.log(`\n📝 Testing ${model.name.toUpperCase()}:`);
        console.log(`URL: ${model.url}`);
        console.log(`Specialization: ${model.specialization.join(', ')}`);
        console.log(`Max Length: ${model.maxLength}`);
        
        try {
            console.log('\nSending request...');
            const startTime = Date.now();
            console.log('Making request with headers:', {
                'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                'Content-Type': 'application/json'
            });
            const response = await aiProvider.generateWithHuggingFace(testPrompt, model);
            const duration = Date.now() - startTime;
            
            console.log('✅ Success!');
            console.log(`Response time: ${duration}ms`);
            console.log('\nResponse Preview:');
            console.log('-------------------');
            console.log(response.slice(0, 200) + (response.length > 200 ? '...' : ''));
            console.log('-------------------');
        } catch (error) {
            console.log('❌ Failed');
            console.log(`Error: ${error.message}`);
        }
        
        // Get model stats
        const stats = aiProvider.modelStats.get(model.name);
        console.log('\nModel Stats:');
        console.log(`Success Rate: ${stats.successCount}/${stats.successCount + stats.failureCount}`);
        console.log(`Average Response Time: ${Math.round(stats.averageResponseTime)}ms`);
    }
    
    // Test the smart model selection
    console.log('\n🎯 Testing Smart Model Selection:');
    try {
        const bestModel = aiProvider.getBestModel('code');
        console.log(`Selected Model: ${bestModel.name}`);
        
        console.log('\nTesting code generation with automatic model selection...');
        const response = await aiProvider.generateCode(testPrompt);
        console.log('✅ Code generation successful!');
        console.log('\nResponse Preview:');
        console.log('-------------------');
        console.log(response.slice(0, 200) + (response.length > 200 ? '...' : ''));
        console.log('-------------------');
    } catch (error) {
        console.log('❌ Smart selection failed');
        console.log(`Error: ${error.message}`);
    }
}

console.log('Starting model integration tests...\n');
testModels().catch(console.error);
