# Palyt Kitchen

A small React application for managing kitchen stock and checking menu availability based on current inventory and par levels.

## Features

- View kitchen ingredients and stock levels
- Search ingredients
- Add new ingredients
- Edit quantity, unit, and par level
- Delete unused ingredients
- Prevent deletion of ingredients used by menu recipes
- Show whether stock is below par
- Automatic menu availability based on current stock
- Deduct recipe ingredients when an order is placed
- Support unit conversion between:
  - kg / g
  - l / ml
- Persist stock changes using localStorage
- Reset stock to the original supplied data
- Unit and inventory logic covered with Vitest tests

## Menu Availability

A dish is available only when:

1. All recipe ingredients exist in stock.
2. Each required ingredient is not below its par level.
3. There is enough stock to fulfil the recipe.

When an order is placed, the recipe quantities are deducted from the current stock.

Because menu availability is calculated from the current stock, the menu updates automatically after an order, edit, or restock.

## Handling Missing Ingredients

Some recipe ingredients are not present in the supplied stock data, such as `Cumin Seeds` and `Refined Flour`.

These dishes are treated as unavailable because the application cannot fulfil a recipe when one of its required ingredients is missing from stock.

## Deleting Ingredients

An ingredient can be deleted only when it is not used by any recipe.

If an ingredient is referenced by a dish, deletion is blocked to avoid leaving a recipe with a missing dependency.

For example:

- `Bay Leaves` can be deleted because it is not used by the supplied recipes.
- `Cashews` cannot be deleted because it is used by multiple dishes.

## Units

Stock quantities and recipe quantities can use different units.

The application converts quantities to a common base unit before comparing or deducting them.

Examples:

- `1 kg = 1000 g`
- `1 l = 1000 ml`

This prevents incorrect calculations when stock and recipe quantities use different units.

## Persistence

Stock changes are saved to the browser's `localStorage`.

This means changes such as:

- ordering a dish
- adding an ingredient
- editing stock
- deleting an ingredient

remain after refreshing the page.

The **Reset** button restores the original stock data supplied with the task.

## Tech Stack

- React
- Vite
- JavaScript
- Vitest
- CSS
- localStorage

No backend or database is required for this task.

 Running the Project

Install dependencies:

npm install
Start the development server:
npm run dev
Run tests:
npm run test
Run tests in watch mode:
npm run test:watch
Create a production build:
npm run build
Tests
The test suite covers:
- Unit conversion
- Stock availability
- Ingredient deduction
- Multiple ingredient deduction
- Insufficient stock handling
- Missing ingredient handling
- Menu availability
- Below-par availability
- Missing recipe ingredient availability
Current test result:
2 test files passed
10 tests passed



#Project Structure
src/
├── components/
│   ├── Menu.jsx
│   ├── StockForm.jsx
│   └── StockList.jsx
│
├── data/
│   ├── recipes.json
│   └── stock.json
│
├── logic/
│   ├── inventory.js
│   └── menu.js
│
├── App.jsx
├── main.jsx
└── index.css

tests/
├── inventory.test.js
└── menu.test.js


## AI Usage

I used AI tools during development mainly for debugging and to get help with implementation when I was stuck.

I reviewed and tested the generated suggestions myself and made the final decisions about the application logic and UI.