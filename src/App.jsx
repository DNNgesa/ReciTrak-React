import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ErpProvider } from "./context/ErpContext";
import PublicNavBar from "./components/PublicNavBar";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import RecipesPage from "./pages/RecipesPage";
import InventoryPage from "./pages/InventoryPage";
import RestockPage from "./pages/RestockPage";
import PosPage from "./pages/PosPage";

function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light" style={{ paddingTop: "56px" }}>
      <PublicNavBar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function ErpLayout() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light" style={{ paddingTop: "80px" }}>
      <NavBar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErpProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route path="/erp" element={<ErpLayout />}>
            <Route index element={<Navigate to="/erp/recipes" replace />} />
            <Route path="recipes" element={<RecipesPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="restock" element={<RestockPage />} />
            <Route path="pos" element={<PosPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErpProvider>
  );
}

export default App;
