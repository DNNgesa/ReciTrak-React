import { useState } from "react";
import { databaseApi } from "../constants";

function SupplierItemForm({ supplierId, onItemAdded }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("g");
  const [packSize, setPackSize] = useState(1000);
  const [packPrice, setPackPrice] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const price = Number(packPrice);

    const newIngredient = {
      id: `ing-${Date.now()}`,
      name: name.trim(),
      supplierId,
      unit,
      packSize: Number(packSize),
      currentPackPrice: price,
      previousPackPrice: price,
      stockQty: 0,
      reorderLevel: Number(packSize),
      inKitchen: false,
    };

    fetch(`${databaseApi}/ingredients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIngredient),
    })
      .then((res) => res.json())
      .then((saved) => {
        onItemAdded(saved);
        setName("");
        setPackPrice("");
      });
  }

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label className="form-label small fw-semibold">Item Name</label>
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="col-md-2">
        <label className="form-label small fw-semibold">Unit</label>
        <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="g">g</option>
          <option value="ml">ml</option>
          <option value="pcs">pcs</option>
        </select>
      </div>
      <div className="col-md-2">
        <label className="form-label small fw-semibold">Pack Size</label>
        <input type="number" className="form-control" min="1" value={packSize} onChange={(e) => setPackSize(e.target.value)} required />
      </div>
      <div className="col-md-2">
        <label className="form-label small fw-semibold">Price (KES)</label>
        <input type="number" className="form-control" min="1" value={packPrice} onChange={(e) => setPackPrice(e.target.value)} required />
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-success">Upload Item</button>
      </div>
    </form>
  );
}

export default SupplierItemForm;
