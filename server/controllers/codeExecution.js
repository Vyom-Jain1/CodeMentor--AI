const { spawn } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const { v4: uuidv4 } = require("uuid");

// Supported languages and their file extensions
const SUPPORTED_LANGUAGES = {
  javascript: {
    extension: ".js",
    command: "node",
    timeout: 5000,
  },
  python: {
    extension: ".py",
    command: "python",
    timeout: 5000,
  },
  java: {
    extension: ".java",
    command: "java",
    timeout: 10000,
  },
  cpp: {
    extension: ".cpp",
    command: "g++",
    timeout: 10000,
  },
};

// Create a temporary directory for code execution
const createTempDir = async () => {
  const tempDir = path.join(os.tmpdir(), `codementor-${uuidv4()}`);
  await fs.mkdir(tempDir, { recursive: true });
  return tempDir;
};

// Write code to a temporary file
const writeCodeToFile = async (tempDir, code, language) => {
  const langConfig = SUPPORTED_LANGUAGES[language];
  if (!langConfig) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const fileName = `solution${langConfig.extension}`;
  const filePath = path.join(tempDir, fileName);
  await fs.writeFile(filePath, code);
  return filePath;
};

// Execute code and return the result
const executeCode = async (filePath, language, input) => {
  const langConfig = SUPPORTED_LANGUAGES[language];
  const args = language === "java" ? [filePath] : [filePath];

  return new Promise((resolve, reject) => {
    const process = spawn(langConfig.command, args);
    let output = "";
    let error = "";

    // Set timeout
    const timeout = setTimeout(() => {
      process.kill();
      reject(new Error("Execution timed out"));
    }, langConfig.timeout);

    // Handle input
    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }

    // Collect output
    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    // Collect errors
    process.stderr.on("data", (data) => {
      error += data.toString();
    });

    // Handle process completion
    process.on("close", (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error(`Execution failed: ${error}`));
      } else {
        resolve(output.trim());
      }
    });
  });
};

// Validate code against test cases
const validateCode = async (code, language, testCases) => {
  const tempDir = await createTempDir();
  try {
    const filePath = await writeCodeToFile(tempDir, code, language);
    const results = [];

    for (const testCase of testCases) {
      try {
        const output = await executeCode(filePath, language, testCase.input);
        const passed = output === testCase.expectedOutput;
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: output,
          passed,
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          error: error.message,
          passed: false,
        });
      }
    }

    return {
      success: results.every((result) => result.passed),
      results,
    };
  } finally {
    // Clean up temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });
  }
};

// Controller methods
exports.executeCode = async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    if (!code || !language || !testCases) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: code, language, or testCases",
      });
    }

    if (!SUPPORTED_LANGUAGES[language]) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`,
      });
    }

    const result = await validateCode(code, language, testCases);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Code execution error:", error);
    res.status(500).json({
      success: false,
      error: "Code execution failed",
      details: error.message,
    });
  }
};

// Get supported languages
exports.getSupportedLanguages = (req, res) => {
  res.json({
    success: true,
    data: Object.keys(SUPPORTED_LANGUAGES).map((lang) => ({
      name: lang,
      extension: SUPPORTED_LANGUAGES[lang].extension,
      timeout: SUPPORTED_LANGUAGES[lang].timeout,
    })),
  });
};
