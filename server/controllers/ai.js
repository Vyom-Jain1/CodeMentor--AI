const axios = require("axios");
const Problem = require("../models/Problem");
const mongoose = require("mongoose");
const { getAIResponse } = require("../services/aiProviders");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL =
  process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
const AI_PROVIDER = process.env.AI_PROVIDER || "ollama";

// Validate required environment variables
const requiredEnvVars = {
  OPENAI_API_KEY: OPENAI_API_KEY,
};

Object.entries(requiredEnvVars).forEach(([name, value]) => {
  if (!value) {
    console.error(`Error: ${name} is not set in environment variables.`);
    process.exit(1);
  }
});

async function callAI(prompt, options = {}) {
  // For OpenAI, pass messages array; for others, just prompt
  if (AI_PROVIDER === "openai") {
    const messages = options.messages || [
      { role: "system", content: "You are a helpful coding assistant." },
      { role: "user", content: prompt },
    ];
    return getAIResponse(AI_PROVIDER, prompt, { ...options, messages });
  }
  return getAIResponse(AI_PROVIDER, prompt, options);
}

// @desc    Get AI hint for a problem
// @route   GET /api/ai/hint/:problemId
// @access  Private
exports.getHint = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, error: "Problem not found" });
    }
    const prompt = `Given this coding problem:\nTitle: ${problem.title}\nDescription: ${problem.description}\nDifficulty: ${problem.difficulty}\nCategory: ${problem.category}\n\nProvide a helpful hint that guides the user towards the solution without giving away the answer. Focus on the key concepts and approach they should consider. Keep the response concise and clear.`;
    const result = await callAI(prompt, { maxTokens: 150 });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get code explanation
// @route   POST /api/ai/explain/:problemId
// @access  Private
exports.explainCode = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { code, language } = req.body;

    // Input validation
    if (!problemId || !mongoose.Types.ObjectId.isValid(problemId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid problem ID" });
    }

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Code is required and must be a non-empty string",
      });
    }

    const supportedLanguages = ["javascript", "python", "java", "cpp", "c"];
    if (!language || !supportedLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Language is required and must be one of: ${supportedLanguages.join(
          ", "
        )}`,
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, error: "Problem not found" });
    }

    const prompt = `Given this coding problem:\nTitle: ${problem.title}\nDescription: ${problem.description}\n\nExplain this ${language} code in detail, breaking down how it works and its time/space complexity. Format the explanation with clear sections and use markdown for better readability:\n\n\
${code}\
\nStructure the explanation as follows:\n1. Overview\n2. Time Complexity\n3. Space Complexity\n4. Key Concepts\n5. Step-by-Step Explanation`;
    const result = await callAI(prompt);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get code optimization suggestions
// @route   POST /api/ai/optimize/:problemId
// @access  Private
exports.optimizeCode = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { code, language } = req.body;
    if (!code || !language) {
      return res
        .status(400)
        .json({ success: false, error: "Code and language are required" });
    }
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, error: "Problem not found" });
    }
    const prompt = `Given this coding problem:\nTitle: ${problem.title}\nDescription: ${problem.description}\n\nAnalyze this ${language} code and suggest optimizations to improve its performance, readability, and best practices:\n\n\
${code}\
\nProvide specific suggestions with explanations.`;
    const result = await callAI(prompt);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get comprehensive problem solution
// @route   GET /api/ai/solution/:problemId
// @access  Private
exports.getSolution = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, error: "Problem not found" });
    }
    const prompt = `Given this DSA problem:\nTitle: ${problem.title}\nDescription: ${problem.description}\nDifficulty: ${problem.difficulty}\nCategory: ${problem.category}\n\nProvide a solution guide with:\n1. Problem Analysis\n   - Key points and constraints\n   - Edge cases to consider\n2. Optimal Solution\n   - Approach explanation\n   - Time Complexity: O()\n   - Space Complexity: O()\n   - Code implementation\n3. Similar Problems\n   - List of related problems\n   - Common patterns\n4. Interview Tips\n   - Key points to discuss\n   - Common follow-ups`;
    const result = await callAI(prompt, { maxTokens: 1000 });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get step-by-step guidance
// @route   GET /api/ai/guidance/:problemId
// @access  Private
exports.getGuidance = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { step = 0 } = req.query;
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, error: "Problem not found" });
    }
    const prompt = `Given this DSA problem:\nTitle: ${
      problem.title
    }\nDescription: ${problem.description}\nDifficulty: ${
      problem.difficulty
    }\nCategory: ${problem.category}\n\nProvide step ${
      parseInt(step) + 1
    } of the solution process. Focus on one clear step that helps the user progress towards solving the problem.`;
    const result = await callAI(prompt);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Visualize code execution
// @route   POST /api/ai/visualize/:problemId
// @access  Private
exports.visualizeCode = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { code, language, input } = req.body;
    if (!code || !language) {
      return res
        .status(400)
        .json({ success: false, error: "Code and language are required" });
    }
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, error: "Problem not found" });
    }
    const prompt = `Given this coding problem:\nTitle: ${
      problem.title
    }\nDescription: ${
      problem.description
    }\n\nVisualize the execution of this ${language} code with the given input:\n\n${code}\n\nInput: ${
      input || "No input provided"
    }\n\nShow step-by-step how the code executes, including variable values and program state at each step.`;
    const result = await callAI(prompt, { maxTokens: 1000 });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOllamaResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Input validation
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required and must be a non-empty string",
      });
    }

    if (prompt.length > 2000) {
      return res.status(400).json({
        success: false,
        error: "Prompt exceeds maximum length of 2000 characters",
      });
    }

    const result = await callAI(prompt);

    res.status(200).json({
      success: true,
      response: result,
    });
  } catch (err) {
    console.error("Ollama Response Error:", err);
    res.status(500).json({
      success: false,
      error: "An error occurred while processing your request",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
exports.chat = async (req, res) => {
  try {
    const { message, problemId } = req.body;

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a non-empty string",
      });
    }

    let context = "";
    if (problemId) {
      const problem = await Problem.findById(problemId);
      if (problem) {
        context = `Given this coding problem:\nTitle: ${problem.title}\nDescription: ${problem.description}\nDifficulty: ${problem.difficulty}\nCategory: ${problem.category}\n\n`;
      }
    }

    const prompt = `${context}${message}`;
    const result = await callAI(prompt);

    res.status(200).json({
      success: true,
      data: {
        text: result,
        suggestions: [],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
