import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("workzoko_user")) || null;
  });

  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
      localStorage.setItem("workzoko_user", JSON.stringify(data));
      toast.success(`Welcome back, ${data.name}!`);

      if (data.role === "admin") navigate("/admin/dashboard");
      else if (data.role === "recruiter") navigate("/recruiter/dashboard");
      else navigate("/jobs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await api.post("/auth/register", formData);
      setUser(data);
      localStorage.setItem("workzoko_user", JSON.stringify(data));
      toast.success(`Welcome to Workzoko, ${data.name}!`);

      if (data.role === "recruiter") navigate("/recruiter/dashboard");
      else navigate("/jobs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("workzoko_user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
