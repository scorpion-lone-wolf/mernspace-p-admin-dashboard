import type { CreateProductData, Product, ProductListResponse, ProductPriceConfiguration } from "@/types";

export const makePriceConfigurationFormValues = (priceConfiguration: ProductPriceConfiguration) =>
  Object.fromEntries(
    Object.entries(priceConfiguration).map(([configurationKey, configuration]) => [
      JSON.stringify({ configurationKey, priceType: configuration.priceType }),
      configuration.availableOptions,
    ]),
  );

export const replaceProductInList = (cachedProducts: ProductListResponse | undefined, updatedProduct: Product) => {
  if (!cachedProducts) return cachedProducts;

  return {
    ...cachedProducts,
    data: cachedProducts.data.map((product) => (product._id === updatedProduct._id ? updatedProduct : product)),
  };
};

export const makeFormData = (data: CreateProductData) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "image") {
      const imageFile = (value as CreateProductData["image"])[0]?.originFileObj;
      if (imageFile) {
        formData.append(key, imageFile);
      }
    } else if (key === "priceConfiguration" || key === "attribute") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value as string);
    }
  });
  return formData;
};
