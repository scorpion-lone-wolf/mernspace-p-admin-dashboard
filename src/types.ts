export type Credentails = {
  email: string;
  password: string;
};

export type Tenant = {
  id: string;
  name: string;
  address: string;
};

export type CreateTenantPayload = {
  name: string;
  address: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tenant?: Tenant;
};

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  tenantId?: string;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;
export type UpdateTenantPayload = Partial<CreateTenantPayload>;

export type UserQueryFilter = {
  search?: string;
  role?: string;
};

export type TenantQueryFilter = {
  search?: string;
};
