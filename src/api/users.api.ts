import type { User } from "@/types";
import api from "./axios";

export const users = async (page: number, limit: number) =>
  await api.get("/users", {
    params: {
      page,
      limit,
    },
  });
export const createUser = async (user: User) => await api.post("/users", user);
