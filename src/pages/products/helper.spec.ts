import type { Product, ProductListResponse, ProductPriceConfiguration } from "@/types";
import { describe, expect, it } from "vitest";
import { makePriceConfigurationFormValues, replaceProductInList } from "./helper";

const product = {
  _id: "product-id",
  name: "Pizza",
  description: "",
  tenantId: "tenant-id",
  image: "pizza.jpg",
  categoryId: "category-id",
  priceConfiguration: {
    Size: {
      priceType: "base",
      availableOptions: { Small: 100, Large: 200 },
    },
  },
  attribute: [],
  isPublished: true,
} satisfies Product;

describe("replaceProductInList", () => {
  it("replaces the stale table row with the product returned by update", () => {
    const cachedProducts: ProductListResponse = {
      data: [product],
      total: 1,
      page: 1,
      limit: 8,
    };
    const updatedProduct: Product = {
      ...product,
      priceConfiguration: {
        Size: {
          priceType: "base",
          availableOptions: { Small: 150, Large: 250 },
        },
      },
    };

    const result = replaceProductInList(cachedProducts, updatedProduct);

    expect(result?.data[0]?.priceConfiguration.Size?.availableOptions).toEqual({
      Small: 150,
      Large: 250,
    });
    expect(result).toMatchObject({ total: 1, page: 1, limit: 8 });
  });
});

describe("makePriceConfigurationFormValues", () => {
  it("creates the nested field names used by the pricing form", () => {
    const priceConfiguration: ProductPriceConfiguration = {
      Size: {
        priceType: "base",
        availableOptions: { Small: 150, Large: 250 },
      },
      Crust: {
        priceType: "additional",
        availableOptions: { Thin: 10, Thick: 20 },
      },
    };

    expect(makePriceConfigurationFormValues(priceConfiguration)).toEqual({
      '{"configurationKey":"Size","priceType":"base"}': { Small: 150, Large: 250 },
      '{"configurationKey":"Crust","priceType":"additional"}': { Thin: 10, Thick: 20 },
    });
  });

  it("does not carry prices from a previously selected product", () => {
    const firstProductPrices: ProductPriceConfiguration = {
      Size: {
        priceType: "base",
        availableOptions: { Small: 100 },
      },
    };
    const secondProductPrices: ProductPriceConfiguration = {
      Portion: {
        priceType: "base",
        availableOptions: { Regular: 300 },
      },
    };

    makePriceConfigurationFormValues(firstProductPrices);

    expect(makePriceConfigurationFormValues(secondProductPrices)).toEqual({
      '{"configurationKey":"Portion","priceType":"base"}': { Regular: 300 },
    });
  });
});
