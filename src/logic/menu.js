import { hasEnoughStock, isBelowPar } from "./inventory";

export function isDishAvailable(recipe, stock) {
  return recipe.ingredients.every((ingredient) => {
    const stockItem = stock.find(
      (item) =>
        item.name.toLowerCase() === ingredient.name.toLowerCase()
    );

    if (!stockItem) return false;

    // Explicit product rule:
    // dish is unavailable when an ingredient is below par.
    if (isBelowPar(stockItem)) return false;

    return hasEnoughStock(
      stockItem,
      ingredient.qty,
      ingredient.unit
    );
  });
}

export function getMenuWithAvailability(recipes, stock) {
  return recipes.map((recipe) => ({
    ...recipe,
    available: isDishAvailable(recipe, stock),
  }));
}