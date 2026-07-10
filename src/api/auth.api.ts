import type { Credentails } from "@/types";
import api from "./axios";

export const login = (credentials: Credentails) => {
  return api.post("/auth/login", credentials);
};

export const me = () => {
  return api.get("/auth/me");
};
