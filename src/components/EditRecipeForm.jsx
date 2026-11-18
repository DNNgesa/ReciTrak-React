import { useState } from "react";
import { useRecipes } from "../context/RecipeContext";
import { API_URL, DEFAULT_IMAGE } from "../constants";

const BASE_CATEGORIES = [
  "Chilled Desserts",
  "Cookies",
  "Baked Pastries",
  "Cakes & Cheesecakes",
];

function EditRecipeForm({ recipe, ingredients, onUpdateRecipe, onCancel }) {
  const { recipes } = useRecipes();

  const existingCategories = Array.from(
    new Set([...BASE_CATEGORIES, ...recipes.map((r) => r.category)])
  );

  const [name, setName] = useState(recipe.name);
  const [category, setCategory] = useState(recipe.category);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [image, setImage] = useState(recipe.image || "");
  const [yieldServings, setYieldServings] = useState(recipe.yieldServings);
  const [sellingPriceBatch, setSellingPriceBatch] = useState(
    recipe.sellingPriceBatch
  );
  const [bomList, setBomList] = useState(recipe.bom);

  function handleAddRow() {
    setBomList([...bomList, { ingredientId: ingredients[0]?.id || "ing-1", qty: 100 }]);
  }

  function handleRemoveRow(indexToRemove) {
    setBomList(bomList.filter((_, index) => index !== indexToRemove));
  }

  function handleRowChange(index, field, value) {
    const updatedRows = bomList.map((row, i) => {
      if (i !== index) return row;
      return {
        ...row,
        [field]: field === "qty" ? Number(value) : value,
      };
    });
    setBomList(updatedRows);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const finalCategory = isNewCategory
      ? customCategory.trim() || category
      : category;

    const updatedFields = {
      name,
      category: finalCategory,
      image: image.trim() || DEFAULT_IMAGE,
      yieldServings: Number(yieldServings),
      sellingPriceBatch: Number(sellingPriceBatch),
      bom: bomList.filter((row) => row.qty > 0),
    };

    fetch(`${API_URL}/recipes/${recipe.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    })
      .then((res) => res.json())
      .then((savedRecipe) => {
        onUpdateRecipe(savedRecipe);
      });
  }

  return (
    <div className="card shadow-sm border-warning p-4 mb-4">
      <h2 className="h5 fw-bold mb-3">Edit Recipe: {recipe.name}</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Dish Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Yield (Number of Servings)</label>
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
          <div className="row g-2 mb-2" key={index}>
            <div className="col-md-7">
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
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                value={row.qty}
                onChange={(e) => handleRowChange(index, "qty", e.target.value)}
                min="1"
                required
              />
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-outline-danger w-100"
                onClick={() => handleRemoveRow(index)}
                disabled={bomList.length === 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="d-flex gap-2 mt-3">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleAddRow}
          >
            + Add Ingredient
          </button>
          <div className="ms-auto d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-warning fw-semibold">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditRecipeForm;