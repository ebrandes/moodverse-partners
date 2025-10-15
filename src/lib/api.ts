import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  withCredentials: true,
});

export async function getMe() {
  const { data } = await api.get("/api/users/me");
  return data;
}

export async function login(email: string, password: string) {
  // Backend should set HttpOnly cookies
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}
