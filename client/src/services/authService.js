import api from './api';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - name, email, password
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Log in user
   * @param {Object} credentials - email, password
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Get currently authenticated user details
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default authService;
