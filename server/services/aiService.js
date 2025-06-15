const aiProvider = require('./aiProvider');

class AIService {
  constructor() {
    this.defaultOptions = {
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 1000,
      timeout: 30000,
    };
  }

  async queryModel(prompt, options = {}) {
    try {
      const result = await aiProvider.generateCode(prompt, {
        ...this.defaultOptions,
        ...options
      });
      return result;
    } catch (error) {
      console.error("AI query failed:", error.message);
      throw error;
    }
  }

  async generateHint(problem, userCode, difficulty = "medium") {
    const prompt = `You are helping a user solve a coding problem. Analyze their code and provide a helpful hint.\n\nProblem: ${problem.title}\nDifficulty: ${difficulty}\nDescription: ${problem.description}\nExpected Time Complexity: ${problem.timeComplexity}\nExpected Space Complexity: ${problem.spaceComplexity}\n\nUser's Current Code:\n\`\`\`\n${userCode}\n\`\`\`\n\nProvide a concise, helpful hint that:\n1. Identifies any issues in the current approach\n2. Guides towards a better solution without giving it away\n3. Mentions relevant data structures or algorithms if applicable\n4. Points out potential edge cases to consider\n\nFormat your response in a clear, encouraging way.`;
    
    return this.queryModel(prompt, {
      max_tokens: 250,
      temperature: 0.7,
      systemMessage: "You are an expert coding mentor who helps users improve their problem-solving skills. You provide clear, actionable hints that guide users towards solutions without giving them away directly.",
    });
  }

  async explainConcept(concept, level = "beginner") {
    const prompt = `Explain the following programming concept:\n\nConcept: ${concept}\nLevel: ${level}\n\nProvide:\n1. A clear, ${level}-friendly explanation\n2. Real-world analogies or examples\n3. Code examples in multiple languages\n4. Common use cases and pitfalls\n5. Best practices and tips\n\nFormat your response with clear sections and syntax-highlighted code examples.`;
    
    return this.queryModel(prompt, {
      max_tokens: 1000,
      temperature: 0.7,
      systemMessage: "You are an expert programming instructor who excels at explaining complex concepts in simple terms. You use clear examples and analogies to help users understand programming concepts deeply.",
    });
  }

  async debugCode(code, language, error) {
    const prompt = `Debug the following code that has an error:\n\nLanguage: ${language}\nError Message: ${error}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nPlease provide:\n1. Identification of the root cause\n2. Explanation of why the error occurs\n3. Step-by-step solution to fix it\n4. Corrected code\n5. Tips to prevent similar issues\n\nAdditionally, check for:\n- Syntax errors\n- Logic errors\n- Edge cases\n- Performance issues\n- Best practices violations`;

    return this.queryModel(prompt, {
      max_tokens: 800,
      temperature: 0.7,
      systemMessage: "You are an expert debugger who helps users understand and fix their code issues. You provide clear explanations of problems and guide users towards robust solutions.",
    });
  }

  async optimizeCode(code, language) {
    const prompt = `Analyze and optimize the following code:\n\nLanguage: ${language}\n\nCurrent Code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nPlease provide:\n1. Current time and space complexity analysis\n2. Identified performance bottlenecks\n3. Optimization opportunities\n4. Improved code with better complexity\n5. Explanation of optimizations\n6. Trade-offs and considerations\n\nConsider:\n- Algorithm efficiency\n- Data structure choices\n- Memory usage\n- Code readability\n- Edge cases\n- Scalability`;

    return this.queryModel(prompt, {
      max_tokens: 1000,
      temperature: 0.7,
      systemMessage: "You are an expert in algorithms and optimization who helps users write efficient code. You provide detailed analysis and practical improvements while explaining the reasoning behind each optimization.",
    });
  }
  async analyzeSolution(problemId, code, language) {
    const prompt = `Analyze the following solution for a coding problem:\n\nProblem ID: ${problemId}\nLanguage: ${language}\n\nSubmitted Solution:\n\`\`\`${language}\n${code}\n\`\`\`\n\nPlease provide a comprehensive analysis:\n1. Correctness\n- Logic verification\n- Edge case handling\n- Input validation\n
2. Complexity Analysis\n- Time complexity\n- Space complexity\n- Explanation of calculations\n
3. Code Quality\n- Code style and conventions\n- Variable/function naming\n- Comments and documentation\n- Error handling\n
4. Potential Improvements\n- Optimization opportunities\n- Readability enhancements\n- Best practices\n- Alternative approaches\n
5. Learning Points\n- Key concepts used\n- Common pitfalls\n- Related problems/patterns`;

    return this.queryModel(prompt, {
      max_tokens: 1200,
      temperature: 0.7,
      systemMessage: "You are an expert code reviewer who provides comprehensive analysis of coding solutions. You focus on correctness, efficiency, and code quality while helping users learn and improve.",
    });
  }

  async generateTestCases(problem, code, language) {
    const prompt = `Generate comprehensive test cases for the following coding problem and solution:\n\nProblem: ${problem.title}\nDescription: ${problem.description}\nConstraints:\n${problem.constraints}\n\nSolution:\n\`\`\`${language}\n${code}\n\`\`\`\n\nPlease generate:\n1. Basic test cases\n- Simple inputs and expected outputs\n- Boundary conditions\n
2. Edge Cases\n- Empty/null inputs\n- Minimum/maximum values\n- Invalid inputs\n
3. Complex Cases\n- Large inputs\n- Special patterns\n- Performance tests\n
4. Random Test Generator\n- Logic to generate valid random tests\n- Input size variations\n
Format each test case with:\n- Input description\n- Input values\n- Expected output\n- Explanation of what it tests`;

    return this.queryModel(prompt, {
      max_tokens: 1000,
      temperature: 0.7,
      systemMessage: "You are an expert in software testing who creates comprehensive test suites. You focus on covering all edge cases and ensuring robust test coverage.",
    });
  }

  async suggestLearningPath(userLevel, interests, goals) {
    const prompt = `Create a personalized learning path for a programming student:\n\nCurrent Level: ${userLevel}\nInterests: ${interests.join(", ")}\nLearning Goals: ${goals.join(", ")}\n\nPlease provide:\n1. Structured Learning Plan\n- Core concepts to master\n- Recommended order\n- Estimated timeline\n
2. Resources\n- Books\n- Online courses\n- Practice problems\n- Projects\n
3. Milestones\n- Skill checkpoints\n- Practice projects\n- Assessment criteria\n
4. Advanced Topics\n- Specialization areas\n- Industry relevance\n- Career opportunities`;

    return this.queryModel(prompt, {
      max_tokens: 1500,
      temperature: 0.7,
      systemMessage: "You are an experienced programming mentor who creates personalized learning paths. You help users achieve their coding goals through structured, practical learning plans.",
    });
  }
}

module.exports = new AIService();
