function BomRowInput({
  row,
  index,
  ingredients,
  suppliers,
  canRemove,
  onChange,
  onToggleNew,
  onRemove,
}) {
  return (
    <div className="card bg-light border p-3 mb-2">
      <div className="row g-2 align-items-center">
        <div className="col-md-7">
          {row.isNew ? (
            <input
              type="text"
              className="form-control"
              placeholder="New ingredient name (e.g. Roasted Hazelnuts)"
              value={row.newName}
              onChange={(e) => onChange(index, "newName", e.target.value)}
              required
            />
          ) : (
            <select
              className="form-select"
              value={row.ingredientId}
              onChange={(e) => onChange(index, "ingredientId", e.target.value)}
            >
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name} ({ing.unit}) — KES {ing.currentPackPrice} per{" "}
                  {ing.packSize}
                  {ing.unit}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Qty"
            value={row.qty}
            onChange={(e) => onChange(index, "qty", e.target.value)}
            min="1"
            required
          />
        </div>

        <div className="col-md-3 d-flex gap-1">
          <button
            type="button"
            className={`btn btn-sm flex-grow-1 ${
              row.isNew ? "btn-warning" : "btn-outline-primary"
            }`}
            onClick={() => onToggleNew(index)}
          >
            {row.isNew ? "Use Existing" : "+ New Item"}
          </button>
          {canRemove && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => onRemove(index)}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {row.isNew && (
        <div className="row g-2 mt-2 pt-2 border-top">
          <div className="col-md-4">
            <small className="text-muted d-block">Supplier</small>
            <select
              className="form-select form-select-sm"
              value={row.supplierId}
              onChange={(e) => onChange(index, "supplierId", e.target.value)}
            >
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <small className="text-muted d-block">Unit</small>
            <select
              className="form-select form-select-sm"
              value={row.unit}
              onChange={(e) => onChange(index, "unit", e.target.value)}
            >
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="pcs">pcs</option>
            </select>
          </div>

          <div className="col-md-3">
            <small className="text-muted d-block">Pack Size</small>
            <input
              type="number"
              className="form-control form-control-sm"
              min="1"
              value={row.packSize}
              onChange={(e) => onChange(index, "packSize", e.target.value)}
              required
            />
          </div>

          <div className="col-md-3">
            <small className="text-muted d-block">Pack Price (KES)</small>
            <input
              type="number"
              className="form-control form-control-sm"
              min="1"
              value={row.packPrice}
              onChange={(e) => onChange(index, "packPrice", e.target.value)}
              required
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BomRowInput;
