import { useMemo, useState } from "react";
import stockData from "./data/stock.json";
import recipesData from "./data/recipes.json";

import { deductRecipe } from "./logic/inventory";
import { getMenuWithAvailability } from "./logic/menu";

import StockList from "./components/StockList";
import StockForm from "./components/StockForm";
import Menu from "./components/Menu";

const STORAGE_KEY = "palyt-kitchen-stock";

function getInitialStock() {
  try {
    const savedStock = localStorage.getItem(STORAGE_KEY);

    if (savedStock) {
      return JSON.parse(savedStock);
    }
  } catch (error) {
    console.error("Could not load saved stock:", error);
  }

  return stockData;
}

function App() {
  const [stock, setStock] = useState(getInitialStock);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  function updateStock(nextStock) {
    setStock(nextStock);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStock));
  }

  const menu = useMemo(
    () => getMenuWithAvailability(recipesData, stock),
    [stock]
  );

  const filteredStock = stock.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  function saveIngredient(data) {
    const name = data.name.trim();
    const qty = Number(data.qty);
    const par = Number(data.par);

    if (!name) {
      setMessage("Enter an ingredient name.");
      return;
    }

    if (!Number.isFinite(qty) || qty < 0) {
      setMessage("Quantity cannot be negative.");
      return;
    }

    if (!Number.isFinite(par) || par < 0) {
      setMessage("Par level cannot be negative.");
      return;
    }

    if (editingItem) {
      const nextStock = stock.map((item) =>
        item.name === editingItem.name
          ? {
              name,
              qty,
              unit: data.unit,
              par,
            }
          : item
      );

      updateStock(nextStock);
      setMessage("Ingredient updated.");
    } else {
      const alreadyExists = stock.some(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      );

      if (alreadyExists) {
        setMessage("That ingredient already exists.");
        return;
      }

      const nextStock = [
        ...stock,
        {
          name,
          qty,
          unit: data.unit,
          par,
        },
      ];

      updateStock(nextStock);
      setMessage("Ingredient added.");
    }

    setEditingItem(null);
    setShowForm(false);
  }

  function deleteIngredient(item) {
    const usedIn = recipesData.filter((recipe) =>
      recipe.ingredients.some(
        (ingredient) =>
          ingredient.name.toLowerCase() === item.name.toLowerCase()
      )
    );

    if (usedIn.length > 0) {
      setMessage(
        `Can't delete ${item.name}. It is used by ${usedIn
          .map((recipe) => recipe.dish)
          .join(", ")}.`
      );

      return;
    }

    const nextStock = stock.filter(
      (stockItem) => stockItem.name !== item.name
    );

    updateStock(nextStock);
    setMessage(`${item.name} deleted.`);
  }

  function orderDish(recipe) {
    try {
      const updatedStock = deductRecipe(stock, recipe.ingredients);

      updateStock(updatedStock);
      setMessage(`${recipe.dish} ordered.`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function resetStock() {
    const confirmed = window.confirm(
      "Reset stock to the original supplied data?"
    );

    if (!confirmed) {
      return;
    }

    const freshStock = stockData.map((item) => ({ ...item }));

    updateStock(freshStock);
    setMessage("Stock reset to the original data.");
  }

  return (
    <div className="app">
      <header>
        <div>
          <h1>Kitchen Stock</h1>
          <p>Stock levels and menu availability</p>
        </div>
      </header>

      {message && <div className="message">{message}</div>}

      <div className="columns">
        <section className="section">
          <div className="section-title">
            <div>
              <h2>Ingredients</h2>
              <p>{stock.length} ingredients</p>
            </div>

            <div className="header-actions">
              <button onClick={resetStock} className="reset-button">
                Reset
              </button>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowForm(true);
                  setMessage("");
                }}
              >
                Add ingredient
              </button>
            </div>
          </div>

          <input
            className="search"
            placeholder="Search ingredients"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {showForm && (
            <StockForm
              item={editingItem}
              onSave={saveIngredient}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
          )}

          <StockList
            items={filteredStock}
            onEdit={(item) => {
              setEditingItem(item);
              setShowForm(true);
              setMessage("");
            }}
            onDelete={deleteIngredient}
          />
        </section>

        <section className="section">
          <div className="section-title">
            <div>
              <h2>Menu</h2>
              <p className="small-text">
                Availability updates automatically with stock levels.
              </p>
            </div>
          </div>

          <Menu menu={menu} onOrder={orderDish} />
        </section>
      </div>
    </div>
  );
}

export default App;