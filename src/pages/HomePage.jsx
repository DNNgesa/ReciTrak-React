import { Link } from "react-router-dom";
import restaurantImg from "../assets/restaurant.jpg";
import HowItWorks from "../components/HowItWorks";

function HomePage() {
  return (
    <div className="pb-5">
      <div
        className="position-relative text-white d-flex align-items-center justify-content-center text-center mb-5 shadow-sm"
        style={{ minHeight: "380px", overflow: "hidden" }}
      >
        <img
          src={restaurantImg}
          alt="ReciTrak Restaurant Overview"
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ objectFit: "cover", zIndex: 0 }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"
          style={{ zIndex: 1 }}
        ></div>

        <div className="container position-relative py-5" style={{ zIndex: 2 }}>
          <span className="badge bg-warning text-dark mb-2 px-3 py-2">
            Production & Supply Chain Intelligence
          </span>
          <h1 className="display-4 fw-bold mb-3">Your Recipe For Success</h1>
          <p className="lead mx-auto mb-4" style={{ maxWidth: "680px" }}>
            Transform standardized recipes, live supplier rates, and outlet sales
            into real-time operational profit.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-outline-light btn-lg px-4">
              Request Walkthrough
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-9">
            <h2 className="h3 fw-bold mb-3">About ReciTrak</h2>
            <p className="lead text-muted">
              ReciTrak is an advanced restaurant production and supply chain
              management platform designed to transform recipes and sales data
              into actionable operational intelligence.
            </p>
          </div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 p-4">
              <h3 className="h5 fw-bold mb-2">
                <i className="bi bi-graph-up-arrow text-primary me-2"></i>
                Real-Time Updates & Analysis
              </h3>
              <p className="small text-muted mb-0">
                Cross-references recipes with real-time sales data to optimize
                inventory, alert stakeholders, and implicitly track kitchen
                waste metrics.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 p-4">
              <h3 className="h5 fw-bold mb-2">
                <i className="bi bi-shield-check text-success me-2"></i>
                Information Integrity
              </h3>
              <p className="small text-muted mb-0">
                Establishes recipes as the single source of absolute truth,
                ensuring standardized training and strict production
                consistency.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 p-4">
              <h3 className="h5 fw-bold mb-2">
                <i className="bi bi-arrow-left-right text-warning me-2"></i>
                End-to-End Connection
              </h3>
              <p className="small text-muted mb-0">
                Bridges the kitchen to procurement via direct partner
                integration, dynamically updating supply chain resource costs.
              </p>
            </div>
          </div>
        </div>

        <HowItWorks />
      </div>
    </div>
  );
}

export default HomePage;
