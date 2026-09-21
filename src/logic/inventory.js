const UNIT_TO_BASE = {
  kg: { base: "g", factor: 1000 },
  g: { base: "g", factor: 1 },
  l: { base: "ml", factor: 1000 },
  ml: { base: "ml", factor: 1 },
};

export function toBaseUnit(qty, unit) {
  const conversion = UNIT_TO_BASE[unit];

  if (!conversion) {
    throw new Error(`Unsupported unit: ${unit}`);
  }

  return qty * conversion.factor;
}

export function convertUnit(qty, fromUnit, toUnit) {
  if (!UNIT_TO_BASE[fromUnit] || !UNIT_TO_BASE[toUnit]) {
    throw new Error("Unsupported unit");
  }

  const baseQty = toBaseUnit(qty, fromUnit);

  if (UNIT_TO_BASE[fromUnit].base !== UNIT_TO_BASE[toUnit].base) {
    throw new Error(`Cannot convert ${fromUnit} to ${toUnit}`);
  }

  return baseQty / UNIT_TO_BASE[toUnit].factor;
}

export function isBelowPar(item) {
  if (!item) return true;

  return (
    toBaseUnit(item.qty, item.unit) <
    toBaseUnit(item.par, item.unit)
  );
}

export function hasEnoughStock(item, requiredQty, requiredUnit) {
  if (!item) return false;

  try {
    const available = toBaseUnit(item.qty, item.unit);
    const required = toBaseUnit(requiredQty, requiredUnit);

    return available >= required;
  } catch {
    return false;
  }
}

export function deductIngredient(item, requiredQty, requiredUnit) {
  if (!hasEnoughStock(item, requiredQty, requiredUnit)) {
    throw new Error(`Insufficient stock for ${item?.name ?? "ingredient"}`);
  }

  const deduction = convertUnit(
    requiredQty,
    requiredUnit,
    item.unit
  );

  return {
    ...item,
    qty: Number((item.qty - deduction).toFixed(3)),
  };
}

export function deductRecipe(stock, ingredients) {
  const updatedStock = stock.map((item) => ({ ...item }));

  for (const ingredient of ingredients) {
    const index = updatedStock.findIndex(
      (item) =>
        item.name.toLowerCase() === ingredient.name.toLowerCase()
    );

    if (index === -1) {
      throw new Error(`Ingredient not found: ${ingredient.name}`);
    }

    updatedStock[index] = deductIngredient(
      updatedStock[index],
      ingredient.qty,
      ingredient.unit
    );
  }

  return updatedStock;
}