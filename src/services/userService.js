// services/userService.js
import apiService from './api';

class UserService {
  // Customer methods
  async getCustomers(params = {}) {
    return await apiService.get('/admin/users/customers', { params });
  }

  async getCustomerById(id) {
    return await apiService.get(`/admin/users/customers/${id}`);
  }

  async suspendCustomer(id, data) {
    return await apiService.post(`/admin/users/customers/${id}/suspend?reason=${encodeURIComponent(data.reason)}`);
  }

  async activateCustomer(id) {
    return await apiService.post(`/admin/users/customers/${id}/activate`);
  }

  async resetCustomerPassword(id) {
    return await apiService.post(`/admin/users/customers/${id}/reset-password`);
  }

  async getCustomerFilters() {
    return await apiService.get('/admin/users/customers/filters');
  }

  // Agency methods
  async getAgencies(params = {}) {
    return await apiService.get('/admin/users/agencies', { params });
  }

  async getAgencyById(id) {
    return await apiService.get(`/admin/users/agencies/${id}`);
  }

  async suspendAgency(id, data) {
    return await apiService.post(`/admin/users/agencies/${id}/suspend?reason=${encodeURIComponent(data.reason)}`);
  }

  async activateAgency(id) {
    return await apiService.post(`/admin/users/agencies/${id}/activate`);
  }

  async getAgencyFilters() {
    return await apiService.get('/admin/users/agencies/filters');
  }

  // Agency applications
  async getAgencyApplications(params = {}) {
    return await apiService.get('/admin/users/agencies/applications', { params });
  }

  async getApplicationById(id) {
    return await apiService.get(`/admin/users/agencies/applications/${id}`);
  }

  async approveApplication(id) {
    return await apiService.post(`/admin/users/agencies/applications/${id}/approve`);
  }

  async declineApplication(id, data) {
    return await apiService.post(`/admin/users/agencies/applications/${id}/decline`, data);
  }
}

const userService = new UserService();
export default userService;