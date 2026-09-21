import { describe, expect, it } from "vitest";

import {
  isDishAvailable,
  getMenuWithAvailability,
} from "../src/logic/menu";

describe("menu availability", () => {
  const recipe = {
    dish: "Paneer Butter Masala",
    price: 320,
    ingredients: [
      {
        name: "Paneer",
        qty: 180,
        unit: "g",
      },
      {
        name: "Butter",
        qty: 30,
        unit: "g",
      },
    ],
  };

  it("marks a dish available when ingredients are above par", () => {
    const stock = [
      {
        name: "Paneer",
        qty: 1.4,
        unit: "kg",
        par: 0.5,
      },
      {
        name: "Butter",
        qty: 900,
        unit: "g",
        par: 200,
      },
    ];

    expect(isDishAvailable(recipe, stock)).toBe(true);
  });

  it("marks a dish unavailable when an ingredient is below par", () => {
    const stock = [
      {
        name: "Paneer",
        qty: 0.4,
        unit: "kg",
        par: 0.5,
      },
      {
        name: "Butter",
        qty: 900,
        unit: "g",
        par: 200,
      },
    ];

    expect(isDishAvailable(recipe, stock)).toBe(false);
  });

  it("marks a dish unavailable when an ingredient is missing", () => {
    const stock = [
      {
        name: "Paneer",
        qty: 1.4,
        unit: "kg",
        par: 0.5,
      },
    ];

    expect(isDishAvailable(recipe, stock)).toBe(false);
  });

  it("updates menu availability from current stock", () => {
    const stock = [
      {
        name: "Paneer",
        qty: 0.4,
        unit: "kg",
        par: 0.5,
      },
      {
        name: "Butter",
        qty: 900,
        unit: "g",
        par: 200,
      },
    ];

    const menu = getMenuWithAvailability([recipe], stock);

    expect(menu[0].available).toBe(false);
  });
});