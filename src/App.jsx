import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import RecipesPage from "./pages/RecipesPage";
import InventoryPage from "./pages/InventoryPage";
import RestockPage from "./pages/RestockPage";
import PosPage from "./pages/PosPage";

function Layout({ sharedData }) {
  const lowStockCount = sharedData.ingredients.filter(
    (item) => item.stockQty <= item.reorderLevel
  ).length;

  return (
    <div className="min-vh-100 bg-light">
      <NavBar lowStockCount={lowStockCount} />
      <Outlet context={sharedData} />
    </div>
  );
}

function App() {
  const [suppliers, setSuppliers] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/suppliers")
      .then((res) => res.json())
      .then((data) => setSuppliers(data));

    fetch("http://localhost:4000/ingredients")
      .then((res) => res.json())
      .then((data) => setIngredients(data));

    fetch("http://localhost:4000/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data));

    fetch("http://localhost:4000/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  const sharedData = {
    suppliers,
    ingredients,
    setIngredients,
    recipes,
    setRecipes,
    orders,
    setOrders,
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout sharedData={sharedData} />}>
          <Route path="/" element={<Navigate to="/recipes" replace />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/restock" element={<RestockPage />} />
          <Route path="/pos" element={<PosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
