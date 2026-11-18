import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import { useInventory } from "../context/InventoryContext";
import { API_URL } from "../constants";
import RecipeCard from "../components/RecipeCard";
import RecipeBomTable from "../components/RecipeBomTable";
import NewRecipeForm from "../components/NewRecipeForm";
import EditRecipeForm from "../components/EditRecipeForm";

function RecipesPage() {
  const { recipes, setRecipes } = useRecipes();
  const { ingredients } = useInventory();  
  const { id } = useParams();
  const navigate = useNavigate();

  const [showNewForm, setShowNewForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Calculate total KES cost of a recipe's Bill of Materials
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

  // CREATE: Add newly saved recipe and navigate to its dynamic URL
  function handleAddRecipe(savedRecipe) {
    setRecipes([...recipes, savedRecipe]);
    setShowNewForm(false);
    navigate(`/erp/recipes/${savedRecipe.id}`);
  }

  // UPDATE: Replace edited recipe in state
  function handleUpdateRecipe(updatedRecipe) {
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );
    setIsEditing(false);
  }

  // DELETE: Remove recipe from db.json and navigate to remaining recipe
  function handleDeleteRecipe(recipeToDelete) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${recipeToDelete.name}"?`
    );
    if (!confirmed) return;

    fetch(`${API_URL}/recipes/${recipeToDelete.id}`, {
      method: "DELETE",
    }).then(() => {
      const remaining = recipes.filter((r) => r.id !== recipeToDelete.id);
      setRecipes(remaining);
      setIsEditing(false);

      if (remaining.length > 0) {
        navigate(`/erp/recipes/${remaining[0].id}`);
      } else {
        navigate("/erp/recipes");
      }
    });
  }

  // Match recipe from dynamic URL parameter (:id), or default to the first recipe
  const activeRecipe = recipes.find((r) => r.id === id) || recipes[0];

  return (
    <div className="container pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Recipes & Bill of Materials (BOM)</h1>
          <p className="text-muted mb-0">
            Click any card to inspect, edit, or delete its recipe BOM.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowNewForm(!showNewForm);
            setIsEditing(false);
          }}
        >
          {showNewForm ? "Cancel" : "+ Add New Recipe"}
        </button>
      </div>

      {showNewForm && (
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
            onSelect={(recipeId) => {
              navigate(`/erp/recipes/${recipeId}`);
              setIsEditing(false);
            }}
          />
        ))}
      </div>

      {isEditing && activeRecipe ? (
        <EditRecipeForm
          recipe={activeRecipe}
          ingredients={ingredients}
          onUpdateRecipe={handleUpdateRecipe}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <RecipeBomTable
          recipe={activeRecipe}
          ingredients={ingredients}
          batchCost={activeRecipe ? getRecipeCost(activeRecipe.bom) : 0}
          onEdit={() => {
            setIsEditing(true);
            setShowNewForm(false);
          }}
          onDelete={handleDeleteRecipe}
        />
      )}
    </div>
  );
}

export default RecipesPage;
