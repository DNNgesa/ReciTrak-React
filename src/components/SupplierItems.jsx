import { useState } from "react";
import { databaseApi } from "../constants";

function SupplierItems({ items, onUpdateItem, onDeleteItem }) {
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  function startEdit(item) {
    setEditingId(item.id);
    setEditPrice(item.currentPackPrice);
  }

  function handleSave(item) {
    const newPrice = Number(editPrice);
    if (newPrice <= 0) return;

    fetch(`${databaseApi}/ingredients/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        previousPackPrice: item.currentPackPrice,
        currentPackPrice: newPrice,
      }),
    })
      .then((res) => res.json())
      .then((updated) => {
        onUpdateItem(updated);
        setEditingId(null);
      });
  }

  function handleDelete(item) {
    if (!window.confirm(`Remove "${item.name}" from this supplier's catalog?`)) {
      return;
    }

    fetch(`${databaseApi}/ingredients/${item.id}`, {
      method: "DELETE",
    }).then(() => {
      onDeleteItem(item.id);
    });
  }

  return (
    <div className="card shadow-sm p-4">
      <h2 className="h6 fw-bold mb-3">
        Current Catalog Items ({items.length})
      </h2>

      {items.length === 0 ? (
        <p className="text-muted small mb-0">
          No items uploaded for this supplier yet.
        </p>
      ) : (
        <table className="table table-sm align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Item Name</th>
              <th>Pack Size</th>
              <th>Pack Price (KES)</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="fw-semibold">{item.name}</td>
                <td>{item.packSize} {item.unit}</td>
                <td>
                  {editingId === item.id ? (
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      style={{ width: "110px" }}
                      min="1"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  ) : (
                    `KES ${item.currentPackPrice.toLocaleString()}`
                  )}
                </td>
                <td className="text-end">
                  {editingId === item.id ? (
                    <div className="d-flex justify-content-end gap-1">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleSave(item)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => startEdit(item)}
                      >
                        Edit Price
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SupplierItems;
