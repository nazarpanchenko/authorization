import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from "axios";

export const API_URL = "http://localhost:5000/api";

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export function initializeInterceptors() {
  $api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  $api.interceptors.response.use(
    (response) => response,
    (err: AxiosError) => {
      const originalRequest = err.config as AxiosRequestConfig & {
        _isRetry?: boolean;
      };
      if (err.response?.status === 401 && !originalRequest?._isRetry) {
        originalRequest._isRetry = true;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/sign-in";
        alert("User session expired. Sign in to continue using the app");
      }
      return Promise.reject(err);
    },
  );
}

export default $api;
