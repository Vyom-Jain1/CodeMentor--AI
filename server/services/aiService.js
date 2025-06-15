const { getAIResponse } = require("./aiProviders");

class AIService {
  constructor() {
    this.models = [
      process.env.AI_PROVIDER || "ollama",
      "openai",
      "huggingface",
    ];
  }

  async queryModel(prompt, options = {}) {
    for (const model of this.models) {
      try {
        return await getAIResponse(model, prompt, options);
      } catch (err) {
        // Try next model
        continue;
      }
    }
    throw new Error("All AI models failed");
  }

  async generateHint(problem, userCode, difficulty = "medium") {
    const prompt = `Problem: ${problem.title}\nDifficulty: ${difficulty}\nUser's Code: ${userCode}\n\nProvide a helpful hint that guides the user towards the solution without giving it away completely. Consider the user's current approach and suggest the next logical step.`;
    return this.queryModel(prompt, { max_tokens: 150 });
  }

  async explainConcept(concept, level = "beginner") {
    const prompt = `Explain ${concept} in ${level} level with examples and code snippets.`;
    return this.queryModel(prompt);
  }

  async debugCode(code, language, error) {
    const prompt = `Debug this ${language} code. Error: ${error}\nCode:\n${code}`;
    return this.queryModel(prompt);
  }

  async optimizeCode(code, language) {
    const prompt = `Optimize this ${language} code for better time/space complexity: ${code}`;
    return this.queryModel(prompt);
  }
}

module.exports = new AIService();
