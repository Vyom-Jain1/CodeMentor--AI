const AIService = require("./aiService");

class CodeReviewAI {
  static async reviewCode(code, language, problemId) {
    const prompt = `\n      Please review this ${language} code for the following aspects:\n      1. Code correctness and logic\n      2. Time and space complexity\n      3. Code style and best practices\n      4. Potential optimizations\n      5. Edge cases handling\n\n      Code:\n      ${code}\n\n      Provide specific, actionable feedback with examples.\n    `;
    const review = await AIService.query(prompt, "code_review");
    return {
      overallScore: this.calculateScore(review),
      feedback: review,
      // Optionally parse feedback for suggestions, complexity, etc.
    };
  }

  static calculateScore(review) {
    const positiveKeywords = ["good", "correct", "efficient", "optimal"];
    const negativeKeywords = ["issue", "problem", "inefficient", "wrong"];
    let score = 70;
    positiveKeywords.forEach((keyword) => {
      if (review.toLowerCase().includes(keyword)) score += 5;
    });
    negativeKeywords.forEach((keyword) => {
      if (review.toLowerCase().includes(keyword)) score -= 10;
    });
    return Math.max(0, Math.min(100, score));
  }

  static async generateOptimizedVersion(code, language) {
    const prompt = `\n      Optimize this ${language} code for better performance:\n      \n      Original Code:\n      ${code}\n      \n      Please provide:\n      1. Optimized version of the code\n      2. Explanation of optimizations made\n      3. Before/after complexity comparison\n    `;
    return await AIService.query(prompt, "optimization");
  }
}

module.exports = CodeReviewAI;
