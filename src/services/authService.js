// src/services/authService.js
import api from "./api";

const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data.user;
  },

  register: async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    return response.data.user;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

export default authService;
