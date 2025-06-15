const axios = require("axios");

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

// Main function to run code
async function runCode(provider, code, language, input = "") {
  return pistonProvider(code, language, input);
}

module.exports = {
  runCode,
};
