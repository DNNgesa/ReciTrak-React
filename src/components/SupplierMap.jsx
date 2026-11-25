import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { kitchenLocation, deliveryPricing } from "../constants";
import { getDeliveryQuote } from "../utils/deliveryApi";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function SupplierMap({ suppliers, quotesBySupplier }) {
  const mappedSuppliers = suppliers.filter((s) => s.lat && s.lng);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [activeQuote, setActiveQuote] = useState(null);

  const activeId = selectedSupplierId || mappedSuppliers[0]?.id || "";
  const selectedSupplier = mappedSuppliers.find((s) => s.id === activeId);

  useEffect(() => {
    if (!selectedSupplier) return;

    if (quotesBySupplier?.[selectedSupplier.id]) {
      setActiveQuote(quotesBySupplier[selectedSupplier.id]);
      return;
    }

    let cancelled = false;
    getDeliveryQuote(kitchenLocation, selectedSupplier).then((quote) => {
      if (!cancelled) setActiveQuote(quote);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedSupplier, quotesBySupplier]);

  if (mappedSuppliers.length === 0) return null;

  return (
    <div className="card shadow-sm border-0 mb-4 overflow-hidden">
      <div className="card-header bg-dark text-white d-flex flex-wrap justify-content-between align-items-center gap-2 py-3">
        <div>
          <h2 className="h6 fw-bold mb-0">
            <i className="bi bi-geo-alt-fill text-danger me-2"></i>
            Supplier Network & Delivery Distance Calculator
          </h2>
          <small className="text-white-50">
            Origin: {kitchenLocation.name} • Rate: KES {deliveryPricing.baseFeeKes} base + KES {deliveryPricing.ratePerKmKes}/km
          </small>
        </div>

        <select
          className="form-select form-select-sm w-auto"
          value={activeId}
          onChange={(e) => setSelectedSupplierId(e.target.value)}
        >
          {mappedSuppliers.map((sup) => (
            <option key={sup.id} value={sup.id}>
              {sup.name}
            </option>
          ))}
        </select>
      </div>

      <div className="row g-0">
        <div className="col-lg-8" style={{ height: "300px" }}>
          <MapContainer
            center={[kitchenLocation.lat, kitchenLocation.lng]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[kitchenLocation.lat, kitchenLocation.lng]}>
              <Popup>
                <strong>{kitchenLocation.name}</strong>
                <br />
                {kitchenLocation.address}
              </Popup>
            </Marker>

            {mappedSuppliers.map((sup) => (
              <Marker
                key={sup.id}
                position={[sup.lat, sup.lng]}
                eventHandlers={{
                  click: () => setSelectedSupplierId(sup.id),
                }}
              >
                <Popup>
                  <strong>{sup.name}</strong>
                  <br />
                  {sup.address || "Nairobi Supplier"}
                  <br />
                  Lead Time: {sup.leadTimeDays} day(s)
                </Popup>
              </Marker>
            ))}

            {selectedSupplier && (
              <Polyline
                positions={[
                  [kitchenLocation.lat, kitchenLocation.lng],
                  [selectedSupplier.lat, selectedSupplier.lng],
                ]}
                pathOptions={{ color: "#0d6efd", weight: 4, dashArray: "6, 8" }}
              />
            )}
          </MapContainer>
        </div>

        <div className="col-lg-4 bg-light p-4 d-flex flex-column justify-content-center border-start">
          {selectedSupplier && activeQuote ? (
            <>
              <span className="badge bg-primary-subtle text-primary-emphasis align-self-start mb-2">
                Selected Vendor Route
              </span>
              <h3 className="h5 fw-bold mb-1">{selectedSupplier.name}</h3>
              <p className="text-muted small mb-3">
                {selectedSupplier.address || "Nairobi, Kenya"}
              </p>

              <div className="d-flex justify-content-between border-bottom py-2">
                <span className="text-muted small">Road Distance</span>
                <span className="fw-bold">{activeQuote.distanceKm} km</span>
              </div>
              <div className="d-flex justify-content-between border-bottom py-2">
                <span className="text-muted small">Est. Drive Time</span>
                <span className="fw-bold">{activeQuote.durationMins} mins</span>
              </div>
              <div className="d-flex justify-content-between py-2">
                <span className="text-muted small">Delivery Fee</span>
                <span className="fw-bold text-success fs-6">
                  KES {activeQuote.deliveryFeeKes.toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <p className="text-muted small mb-0">Calculating route...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SupplierMap;
