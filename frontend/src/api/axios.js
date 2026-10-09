import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Access token expired
    if (
  error.response?.status === 401 &&
  !originalRequest._retry &&
  !originalRequest.url.includes("/users/token/refresh/") &&
  !originalRequest.url.includes("/users/login/") &&
  !originalRequest.url.includes("/users/register/") &&
  !originalRequest.url.includes("/users/verify-otp/") &&
  !originalRequest.url.includes("/users/resend-otp/") &&
  !originalRequest.url.includes("/core/forgot-password/") &&
  !originalRequest.url.includes("/core/verify-forgot-otp/") &&
  !originalRequest.url.includes("/core/reset-password/")
) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/users/token/refresh/`,
    {
      refresh: refreshToken,
    }
  );

  const newAccessToken = response.data.access;

  localStorage.setItem("access_token", newAccessToken);

  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

  return api(originalRequest);
} catch (refreshError) {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";

  return Promise.reject(refreshError);
}
    }

    return Promise.reject(error);
  }
);

export default api;