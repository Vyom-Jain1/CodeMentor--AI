const axios = require('axios');

// Force reload environment variables
delete require.cache[require.resolve('dotenv')];
require('dotenv').config();

class AIProvider {
  constructor() {
    this.hfApiKey = process.env.HF_API_KEY;
    if (!this.hfApiKey) {
      throw new Error('HF_API_KEY is required');
    }

    this.models = [
      {
        name: 'codellama/CodeLlama-34b-Instruct-hf',
        url: 'https://api-inference.huggingface.co/models/codellama/CodeLlama-34b-Instruct-hf',
        priority: 1,
        specialization: ['code'],
        maxLength: 2048
      },
      {
        name: 'microsoft/phi-2',
        url: 'https://api-inference.huggingface.co/models/microsoft/phi-2',
        priority: 2,
        specialization: ['general'],
        maxLength: 2048
      },
      {
        name: 'starcoderbase',
        url: 'https://api-inference.huggingface.co/models/bigcode/starcoderbase-1b',
        priority: 2,
        specialization: ['code'],
        maxLength: 2048
      },
      {
        name: 'codegen',
        url: 'https://api-inference.huggingface.co/models/Salesforce/codegen-350m-mono',
        priority: 3,
        specialization: ['code'],
        maxLength: 1024
      },
      {
        name: 'incoder',
        url: 'https://api-inference.huggingface.co/models/facebook/incoder-1b',
        priority: 4,
        specialization: ['code'],
        maxLength: 2048
      }
    ];

    // Keep track of model performance
    this.modelStats = new Map();
    this.models.forEach(model => {
      this.modelStats.set(model.name, {
        successCount: 0,
        failureCount: 0,
        averageResponseTime: 0
      });
    });
  }

  async generateWithHuggingFace(prompt, model) {
    const startTime = Date.now();
    try {
      const response = await axios.post(
        model.url,
        { 
          inputs: prompt,
          max_length: model.maxLength,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.hfApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      const responseTime = Date.now() - startTime;
      this.updateModelStats(model.name, true, responseTime);

      // Extract the generated text from the response
      if (Array.isArray(response.data)) {
        return response.data[0].generated_text || response.data[0];
      }
      return response.data.generated_text || response.data;
    } catch (error) {
      this.updateModelStats(model.name, false, Date.now() - startTime);
      console.error(`Error calling ${model.name}:`, error.message);
      throw error;
    }
  }

  async generateCode(prompt, options = {}) {
    try {
      // Select appropriate model
      const model = this.selectModel(options.task || 'code');
      
      // Make API request
      const response = await axios.post(
        model.url,
        { inputs: prompt },
        {
          headers: {
            'Authorization': `Bearer ${this.hfApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0].generated_text;
      }
      
      return response.data;
    } catch (error) {
      console.error('AI code generation failed:', error?.response?.data || error.message);
      throw new Error('Failed to generate code. Please try again later.');
    }
  }

  updateModelStats(modelName, success, responseTime) {
    const stats = this.modelStats.get(modelName);
    if (success) {
      stats.successCount++;
      stats.averageResponseTime = (stats.averageResponseTime * (stats.successCount - 1) + responseTime) / stats.successCount;
    } else {
      stats.failureCount++;
    }
    this.modelStats.set(modelName, stats);
  }

  getBestModel(taskType = 'code') {
    return this.models
      .filter(model => model.specialization.includes(taskType))
      .sort((a, b) => {
        const statsA = this.modelStats.get(a.name);
        const statsB = this.modelStats.get(b.name);
        const successRateA = statsA.successCount / (statsA.successCount + statsA.failureCount || 1);
        const successRateB = statsB.successCount / (statsB.successCount + statsB.failureCount || 1);
        
        // Consider both success rate and response time
        const scoreA = successRateA * (1 / (statsA.averageResponseTime || 1000));
        const scoreB = successRateB * (1 / (statsB.averageResponseTime || 1000));
        
        return scoreB - scoreA;
      })[0] || this.models[0];
  }

  async generateCode(prompt) {
    let lastError;
    
    // Try each model in order of current performance ranking
    for (const model of this.models) {
      try {
        return await this.generateWithHuggingFace(prompt, model);
      } catch (error) {
        console.warn(`${model.name} failed, trying next model:`, error.message);
        lastError = error;
        continue;
      }
    }

    // If all Hugging Face models fail, fall back to OpenAI
    try {
      console.warn('All Hugging Face models failed, falling back to OpenAI');
      return await this.generateWithOpenAI(prompt);
    } catch (error) {
      console.error('All AI providers failed:', error.message);
      throw new Error('Failed to generate code with any available AI provider');
    }
  }
}

module.exports = new AIProvider();
