import type { Credentails } from "@/types";
import api from "./axios";

export const login = (credentials: Credentails) => api.post("/auth/login", credentials);
export const me = () => api.get("/auth/me");
export const logout = () => api.post("/auth/logout");
