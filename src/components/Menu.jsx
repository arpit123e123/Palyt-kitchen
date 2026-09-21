function Menu({ menu, onOrder }) {
  return (
    <div className="menu-list">
      {menu.map((recipe) => (
        <article className="menu-card" key={recipe.dish}>
          <div>
            <h3>{recipe.dish}</h3>
            <p className="price">₹{recipe.price}</p>
          </div>

          <div className="menu-footer">
            <span
              className={
                recipe.available
                  ? "status available"
                  : "status unavailable"
              }
            >
              {recipe.available ? "Available" : "Unavailable"}
            </span>

            <button
              disabled={!recipe.available}
              onClick={() => onOrder(recipe)}
            >
              Order
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default Menu;