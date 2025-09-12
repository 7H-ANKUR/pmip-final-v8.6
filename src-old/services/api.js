// API configuration
import LocalAuthService from './localAuth.js';

const getBackendURL = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    if (hostname.includes('replit.dev')) {
      // For Replit environment
      return `${protocol}//${hostname.replace('-5000', '-8000')}/api`;
    }
    // For local development
    return `${protocol}//localhost:8000/api`;
  }
  return 'http://localhost:8000/api';
};

const apiConfig = {
  baseURL: getBackendURL(),
  headers: {
    'Content-Type': 'application/json',
  },
};

// Trial mode flag - set to true to use local authentication
const USE_LOCAL_AUTH = true;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    ...apiConfig.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

class ApiService {
  // Authentication APIs
  async signup(userData) {
    // Use local authentication for trial mode
    if (USE_LOCAL_AUTH) {
      console.log('Using local authentication for signup (trial mode)');
      const result = await LocalAuthService.register(userData);
      
      if (result.success && result.access_token) {
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      
      return result;
    }

    // Original backend authentication
    try {
      const response = await fetch(`${apiConfig.baseURL}/auth/signup`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      
      if (response.ok && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Signup error, falling back to local auth:', error);
      // Fallback to local authentication if backend fails
      return await this.signup(userData);
    }
  }

  async login(credentials) {
    // Use local authentication for trial mode
    if (USE_LOCAL_AUTH) {
      console.log('Using local authentication for login (trial mode)');
      const result = await LocalAuthService.login(credentials);
      
      if (result.success && result.access_token) {
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      
      return result;
    }

    // Original backend authentication
    try {
      const response = await fetch(`${apiConfig.baseURL}/auth/login`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      
      if (response.ok && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login error, falling back to local auth:', error);
      // Fallback to local authentication if backend fails  
      return await this.login(credentials);
    }
  }

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  // Internship APIs
  async getInternships(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${apiConfig.baseURL}/internships?${params}`, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Get internships error:', error);
      throw error;
    }
  }

  async getRecommendations() {
    try {
      const response = await fetch(`${apiConfig.baseURL}/recommendations`, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  }

  // Universities API
  async getUniversities() {
    try {
      const response = await fetch(`${apiConfig.baseURL}/universities`, {
        headers: apiConfig.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get universities error:', error);
      // Return fallback data if API fails
      return { universities: [] };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${apiConfig.baseURL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

export default new ApiService();