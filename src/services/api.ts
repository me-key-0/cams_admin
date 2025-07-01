import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { useAuthStore } from '../stores/authStore';

// API Base URLs
const API_BASE_URL = 'http://localhost:8760'; // API Gateway URL
const AUTH_BASE_URL = 'http://localhost:8762/api/auth';
const USER_BASE_URL = 'http://localhost:8763/api/users';
const COURSE_BASE_URL = 'http://localhost:8764/api';
const COMMUNICATION_BASE_URL = 'http://localhost:8765/api/com';
const GRADE_BASE_URL = 'http://localhost:8766/api/grades';
const RESOURCE_BASE_URL = 'http://localhost:8767/api/v1/resources';

// Create axios instances
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth headers
  instance.interceptors.request.use(
    (config) => {
      const { token, user } = useAuthStore.getState();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Only add user headers if user is authenticated
      if (user && token) {
        config.headers['X-User-Id'] = user.id.toString();
        config.headers['X-User-Role'] = user.role;
        
        // Set department code - use departmentId if available, otherwise default to '1' for admins
        if (user.departmentId) {
          config.headers['X-User-Department'] = user.departmentId.toString();
        } else if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
          config.headers['X-User-Department'] = '1'; // Default department for admins
        }
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// API instances
export const authApi = createApiInstance(AUTH_BASE_URL);
export const userApi = createApiInstance(USER_BASE_URL);
export const courseApi = createApiInstance(COURSE_BASE_URL);
export const communicationApi = createApiInstance(COMMUNICATION_BASE_URL);
export const gradeApi = createApiInstance(GRADE_BASE_URL);
export const resourceApi = createApiInstance(RESOURCE_BASE_URL);

// Generic API client for gateway
export const apiClient = createApiInstance(API_BASE_URL);

// Helper function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

// Helper function to handle API errors
export const handleApiError = (error: any): never => {
  if (error.response?.data) {
    throw error.response.data;
  }
  throw new Error(error.message || 'An unexpected error occurred');
};