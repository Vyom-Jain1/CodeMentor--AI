import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance with updated configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
<<<<<<< HEAD
    "Content-Type": "application/json"
  }
=======
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
});

// Global rate limit state
let isRateLimited = false;
let rateLimitTimeout = null;
let requestQueue = [];
let isProcessingQueue = false;
let pendingRequests = new Map();
let requestCache = new Map(); // Cache for GET requests
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const getCacheKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(
    config.params || {}
  )}`;
};

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;

  isProcessingQueue = true;
  const request = requestQueue.shift();

  try {
    const response = await request.fn();
    request.resolve(response);
  } catch (error) {
    // Handle rate limit errors
    if (error.message?.includes("Rate limited")) {
      const waitTime = parseInt(error.message.match(/\d+/)[0]);

      // If we haven't exceeded max retries, requeue the request
      if (request.retryCount < MAX_RETRIES) {
        request.retryCount = (request.retryCount || 0) + 1;
        const backoffTime = Math.min(
          RETRY_DELAY * Math.pow(2, request.retryCount),
          waitTime * 1000
        );

        setTimeout(() => {
          requestQueue.unshift(request); // Add back to front of queue
          processQueue();
        }, backoffTime);

        return;
      }
    }
    request.reject(error);
  } finally {
    isProcessingQueue = false;
    if (requestQueue.length > 0) {
      processQueue();
    }
  }
};

const queueRequest = (fn, config) => {
  const cacheKey = getCacheKey(config);

  // Check if there's already a pending request for this endpoint
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  // Check cache for GET requests
  if (config.method === "get") {
    const cachedData = requestCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return Promise.resolve(cachedData.data);
    }
  }

  const promise = new Promise((resolve, reject) => {
    requestQueue.push({
      fn,
      resolve,
      reject,
      retryCount: 0,
      config,
    });
    processQueue();
  });

  // Store the promise in pending requests
  pendingRequests.set(cacheKey, promise);

  // Clean up pending request after completion
  promise.finally(() => {
    pendingRequests.delete(cacheKey);
  });

  return promise;
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Check for rate limiting - exclude auth endpoints
    if (!config.url.includes("/auth/")) {
      if (isRateLimited) {
        const error = new Error(
          `Rate limited. Please wait ${Math.ceil(
            (rateLimitTimeout - Date.now()) / 1000
          )} seconds.`
        );
        error.isRateLimit = true;
        return Promise.reject(error);
      }
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === "get") {
      const cacheKey = getCacheKey(response.config);
      requestCache.set(cacheKey, {
        data: response,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    
    if (error.response) {
      // Server responded with an error
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("token");
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = "/login";
          }
          break;
        case 403:
          toast.error("You don't have permission to perform this action");
          break;
        case 404:
          toast.error("The requested resource was not found");
          break;
        case 429:
          // Rate limit exceeded - only store for non-auth endpoints
          if (!error.config.url.includes("/auth/")) {
            const retryAfter = error.response.headers["retry-after"];
            const waitTime = retryAfter ? parseInt(retryAfter) : 60;

            // Set global rate limit state
            isRateLimited = true;
            if (rateLimitTimeout) {
              clearTimeout(rateLimitTimeout);
            }
            rateLimitTimeout = Date.now() + waitTime * 1000;

            // Clear rate limit after wait time
            setTimeout(() => {
              isRateLimited = false;
              rateLimitTimeout = null;
              // Process any queued requests
              processQueue();
            }, waitTime * 1000);

            // Create a rate limit error
            const rateLimitError = new Error(
              `Too many requests. Please wait ${waitTime} seconds before trying again.`
            );
            rateLimitError.isRateLimit = true;
            rateLimitError.waitTime = waitTime;

            toast.error(rateLimitError.message);
            return Promise.reject(rateLimitError);
          }
          break;
        case 500:
          toast.error("An unexpected error occurred. Please try again later.");
          break;
        default:
          toast.error(data?.error || "An error occurred");
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request
      toast.error("An error occurred while setting up the request.");
    }
    
    return Promise.reject(error);
  }
);

<<<<<<< HEAD
// Wrap API methods to use request queue
const wrapWithQueue = (apiMethod) => {
  return async (...args) => {
    const config = {
      method: apiMethod.name.toLowerCase().includes("get") ? "get" : "post",
      url: args[0],
      params: args[1] || {},
    };

    if (isRateLimited) {
      return queueRequest(() => apiMethod(...args), config);
    }
    return apiMethod(...args);
  };
};

// Problem API
export const problemsAPI = {
  getAllProblems: wrapWithQueue((params) => api.get("/problems", { params })),
  getProblem: wrapWithQueue((id) => api.get(`/problems/${id}`)),
  getProblemsByTopic: wrapWithQueue((topic) =>
    api.get(`/problems/topic/${topic}`)
  ),
  getProblemsByCategory: wrapWithQueue((category) =>
    api.get(`/problems/category/${category}`)
  ),
  getTopics: wrapWithQueue(() => api.get("/problems/topics")),
  getCategories: wrapWithQueue(() => api.get("/problems/categories")),
  createProblem: wrapWithQueue((data) => api.post("/problems", data)),
  updateProblem: wrapWithQueue((id, data) => api.put(`/problems/${id}`, data)),
  deleteProblem: wrapWithQueue((id) => api.delete(`/problems/${id}`)),
  submitSolution: wrapWithQueue((id, data) =>
    api.post(`/problems/${id}/submit`, data)
  ),
  getUserSubmissions: wrapWithQueue((problemId) =>
    api.get(`/problems/${problemId}/submissions`)
  ),
  getProblemProgress: wrapWithQueue((problemId) =>
    api.get(`/problems/${problemId}/progress`)
  ),

  // Discussion endpoints - Updated to match server structure
  getDiscussions: wrapWithQueue((problemId, params) =>
    api.get(`/problems/${problemId}/discussions`, { params })
  ),
  createDiscussion: wrapWithQueue((problemId, content) =>
    api.post(`/problems/${problemId}/discussions`, { content })
  ),
  getAllDiscussions: wrapWithQueue((params) =>
    api.get("/problems/discussions", { params })
  ),
  createGeneralDiscussion: wrapWithQueue((content) =>
    api.post("/problems/discussions", { content })
  ),
  likeDiscussion: wrapWithQueue((discussionId) =>
    api.post(`/problems/discussions/${discussionId}/like`)
  ),
  replyToDiscussion: wrapWithQueue((discussionId, content) =>
    api.post(`/problems/discussions/${discussionId}/replies`, { content })
  ),

  // Analytics endpoints
  getUserAnalytics: () => api.get("/analytics/user"),
  getProblemAnalytics: (problemId) =>
    api.get(`/analytics/problems/${problemId}`),
  getCategoryAnalytics: (category) =>
    api.get(`/analytics/categories/${category}`),

  // Interview preparation endpoints
  getCompanyProblems: (company) =>
    api.get(`/interview/companies/${company}/problems`),
  getMockInterviews: () => api.get("/interview/mock"),
  createMockInterview: (data) => api.post("/interview/mock", data),
  submitMockInterview: (interviewId, data) =>
    api.post(`/interview/mock/${interviewId}/submit`, data),

  // Learning features endpoints
  getVideoTutorials: (problemId) => api.get(`/learning/tutorials/${problemId}`),
  getSolutionExplanations: (problemId) =>
    api.get(`/learning/explanations/${problemId}`),
  getInteractiveVisualizations: (problemId) =>
    api.get(`/learning/visualizations/${problemId}`),

  // Community features endpoints
  getLeaderboard: (params) => api.get("/community/leaderboard", { params }),
  createStudyGroup: (data) => api.post("/community/study-groups", data),
  joinStudyGroup: (groupId) =>
    api.post(`/community/study-groups/${groupId}/join`),
  submitCodeReview: (problemId, data) =>
    api.post(`/community/reviews/${problemId}`, data),
  getMentors: () => api.get("/community/mentors"),
  requestMentorship: (mentorId) =>
    api.post(`/community/mentors/${mentorId}/request`),
};

// AI API
export const aiAPI = {
  async analyzeCode(code, language) {
    const response = await api.post("/ai/analyze", { code, language });
    return response.data;
  },

  async debugCode(code, language, error) {
    const response = await api.post("/ai/debug", { code, language, error });
    return response.data;
  },

  async improveCode(code, language) {
    const response = await api.post("/ai/improve", { code, language });
    return response.data;
  },

  async explainCode(code, language) {
    const response = await api.post("/ai/explain", { code, language });
    return response.data;
  },
  getHint: async (problemId) => {
    const response = await api.get(`/ai/hint/${problemId}`);
    return response.data;
  },

  chat: async (message, problemId = null) => {
    const response = await api.post(`/ai/chat`, {
      message,
      problemId,
    });
    return response.data;
  },

  getExplanation: async (problemId, code, language) => {
    const response = await api.post(`/ai/explain/${problemId}`, {
      code,
      language,
    });
    return response.data;
  },

  getOptimization: async (problemId, code, language) => {
    const response = await api.post(`/ai/optimize/${problemId}`, {
      code,
      language,
    });
    return response.data;
  },

  getSolution: async (problemId) => {
    const response = await api.get(`/ai/solution/${problemId}`);
    return response.data;
  },

  getGuidance: async (problemId, step) => {
    const response = await api.get(`/ai/guidance/${problemId}?step=${step}`);
    return response.data;
  },

  visualizeCode: async (problemId, code, language, input) => {
    const response = await api.post(`/ai/visualize/${problemId}`, {
      code,
      language,
      input,
    });
    return response.data;
  },
};

// Auth API
export const authAPI = {
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response;
  },
  login: async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      // Remove this debug log
      // console.log("Raw login response:", response);
      return response;
    } catch (error) {
      console.error("Login API error:", error.response?.data || error.message);
      throw error;
    }
  },
  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response;
  },
  updateProfile: async (data) => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },
  checkAuth: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
=======
// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
};

// Problem API
export const problemsAPI = {
  getAllProblems: (params) => api.get("/problems", { params }),
  getProblem: (id) => api.get(`/problems/${id}`),
  getProblemsByTopic: (topic) => api.get(`/problems/topic/${topic}`),
  getProblemsByCategory: (category) => api.get(`/problems/category/${category}`),
  getTopics: () => api.get("/problems/topics"),
  getCategories: () => api.get("/problems/categories"),
  createProblem: (data) => api.post("/problems", data),
  updateProblem: (id, data) => api.put(`/problems/${id}`, data),
  deleteProblem: (id) => api.delete(`/problems/${id}`),
  submitSolution: (id, data) => api.post(`/problems/${id}/submit`, data),

  // Mock implementations for missing endpoints
  getDiscussions: (problemId) => 
    Promise.resolve({ data: { success: true, data: [] } }),
  createDiscussion: (problemId, discussionData) => 
    Promise.resolve({ data: { success: true, data: { _id: Date.now(), ...discussionData } } }),
  likeDiscussion: (discussionId) => 
    Promise.resolve({ data: { success: true } }),
  replyToDiscussion: (discussionId, content) => 
    Promise.resolve({ data: { success: true, data: { _id: Date.now(), content } } }),
  
  // Analytics endpoints (mock)
  getUserAnalytics: () => Promise.resolve({ 
    data: { 
      overallStats: { totalProblems: 0, solvedProblems: 0, successRate: 0, averageTime: 0 },
      categoryStats: [],
      difficultyStats: [],
      recentActivity: [],
      performanceTrend: [],
      strengths: [],
      weaknesses: []
    } 
  }),
  
  // Interview preparation endpoints (mock)
  getCompanyProblems: (company) => Promise.resolve({ data: [] }),
  getMockInterviews: () => Promise.resolve({ data: [] }),
  createMockInterview: (data) => Promise.resolve({ data: { _id: Date.now(), ...data } }),
  
  // Learning features endpoints (mock)
  getVideoTutorials: (problemId) => Promise.resolve({ data: [] }),
  getSolutionExplanations: (problemId) => Promise.resolve({ data: [] }),
  getInteractiveVisualizations: (problemId) => Promise.resolve({ data: [] }),
};

// AI API
export const aiAPI = {
  getHint: async (problemId) => {
    try {
      const response = await api.get(`/ai/hint/${problemId}`);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to get hint");
    }
  },

  chat: async (message, problemId = null) => {
    try {
      const response = await api.post(`/ai/chat`, {
        message,
        problemId,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to get AI response");
    }
  },

  getExplanation: async (problemId, code, language) => {
    try {
      const response = await api.post(`/ai/explain/${problemId}`, {
        code,
        language,
      });
      return {
        approach: response.data.data,
        steps: ["Step 1: Understand the problem", "Step 2: Plan your approach", "Step 3: Implement the solution"]
      };
    } catch (error) {
      throw new Error("Failed to get explanation");
    }
  },

  getOptimization: async (problemId, code, language) => {
    try {
      const response = await api.post(`/ai/optimize/${problemId}`, {
        code,
        language,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to get optimization");
    }
  },

  getSolution: async (problemId) => {
    try {
      const response = await api.get(`/ai/solution/${problemId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get solution");
    }
  },
};

// Code Execution API
export const codeAPI = {
<<<<<<< HEAD
  async runCode(data) {
    const response = await api.post("/code/run", data);
    return response.data;
  },

  async submitSolution(problemId, data) {
    const response = await api.post(`/code/submit/${problemId}`, data);
    return response.data;
  },

  async validateSolution(problemId, data) {
    const response = await api.post(`/code/validate/${problemId}`, data);
    return response.data;
  },

  async getTestResults(submissionId) {
    const response = await api.get(`/code/results/${submissionId}`);
    return response.data;
  },

  async getSolutionStats(problemId) {
    const response = await api.get(`/code/stats/${problemId}`);
    return response.data;
  },
=======
  runCode: (data) => api.post("/code/execute", data),
  submitSolution: (problemId, data) => api.post(`/problems/${problemId}/submit`, data),
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
};

// User API
export const userAPI = {
  getSubmissions: () => Promise.resolve({ data: [] }),
  getProgress: () => api.get("/progress"),
  getStats: () => Promise.resolve({ data: {} }),
};

// Progress API
export const progressAPI = {
  async getUserProgress() {
    const response = await api.get("/progress");
    return response.data;
  },

  async updateProgress(data) {
    const response = await api.post("/progress", data);
    return response.data;
  },

  async getStreak() {
    const response = await api.get("/progress/streak");
    return response.data;
  },

  async getProblemProgress(problemId) {
    const response = await api.get(`/progress/problems/${problemId}`);
    return response.data;
  },

  async getCategoryProgress(category) {
    const response = await api.get(`/progress/categories/${category}`);
    return response.data;
  },

  async getDifficultyProgress(difficulty) {
    const response = await api.get(`/progress/difficulty/${difficulty}`);
    return response.data;
  },

  async getWeeklyStats() {
    const response = await api.get("/progress/weekly");
    return response.data;
  },

  async getMonthlyStats() {
    const response = await api.get("/progress/monthly");
    return response.data;
  },

  async getLearningPath() {
    const response = await api.get("/progress/learning-path");
    return response.data;
  },

  async updateLearningPath(data) {
    const response = await api.post("/progress/learning-path", data);
    return response.data;
  },
};

export default api;