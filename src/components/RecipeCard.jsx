import { DEFAULT_IMAGE } from "../constants";

function RecipeCard({ recipe, batchCost, isSelected, onSelect }) {
  const foodCostPercent = (
    (batchCost / recipe.sellingPriceBatch) *
    100
  ).toFixed(1);

  return (
    <div className="col-md-6 col-lg-4">
      <div
        className={`card h-100 shadow-sm ${
          isSelected ? "border-primary border-2" : ""
        }`}
        style={{ cursor: "pointer" }}
        onClick={() => onSelect(recipe.id)}
      >
        <img
          src={recipe.image || DEFAULT_IMAGE}
          alt={recipe.name}
          className="card-img-top"
          style={{ height: "160px", objectFit: "cover" }}
        />

        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <span className="badge bg-secondary mb-2">{recipe.category}</span>
            <h2 className="h6 fw-bold">{recipe.name}</h2>
          </div>

          <div className="mt-2 pt-2 border-top small">
            <div className="d-flex justify-content-between">
              <span>Batch Cost:</span>
              <strong>KES {batchCost.toFixed(2)}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Selling Price:</span>
              <span>KES {recipe.sellingPriceBatch.toLocaleString()}</span>
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
}

export default RecipeCard;
