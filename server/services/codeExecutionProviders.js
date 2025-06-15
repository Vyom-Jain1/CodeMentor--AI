const CodeRunner = require("./codeRunner");
const axios = require("axios");

const codeRunner = new CodeRunner();
codeRunner.initialize();

// Piston API Provider
async function pistonProvider(code, language, input = "") {
  const endpoint =
    process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston/execute";
  // Map language to Piston supported language if needed
  const langMap = {
    python: "python3",
    javascript: "javascript",
    java: "java",
    cpp: "cpp",
  };
  const pistonLang = langMap[language] || language;
  const response = await axios.post(endpoint, {
    language: pistonLang,
    source: code,
    stdin: input,
  });
  if (response.data) {
    return {
      stdout: response.data.output || "",
      stderr: response.data.stderr || "",
      exitCode: response.data.code || 0,
    };
  }
  throw new Error("Invalid response from Piston API");
}

// Main function to select provider
async function runCode(provider, code, language, input = "") {
  switch (provider) {
    case "docker":
      return codeRunner.runCode(code, language, input, "docker");
    case "local":
      return codeRunner.runCode(code, language, input, "local");
    case "piston":
      return pistonProvider(code, language, input);
    default:
      throw new Error("Unknown code execution provider");
  }
}

module.exports = {
  runCode,
};
