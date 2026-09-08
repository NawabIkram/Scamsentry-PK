import api from './api';

const reportService = {
  /**
   * Submit a new scam report
   * @param {FormData} reportData - Form data containing report text details and optional file
   */
  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Get all reports submitted by the current authenticated user
   */
  getMyReports: async () => {
    const response = await api.get('/reports/my');
    return response.data;
  },

  /**
   * Get single report details by ID
   * @param {string} id - Report ID
   */
  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  /**
   * Trigger/Re-run AI threat analysis for a report
   * @param {string} id - Report ID
   */
  analyzeReport: async (id) => {
    const response = await api.post(`/reports/${id}/analyze`);
    return response.data;
  },

  /**
   * Delete a scam report
   * @param {string} id - Report ID
   */
  deleteReport: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  }
};

export default reportService;
