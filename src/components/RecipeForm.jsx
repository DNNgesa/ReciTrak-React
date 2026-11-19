import { useState } from "react";
import { useRecipes } from "../context/RecipeContext";
import { useInventory } from "../context/InventoryContext";
import { saveRecipeWithIngredients } from "../utils/recipeApi";
import BomRowInput from "./BomRowInput";
import { defaultImg } from "../constants";

const BASE_CATEGORIES = ["Chilled Desserts", "Cookies", "Baked Pastries", "Cakes & Cheesecakes"];

function RecipeForm({ initialRecipe = null, ingredients, onSaveRecipe, onCancel }) {
  const { recipes } = useRecipes();
  const { suppliers, setIngredients } = useInventory();
  const isEditMode = Boolean(initialRecipe);

  const categories = Array.from(new Set([...BASE_CATEGORIES, ...recipes.map((r) => r.category)]));
  const emptyRow = () => ({
    isNew: false,
    ingredientId: ingredients[0]?.id || "ing-1",
    qty: 100,
    newName: "",
    supplierId: suppliers[0]?.id || "sup-1",
    unit: "g",
    packSize: 1000,
    packPrice: 250,
  });

  const [name, setName] = useState(initialRecipe?.name || "");
  const [category, setCategory] = useState(initialRecipe?.category || categories[0]);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [photoUrl, setPhotoUrl] = useState(initialRecipe?.image || "");
  const [yieldServings, setYieldServings] = useState(initialRecipe?.yieldServings || 10);
  const [sellingPriceBatch, setSellingPriceBatch] = useState(initialRecipe?.sellingPriceBatch || 3000);
  const [bomList, setBomList] = useState(() =>
    initialRecipe ? initialRecipe.bom.map((item) => ({ ...emptyRow(), ...item })) : [{ ...emptyRow(), qty: 200 }]
  );

  function updateRow(index, changes) {
    setBomList(bomList.map((row, i) => (i === index ? { ...row, ...changes } : row)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const finalCategory = isNewCategory ? customCategory.trim() || category : category;

    const { savedRecipe, newlyCreatedIngredients } = await saveRecipeWithIngredients({
        initialRecipe,
        name,
        category: finalCategory,
        image: photoUrl,
        yieldServings,
        sellingPriceBatch,
        bomList,
        defaultSupplierId: suppliers[0]?.id,
    });


    if (newlyCreatedIngredients.length > 0) {
      setIngredients((prev) => [...prev, ...newlyCreatedIngredients]);
    }
    onSaveRecipe(savedRecipe);
  }

  return (
    <div className={`card shadow-sm p-4 mb-4 ${isEditMode ? "border-warning" : ""}`}>
      <h2 className="h5 fw-bold mb-3">{isEditMode ? `Edit Recipe: ${initialRecipe.name}` : "Create New Menu Item & BOM"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Dish Name</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="col-md-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-semibold mb-0">Category</label>
              <button type="button" className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => setIsNewCategory(!isNewCategory)}>
                {isNewCategory ? "Choose Existing" : "+ New Category"}
              </button>
            </div>
            {isNewCategory ? (
              <input type="text" className="form-control" placeholder="e.g. Spreads & Sauces" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} required />
            ) : (
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Menu Image URL</label>
            <input type="url" className="form-control" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder= {defaultImg} />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Yield (Servings)</label>
            <input type="number" className="form-control" value={yieldServings} onChange={(e) => setYieldServings(e.target.value)} min="1" required />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Batch Selling Price (KES)</label>
            <input type="number" className="form-control" value={sellingPriceBatch} onChange={(e) => setSellingPriceBatch(e.target.value)} min="1" required />
          </div>
        </div>

        <h3 className="h6 fw-bold mb-2">Recipe Ingredients (BOM)</h3>
        {bomList.map((row, index) => (
          <BomRowInput
            key={index}
            row={row}
            index={index}
            ingredients={ingredients}
            suppliers={suppliers}
            canRemove={bomList.length > 1}
            onChange={(i, field, val) => updateRow(i, { [field]: ["qty", "packSize", "packPrice"].includes(field) ? Number(val) : val })}
            onToggleNew={(i) => updateRow(i, { isNew: !bomList[i].isNew })}
            onRemove={(i) => setBomList(bomList.filter((_, idx) => idx !== i))}
          />
        ))}

        <div className="d-flex gap-2 mt-3">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setBomList([...bomList, emptyRow()])}>Add Ingredient Row</button>
          <div className="ms-auto d-flex gap-2">
            {onCancel && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>}
            <button type="submit" className={`btn fw-semibold ${isEditMode ? "btn-warning" : "btn-success"}`}>
              {isEditMode ? "Save Changes" : "Save Recipe & Sync Inventory"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;
