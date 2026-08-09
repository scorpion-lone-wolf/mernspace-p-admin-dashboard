import type { Category, ProductPriceConfiguration } from "@/types";
import { render, screen } from "@testing-library/react";
import { Form } from "antd";
import { describe, expect, it } from "vitest";
import Pricing from "./Pricing";
import { makePriceConfigurationFormValues } from "./helper";

const category: Category = {
  _id: "category-id",
  name: "Pizza",
  priceConfiguration: {
    Size: {
      priceType: "base",
      availableOptions: ["Small", "Medium", "Large"],
    },
    Crust: {
      priceType: "additional",
      availableOptions: ["Thin", "Thick"],
    },
  },
  attributes: [],
};

const existingPrices: ProductPriceConfiguration = {
  Size: {
    priceType: "base",
    availableOptions: { Small: 1112, Medium: 222, Large: 333 },
  },
  Crust: {
    priceType: "additional",
    availableOptions: { Thin: 1, Thick: 20 },
  },
};

describe("Pricing", () => {
  it("fills the existing product prices when edit fields mount", () => {
    render(
      <Form initialValues={{ priceConfiguration: makePriceConfigurationFormValues(existingPrices) }}>
        <Pricing selectedCategory={category} />
      </Form>,
    );

    expect(screen.getByRole("spinbutton", { name: "Small" })).toHaveValue("1112");
    expect(screen.getByRole("spinbutton", { name: "Medium" })).toHaveValue("222");
    expect(screen.getByRole("spinbutton", { name: "Large" })).toHaveValue("333");
    expect(screen.getByRole("spinbutton", { name: "Thin" })).toHaveValue("1");
    expect(screen.getByRole("spinbutton", { name: "Thick" })).toHaveValue("20");
  });
});
