import { Link } from "react-router-dom";
import restaurantImg from "../assets/restaurant.jpg";
import step1Img from "../assets/step1.jpg";
import step2Img from "../assets/step2.jpg";
import step3Img from "../assets/step3.jpg";
import step4Img from "../assets/step4.jpg";

function HomePage() {
  const steps = [
    {
      number: 1,
      title: "Precision Financial Control and Menu Engineering",
      text: "ReciTrak builds a bulletproof financial foundation for your culinary business. The platform automatically determines your exact Cost of Goods Sold (COGS) based on your core recipes and calculates true menu item profitability.",
      image: step1Img,
      alt: "Financial Control",
    },
    {
      number: 2,
      title: "Dynamic Production and Dynamic Recipe Management",
      text: "Culinary environments require flexibility. ReciTrak allows managers to save and recall distinct recipe variations tailored for catering events, seasonal shifts, or ingredient shortages while serving as a standardized training tool.",
      image: step2Img,
      alt: "Recipe Management",
    },
    {
      number: 3,
      title: "Automated, High-Efficiency Supply Chain Integration",
      text: "ReciTrak bridges the gap between kitchen production and procurement. The platform continuously updates resource costs through direct integrations with supply chain partners and triggers automated restock indents.",
      image: step3Img,
      alt: "Supply Chain Integrations Network UI",
    },
    {
      number: 4,
      title: "Operational Analytics & Growth",
      text: "Review cross-department analytics to scale performance milestones smoothly, streamline operational structures, and track long-term financial metrics seamlessly.",
      image: step4Img,
      alt: "Analytics Graphs Screen UI",
    },
  ];

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
          <h1 className="display-4 fw-bold mb-3">Your Recipe For Success</h1>
          <p className="lead mx-auto mb-4" style={{ maxWidth: "680px" }}>
            Transform standardized recipes, live supplier rates and on-location sales into real-time operational profit.
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
              ReciTrak is an advanced restaurant production and supply chain management platform designed to transform recipes and sales data into actionable operational intelligence.
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
                Cross-references recipes with real-time sales data to optimize inventory, alert stakeholders, and implicitly track kitchen waste metrics.
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
                Establishes recipes as the single source of absolute truth, ensuring standardized training and strict production consistency.
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
                Bridges the kitchen to procurement via direct partner integration, dynamically updating supply chain resource costs.
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center pt-3">
          <div className="col-lg-10">
            <h2 className="h3 fw-bold text-center mb-2">How It Works</h2>
            <p className="text-center text-muted mb-4">
              Our platform simplifies your workflow by automating reconciliation processes through a seamless, 4-step pipeline:
            </p>

            <div className="d-flex flex-column gap-4">
              {steps.map((step) => (
                <div className="card shadow-sm border-0 p-4" key={step.number}>
                  <div className="row g-4 align-items-center">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <span className="badge bg-primary rounded-circle fs-6 px-3 py-2">
                          {step.number}
                        </span>
                        <h3 className="h5 fw-bold mb-0">{step.title}</h3>
                      </div>
                      <p className="text-muted small mb-0">{step.text}</p>
                    </div>

                    <div className="col-md-4 text-center">
                      <img
                        src={step.image}
                        alt={step.alt}
                        className="img-fluid rounded border shadow-sm"
                        style={{ maxHeight: "170px", objectFit: "cover" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
