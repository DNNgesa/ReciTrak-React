import { NavLink, Link } from "react-router-dom";
import { useInventory } from "../context/InventoryContext";

function NavBar() {
  const { lowStockCount } = useInventory();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/erp/recipes">
          <i className="bi bi-shop me-2 text-warning"></i>
          ReciTrak ERP 
        </NavLink>

        <div className="navbar-nav ms-auto d-flex flex-row flex-wrap align-items-center gap-2">
          <NavLink
            to="/erp/recipes"
            className={({ isActive }) =>
              "nav-link px-3 rounded " + (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
            <i className="bi bi-journal-richtext me-1"></i> Recipes & BOM
          </NavLink>

          <NavLink
            to="/erp/inventory"
            className={({ isActive }) =>
              "nav-link px-3 rounded " + (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
            <i className="bi bi-boxes me-1"></i> Inventory
          </NavLink>

          <NavLink
            to="/erp/restock"
            className={({ isActive }) =>
              "nav-link px-3 rounded " + (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
            <i className="bi bi-truck me-1"></i> Restock
            {lowStockCount > 0 && (
              <span className="badge bg-danger ms-2">{lowStockCount}</span>
            )}
          </NavLink>

          <NavLink
            to="/erp/pos"
            className={({ isActive }) =>
              "nav-link px-3 rounded " + (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
            <i className="bi bi-cash-register me-1"></i> POS
          </NavLink>

          <NavLink
          to="/erp/suppliers"
          className={({ isActive }) =>
            "nav-link px-3 rounded " + (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
            <i className="bi bi-building-add me-1"></i> Suppliers
          </NavLink>

          <Link to="/" className="btn btn-outline-light btn-sm ms-2">
            <i className="bi bi-house-door me-1"></i> Home
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
