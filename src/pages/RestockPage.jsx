import { useState, useEffect } from "react";
import { databaseApi, kitchenLocation } from "../constants";
import { useInventory } from "../context/InventoryContext";
import { getDeliveryQuote } from "../utils/deliveryApi";
import RestockRow from "../components/RestockRow";
import SupplierMap from "../components/SupplierMap";

function RestockPage() {
  const { ingredients, setIngredients, suppliers } = useInventory();
  const [orderPacks, setOrderPacks] = useState({});
  const [quotesBySupplier, setQuotesBySupplier] = useState({});

  const lowStockItems = ingredients.filter(
    (ing) => ing.inKitchen !== false && ing.stockQty <= ing.reorderLevel
  );

  useEffect(() => {
    const mappedSuppliers = suppliers.filter((s) => s.lat && s.lng);
    if (mappedSuppliers.length === 0) return;

    let cancelled = false;

    Promise.all(
      mappedSuppliers.map(async (sup) => {
        const quote = await getDeliveryQuote(kitchenLocation, sup);
        return [sup.id, quote];
      })
    ).then((entries) => {
      if (!cancelled) {
        setQuotesBySupplier(Object.fromEntries(entries));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [suppliers]);

  function getPacksToOrder(ing) {
    if (orderPacks[ing.id] !== undefined) return orderPacks[ing.id];
    const deficit = Math.max(ing.reorderLevel * 2 - ing.stockQty, ing.packSize);
    return Math.ceil(deficit / ing.packSize);
  }

  function handlePackChange(id, value) {
    const count = Math.max(1, Number(value) || 1);
    setOrderPacks((prev) => ({ ...prev, [id]: count }));
  }

  function handleApproveRestock(ing) {
    const packs = getPacksToOrder(ing);
    const newStockQty = ing.stockQty + packs * ing.packSize;

    fetch(`${databaseApi}/ingredients/${ing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockQty: newStockQty }),
    })
      .then((res) => res.json())
      .then((updatedIng) => {
        setIngredients((prev) =>
          prev.map((item) => (item.id === updatedIng.id ? updatedIng : item))
        );
        setOrderPacks((prev) => {
          const next = { ...prev };
          delete next[ing.id];
          return next;
        });
      });
  }

  const ingredientsSubtotal = lowStockItems.reduce(
    (sum, ing) => sum + getPacksToOrder(ing) * ing.currentPackPrice,
    0
  );

  const activeSupplierIds = [...new Set(lowStockItems.map((ing) => ing.supplierId))];
  const estimatedDeliveryTotal = activeSupplierIds.reduce(
    (sum, supId) => sum + (quotesBySupplier[supId]?.deliveryFeeKes || 0),
    0
  );

  const grandTotalCost = ingredientsSubtotal + estimatedDeliveryTotal;

  return (
    <div className="container pb-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Automated Reordering Matrix</h1>
          <p className="text-muted mb-0">
            Automated restock orders triggered when stock drops to or below
            minimum levels.
          </p>
        </div>

        <div className="card bg-white px-4 py-2 text-end shadow-sm">
          <small className="text-muted">
            Estimated Reorder Total (incl. KES {estimatedDeliveryTotal.toLocaleString()} delivery)
          </small>
          <div className="h5 fw-bold text-primary mb-0">
            KES {grandTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <SupplierMap
        suppliers={suppliers}
        quotesBySupplier={quotesBySupplier}
      />

      {lowStockItems.length === 0 ? (
        <div className="alert alert-success p-4 text-center shadow-sm">
          <h2 className="h5 fw-bold">All Kitchen Stock Levels Are Healthy!</h2>
          <p className="mb-0">No stock items are critically low.</p>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-warning">
                <tr>
                  <th>Low-Stock Ingredient</th>
                  <th>Supplier</th>
                  <th>Current vs. Minimum Stock</th>
                  <th>Packs to Order (PO)</th>
                  <th>Restock Qty</th>
                  <th>PO Cost (KES)</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((ing) => (
                  <RestockRow
                    key={ing.id}
                    ingredient={ing}
                    supplier={suppliers.find((s) => s.id === ing.supplierId)}
                    packs={getPacksToOrder(ing)}
                    onPackChange={handlePackChange}
                    onApprove={handleApproveRestock}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestockPage;
