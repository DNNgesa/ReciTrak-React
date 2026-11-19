import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import { useInventory } from "../context/InventoryContext";
import RecipeCard from "../components/RecipeCard";
import RecipeForm from "../components/RecipeForm";
import CategoryFilterBar from "../components/CategoryFilterBar";

function RecipesPage() {
  const { recipes, setRecipes } = useRecipes();
  const { ingredients } = useInventory();
  const navigate = useNavigate();

  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  function getRecipeCost(bom) {
    return bom.reduce((sum, item) => {
      const ing = ingredients.find((i) => i.id === item.ingredientId);
      if (!ing) return sum;
      return sum + (ing.currentPackPrice / ing.packSize) * item.qty;
    }, 0);
  }

  function handleAddRecipe(savedRecipe) {
    setRecipes([...recipes, savedRecipe]);
    setShowNewForm(false);
    navigate(`/erp/recipes/${savedRecipe.id}`);
  }

  const categories = ["All", ...new Set(recipes.map((r) => r.category))];
  const filteredRecipes =
    selectedCategory === "All"
      ? recipes
      : recipes.filter((r) => r.category === selectedCategory);

  return (
    <div className="container pb-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Menu & Recipes Catalog</h1>
          <p className="text-muted mb-0">
            Click any recipe card to inspect its Bill of Materials, cost breakdown, or edit details.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowNewForm(!showNewForm)}
        >
          {showNewForm ? "Cancel" : "Add New Recipe"}
        </button>
      </div>

      {showNewForm && (
        <RecipeForm
          ingredients={ingredients}
          onSaveRecipe={handleAddRecipe}
          onCancel={() => setShowNewForm(false)}
        />
      )}

      <CategoryFilterBar
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      />

      <div className="row g-3">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            batchCost={getRecipeCost(recipe.bom)}
            isSelected={false}
            onSelect={(recipeId) => navigate(`/erp/recipes/${recipeId}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default RecipesPage;
