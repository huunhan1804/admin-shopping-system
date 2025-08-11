// services/supportService.js
import apiService from "./api";

class SupportService {
  // === QUẢN LÝ DANH MỤC ===

  async getAllCategories() {
    return await apiService.get("/admin/support/categories");
  }

  async createCategory(data) {
    // Transform to match backend DTO
    const payload = {
      categoryName: data.supportCategoryName,
      description: data.supportCategoryDescription,
    };
    return await apiService.post("/admin/support/categories", payload);
  }

  async updateCategory(categoryId, data) {
    const payload = {
      categoryName: data.supportCategoryName,
      description: data.supportCategoryDescription
    };
    return await apiService.put(
      `/admin/support/categories/${categoryId}`,
      payload
    );
  }

  async deleteCategory(categoryId) {
    return await apiService.delete(`/admin/support/categories/${categoryId}`);
  }

  // === QUẢN LÝ BÀI VIẾT ===

  async getArticlesByCategory(categoryId) {
    return await apiService.get(
      `/admin/support/categories/${categoryId}/articles`
    );
  }

  async createArticle(categoryId, data) {
   const payload = {
  articleTitle: data.articleTitle,
  articleContent: data.articleContent,
  isVisible: data.isVisible,
  articleImages: data.articleImages || []    // ⬅️ THÊM
};
return await apiService.post(
  `/admin/support/categories/${categoryId}/articles`,
  payload
);
  }

  async getArticleById(articleId) {
    return await apiService.get(`/admin/support/articles/${articleId}`);
  }

  async updateArticle(articleId, data) {
    return await apiService.put(`/admin/support/articles/${articleId}`, data);
  }

  async deleteArticle(articleId) {
    return await apiService.delete(`/admin/support/articles/${articleId}`);
  }

  async toggleArticleVisibility(articleId) {
    return await apiService.post(
      `/admin/support/articles/${articleId}/toggle-visibility`
    );
  }

  async reorderArticles(data) {
    return await apiService.post("/admin/support/articles/reorder", data);
  }

  // === TÌM KIẾM ===

  async searchArticles(query) {
    return await apiService.get("/admin/support/articles/search", {
      params: { query },
    });
  }
}


const supportService = new SupportService();
export default supportService;
