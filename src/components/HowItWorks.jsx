import step1Img from "../assets/step1.jpg";
import step2Img from "../assets/step2.jpg";
import step3Img from "../assets/step3.jpg";
import step4Img from "../assets/step4.jpg";

const STEPS = [
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

function HowItWorks() {
  return (
    <div className="row justify-content-center pt-3">
      <div className="col-lg-10">
        <h2 className="h3 fw-bold text-center mb-2">How It Works</h2>
        <p className="text-center text-muted mb-4">
          Our platform simplifies your workflow by automating reconciliation
          processes through a seamless, 4-step pipeline:
        </p>

        <div className="d-flex flex-column gap-4">
          {STEPS.map((step) => (
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
  );
}

export default HowItWorks;
