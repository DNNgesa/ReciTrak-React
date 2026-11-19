import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import { useInventory } from "../context/InventoryContext";
import { databaseApi } from "../constants";
import RecipeBomTable from "../components/RecipeBomTable";
import RecipeForm from "../components/RecipeForm";

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, setRecipes } = useRecipes();
  const { ingredients } = useInventory();
  const [isEditing, setIsEditing] = useState(false);

  const recipe = recipes.find((r) => r.id === id);

  function getRecipeCost(bom) {
    return bom.reduce((sum, item) => {
      const ing = ingredients.find((i) => i.id === item.ingredientId);
      if (!ing) return sum;
      return sum + (ing.currentPackPrice / ing.packSize) * item.qty;
    }, 0);
  }

  function handleUpdateRecipe(updatedRecipe) {
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );
    setIsEditing(false);
  }

  function handleDeleteRecipe(recipeToDelete) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${recipeToDelete.name}"?`
    );
    if (!confirmed) return;

    fetch(`${databaseApi}/recipes/${recipeToDelete.id}`, {
      method: "DELETE",
    }).then(() => {
      setRecipes(recipes.filter((r) => r.id !== recipeToDelete.id));
      navigate("/erp/recipes");
    });
  }

  if (recipes.length === 0) {
    return <div className="container py-5 text-muted">Loading recipe...</div>;
  }

  if (!recipe) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h2 className="h5 fw-bold">Recipe Not Found</h2>
          <p className="mb-3">
            No menu item matches ID <code>{id}</code>.
          </p>
          <Link to="/erp/recipes" className="btn btn-primary btn-sm">
            Back to All Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/erp/recipes" className="btn btn-outline-secondary btn-sm">
          Back to All Items
        </Link>
        <span className="badge bg-secondary">{recipe.category}</span>
      </div>

      {isEditing ? (
        <RecipeForm
          initialRecipe={recipe}
          ingredients={ingredients}
          onSaveRecipe={handleUpdateRecipe}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <RecipeBomTable
          recipe={recipe}
          ingredients={ingredients}
          batchCost={getRecipeCost(recipe.bom)}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDeleteRecipe}
        />
      )}
    </div>
  );
}

export default RecipeDetailPage;
