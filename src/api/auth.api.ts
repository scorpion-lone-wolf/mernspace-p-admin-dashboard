import type { Credentails } from "@/types";
import api from "./axios";

export const login = async (credentials: Credentails) => await api.post("/auth/login", credentials);
export const me = async () => await api.get("/auth/me");
export const logout = async () => await api.post("/auth/logout");
