import api from './api';

const adminService = {
  /**
   * Fetch system-wide dashboard counters
   */
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  /**
   * Fetch all reports submitted in the system
   */
  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },

  /**
   * Fetch all registered users in the system
   */
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  }
};

export default adminService;
