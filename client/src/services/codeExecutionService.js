import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Get supported programming languages
export const getSupportedLanguages = async () => {
  try {
    const response = await axios.get(`${API_URL}/code/languages`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Execute code and validate against test cases
export const executeCode = async (code, language, testCases) => {
  try {
    const response = await axios.post(`${API_URL}/code/execute`, {
      code,
      language,
      testCases,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Format code execution results for display
export const formatExecutionResults = (results) => {
  if (!results || !results.data) {
    return {
      success: false,
      message: "No results available",
    };
  }

  const { success, results: testResults } = results.data;
  const totalTests = testResults.length;
  const passedTests = testResults.filter((test) => test.passed).length;

  return {
    success,
    summary: {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      passRate: (passedTests / totalTests) * 100,
    },
    details: testResults.map((test, index) => ({
      testNumber: index + 1,
      input: test.input,
      expectedOutput: test.expectedOutput,
      actualOutput: test.actualOutput,
      error: test.error,
      passed: test.passed,
    })),
  };
};
