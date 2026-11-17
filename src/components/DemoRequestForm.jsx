import { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../constants";

function DemoRequestForm() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [organization, setOrganization] = useState("");
  const [submittedUser, setSubmittedUser] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    const newRequest = {
      id: `demo-${Date.now()}`,
      fullName,
      phoneNumber,
      emailAddress,
      organization,
      submittedAt: new Date().toLocaleString(),
    };

    fetch(`${API_URL}/demoRequests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRequest),
    })
      .then((res) => res.json())
      .then((saved) => {
        setSubmittedUser(saved);
        setFullName("");
        setPhoneNumber("");
        setEmailAddress("");
        setOrganization("");
      });
  }

  return (
    <div className="card shadow-sm border-0 p-4 p-md-5">
      <h1 className="h3 fw-bold mb-2">Would you like a live demonstration?</h1>
      <p className="text-muted mb-4">
        Schedule a real-time, hands-on walkthrough with one of our product
        experts today and learn how we can optimize your restaurant operations.
      </p>

      {submittedUser && (
        <div className="alert alert-success mb-4">
          <h2 className="h6 fw-bold mb-1">
            <i className="bi bi-check-circle-fill me-2"></i>
            Thank you, {submittedUser.fullName}!
          </h2>
          <p className="small mb-2">
            Your walkthrough request for{" "}
            <strong>{submittedUser.organization}</strong> has been received. You
            can also explore the live system right now:
          </p>
          <Link to="/erp/recipes" className="btn btn-sm btn-success fw-semibold">
            Launch ReciTrak Demo →
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label fw-semibold">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Sunny Sky"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label fw-semibold">
            Phone Number
          </label>
          <input
            type="tel"
            className="form-control"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="+254 (0) 700 000 000"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="emailAddress" className="form-label fw-semibold">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="emailAddress"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
            placeholder="sunny.sky@company.com"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="organization" className="form-label fw-semibold">
            Organization / Restaurant Name
          </label>
          <input
            type="text"
            className="form-control"
            id="organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
            placeholder="Culinary Group Ltd"
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-100 fw-semibold py-2"
        >
          Request Demo
        </button>
      </form>
    </div>
  );
}

export default DemoRequestForm;
