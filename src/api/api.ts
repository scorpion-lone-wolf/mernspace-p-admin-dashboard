import type {
  CreateTenantPayload,
  CreateUserPayload,
  Credentails,
  Product,
  ProductListResponse,
  ProductQueryFilter,
  TenantQueryFilter,
  UpdateTenantPayload,
  UpdateUserPayload,
  UserQueryFilter,
} from "@/types";
import api from "./axios";

export const AUTH_SERVICE = "/api/auth";
const CATALOG_SERVICE = "/api/catalog";

// === Auth Service ===
export const login = async (credentials: Credentails) => await api.post(`${AUTH_SERVICE}/auth/login`, credentials);
export const me = async () => await api.get(`${AUTH_SERVICE}/auth/me`);
export const logout = async () => await api.post(`${AUTH_SERVICE}/auth/logout`);

export const getTenants = async (page?: number, limit?: number, filters?: TenantQueryFilter) => {
  return await api.get(`${AUTH_SERVICE}/tenants`, {
    params: {
      ...(page ? { page } : {}),
      ...(limit ? { limit } : {}),
      ...(filters?.search?.trim() ? { search: filters.search.trim() } : {}),
    },
  });
};
export const createTenant = async (tenant: CreateTenantPayload) => await api.post(`${AUTH_SERVICE}/tenants`, tenant);
export const updateTenant = async (tenant: UpdateTenantPayload, id: string) => await api.patch(`${AUTH_SERVICE}/tenants/${id}`, tenant);

export const getUsers = async (page: number, limit: number, filters: UserQueryFilter) => {
  return await api.get(`${AUTH_SERVICE}/users`, {
    params: {
      page,
      limit,
      ...(filters.search?.trim() ? { search: filters.search.trim() } : {}),
      ...(filters.role ? { role: filters.role } : {}),
    },
  });
};
export const createUser = async (user: CreateUserPayload) => await api.post(`${AUTH_SERVICE}/users`, user);
export const updateUser = async (id: string, user: UpdateUserPayload) => await api.patch(`${AUTH_SERVICE}/users/${id}`, user);

// === Catalog  Service ===

export const getCategories = async () => await api.get(`${CATALOG_SERVICE}/categories`);

export const getProducts = async (page: number, limit: number, filters: ProductQueryFilter) => {
  return await api.get<ProductListResponse>(`${CATALOG_SERVICE}/products`, {
    params: {
      page,
      limit,
      ...(filters.search?.trim() ? { search: filters.search.trim() } : {}),
      ...(filters.isPublished ? { isPublished: true } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.tenantId ? { tenantId: filters.tenantId } : {}),
    },
  });
};

export const createProduct = async (product: FormData) =>
  await api.post(`${CATALOG_SERVICE}/products`, product, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateProduct = async (id: string, product: FormData) =>
  await api.patch<Product>(`${CATALOG_SERVICE}/products/${id}`, product, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
