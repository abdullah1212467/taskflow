import axios from "axios";

const api = axios.create({
  baseURL: "http://100.58.219.37:5000/api",
  withCredentials: true,
});

// Request Interceptor
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

// Response Interceptor
api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

  if (
  error.response?.status === 401 &&
  !originalRequest._retry &&
  originalRequest.url !== "/auth/refresh-token"
){

      originalRequest._retry = true;

      try {

        const { data } = await axios.post(
          "http://100.58.219.37:5000/api/auth/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );

        localStorage.setItem(
          "accessToken",
          data.accessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return api(originalRequest);

      } catch (refreshError) {

        localStorage.removeItem("accessToken");

        window.location.href = "/login";

        return Promise.reject(refreshError);

      }

    }

    return Promise.reject(error);

  }

);

export default api;