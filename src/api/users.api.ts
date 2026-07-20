import type { CreateUserPayload, UpdateUserPayload, UserQueryFilter } from "@/types";
import api from "./axios";

export const users = async (page: number, limit: number, filters: UserQueryFilter) => {
  return await api.get("/users", {
    params: {
      page,
      limit,
      ...(filters.search?.trim() ? { search: filters.search.trim() } : {}),
      ...(filters.role ? { role: filters.role } : {}),
    },
  });
};
export const createUser = async (user: CreateUserPayload) => await api.post("/users", user);
export const updateUser = async (id: string, user: UpdateUserPayload) => await api.patch(`/users/${id}`, user);
