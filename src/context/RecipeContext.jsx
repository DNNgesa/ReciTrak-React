import { createContext, useContext, useEffect, useState } from "react";
import { databaseApi } from "../constants";

const RecipeContext = createContext();

export function useRecipes() {
  return useContext(RecipeContext);
}

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`${databaseApi}/recipes`)
      .then((res) => res.json())
      .then((data) => setRecipes(data));
  }, []);

  const value = {
    recipes,
    setRecipes,
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
}
