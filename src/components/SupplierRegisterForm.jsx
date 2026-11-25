import { useState } from "react";
import { databaseApi } from "../constants";

function SupplierRegisterForm({ onSupplierCreated }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [leadTimeDays, setLeadTimeDays] = useState(1);
  const [lat, setLat] = useState("-1.2684");
  const [lng, setLng] = useState("36.8112");

  function handleSubmit(e) {
    e.preventDefault();

    const newSupplier = {
      id: `sup-${Date.now()}`,
      name: name.trim(),
      address: address.trim(),
      leadTimeDays: Number(leadTimeDays),
      lat: Number(lat),
      lng: Number(lng),
    };

    fetch(`${databaseApi}/suppliers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSupplier),
    })
      .then((res) => res.json())
      .then((saved) => {
        onSupplierCreated(saved);
        setName("");
        setAddress("");
      });
  }

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label className="form-label small fw-semibold">Business Name</label>
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold">Nairobi Address</label>
        <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold">Lead Time (Days)</label>
        <input type="number" className="form-control" min="1" value={leadTimeDays} onChange={(e) => setLeadTimeDays(e.target.value)} required />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold">Latitude</label>
        <input type="number" step="any" className="form-control" value={lat} onChange={(e) => setLat(e.target.value)} required />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold">Longitude</label>
        <input type="number" step="any" className="form-control" value={lng} onChange={(e) => setLng(e.target.value)} required />
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-primary">Save Supplier</button>
      </div>
    </form>
  );
}

export default SupplierRegisterForm;
