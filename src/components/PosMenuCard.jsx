import { DEFAULT_IMAGE } from "../constants";

function PosMenuCard({ recipe, inStock, onSell }) {
  return (
    <div className="col-md-6">
      <div className="card h-100 shadow-sm">
        <img
        src={recipe.image || DEFAULT_IMAGE}
        onError={(e) => {
          e.currentTarget.src = DEFAULT_IMAGE;
        }}
        className="card-img-top"
        alt={recipe.name}
        style={{ height: "140px", objectFit: "cover" }}
        />


        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between mb-2">
            <span className="badge bg-primary">{recipe.category}</span>
            <strong className="text-success">
              KES {recipe.sellingPriceBatch.toLocaleString()}
            </strong>
          </div>

          <h2 className="h5 fw-bold">{recipe.name}</h2>
          <p className="small text-muted">
            Yield: {recipe.yieldServings} servings
          </p>

          <button
            className={`btn mt-auto w-100 ${
              inStock ? "btn-dark" : "btn-outline-danger"
            }`}
            disabled={!inStock}
            onClick={() => onSell(recipe)}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PosMenuCard;
