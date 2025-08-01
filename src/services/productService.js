// services/productService.js
import apiService from './api';

class ProductService {
  async getProducts(params = {}) {
    return await apiService.get('/admin/products', { params });
  }

  async getPendingProducts(params = {}) {
    return await apiService.get('/admin/products/pending', { params });
  }

  async getProductById(id) {
    return await apiService.get(`/admin/products/${id}`);
  }

  async approveProduct(id) {
    return await apiService.post(`/admin/products/${id}/approve`);
  }

  async rejectProduct(id, data) {
    return await apiService.post(`/admin/products/${id}/reject`, data);
  }

  async requestEdit(id, data) {
    return await apiService.post(`/admin/products/${id}/request-edit`, data);
  }

  async warnAgency(id, data) {
    return await apiService.post(`/admin/products/${id}/warn-agency`, data);
  }

  async removeProduct(id, data) {
    return await apiService.post(`/admin/products/${id}/remove`, data);
  }

  async getFilterOptions() {
    return await apiService.get('/admin/products/filter-options');
  }
}

const productService = new ProductService();
export default productService;