export type Credentails = {
  email: string;
  password: string;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  tenantId?: string;
};

export type Tenant = {
  name: string;
  address: string;
};

export type UserQueryFilter = {
  search?: string;
  role?: string;
};

export type TenantQueryFilter = {
  search?: string;
};
