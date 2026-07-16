import api from "./axios";

export const tenants = async () => await api.get("/tenants");
