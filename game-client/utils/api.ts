import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () => api.get('/auth/me'),
  
  updateProfile: (data: { username?: string; avatar?: string }) =>
    api.put('/auth/profile', data),
  
  logout: () => api.post('/auth/logout'),
  
  refreshToken: () => api.post('/auth/refresh'),
};

// Game API
export const gameAPI = {
  saveScore: (data: {
    score: number;
    accuracy: number;
    level: number;
    constellation: string;
    shotsFired: number;
    shotsHit: number;
    gameTime: number;
    difficulty?: string;
    platform?: string;
    metadata?: any;
  }) => api.post('/game/score', data),
  
  getStats: () => api.get('/game/stats'),
  
  getHistory: (page = 1, limit = 10) =>
    api.get(`/game/history?page=${page}&limit=${limit}`),
  
  getConstellations: () => api.get('/game/constellations'),
  
  deleteScore: (scoreId: string) => api.delete(`/game/score/${scoreId}`),
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: (params?: {
    limit?: number;
    constellation?: string;
    timeFrame?: string;
    difficulty?: string;
  }) => api.get('/leaderboard', { params }),
  
  getGlobalStats: () => api.get('/leaderboard/global-stats'),
  
  getUserStats: (userId: string) => api.get(`/leaderboard/user/${userId}`),
  
  getConstellationLeaderboard: (constellation: string, limit = 10) =>
    api.get(`/leaderboard/constellation/${constellation}?limit=${limit}`),
  
  getTopPlayers: (metric = 'highestScore', limit = 5) =>
    api.get(`/leaderboard/top-players?metric=${metric}&limit=${limit}`),
  
  getDailyLeaderboard: (limit = 10) =>
    api.get(`/leaderboard/daily?limit=${limit}`),
};

// Utility functions
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  // Get current user data
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set authentication data
  setAuth: (token: string, user: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear authentication data
  clearAuth: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Handle API errors
  handleError: (error: any): string => {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },
};

export default api; 