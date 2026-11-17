import { useState } from "react";
import { API_URL, DEFAULT_IMAGE } from "../constants";

function NewRecipeForm({ ingredients, onAddRecipe }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Baked Pastries");
  const [image, setImage] = useState("");
  const [yieldServings, setYieldServings] = useState(10);
  const [sellingPriceBatch, setSellingPriceBatch] = useState(3000);
  const [bomList, setBomList] = useState([{ ingredientId: "ing-1", qty: 200 }]);

  function handleAddRow() {
    setBomList([...bomList, { ingredientId: "ing-1", qty: 100 }]);
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

    const newRecipe = {
      id: `rec-${Date.now()}`,
      name: name,
      category: category,
      image: image.trim() || DEFAULT_IMAGE,
      yieldServings: Number(yieldServings),
      sellingPriceBatch: Number(sellingPriceBatch),
      bom: bomList.filter((row) => row.qty > 0),
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
        setImage("");
      });
  }

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h2 className="h5 fw-bold mb-3">Create New Menu Item & BOM</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label">Dish Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chocolate Brownies"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Chilled Desserts">Chilled Desserts</option>
              <option value="Cookies">Cookies</option>
              <option value="Baked Pastries">Baked Pastries</option>
              <option value="Cakes & Cheesecakes">Cakes & Cheesecakes</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Menu Image URL</label>
            <input
              type="url"
              className="form-control"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Yield (Number of Servings)</label>
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
            <label className="form-label">Batch Selling Price (KES)</label>
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
            <div className="col-md-8">
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
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Amount needed"
                value={row.qty}
                onChange={(e) => handleRowChange(index, "qty", e.target.value)}
                min="1"
                required
              />
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
          <button type="submit" className="btn btn-success ms-auto">
            Save Recipe
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewRecipeForm;
