import { useState } from "react";
import { useErp } from "../context/ErpContext";
import IngredientRow from "../components/IngredientRow";

function InventoryPage() {
  const { ingredients, setIngredients, suppliers } = useErp();
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");

  function getSupplierName(supplierId) {
    const match = suppliers.find((s) => s.id === supplierId);
    return match ? match.name : "Unknown Supplier";
  }

  function handleUpdateIngredient(updatedItem) {
    setIngredients((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  }

  const displayedIngredients = ingredients.filter((ing) => {
    const matchesName = ing.name.toLowerCase().includes(search.toLowerCase());
    const matchesSupplier =
      supplierFilter === "All" || ing.supplierId === supplierFilter;
    return matchesName && matchesSupplier;
  });

  return (
    <div className="container pb-5">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">
          Inventory & Supplier Price Variance
        </h1>
        <p className="text-muted mb-0">
          Track live stock levels and supplier percentage price changes.
        </p>
      </div>

      <div className="card shadow-sm p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Search ingredients (e.g. Butter, Flour, Mascarpone)..."
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

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Ingredient</th>
                <th>Supplier</th>
                <th>Stock On Hand</th>
                <th>Previous Pack (KES)</th>
                <th>Current Pack (KES)</th>
                <th>Price Change %</th>
                <th className="text-end">Update Price</th>
              </tr>
            </thead>
            <tbody>
              {displayedIngredients.map((ing) => (
                <IngredientRow
                  key={ing.id}
                  ingredient={ing}
                  supplierName={getSupplierName(ing.supplierId)}
                  onUpdateIngredient={handleUpdateIngredient}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
