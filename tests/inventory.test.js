import { describe, expect, it } from "vitest";

import {
  toBaseUnit,
  hasEnoughStock,
  deductIngredient,
  deductRecipe,
} from "../src/logic/inventory";

describe("inventory logic", () => {
  it("converts kilograms to grams", () => {
    expect(toBaseUnit(1.4, "kg")).toBe(1400);
  });

  it("checks stock across different units", () => {
    const paneer = {
      name: "Paneer",
      qty: 1.4,
      unit: "kg",
      par: 0.5,
    };

    expect(hasEnoughStock(paneer, 180, "g")).toBe(true);
  });

  it("deducts recipe quantity while preserving stock unit", () => {
    const paneer = {
      name: "Paneer",
      qty: 1.4,
      unit: "kg",
      par: 0.5,
    };

    const updated = deductIngredient(paneer, 180, "g");

    expect(updated.qty).toBe(1.22);
    expect(updated.unit).toBe("kg");
  });

  it("deducts multiple ingredients from a recipe", () => {
    const stock = [
      {
        name: "Paneer",
        qty: 1.4,
        unit: "kg",
        par: 0.5,
      },
      {
        name: "Tomatoes",
        qty: 6,
        unit: "kg",
        par: 1.5,
      },
    ];

    const ingredients = [
      {
        name: "Paneer",
        qty: 180,
        unit: "g",
      },
      {
        name: "Tomatoes",
        qty: 150,
        unit: "g",
      },
    ];

    const updated = deductRecipe(stock, ingredients);

    expect(updated[0].qty).toBe(1.22);
    expect(updated[1].qty).toBe(5.85);
  });

  it("rejects insufficient stock", () => {
    const chicken = {
      name: "Chicken",
      qty: 0,
      unit: "kg",
      par: 1,
    };

    expect(() => {
      deductIngredient(chicken, 250, "g");
    }).toThrow("Insufficient stock");
  });

  it("rejects a recipe ingredient missing from stock", () => {
    const stock = [
      {
        name: "Paneer",
        qty: 1,
        unit: "kg",
        par: 0.5,
      },
    ];

    const ingredients = [
      {
        name: "Cumin Seeds",
        qty: 4,
        unit: "g",
      },
    ];

    expect(() => {
      deductRecipe(stock, ingredients);
    }).toThrow("Ingredient not found");
  });
});