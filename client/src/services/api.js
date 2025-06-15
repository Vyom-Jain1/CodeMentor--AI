import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (response) => response,
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
          toast.error("Too many requests. Please try again later");
          break;
        case 500:
          toast.error("Server error. Please try again later");
          break;
        default:
          toast.error(data?.error || "An error occurred");
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error(
        "Unable to connect to the server. Please check your internet connection"
      );
    } else {
      // Error in request setup
      toast.error("An unexpected error occurred");
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
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
  runCode: (data) => api.post("/code/execute", data),
  submitSolution: (problemId, data) => api.post(`/problems/${problemId}/submit`, data),
};

// User API
export const userAPI = {
  getSubmissions: () => Promise.resolve({ data: [] }),
  getProgress: () => api.get("/progress"),
  getStats: () => Promise.resolve({ data: {} }),
};

// Progress API
export const progressAPI = {
  getUserProgress: () => api.get("/progress"),
  updateProgress: (data) => api.put("/progress", data),
};

export default api;