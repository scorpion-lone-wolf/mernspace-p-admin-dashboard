import type { Credentails } from "@/types";
import api from "./axios";

export const login = (credentials: Credentails) => {
  return api.post("/auth/login", credentials);
};
