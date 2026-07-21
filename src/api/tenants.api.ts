import type { CreateTenantPayload, TenantQueryFilter, UpdateTenantPayload } from "@/types";
import api from "./axios";

export const tenants = async (page?: number, limit?: number, filters?: TenantQueryFilter) => {
  return await api.get("/tenants", {
    params: {
      ...(page ? { page } : {}),
      ...(limit ? { limit } : {}),
      ...(filters?.search?.trim() ? { search: filters.search.trim() } : {}),
    },
  });
};
export const createTenant = async (tenant: CreateTenantPayload) => await api.post("/tenants", tenant);
export const updateTenant = async (tenant: UpdateTenantPayload, id: string) => await api.patch("/tenants/" + id, tenant);
