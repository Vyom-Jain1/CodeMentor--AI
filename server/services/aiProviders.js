const axios = require("axios");

// Ollama Provider
async function ollamaProvider(prompt, options = {}) {
  const endpoint =
    process.env.OLLAMA_API_URL || "http://localhost:11434/api/generate";
  const model = options.model || process.env.OLLAMA_MODEL || "codellama:7b";
  const response = await axios.post(endpoint, {
    model,
    prompt,
    stream: false,
  });
  if (response.data && response.data.response) {
    return response.data.response.trim();
  }
  throw new Error("Invalid response from Ollama");
}

// OpenAI Provider
async function openaiProvider(prompt, options = {}) {
  const endpoint =
    process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
  const apiKey = process.env.OPENAI_API_KEY;
  const model = options.model || process.env.OPENAI_MODEL || "gpt-3.5-turbo";
  const messages = options.messages || [
    { role: "system", content: "You are a helpful coding assistant." },
    { role: "user", content: prompt },
  ];
  const response = await axios.post(
    endpoint,
    {
      model,
      messages,
      max_tokens: options.max_tokens || 500,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.data?.choices?.[0]?.message?.content) {
    return response.data.choices[0].message.content.trim();
  }
  throw new Error("Invalid response from OpenAI");
}

// Hugging Face Provider (Free Tier)
async function huggingfaceProvider(prompt, options = {}) {
  const endpoint =
    process.env.HF_API_URL ||
    "https://api-inference.huggingface.co/models/bigcode/starcoder";
  const apiKey = process.env.HF_API_KEY;
  const response = await axios.post(
    endpoint,
    { inputs: prompt },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.data && response.data[0]?.generated_text) {
    return response.data[0].generated_text.trim();
  }
  throw new Error("Invalid response from Hugging Face");
}

// Main function to select provider
async function getAIResponse(provider, prompt, options = {}) {
  switch (provider) {
    case "ollama":
      return ollamaProvider(prompt, options);
    case "openai":
      return openaiProvider(prompt, options);
    case "huggingface":
      return huggingfaceProvider(prompt, options);
    default:
      throw new Error("Unknown AI provider");
  }
}

module.exports = {
  getAIResponse,
};
