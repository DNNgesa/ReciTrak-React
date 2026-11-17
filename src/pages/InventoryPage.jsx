import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function InventoryPage() {
  const { ingredients, setIngredients, suppliers } = useOutletContext();
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [newPriceInput, setNewPriceInput] = useState("");

  function getSupplierName(supplierId) {
    return suppliers.find((s) => s.id === supplierId)?.name || "Unknown Supplier";
  }

  function handleSaveNewPrice(ingredient) {
    const parsedPrice = parseFloat(newPriceInput);
    if (isNaN(parsedPrice) || parsedPrice <= 0) return;

    const updatedFields = {
      previousPackPrice: ingredient.currentPackPrice,
      currentPackPrice: parsedPrice,
    };

    fetch(`http://localhost:4000/ingredients/${ingredient.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    })
      .then((r) => r.json())
      .then((updatedIng) => {
        setIngredients((prev) =>
          prev.map((item) => (item.id === updatedIng.id ? updatedIng : item))
        );
        setEditingId(null);
        setNewPriceInput("");
      })
      .catch(console.error);
  }

  const filteredIngredients = ingredients.filter((ing) => {
    const matchesSearch = ing.name.toLowerCase().includes(search.toLowerCase());
    const matchesSupplier =
      supplierFilter === "All" || ing.supplierId === supplierFilter;
    return matchesSearch && matchesSupplier;
  });

  return (
    <div className="container pb-5">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Inventory & Supplier Price Variance</h1>
        <p className="text-muted mb-0">
          Track on hand stock live and monitor supplier percentage price increases in KES.
        </p>
      </div>

      <div className="card shadow-sm border-0 p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Search raw ingredients (e.g. Butter, Flour, Mascarpone)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-5">
            <select
              className="form-select"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
            >
              <option value="All">All Suppliers</option>
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Ingredient</th>
                <th>Supplier</th>
                <th>Stock On Hand</th>
                <th>Previous Price (KES)</th>
                <th>Current Price (KES)</th>
                <th>Price Change %</th>
                <th className="text-end">Update Supplier Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.map((ing) => {
                const isLow = ing.stockQty <= ing.reorderLevel;
                const priceDiffPct =
                  ((ing.currentPackPrice - ing.previousPackPrice) /
                    ing.previousPackPrice) *
                  100;

                return (
                  <tr key={ing.id}>
                    <td>
                      <div className="fw-bold">{ing.name}</div>
                      <small className="text-muted">
                        Pack: {ing.packSize} {ing.unit}
                      </small>
                    </td>
                    <td className="small">{getSupplierName(ing.supplierId)}</td>
                    <td>
                      <span
                        className={`badge ${
                          isLow ? "bg-danger" : "bg-success-subtle text-success border border-success"
                        }`}
                      >
                        {ing.stockQty} {ing.unit}
                      </span>
                      <div className="small text-muted">
                        Min: {ing.reorderLevel} {ing.unit}
                      </div>
                    </td>
                    <td className="text-muted">KES {ing.previousPackPrice.toFixed(2)}</td>
                    <td className="fw-bold">KES {ing.currentPackPrice.toFixed(2)}</td>
                    <td>
                      {priceDiffPct > 0 ? (
                        <span className="badge bg-danger">
                          <i className="bi bi-arrow-up-right me-1"></i>+
                          {priceDiffPct.toFixed(1)}%
                        </span>
                      ) : priceDiffPct < 0 ? (
                        <span className="badge bg-success">
                          <i className="bi bi-arrow-down-right me-1"></i>
                          {priceDiffPct.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="badge bg-secondary">0.0%</span>
                      )}
                    </td>
                    <td className="text-end">
                      {editingId === ing.id ? (
                        <div className="d-flex justify-content-end gap-1">
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ width: "100px" }}
                            placeholder="New KES"
                            value={newPriceInput}
                            onChange={(e) => setNewPriceInput(e.target.value)}
                          />
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleSaveNewPrice(ing)}
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
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setEditingId(ing.id);
                            setNewPriceInput(ing.currentPackPrice);
                          }}
                        >
                          Log New Price
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;