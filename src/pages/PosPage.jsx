import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://unsplash.com";

function PosPage() {
  const { recipes, ingredients, setIngredients, orders, setOrders } =
    useOutletContext();
  const [message, setMessage] = useState("");

  function canMakeRecipe(recipe) {
    return recipe.bom.every((item) => {
      const ing = ingredients.find((i) => i.id === item.ingredientId);
      return ing && ing.stockQty >= item.qty;
    });
  }

  function handleAddtoCart(recipe) {
    if (!canMakeRecipe(recipe)) {
      setMessage(`Not enough stock to make ${recipe.name}!`);
      return;
    }

    const updateRequests = recipe.bom.map((item) => {
      const ing = ingredients.find((i) => i.id === item.ingredientId);
      const updatedStock = ing.stockQty - item.qty;

      return fetch(`http://localhost:4000/ingredients/${ing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQty: updatedStock }),
      }).then((res) => res.json());
    });

    Promise.all(updateRequests).then((updatedList) => {
      setIngredients((prevIngredients) =>
        prevIngredients.map((ing) => {
          const match = updatedList.find((u) => u.id === ing.id);
          return match ? match : ing;
        })
      );

      const newOrder = {
        id: `ord-${Date.now()}`,
        recipeName: recipe.name,
        revenueKes: recipe.sellingPriceBatch,
        timestamp: new Date().toLocaleTimeString(),
      };

      fetch("http://localhost:4000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      })
        .then((res) => res.json())
        .then((savedOrder) => {
          setOrders([savedOrder, ...orders]);
          setMessage(
            `Sold 1 batch of ${recipe.name}! Ingredients deducted from inventory.`
          );
        });
    });
  }

  const totalSales = orders.reduce((sum, order) => sum + order.revenueKes, 0);

  return (
    <div className="container pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Point of Sale</h1>
          <p className="text-muted mb-0">
            Selling a batch automatically deducts its recipe ingredients from stock.
          </p>
        </div>
        <div className="card bg-success text-white px-3 py-2 text-end">
          <small>Total Sales</small>
          <div className="h5 fw-bold mb-0">KES {totalSales.toLocaleString()}</div>
        </div>
      </div>

      {message && (
        <div className="alert alert-info alert-dismissible fade show">
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage("")}
          ></button>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="row g-3">
            {recipes.map((recipe) => {
              const inStock = canMakeRecipe(recipe);
              return (
                <div className="col-md-6" key={recipe.id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={recipe.image || DEFAULT_IMAGE}
                      alt={recipe.name}
                      className="card-img-top"
                      style={{ height: "160px", objectFit: "cover" }}
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
                        onClick={() => handleAddtoCart(recipe)}
                      >
                        {inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm p-3">
            <h2 className="h5 fw-bold mb-3">Recent Sales</h2>
            {orders.length === 0 ? (
              <p className="text-muted small mb-0">
                No sales yet. Click "Add to Cart" to test stock deduction.
              </p>
            ) : (
              <ul className="list-group list-group-flush">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="list-group-item d-flex justify-content-between align-items-center px-0"
                  >
                    <div>
                      <div className="fw-semibold small">{order.recipeName}</div>
                      <small className="text-muted">{order.timestamp}</small>
                    </div>
                    <span className="badge bg-success">
                      +KES {order.revenueKes.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PosPage;