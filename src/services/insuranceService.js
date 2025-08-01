// services/insuranceService.js
import apiService from './api';

class InsuranceService {
  async getClaims(params = {}) {
    return await apiService.get('/admin/insurance/claims', { params });
  }

  async getClaimById(id) {
    return await apiService.get(`/admin/insurance/claims/${id}`);
  }

  async processClaim(id, data) {
    return await apiService.put(`/admin/insurance/claims/${id}/process`, data);
  }

  async sendCommunication(data) {
    return await apiService.post('/admin/insurance/communication', data);
  }

  async getStatuses() {
    return await apiService.get('/admin/insurance/statuses');
  }

  async getStats() {
    return await apiService.get('/admin/insurance/stats');
  }
}

const insuranceService = new InsuranceService();
export default insuranceService;