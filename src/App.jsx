import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ErpProvider } from "./context/ErpContext";
import NavBar from "./components/NavBar";
import RecipesPage from "./pages/RecipesPage";
import InventoryPage from "./pages/InventoryPage";
import RestockPage from "./pages/RestockPage";
import PosPage from "./pages/PosPage";

function Layout() {
  return (
    <div className="min-vh-100 bg-light">
      <NavBar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <ErpProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/recipes" replace />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/restock" element={<RestockPage />} />
            <Route path="/pos" element={<PosPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErpProvider>
  );
}

export default App;
