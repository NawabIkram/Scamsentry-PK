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
   * Update scam report status (Admin Moderation)
   * @param {string} id - Report ID
   * @param {string} status - New status ('verified', 'flagged', 'rejected', 'analyzed')
   */
  updateReportStatus: async (id, status) => {
    const response = await api.patch(`/admin/reports/${id}/status`, { status });
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
