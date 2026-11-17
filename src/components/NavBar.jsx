import { NavLink } from "react-router-dom";

function NavBar({ lowStockCount }) {
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
             BOM Costing
          </NavLink>

          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              "nav-link px-3 rounded " + (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
             Inventory & Suppliers
          </NavLink>

          <NavLink
            to="/restock"
            className={({ isActive }) =>
              "nav-link px-3 rounded " + (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
             Restock
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
             Point Of Sale
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
