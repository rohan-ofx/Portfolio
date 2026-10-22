
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
});

let refreshPromise = null;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    // Login/refresh requests ko dobara intercept nahi karna.
    if (
      requestUrl.includes("/users/login") ||
      requestUrl.includes("/users/refresh-token") ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/admin/login";

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Ek saath multiple requests fail hon, toh refresh ek hi baar hoga.
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${baseURL}/users/refresh-token`, {
            refreshToken,
          })
          .then((response) => {
            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data;

            if (!accessToken || !newRefreshToken) {
              throw new Error("Refresh response is missing tokens.");
            }

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            return accessToken;
          })
          .catch((refreshError) => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/admin/login";

            throw refreshError;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;
