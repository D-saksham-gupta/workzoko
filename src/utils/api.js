import axios from "axios";

const api = axios.create({
  baseURL: "https://workzoko-backend.onrender.com/api",
});

// automatically attach token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("workzoko_user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
