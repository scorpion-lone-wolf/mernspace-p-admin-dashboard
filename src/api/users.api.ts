import type { User } from "@/types";
import api from "./axios";

export const users = async () => await api.get("/users");
export const createUser = async (user: User) => await api.post("/users", user);
