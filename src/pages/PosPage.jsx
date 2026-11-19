import { useState } from "react";
import { databaseApi } from "../constants";
import { useRecipes } from "../context/RecipeContext";
import { useInventory } from "../context/InventoryContext";
import { useOrders } from "../context/OrderContext";
import PosMenuCard from "../components/PosMenuCard";
import CategoryFilterBar from "../components/CategoryFilterBar";

function PosPage() {
  const { recipes } = useRecipes();
  const { ingredients, setIngredients } = useInventory();
  const { orders, setOrders } = useOrders();
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  function canMakeRecipe(recipe) {
    return recipe.bom.every((item) => {
      const ing = ingredients.find((i) => i.id === item.ingredientId);
      return ing && ing.stockQty >= item.qty;
    });
  }

  function handleSellBatch(recipe) {
    if (!canMakeRecipe(recipe)) {
      setMessage(`Not enough stock to make ${recipe.name}!`);
      return;
    }

    const updateRequests = recipe.bom.map((item) => {
      const ing = ingredients.find((i) => i.id === item.ingredientId);
      const updatedStock = ing.stockQty - item.qty;

      return fetch(`${databaseApi}/ingredients/${ing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQty: updatedStock }),
      }).then((res) => res.json());
    });

    Promise.all(updateRequests).then((updatedList) => {
      setIngredients((prev) =>
        prev.map((ing) => updatedList.find((u) => u.id === ing.id) || ing)
      );

      const newOrder = {
        id: `ord-${Date.now()}`,
        recipeName: recipe.name,
        revenueKes: recipe.sellingPriceBatch,
        timestamp: new Date().toLocaleTimeString(),
      };

      fetch(`${databaseApi}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      })
        .then((res) => res.json())
        .then((savedOrder) => {
          setOrders([savedOrder, ...orders]);
          setMessage(
            `Sold 1 batch of ${recipe.name}! Ingredients deducted from stock.`
          );
        });
    });
  }

  const totalSales = orders.reduce((sum, order) => sum + order.revenueKes, 0);

  const categories = ["All", ...new Set(recipes.map((r) => r.category))];
  const filteredRecipes =
    selectedCategory === "All"
      ? recipes
      : recipes.filter((r) => r.category === selectedCategory);

  return (
    <div className="container pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Point Of Sale (POS)</h1>
          <p className="text-muted mb-0">
            Selling a batch automatically deducts its recipe ingredients from
            stock.
          </p>
        </div>
        <div className="card bg-success text-white px-3 py-2 text-end">
          <small>Total Sales</small>
          <div className="h5 fw-bold mb-0">
            KES {totalSales.toLocaleString()}
          </div>
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

      <CategoryFilterBar
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      />

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="row g-3">
            {filteredRecipes.map((recipe) => (
              <PosMenuCard
                key={recipe.id}
                recipe={recipe}
                inStock={canMakeRecipe(recipe)}
                onSell={handleSellBatch}
              />
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm p-3">
            <h2 className="h5 fw-bold mb-3">Recent Sales</h2>
            {orders.length === 0 ? (
              <p className="text-muted small mb-0">No sales yet.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="list-group-item d-flex justify-content-between align-items-center px-0"
                  >
                    <div>
                      <div className="fw-semibold small">
                        {order.recipeName}
                      </div>
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
