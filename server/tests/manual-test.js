const axios = require("axios");

const API_URL = "http://localhost:5000/api";
let token = "";
let problemId = "";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  try {
    // Login to get token
    console.log("1. Testing authentication...");
    const authResponse = await axios.post(`${API_URL}/auth/login`, {
      email: "test@example.com",
      password: "password123",
    });
    token = authResponse.data.token;
    console.log("✓ Authentication successful");

    // Get a problem ID
    console.log("\n2. Getting a problem...");
    const problemsResponse = await axios.get(`${API_URL}/problems`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    problemId = problemsResponse.data.data[0]._id;
    console.log("✓ Got problem ID:", problemId);

    // Test rate limiting
    console.log("\n3. Testing rate limiting...");
    const requests = Array(10)
      .fill()
      .map(async (_, i) => {
        try {
          const response = await axios.get(`${API_URL}/ai/hint/${problemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(`Request ${i + 1}: Success`);
          return response;
        } catch (error) {
          console.log(
            `Request ${i + 1}: Rate limited (${error.response.status})`
          );
          return error.response;
        }
      });

    const responses = await Promise.all(requests);
    const rateLimited = responses.filter((r) => r.status === 429).length;
    console.log(
      `✓ Rate limiting test complete: ${rateLimited} requests were rate limited`
    );

    // Test AI endpoints
    console.log("\n4. Testing AI endpoints...");
    await sleep(2000); // Wait for rate limit to reset

    // Test hint endpoint
    const hintResponse = await axios.get(`${API_URL}/ai/hint/${problemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✓ Hint endpoint working");

    // Test explain endpoint
    const explainResponse = await axios.post(
      `${API_URL}/ai/explain/${problemId}`,
      {
        code: "function test() { return true; }",
        language: "javascript",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✓ Explain endpoint working");

    console.log("\nAll tests completed successfully!");
  } catch (error) {
    console.error("Test failed:", error.response?.data || error.message);
  }
}

runTests();
