// API Configuration
const getApiBaseUrl = () => {
  // Check for environment variable first (for Render deployment)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production (Render), use the backend service URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // For Render deployment, you'll need to replace this with your actual backend URL
    return 'https://pmip-backend.onrender.com';
  }
  
  // In development, use direct backend URL
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

// API helper function
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export default apiCall;