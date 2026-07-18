import type { Tenant } from "@/types";
import api from "./axios";

export const tenants = async () => await api.get("/tenants");
export const createTenant = async (tenant: Tenant) => await api.post("/tenants", tenant);
