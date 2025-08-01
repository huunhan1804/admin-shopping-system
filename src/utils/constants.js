export const API_BASE_URL = 'https://app-server-production-f23c.up.railway.app/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/authenticate',
    REFRESH: '/auth/refresh-token',
    LOGOUT: '/auth/logout'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    PRODUCTS: '/admin/products'
  }
};

export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token'
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  HOME: '/'
};