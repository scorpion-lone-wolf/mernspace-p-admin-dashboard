import api from "./axios";

export const users = async () => await api.get("/users");
