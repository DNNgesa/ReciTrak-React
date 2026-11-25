import { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import SupplierRegisterForm from "../components/SupplierRegisterForm";
import SupplierItemForm from "../components/SupplierItemForm";
import SupplierItems from "../components/SupplierItems";

function SupplierPortalPage() {
  const { suppliers, setSuppliers, ingredients, setIngredients } = useInventory();
  const [selectedId, setSelectedId] = useState("new");
  const [message, setMessage] = useState("");

  const supplierItems = ingredients.filter(
    (item) => item.supplierId === selectedId
  );

  function handleSupplierCreated(newSup) {
    setSuppliers([...suppliers, newSup]);
    setSelectedId(newSup.id);
    setMessage(`Registered ${newSup.name}! Now add their items below.`);
  }

  function handleItemAdded(newItem) {
    setIngredients((prev) => [...prev, newItem]);
    setMessage(`Uploaded ${newItem.name} (KES ${newItem.currentPackPrice}) to inventory!`);
  }

  function handleUpdateItem(updatedItem) {
    setIngredients((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setMessage(`Updated price for ${updatedItem.name} to KES ${updatedItem.currentPackPrice}!`);
  }

  function handleDeleteItem(deletedId) {
    setIngredients((prev) => prev.filter((item) => item.id !== deletedId));
    setMessage("Removed item from supplier catalog.");
  }

  return (
    <div className="container pb-5" style={{ maxWidth: "750px" }}>
      <h1 className="h3 fw-bold mb-1">Supplier Portal</h1>
      <p className="text-muted mb-4">Onboard suppliers and manage their wholesale catalog items in the ERP.</p>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="card shadow-sm p-4 mb-4">
        <h2 className="h5 fw-bold mb-3">Step 1: Select or Register Supplier</h2>
        <select className="form-select mb-3" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="new">+ Register New Supplier</option>
          {suppliers.map((sup) => (
            <option key={sup.id} value={sup.id}>{sup.name}</option>
          ))}
        </select>

        {selectedId === "new" && (
          <SupplierRegisterForm onSupplierCreated={handleSupplierCreated} />
        )}
      </div>

      {selectedId !== "new" && (
        <>
          <div className="card shadow-sm p-4 mb-4">
            <h2 className="h5 fw-bold mb-3">Step 2: Upload Wholesale Item</h2>
            <SupplierItemForm supplierId={selectedId} onItemAdded={handleItemAdded} />
          </div>

          <SupplierItems
            items={supplierItems}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        </>
      )}
    </div>
  );
}

export default SupplierPortalPage;
