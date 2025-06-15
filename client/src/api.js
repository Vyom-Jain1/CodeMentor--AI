// Add the import at the top
import axios from 'axios';

// Export the api instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // 30 second timeout for code execution
  withCredentials: true, // Enable sending cookies
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  checkAuth: () => api.get("/auth/me"),
  updateProfile: (userData) => api.put("/auth/profile", userData),
};

// Problems API
export const problemsAPI = {
  getAllProblems: (params) => api.get("/problems", { params }),
  getProblem: (id) => api.get(`/problems/${id}`),
  submitSolution: (id, solution) =>
    api.post(`/problems/${id}/submit`, solution),
  getDiscussions: (problemId, params) =>
    problemId
      ? api.get(`/problems/${problemId}/discussions`, { params })
      : api.get("/problems/discussions", { params }),
  createDiscussion: (problemId, content) =>
    problemId
      ? api.post(`/problems/${problemId}/discussions`, { content })
      : api.post("/problems/discussions", { content }),
  likeDiscussion: (discussionId) =>
    api.post(`/problems/discussions/${discussionId}/like`),
  replyToDiscussion: (discussionId, content) =>
    api.post(`/problems/discussions/${discussionId}/replies`, { content }),
  deleteDiscussion: (discussionId) =>
    api.delete(`/problems/discussions/${discussionId}`),
};

// Learning Path API
export const learningPathAPI = {
  getProgress: () => api.get("/users/progress"),
  updateProgress: (data) => api.put("/users/progress", data),
  getLearningPath: () => api.get("/users/learning-path"),
  updateLearningPath: (data) => api.put("/users/learning-path", data),
};

// Code Execution API
export const codeExecutionAPI = {
  executeCode: (code, language) =>
    api.post("/code/execute", { code, language }),
  submitSolution: (problemId, solution) =>
    api.post(`/problems/${problemId}/submit`, solution),
};

// AI API
export const aiAPI = {
  getHint: (problemId) => api.get(`/ai/hint/${problemId}`),
  getExplanation: (problemId) => api.get(`/ai/explanation/${problemId}`),
  getSimilarProblems: (problemId) => api.get(`/ai/similar/${problemId}`),
};

export default api;
