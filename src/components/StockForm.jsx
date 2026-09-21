import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  qty: "",
  unit: "g",
  par: "",
};

function StockForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        qty: item.qty,
        unit: item.unit,
        par: item.par,
      });
    } else {
      setForm(initialForm);
    }
  }, [item]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>{item ? "Edit ingredient" : "Add ingredient"}</h3>

      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ingredient name"
        />
      </label>

      <label>
        Quantity
        <input
          name="qty"
          type="number"
          min="0"
          step="0.001"
          value={form.qty}
          onChange={handleChange}
        />
      </label>

      <label>
        Unit
        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
        >
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="l">l</option>
        </select>
      </label>

      <label>
        Par level
        <input
          name="par"
          type="number"
          min="0"
          step="0.001"
          value={form.par}
          onChange={handleChange}
        />
      </label>

      <div className="form-actions">
        <button type="submit">
          {item ? "Save changes" : "Add ingredient"}
        </button>

        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default StockForm;