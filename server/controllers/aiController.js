const axios = require("axios");

// Initialize Ollama API configuration
const OLLAMA_API = process.env.OLLAMA_API || "http://localhost:11434/api";
const MODEL = process.env.OLLAMA_MODEL || "codellama";

// Get AI explanation for a problem
exports.getExplanation = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { question } = req.body;

    // Call Ollama API
    const response = await axios.post(`${OLLAMA_API}/generate`, {
      model: MODEL,
      prompt: `Explain the following DSA problem and provide a solution approach: ${question}`,
      stream: false,
    });

    res.json({ explanation: response.data.response });
  } catch (error) {
    console.error("AI Service Error:", error);
    res.status(500).json({ message: "Error getting AI explanation" });
  }
};

// Get code analysis
exports.analyzeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    // Call Ollama API for code analysis
    const response = await axios.post(`${OLLAMA_API}/generate`, {
      model: MODEL,
      prompt: `Analyze this ${language} code and provide feedback on time complexity, space complexity, and potential improvements:\n\n${code}`,
      stream: false,
    });

    res.json({ analysis: response.data.response });
  } catch (error) {
    console.error("AI Service Error:", error);
    res.status(500).json({ message: "Error analyzing code" });
  }
};

// Get learning path recommendation
exports.getLearningPath = async (req, res) => {
  try {
    const { currentLevel, completedTopics } = req.body;

    // Call Ollama API for learning path
    const response = await axios.post(`${OLLAMA_API}/generate`, {
      model: MODEL,
      prompt: `Based on the user's current level ${currentLevel} and completed topics ${completedTopics.join(
        ", "
      )}, suggest a learning path for DSA topics.`,
      stream: false,
    });

    res.json({ learningPath: response.data.response });
  } catch (error) {
    console.error("AI Service Error:", error);
    res.status(500).json({ message: "Error generating learning path" });
  }
};

// Get problem hints
exports.getHints = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { currentAttempt } = req.body;

    // Call Ollama API for hints
    const response = await axios.post(`${OLLAMA_API}/generate`, {
      model: MODEL,
      prompt: `Provide a hint for solving this DSA problem. Current attempt: ${currentAttempt}`,
      stream: false,
    });

    res.json({ hint: response.data.response });
  } catch (error) {
    console.error("AI Service Error:", error);
    res.status(500).json({ message: "Error getting hints" });
  }
};
