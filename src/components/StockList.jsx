import { isBelowPar } from "../logic/inventory";

function StockList({ items, onEdit, onDelete }) {
  if (!items.length) {
    return <p className="empty">No ingredients found.</p>;
  }

  return (
    <div className="stock-list">
      {items.map((item) => {
        const belowPar = isBelowPar(item);

        return (
          <div className="stock-row" key={item.name}>
            <div className="stock-info">
              <strong>{item.name}</strong>
              <span>
                {item.qty} {item.unit}
              </span>
            </div>

            <div className="par">
              Par: {item.par} {item.unit}
            </div>

            <span className={belowPar ? "status danger" : "status ok"}>
              {belowPar ? "Below par" : "OK"}
            </span>

            <div className="row-actions">
              <button
                className="secondary"
                onClick={() => onEdit(item)}
              >
                Edit
              </button>

              <button
                className="danger-button"
                onClick={() => onDelete(item)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StockList;