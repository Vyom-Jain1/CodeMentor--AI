import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
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
    if (error.response) {
      // Server responded with an error
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("token");
          window.location.href = "/login";
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
          toast.error(error.response.data?.message || "An error occurred");
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

// Problem API
export const problemsAPI = {
  getAllProblems: (params) => api.get("/problems", { params }),
  getProblem: (id) => api.get(`/problems/${id}`),
  getProblemsByTopic: (topic) => api.get(`/problems/topic/${topic}`),
  getProblemsByCategory: (category) =>
    api.get(`/problems/category/${category}`),
  getTopics: () => api.get("/problems/topics"),
  getCategories: () => api.get("/problems/categories"),
  createProblem: (data) => api.post("/problems", data),
  updateProblem: (id, data) => api.put(`/problems/${id}`, data),
  deleteProblem: (id) => api.delete(`/problems/${id}`),
  submitSolution: (id, data) => api.post(`/problems/${id}/submit`, data),

  // Discussion endpoints
  getDiscussions: (problemId) => api.get(`/problems/${problemId}/discussions`),
  createDiscussion: (problemId, discussionData) =>
    api.post(`/problems/${problemId}/discussions`, discussionData),
  updateDiscussion: (problemId, discussionId, discussionData) =>
    api.put(
      `/problems/${problemId}/discussions/${discussionId}`,
      discussionData
    ),
  deleteDiscussion: (problemId, discussionId) =>
    api.delete(`/problems/${problemId}/discussions/${discussionId}`),
  likeDiscussion: (discussionId) =>
    api.post(`/discussions/${discussionId}/like`),
  reportDiscussion: (discussionId, reason) =>
    api.post(`/discussions/${discussionId}/report`, { reason }),

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
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  checkAuth: () => api.get("/auth/me"),
  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
};

// User API
export const userAPI = {
  getSubmissions: () => api.get("/users/submissions"),
  getProgress: () => api.get("/users/progress"),
  getStats: () => api.get("/users/stats"),
};

// Code Execution API
export const codeAPI = {
  runCode: (data) => api.post("/code/run", data),
  submitSolution: (problemId, data) =>
    api.post(`/code/submit/${problemId}`, data),
};

// User Progress API
export const progressAPI = {
  getUserProgress: () => api.get("/progress"),
  updateProgress: (data) => api.put("/progress", data),
};

export default api;
