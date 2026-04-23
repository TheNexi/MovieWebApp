import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true, 
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await API.post("/auth/refresh");
        return API(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;