import type { CreateProductData, ProductFormImage } from "@/types";

export const makeFormData = (data: CreateProductData) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "image") {
      const imageFile = (value as ProductFormImage).file.originFileObj!;
      formData.append(key, imageFile);
    } else if (key === "priceConfiguration" || key === "attribute") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value as string);
    }
  });
  return formData;
};
