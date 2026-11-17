import { NavLink, Link } from "react-router-dom";

function PublicNavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          <i className="bi bi-shop me-2 text-warning"></i>
          ReciTrak 
        </NavLink>

        <div className="navbar-nav ms-auto d-flex flex-row flex-wrap align-items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "nav-link px-3 rounded " +
              (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
            <i className="bi bi-house-door me-1"></i> Home
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              "nav-link px-3 rounded " +
              (isActive ? "active bg-primary text-white fw-semibold" : "")
            }
          >
            <i className="bi bi-calendar-check me-1"></i> Request Walkthrough
          </NavLink>

          <Link to="/erp/recipes" className="btn btn-warning text-dark fw-semibold px-3 ms-1">
            <i className="bi bi-rocket-takeoff me-1"></i> Launch ERP
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavBar;
