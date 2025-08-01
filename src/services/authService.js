import apiService from './api';
import tokenService from './tokenService';

class AuthService {
  async login(credentials) {
    try {
      const response = await apiService.login(credentials);
      
      if (response.status === 200 && response.data) {
        const { access_token, refresh_token } = response.data;
        tokenService.setTokens(access_token, refresh_token);
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenService.clearTokens();
    }
  }

  isAuthenticated() {
    return tokenService.hasValidToken();
  }

  getCurrentUser() {
    // Decode token để lấy thông tin user nếu cần
    const token = tokenService.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        username: payload.sub,
        exp: payload.exp,
        iat: payload.iat
      };
    } catch (error) {
      return null;
    }
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;