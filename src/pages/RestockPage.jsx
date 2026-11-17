import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function RestockPage() {
  const { ingredients, setIngredients, suppliers } = useOutletContext();
  const [orderPacks, setOrderPacks] = useState({});

  const lowStockItems = ingredients.filter(
    (ing) => ing.stockQty <= ing.reorderLevel
  );

  function getPacksToOrder(ing) {
    if (orderPacks[ing.id] !== undefined) return orderPacks[ing.id];
    const deficit = Math.max(ing.reorderLevel * 2 - ing.stockQty, ing.packSize);
    return Math.ceil(deficit / ing.packSize);
  }

  function handlePackChange(id, value) {
    const count = Math.max(1, parseInt(value) || 1);
    setOrderPacks((prev) => ({ ...prev, [id]: count }));
  }

  function handleApproveRestock(ing) {
    const packs = getPacksToOrder(ing);
    const addedQty = packs * ing.packSize;
    const newStockQty = ing.stockQty + addedQty;

    fetch(`http://localhost:4000/ingredients/${ing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockQty: newStockQty }),
    })
      .then((r) => r.json())
      .then((updatedIng) => {
        setIngredients((prev) =>
          prev.map((item) => (item.id === updatedIng.id ? updatedIng : item))
        );
      })
      .catch(console.error);
  }

  const totalIndentCost = lowStockItems.reduce((sum, ing) => {
    return sum + getPacksToOrder(ing) * ing.currentPackPrice;
  }, 0);

  return (
    <div className="container pb-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Automated Reordering</h1>
          <p className="text-muted mb-0">
            Automated supplier purchase requests triggered when stock drops to or below reorder thresholds.
          </p>
        </div>
        <div className="card bg-light border-0 px-4 py-2 text-end">
          <small className="text-muted">Estimated Reorder Total</small>
          <div className="h5 fw-bold text-primary mb-0">
            KES {totalIndentCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {lowStockItems.length === 0 ? (
        <div className="alert alert-success p-4 text-center shadow-sm">
          <i className="bi bi-check-circle-fill fs-2 d-block mb-2"></i>
          <h2 className="h5 fw-bold">All Kitchen Stock Levels Are Healthy!</h2>
          <p className="mb-0">
            No reorders currently pending. 
          </p>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-warning">
                <tr>
                  <th>Low-Stock Ingredient</th>
                  <th>Supplier</th>
                  <th>Current vs. Min Stock</th>
                  <th>Packs to Order</th>
                  <th>Restock Qty</th>
                  <th>PO Cost (KES)</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((ing) => {
                  const supplier = suppliers.find((s) => s.id === ing.supplierId);
                  const packs = getPacksToOrder(ing);
                  const restockQty = packs * ing.packSize;
                  const lineTotal = packs * ing.currentPackPrice;

                  return (
                    <tr key={ing.id}>
                      <td className="fw-bold">{ing.name}</td>
                      <td>
                        <div>{supplier?.name}</div>
                        <small className="text-muted">Lead time: {supplier?.leadTimeDays} day(s)</small>
                      </td>
                      <td>
                        <span className="badge bg-danger">
                          {ing.stockQty} {ing.unit}
                        </span>{" "}
                        <small className="text-muted">
                          / Min {ing.reorderLevel} {ing.unit}
                        </small>
                      </td>
                      <td style={{ width: "130px" }}>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min="1"
                          value={packs}
                          onChange={(e) => handlePackChange(ing.id, e.target.value)}
                        />
                      </td>
                      <td className="text-success fw-semibold">
                        +{restockQty} {ing.unit}
                      </td>
                      <td className="fw-bold">KES {lineTotal.toFixed(2)}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApproveRestock(ing)}
                        >
                          <i className="bi bi-check2-circle me-1"></i>Approve
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestockPage;
