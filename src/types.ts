import type { UploadFile } from "antd";

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

export type Category = {
  _id: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
};

export type PriceConfiguration = {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: string[];
  };
};

export type ProductPriceConfiguration = {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: Record<string, number>;
  };
};
export type Attribute = {
  name: string;
  widgetType: "radio" | "switch";
  defaultValue: string;
  availableOptions: string[];
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  tenantId: string;
  image: string;
  categoryId: Category["_id"] | Category;
  priceConfiguration: ProductPriceConfiguration;
  attribute: { name: string; value: unknown }[];
  isPublished: boolean;
};

export type ProductListResponse = {
  data: Product[];
  total: number;
  page: number;
  limit: number;
};

export type ProductQueryFilter = {
  search?: string;
  isPublished?: boolean | string;
  categoryId?: string;
  tenantId?: string;
};

export type CreateProductData = {
  // _id: string;
  name: string;
  description: string;
  tenantId: string;
  image: UploadFile[];
  categoryId: Category["_id"];
  isPublished: boolean;
  priceConfiguration: ProductPriceConfiguration;
  attribute: { name: string; value: unknown }[];
};

export type Coupon = {
  _id: string;
  title: string;
  code: string;
  discount: number;
  validUpto: string;
  tenant: string;
};

export type CouponListResponse = {
  data: Coupon[];
  total: number;
  page: number;
  limit: number;
};

export type CreateCouponPayload = Omit<Coupon, "_id">;
export type UpdateCouponPayload = Partial<CreateCouponPayload>;
