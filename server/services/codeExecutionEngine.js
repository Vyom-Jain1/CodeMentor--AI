const { runCode } = require("./codeExecutionProviders");

class CodeExecutionEngine {
  constructor() {
    this.supportedLanguages = ["javascript", "python", "java", "cpp"];
  }

  async executeCode({ code, language, testCases = [], timeLimit = 5000 }) {
    if (!this.supportedLanguages.includes(language)) {
      throw new Error(`Unsupported language: ${language}`);
    }
    const results = [];
    for (const testCase of testCases) {
      const startTime = Date.now();
      try {
        const result = await Promise.race([
          runCode(
            process.env.CODE_EXECUTION_PROVIDER || "piston",
            code,
            language,
            testCase.input
          ),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Time Limit Exceeded")),
              timeLimit
            )
          ),
        ]);
        const executionTime = Date.now() - startTime;
        results.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: result.stdout,
          passed: this.compareOutputs(result.stdout, testCase.output),
          executionTime,
          memoryUsed: result.memoryUsed || 0,
          error: result.stderr,
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: "",
          passed: false,
          executionTime: timeLimit,
          memoryUsed: 0,
          error: error.message,
        });
      }
    }
    return {
      success: results.every((r) => r.passed),
      results,
      summary: this.generateSummary(results),
    };
  }

  compareOutputs(actual, expected) {
    const normalizeOutput = (output) =>
      output?.toString().trim().replace(/\s+/g, " ");
    return normalizeOutput(actual) === normalizeOutput(expected);
  }

  generateSummary(results) {
    const totalTests = results.length;
    const passedTests = results.filter((r) => r.passed).length;
    const avgExecutionTime =
      results.reduce((sum, r) => sum + r.executionTime, 0) / totalTests;
    return {
      totalTests,
      passedTests,
      successRate: Math.round((passedTests / totalTests) * 100),
      avgExecutionTime: Math.round(avgExecutionTime),
      status: passedTests === totalTests ? "ACCEPTED" : "WRONG_ANSWER",
    };
  }
}

module.exports = new CodeExecutionEngine();
