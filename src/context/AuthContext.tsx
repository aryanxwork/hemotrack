import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Role, UserAdmin } from "@/types";
import { api } from "@/lib/api";

interface AuthCtx {
  user: UserAdmin | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  role: Role | null;
}
const Ctx = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "hemotrack_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAdmin | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserAdmin) : null;
  });

  useEffect(() => {
    const handleAuthError = () => {
      setUser(null);
    };
    window.addEventListener("auth-error", handleAuthError);
    return () => window.removeEventListener("auth-error", handleAuthError);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      if (res.data.success) {
        localStorage.setItem("hemotrack_token", res.data.token);
        setUser(res.data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, message: res.data.message || "Invalid credentials" };
    } catch (err: any) {
      console.error(err);
      return { success: false, message: err.message || "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}
    setUser(null);
    localStorage.removeItem("hemotrack_token");
    localStorage.removeItem(STORAGE_KEY);
  };

  const register = async (username: string, password: string) => {
    try {
      const res = await api.post("/auth/register", { username, password, role: 'Patient' });
      if (res.data.success) {
        localStorage.setItem("hemotrack_token", res.data.token);
        setUser(res.data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, message: res.data.message || "Registration failed" };
    } catch (err: any) {
      console.error(err);
      return { success: false, message: err.message || "Registration failed" };
    }
  };

  return <Ctx.Provider value={{ user, login, logout, register, role: user?.role ?? null }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}
