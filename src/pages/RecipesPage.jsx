import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://unsplash.com";

function RecipesPage() {
  const { recipes, setRecipes, ingredients } = useOutletContext();

  const [selectedId, setSelectedId] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Baked Pastries");
  const [image, setImage] = useState("");
  const [yieldServings, setYieldServings] = useState(10);
  const [sellingPriceBatch, setSellingPriceBatch] = useState(3000);
  const [bomList, setBomList] = useState([{ ingredientId: "ing-1", qty: 200 }]);

  function getRecipeCost(bom) {
    let totalCost = 0;

    bom.forEach((item) => {
      const ingredient = ingredients.find((ing) => ing.id === item.ingredientId);
      if (ingredient) {
        const costPerUnit = ingredient.currentPackPrice / ingredient.packSize;
        totalCost += costPerUnit * item.qty;
      }
    });

    return totalCost;
  }

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

    fetch("http://localhost:4000/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    })
      .then((res) => res.json())
      .then((savedRecipe) => {
        setRecipes([...recipes, savedRecipe]);
        setSelectedId(savedRecipe.id);
        setShowForm(false);
        setName("");
        setImage("");
      });
  }

  const activeRecipe = recipes.find((r) => r.id === selectedId) || recipes[0];

  return (
    <div className="container pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Bill of Materials (BOM)</h1>
          <p className="text-muted mb-0">
            Click any dessert card to inspect its exact ingredient cost in KES.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add New Recipe"}
        </button>
      </div>

      {showForm && (
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
                    onChange={(e) =>
                      handleRowChange(index, "qty", e.target.value)
                    }
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
      )}

      <div className="row g-3 mb-4">
        {recipes.map((recipe) => {
          const batchCost = getRecipeCost(recipe.bom);
          const foodCostPercent = (
            (batchCost / recipe.sellingPriceBatch) *
            100
          ).toFixed(1);
          const isSelected = activeRecipe?.id === recipe.id;

          return (
            <div className="col-md-6 col-lg-3" key={recipe.id}>
              <div
                className={`card h-100 shadow-sm ${
                  isSelected ? "border-primary border-2" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedId(recipe.id)}
              >
                <img
                  src={recipe.image || DEFAULT_IMAGE}
                  alt={recipe.name}
                  className="card-img-top"
                  style={{ height: "160px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge bg-secondary mb-2">
                      {recipe.category}
                    </span>
                    <h2 className="h6 fw-bold">{recipe.name}</h2>
                  </div>

                  <div className="mt-2 pt-2 border-top small">
                    <div className="d-flex justify-content-between">
                      <span>Batch Cost:</span>
                      <strong>KES {batchCost.toFixed(2)}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Selling Price:</span>
                      <span>KES {recipe.sellingPriceBatch}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <span>Food Cost %:</span>
                      <span
                        className={`badge ${
                          foodCostPercent > 35 ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {foodCostPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {activeRecipe && (
        <div className="card shadow-sm p-4">
          <h2 className="h5 fw-bold">{activeRecipe.name} — Ingredient Cost Breakdown</h2>
          <p className="text-muted">Makes {activeRecipe.yieldServings} servings</p>
          <div className="d-flex justify-content-between mb-3">
            <strong>Batch Cost: KES {getRecipeCost(activeRecipe.bom).toFixed(2)}</strong>
            <strong>
              Profit: KES{" "}
              {(activeRecipe.sellingPriceBatch - getRecipeCost(activeRecipe.bom)).toFixed(2)}
            </strong>
          </div>
          <table className="table">
            <thead>
              <tr><th>Ingredient</th><th>Quantity</th><th>Line Cost (KES)</th></tr>
            </thead>
            <tbody>
              {activeRecipe.bom.map((item, index) => {
                const ing = ingredients.find((i) => i.id === item.ingredientId);
                if (!ing) return null;
                const lineCost = (ing.currentPackPrice / ing.packSize) * item.qty;
                return (
                  <tr key={`${item.ingredientId}-${index}`}>
                    <td>{ing.name}</td>
                    <td>{item.qty} {ing.unit}</td>
                    <td>{lineCost.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecipesPage;
