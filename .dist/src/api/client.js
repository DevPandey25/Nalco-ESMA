import { env } from '../config/env';

class ApiClient {
  constructor() {
    this.baseURL = env.API_BASE_URL || 'http://localhost:5000/api/v1';
  }

  // Helper to get the auth token
  getToken() {
    return localStorage.getItem('esma_token');
  }

  // Helper to set headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const activeRole = localStorage.getItem('esma_active_role');
    if (activeRole) {
      headers['x-role-override'] = activeRole;
    }
    
    return headers;
  }

  // Generic Request Handler
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Throw the error message provided by the backend, or a default one
        throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
      }

      return data.data || data; // Backend usually wraps data in { success: true, data: ... }
    } catch (error) {
      console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error.message);
      throw error;
    }
  }

  // HTTP Methods
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, payload) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async put(endpoint, payload) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
