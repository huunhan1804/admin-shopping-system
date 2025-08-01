// services/reportService.js
import apiService from './api';

class ReportService {
  async getRevenueReport(params = {}) {
    return await apiService.get('/admin/reports/revenue', { params });
  }

  async getProductReport(params = {}) {
    return await apiService.get('/admin/reports/products', { params });
  }

  async getUserAnalytics(params = {}) {
    return await apiService.get('/admin/reports/user-analytics', { params });
  }

  async exportReport(type, data) {
    const endpoints = {
      revenue: '/admin/reports/export/revenue',
      products: '/admin/reports/export/products',
      analytics: '/admin/reports/export/user-analytics'
    };

    return await apiService.post(endpoints[type], data, {
      responseType: 'blob'
    });
  }

  async getChartData(type, params = {}) {
    const endpoints = {
      revenue: '/admin/reports/chart-data/revenue',
      products: '/admin/reports/chart-data/products',
      'user-behavior': '/admin/reports/chart-data/user-behavior'
    };

    return await apiService.get(endpoints[type], { params });
  }
}

const reportService = new ReportService();
export default reportService;