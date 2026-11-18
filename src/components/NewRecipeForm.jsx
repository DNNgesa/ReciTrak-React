import { useState } from "react";
import { useRecipes } from "../context/RecipeContext";
import { useInventory } from "../context/InventoryContext";
import { API_URL, DEFAULT_IMAGE } from "../constants";

const BASE_CATEGORIES = [
  "Chilled Desserts",
  "Cookies",
  "Baked Pastries",
  "Cakes & Cheesecakes",
];

function NewRecipeForm({ ingredients, onAddRecipe }) {
  const { recipes } = useRecipes();
  const { suppliers, setIngredients } = useInventory();

  const existingCategories = Array.from(
    new Set([...BASE_CATEGORIES, ...recipes.map((r) => r.category)])
  );

  const [name, setName] = useState("");
  const [category, setCategory] = useState(existingCategories[0]);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [image, setImage] = useState("");
  const [yieldServings, setYieldServings] = useState(10);
  const [sellingPriceBatch, setSellingPriceBatch] = useState(3000);

  const [bomList, setBomList] = useState([
    {
      isNew: false,
      ingredientId: "ing-1",
      qty: 200,
      newName: "",
      supplierId: suppliers[0]?.id || "sup-1",
      unit: "g",
      packSize: 1000,
      packPrice: 250,
    },
  ]);

  function handleAddRow() {
    setBomList([
      ...bomList,
      {
        isNew: false,
        ingredientId: ingredients[0]?.id || "ing-1",
        qty: 100,
        newName: "",
        supplierId: suppliers[0]?.id || "sup-1",
        unit: "g",
        packSize: 1000,
        packPrice: 250,
      },
    ]);
  }

  function handleRemoveRow(indexToRemove) {
    setBomList(bomList.filter((_, index) => index !== indexToRemove));
  }

  function handleRowChange(index, field, value) {
    const numberFields = ["qty", "packSize", "packPrice"];
    const updatedRows = bomList.map((row, i) => {
      if (i !== index) return row;
      return {
        ...row,
        [field]: numberFields.includes(field) ? Number(value) : value,
      };
    });
    setBomList(updatedRows);
  }

  function toggleNewIngredient(index) {
    const updatedRows = bomList.map((row, i) =>
      i === index ? { ...row, isNew: !row.isNew } : row
    );
    setBomList(updatedRows);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const finalCategory = isNewCategory
      ? customCategory.trim() || BASE_CATEGORIES[0]
      : category;

    const newIngredientRequests = bomList.map((row) => {
      if (!row.isNew) {
        return Promise.resolve({
          ingredientId: row.ingredientId,
          qty: row.qty,
          createdItem: null,
        });
      }

      const newIngPayload = {
        id: `ing-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: row.newName.trim(),
        supplierId: row.supplierId || suppliers[0]?.id || "sup-1",
        unit: row.unit,
        packSize: row.packSize || 1000,
        currentPackPrice: row.packPrice || 100,
        previousPackPrice: row.packPrice || 100,
        stockQty: 0,
        reorderLevel: row.packSize || 500,
      };

      return fetch(`${API_URL}/ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIngPayload),
      })
        .then((res) => res.json())
        .then((savedIng) => ({
          ingredientId: savedIng.id,
          qty: row.qty,
          createdItem: savedIng,
        }));
    });

    Promise.all(newIngredientRequests).then((resolvedRows) => {
      const newlyCreatedItems = resolvedRows
        .map((r) => r.createdItem)
        .filter(Boolean);

      if (newlyCreatedItems.length > 0) {
        setIngredients((prev) => [...prev, ...newlyCreatedItems]);
      }

      const finalBom = resolvedRows
        .filter((r) => r.qty > 0)
        .map((r) => ({ ingredientId: r.ingredientId, qty: r.qty }));

      const newRecipe = {
        id: `rec-${Date.now()}`,
        name: name.trim(),
        category: finalCategory,
        image: image.trim() || DEFAULT_IMAGE,
        yieldServings: Number(yieldServings),
        sellingPriceBatch: Number(sellingPriceBatch),
        bom: finalBom,
      };

      fetch(`${API_URL}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      })
        .then((res) => res.json())
        .then((savedRecipe) => {
          onAddRecipe(savedRecipe);
          setName("");
          setCustomCategory("");
          setIsNewCategory(false);
          setImage("");
        });
    });
  }

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h2 className="h5 fw-bold mb-3">Create New Menu Item & BOM</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Dish Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Homemade Chocolate Hazelnut Spread"
              required
            />
          </div>

          <div className="col-md-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-semibold mb-0">Category</label>
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none"
                onClick={() => setIsNewCategory(!isNewCategory)}
              >
                {isNewCategory ? "Choose Existing" : "+ New Category"}
              </button>
            </div>

            {isNewCategory ? (
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Spreads & Sauces"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
              />
            ) : (
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Menu Image URL</label>
            <input
              type="url"
              className="form-control"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Yield (Servings)</label>
            <input
              type="number"
              className="form-control"
              value={yieldServings}
              onChange={(e) => setYieldServings(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Batch Selling Price (KES)</label>
            <input
              type="number"
              className="form-control"
              value={sellingPriceBatch}
              onChange={(e) => setSellingPriceBatch(e.target.value)}
              min="1"
              required
            />
          </div>
        </div>

        <h3 className="h6 fw-bold mb-2">Recipe Ingredients (BOM)</h3>
        {bomList.map((row, index) => (
          <div className="card bg-light border p-3 mb-2" key={index}>
            <div className="row g-2 align-items-center">
              <div className="col-md-7">
                {row.isNew ? (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="New ingredient name (e.g. Roasted Hazelnuts)"
                    value={row.newName}
                    onChange={(e) =>
                      handleRowChange(index, "newName", e.target.value)
                    }
                    required
                  />
                ) : (
                  <select
                    className="form-select"
                    value={row.ingredientId}
                    onChange={(e) =>
                      handleRowChange(index, "ingredientId", e.target.value)
                    }
                  >
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} ({ing.unit}) — KES {ing.currentPackPrice} per{" "}
                        {ing.packSize}
                        {ing.unit}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Recipe Qty"
                  value={row.qty}
                  onChange={(e) => handleRowChange(index, "qty", e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="col-md-3 d-flex gap-1">
                <button
                  type="button"
                  className={`btn btn-sm flex-grow-1 ${
                    row.isNew ? "btn-warning" : "btn-outline-primary"
                  }`}
                  onClick={() => toggleNewIngredient(index)}
                >
                  {row.isNew ? "Use Existing" : "+ New Item"}
                </button>
                {bomList.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveRow(index)}
                  >
                    ×
                  </button>
                )}
              </div>

              {row.isNew && (
                <>
                  <div className="col-md-3">
                    <label className="form-label">Supplier</label>
                    <select
                      className="form-select form-select-sm"
                      value={row.supplierId}
                      onChange={(e) =>
                        handleRowChange(index, "supplierId", e.target.value)
                      }
                    >
                      {suppliers.map((sup) => (
                        <option key={sup.id} value={sup.id}>
                          {sup.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Unit</label>
                    <select
                      className="form-select form-select-sm"
                      value={row.unit}
                      onChange={(e) =>
                        handleRowChange(index, "unit", e.target.value)
                      }
                    >
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="pcs">pcs</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Pack Size</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      min="1"
                      value={row.packSize}
                      onChange={(e) =>
                        handleRowChange(index, "packSize", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Pack Price (KES)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      min="1"
                      value={row.packPrice}
                      onChange={(e) =>
                        handleRowChange(index, "packPrice", e.target.value)
                      }
                      required
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm mb-3"
          onClick={handleAddRow}
        >
          + Add Ingredient Row
        </button>

        <button type="submit" className="btn btn-primary w-100">
          Save Recipe &amp; Sync Inventory
        </button>
      </form>
    </div>
  );
}
export default NewRecipeForm;
