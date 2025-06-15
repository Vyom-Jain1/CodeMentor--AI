require("dotenv").config();
const axios = require("axios");

async function testHuggingFace() {
  const hfApiKey = process.env.HF_API_KEY;
  // Using Mixtral-8x7B-Instruct which is one of the most popular models
  const hfApiUrl =
    "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

  console.log("Testing Hugging Face API connection...");
  console.log("API URL:", hfApiUrl);
  console.log("API Key exists:", !!hfApiKey);

  if (!hfApiKey) {
    console.error("Error: HF_API_KEY environment variable is not set");
    process.exit(1);
  }

  try {
    const response = await axios.post(
      hfApiUrl,
      {
        inputs:
          "<s>[INST] Write a Python function to find the sum of an array [/INST]",
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${hfApiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );
    console.log("Success! Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : "No response data",
      config: {
        url: error.config.url,
        headers: error.config.headers,
      },
    });
  }
}

testHuggingFace();
