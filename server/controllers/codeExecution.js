const { runCode } = require("../services/codeExecutionProviders");
const CODE_EXECUTION_PROVIDER = "piston";  // Force Piston API for now

// Controller methods
exports.executeCode = async (req, res) => {
  try {
    const { code, language, input = "" } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: code or language",
      });
    }

    const result = await runCode(
      CODE_EXECUTION_PROVIDER,
      code,
      language,
      input
    );
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
    data: [
      { name: "javascript", extension: ".js" },
      { name: "python", extension: ".py" },
      { name: "java", extension: ".java" },
      { name: "cpp", extension: ".cpp" },
    ],
  });
};
