// services/dashboardService.js
import apiService from './api';

class DashboardService {
  async getDashboardStats() {
    return await apiService.get('/admin/dashboard-stats');
  }

  async getPendingCounts() {
    return await apiService.get('/admin/pending-counts');
  }

  async getRecentOrders(limit = 5) {
    return await apiService.get('/admin/recent-orders', {
      params: { limit }
    });
  }

  async getNewUsers(limit = 5) {
    return await apiService.get('/admin/new-users', {
      params: { limit }
    });
  }

  async getRevenueChart(period = '30d') {
    return await apiService.get('/admin/revenue-chart', {
      params: { period }
    });
  }

  async getCategoryChart() {
    return await apiService.get('/admin/category-chart');
  }
}

const dashboardService = new DashboardService();
export default dashboardService;