import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../utils/constants';
import tokenService from './tokenService';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.isRefreshing = false;
    this.failedRequestsQueue = [];

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = tokenService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedRequestsQueue.push({ resolve, reject });
            }).then(() => {
              return this.api(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = tokenService.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.refreshToken(refreshToken);
            const { access_token, refresh_token } = response.data.data;

            tokenService.setTokens(access_token, refresh_token);

            // Process queued requests
            this.failedRequestsQueue.forEach(({ resolve }) => {
              resolve();
            });
            this.failedRequestsQueue = [];

            // Retry original request
            return this.api(originalRequest);

          } catch (refreshError) {
            // Refresh failed, logout user
            this.failedRequestsQueue.forEach(({ reject }) => {
              reject(refreshError);
            });
            this.failedRequestsQueue = [];

            tokenService.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);

          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async refreshToken(refreshToken) {
    return axios.post(`${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, {
      refresh_token: refreshToken
    });
  }

  // Auth methods
  async login(credentials) {
    const response = await this.api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  }

  async logout() {
    try {
      await this.api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenService.clearTokens();
    }
  }

  // Generic methods
  async get(url, config = {}) {
    const response = await this.api.get(url, config);
    return response.data;
  }

  async post(url, data = {}, config = {}) {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  async put(url, data = {}, config = {}) {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  async delete(url, config = {}) {
    const response = await this.api.delete(url, config);
    return response.data;
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;