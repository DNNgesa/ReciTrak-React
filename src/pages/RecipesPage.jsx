import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import RecipeBomTable from "../components/RecipeBomTable";
import NewRecipeForm from "../components/NewRecipeForm";

function RecipesPage() {
  const { recipes, setRecipes, ingredients } = useOutletContext();
  const [selectedId, setSelectedId] = useState("");
  const [showForm, setShowForm] = useState(false);

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

  function handleAddRecipe(savedRecipe) {
    setRecipes([...recipes, savedRecipe]);
    setSelectedId(savedRecipe.id);
    setShowForm(false);
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
        <NewRecipeForm
          ingredients={ingredients}
          onAddRecipe={handleAddRecipe}
        />
      )}

      <div className="row g-3 mb-4">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            batchCost={getRecipeCost(recipe.bom)}
            isSelected={activeRecipe?.id === recipe.id}
            onSelect={setSelectedId}
          />
        ))}
      </div>

      <RecipeBomTable
        recipe={activeRecipe}
        ingredients={ingredients}
        batchCost={activeRecipe ? getRecipeCost(activeRecipe.bom) : 0}
      />
    </div>
  );
}

export default RecipesPage;
