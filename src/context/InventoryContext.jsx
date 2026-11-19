import { createContext, useContext, useEffect, useState } from "react";
import { databaseApi } from "../constants";

const InventoryContext = createContext();

export function useInventory() {
  return useContext(InventoryContext);
}

export function InventoryProvider({ children }) {
  const [suppliers, setSuppliers] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch(`${databaseApi}/suppliers`)
      .then((res) => res.json())
      .then((data) => setSuppliers(data));

    fetch(`${databaseApi}/ingredients`)
      .then((res) => res.json())
      .then((data) => setIngredients(data));
  }, []);

  const lowStockCount = ingredients.filter(
    (item) => item.stockQty <= item.reorderLevel
  ).length;

  const value = {
    suppliers,
    setSuppliers,
    ingredients,
    setIngredients,
    lowStockCount,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}
