import { NavLink } from "react-router-dom";
import { useErp } from "../context/ErpContext";

function NavBar() {
  const { lowStockCount } = useErp();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/recipes">
          <i className="bi bi-shop me-2 text-warning"></i>
          ReciTrak ERP 
        </NavLink>

        <div className="navbar-nav ms-auto d-flex flex-row flex-wrap gap-2">
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              "nav-link px-3 rounded " + (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
            <i className="bi bi-journal-richtext me-1"></i> Recipes & BOM Costing
          </NavLink>

          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              "nav-link px-3 rounded " + (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
            <i className="bi bi-boxes me-1"></i> Inventory & Suppliers
          </NavLink>

          <NavLink
            to="/restock"
            className={({ isActive }) =>
              "nav-link px-3 rounded " + (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
            <i className="bi bi-truck me-1"></i> Restock Matrix
            {lowStockCount > 0 && (
              <span className="badge bg-danger ms-2">{lowStockCount}</span>
            )}
          </NavLink>

          <NavLink
            to="/pos"
            className={({ isActive }) =>
              "nav-link px-3 rounded " + (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
            <i className="bi bi-cash-register me-1"></i> Point Of Sale
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
