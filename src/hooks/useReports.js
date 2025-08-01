// hooks/useReports.js
import { useState, useCallback } from 'react';
import apiService from '../services/api';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = useCallback(async (reportType, filters) => {
    try {
      setLoading(true);
      setError(null);
      
      let endpoint;
      let params = {};
      
      switch (reportType) {
        case 'revenue':
          endpoint = '/admin/reports/revenue';
          params = {
            period: filters.period,
            startDate: filters.startDate,
            endDate: filters.endDate,
            year: filters.year
          };
          break;
          
        case 'products':
          endpoint = '/admin/reports/products';
          params = {
            limit: filters.limit,
            startDate: filters.startDate,
            endDate: filters.endDate
          };
          break;
          
        case 'analytics':
          endpoint = '/admin/reports/user-analytics';
          params = {
            startDate: filters.startDate,
            endDate: filters.endDate
          };
          break;
          
        default:
          throw new Error('Invalid report type');
      }
      
      const response = await apiService.get(endpoint, { params });
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to generate report');
      }
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportReport = useCallback(async (reportType, filters) => {
    try {
      setLoading(true);
      
      const exportEndpoints = {
        revenue: '/admin/reports/export/revenue',
        products: '/admin/reports/export/products',
        analytics: '/admin/reports/export/user-analytics'
      };
      
      const requestData = {
        reportType,
        period: filters.period,
        startDate: filters.startDate,
        endDate: filters.endDate,
        year: filters.year,
        limit: filters.limit
      };
      
      const response = await apiService.post(exportEndpoints[reportType], requestData, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      setError('Có lỗi xảy ra khi xuất báo cáo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getChartData = useCallback(async (chartType, filters) => {
    try {
      const endpoints = {
        revenue: '/admin/reports/chart-data/revenue',
        products: '/admin/reports/chart-data/products',
        'user-behavior': '/admin/reports/chart-data/user-behavior'
      };
      
      const response = await apiService.get(endpoints[chartType], {
        params: filters
      });
      
      return response.success ? response.chartData : null;
    } catch (err) {
      console.error('Error getting chart data:', err);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    generateReport,
    exportReport,
    getChartData,
    clearError: () => setError(null)
  };
};