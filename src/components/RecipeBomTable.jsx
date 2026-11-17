function RecipeBomTable({ recipe, ingredients, batchCost, onEdit, onDelete }) {
  if (!recipe) return null;

  const grossProfit = recipe.sellingPriceBatch - batchCost;

  return (
    <div className="card shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h2 className="h5 fw-bold mb-0">
            {recipe.name} — Ingredient Cost Breakdown
          </h2>
          <small className="text-muted">
            Makes {recipe.yieldServings} servings
          </small>
        </div>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="text-end">
            <div className="fw-bold text-primary">
              Batch Cost: KES {batchCost.toFixed(2)}
            </div>
            <small className="text-success fw-semibold">
              Gross Profit: KES {grossProfit.toFixed(2)}
            </small>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-warning text-dark fw-semibold"
              onClick={onEdit}
            >
              <i className="bi bi-pencil-square me-1"></i>Edit Recipe
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(recipe)}
            >
              <i className="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Ingredient</th>
              <th>Recipe Qty</th>
              <th>Supplier Pack Rate</th>
              <th className="text-end">Ingredient Cost (KES)</th>
            </tr>
          </thead>
          <tbody>
            {recipe.bom.map((item) => {
              const ing = ingredients.find((i) => i.id === item.ingredientId);
              if (!ing) return null;

              const lineCost =
                (ing.currentPackPrice / ing.packSize) * item.qty;

              return (
                <tr key={item.ingredientId}>
                  <td>{ing.name}</td>
                  <td>
                    {item.qty} {ing.unit}
                  </td>
                  <td className="text-muted small">
                    KES {ing.currentPackPrice} per {ing.packSize} {ing.unit}
                  </td>
                  <td className="text-end fw-bold">
                    KES {lineCost.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecipeBomTable;
