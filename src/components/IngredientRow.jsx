import { useState } from "react";
import { databaseApi } from "../constants";

function IngredientRow({ ingredient, supplierName, onUpdateIngredient }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState(ingredient.currentPackPrice);

  const isLow = ingredient.stockQty <= ingredient.reorderLevel;

  // Formula: ((New Price - Old Price) / Old Price) * 100
  const priceChangePercent =
    ((ingredient.currentPackPrice - ingredient.previousPackPrice) /
      ingredient.previousPackPrice) *
    100;

  function handleSave() {
    const parsedPrice = Number(newPrice);
    if (parsedPrice <= 0) return;

    fetch(`${databaseApi}/ingredients/${ingredient.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        previousPackPrice: ingredient.currentPackPrice,
        currentPackPrice: parsedPrice,
      }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        onUpdateIngredient(updatedItem);
        setIsEditing(false);
      });
  }

  return (
    <tr>
      <td>
        <div className="fw-bold">{ingredient.name}</div>
        <small className="text-muted">
          Pack: {ingredient.packSize} {ingredient.unit}
        </small>
      </td>

      <td className="small">{supplierName}</td>

      <td>
        <span className={`badge ${isLow ? "bg-danger" : "bg-success"}`}>
          {ingredient.stockQty} {ingredient.unit}
        </span>
        <div className="small text-muted">
          Min: {ingredient.reorderLevel} {ingredient.unit}
        </div>
      </td>

      <td className="text-muted">
        KES {ingredient.previousPackPrice.toFixed(2)}
      </td>

      <td className="fw-bold">
        KES {ingredient.currentPackPrice.toFixed(2)}
      </td>

      <td>
        {priceChangePercent > 0 ? (
          <span className="badge bg-danger">
            +{priceChangePercent.toFixed(1)}%
          </span>
        ) : priceChangePercent < 0 ? (
          <span className="badge bg-success">
            {priceChangePercent.toFixed(1)}%
          </span>
        ) : (
          <span className="badge bg-secondary">0.0%</span>
        )}
      </td>

      <td className="text-end">
        {isEditing ? (
          <div className="d-flex justify-content-end gap-1">
            <input
              type="number"
              className="form-control form-control-sm"
              style={{ width: "100px" }}
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
            <button className="btn btn-sm btn-success" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setIsEditing(true)}
          >
            Log New Price
          </button>
        )}
      </td>
    </tr>
  );
}

export default IngredientRow;
