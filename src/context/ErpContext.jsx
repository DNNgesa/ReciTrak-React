import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../constants";

const ErpContext = createContext();

// 2. Create a custom hook so pages can easily read the context
export function useErp() {
  return useContext(ErpContext);
}

// 3. Create the Provider component that holds shared state and fetches data
export function ErpProvider({ children }) {
  const [suppliers, setSuppliers] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/suppliers`)
      .then((res) => res.json())
      .then((data) => setSuppliers(data));

    fetch(`${API_URL}/ingredients`)
      .then((res) => res.json())
      .then((data) => setIngredients(data));

    fetch(`${API_URL}/recipes`)
      .then((res) => res.json())
      .then((data) => setRecipes(data));

    fetch(`${API_URL}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  // Automatically calculate low-stock count for the NavBar badge
  const lowStockCount = ingredients.filter(
    (item) => item.stockQty <= item.reorderLevel
  ).length;

  const value = {
    suppliers,
    ingredients,
    setIngredients,
    recipes,
    setRecipes,
    orders,
    setOrders,
    lowStockCount,
  };

  return <ErpContext.Provider value={value}>{children}</ErpContext.Provider>;
}
