const axios = require("axios");
const axiosRetry = require("axios-retry");

// Configure axios with retries
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === "ECONNABORTED" ||
      (error.response && error.response.status >= 500)
    );
  },
});

// Enhanced error handling
class AIProviderError extends Error {
  constructor(message, provider, details = {}) {
    super(message);
    this.name = "AIProviderError";
    this.provider = provider;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// Rate limiting and concurrency control
const rateLimiters = {
  ollama: {
    maxRequests: 10,
    perSeconds: 1,
    currentRequests: 0,
    lastReset: Date.now(),
  },
  openai: {
    maxRequests: 3,
    perSeconds: 1,
    currentRequests: 0,
    lastReset: Date.now(),
  },
  huggingface: {
    maxRequests: 5,
    perSeconds: 1,
    currentRequests: 0,
    lastReset: Date.now(),
  },
};

async function checkRateLimit(provider) {
  const limiter = rateLimiters[provider];
  const now = Date.now();

  if (now - limiter.lastReset >= limiter.perSeconds * 1000) {
    limiter.currentRequests = 0;
    limiter.lastReset = now;
  }

  if (limiter.currentRequests >= limiter.maxRequests) {
    const waitTime = limiter.perSeconds * 1000 - (now - limiter.lastReset);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    return checkRateLimit(provider);
  }

  limiter.currentRequests++;
}

// Ollama Provider
async function ollamaProvider(prompt, options = {}) {
  await checkRateLimit("ollama");
  
  const endpoint =
    process.env.OLLAMA_API_URL || "http://localhost:11434/api/generate";
  const model = options.model || process.env.OLLAMA_MODEL || "codellama:7b";
  
  try {
    const response = await axios.post(
      endpoint,
      {
        model,
        prompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          top_p: options.top_p || 0.9,
          num_ctx: options.max_tokens || 2048,
          stop: options.stop || ["\n\n", "```"],
        },
      },
      {
        timeout: options.timeout || 30000,
      }
    );

    if (response.data && response.data.response) {
      return response.data.response.trim();
    }
    
    throw new AIProviderError(
      "Invalid response format",
      "ollama",
      { response: response.data }
    );
  } catch (error) {
    if (error instanceof AIProviderError) throw error;
    
    throw new AIProviderError(
      error.message,
      "ollama",
      {
        status: error.response?.status,
        data: error.response?.data,
      }
    );
  }
}

// OpenAI Provider
async function openaiProvider(prompt, options = {}) {
  await checkRateLimit("openai");

  const endpoint =
    process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new AIProviderError(
      "OpenAI API key not found",
      "openai",
      { configError: "Missing API key" }
    );
  }

  const model = options.model || process.env.OPENAI_MODEL || "gpt-3.5-turbo";
  const systemMessage = {
    role: "system",
    content: options.systemMessage || `You are an expert coding assistant with deep knowledge of algorithms, data structures, and software engineering best practices. You provide clear, concise, and accurate responses with practical code examples when relevant. You focus on helping users understand concepts deeply and write efficient, maintainable code.`,
  };

  const messages = options.messages || [systemMessage, { role: "user", content: prompt }];

  try {
    const response = await axios.post(
      endpoint,
      {
        model,
        messages,
        max_tokens: options.max_tokens || 1000,
        temperature: options.temperature || 0.7,
        top_p: options.top_p || 0.9,
        presence_penalty: options.presence_penalty || 0.1,
        frequency_penalty: options.frequency_penalty || 0.1,
        stop: options.stop,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: options.timeout || 30000,
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      return response.data.choices[0].message.content.trim();
    }

    throw new AIProviderError(
      "Invalid response format",
      "openai",
      { response: response.data }
    );
  } catch (error) {
    if (error instanceof AIProviderError) throw error;

    if (error.response?.status === 429) {
      throw new AIProviderError(
        "Rate limit exceeded",
        "openai",
        {
          retryAfter: error.response.headers["retry-after"],
          status: 429,
        }
      );
    }

    throw new AIProviderError(
      error.message,
      "openai",
      {
        status: error.response?.status,
        data: error.response?.data,
      }
    );
  }
}

// Hugging Face Provider
async function huggingfaceProvider(prompt, options = {}) {
  await checkRateLimit("huggingface");

  const endpoint =
    process.env.HF_API_URL ||
    "https://api-inference.huggingface.co/models/bigcode/starcoder";
  const apiKey = process.env.HF_API_KEY;

  if (!apiKey) {
    throw new AIProviderError(
      "Hugging Face API key not found",
      "huggingface",
      { configError: "Missing API key" }
    );
  }

  try {
    const response = await axios.post(
      endpoint,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: options.max_tokens || 500,
          temperature: options.temperature || 0.7,
          top_p: options.top_p || 0.9,
          do_sample: true,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: options.timeout || 30000,
      }
    );

    if (response.data && response.data[0]?.generated_text) {
      return response.data[0].generated_text.trim();
    }

    throw new AIProviderError(
      "Invalid response format",
      "huggingface",
      { response: response.data }
    );
  } catch (error) {
    if (error instanceof AIProviderError) throw error;

    if (error.response?.status === 503) {
      throw new AIProviderError(
        "Model is loading",
        "huggingface",
        { status: 503, retryAfter: 30 }
      );
    }

    throw new AIProviderError(
      error.message,
      "huggingface",
      {
        status: error.response?.status,
        data: error.response?.data,
      }
    );
  }
}

// Cache implementation
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(provider, prompt, options) {
  return `${provider}:${prompt}:${JSON.stringify(options)}`;
}

function getCachedResponse(provider, prompt, options) {
  const key = getCacheKey(provider, prompt, options);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  return null;
}

function setCachedResponse(provider, prompt, options, response) {
  const key = getCacheKey(provider, prompt, options);
  cache.set(key, {
    response,
    timestamp: Date.now(),
  });
}

// Main function to select provider
async function getAIResponse(provider, prompt, options = {}) {
  // Check cache first if caching is enabled
  if (options.enableCache !== false) {
    const cached = getCachedResponse(provider, prompt, options);
    if (cached) return cached;
  }

  let lastError = null;
  const maxRetries = options.maxRetries || 3;
  const providers = provider === "auto" ? ["ollama", "openai", "huggingface"] : [provider];

  for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
    for (const currentProvider of providers) {
      try {
        const response = await (async () => {
          switch (currentProvider) {
            case "ollama":
              return ollamaProvider(prompt, options);
            case "openai":
              return openaiProvider(prompt, options);
            case "huggingface":
              return huggingfaceProvider(prompt, options);
            default:
              throw new AIProviderError(
                "Unknown AI provider",
                currentProvider,
                { provider: currentProvider }
              );
          }
        })();

        // Cache successful response if caching is enabled
        if (options.enableCache !== false) {
          setCachedResponse(currentProvider, prompt, options, response);
        }

        return response;
      } catch (error) {
        lastError = error;
        console.error(
          `AI provider ${currentProvider} failed (attempt ${retryCount + 1}/${maxRetries}):`,
          error
        );

        // If it's a configuration error or rate limit, try next provider
        if (
          error.details?.configError ||
          error.details?.status === 429 ||
          error.details?.status === 503
        ) {
          continue;
        }

        // For other errors, wait before retrying
        if (retryCount < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, retryCount) * 1000)
          );
        }
      }
    }
  }

  throw lastError || new AIProviderError("All providers failed", "all");
}

module.exports = {
  getAIResponse,
};
