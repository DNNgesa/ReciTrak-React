function RestockRow({ ingredient, supplier, packs, onPackChange, onApprove }) {
  const restockQty = packs * ingredient.packSize;
  const lineTotal = packs * ingredient.currentPackPrice;

  return (
    <tr>
      <td className="fw-bold">{ingredient.name}</td>

      <td>
        <div>{supplier?.name}</div>
        <small className="text-muted">
          Lead time: {supplier?.leadTimeDays} day(s)
        </small>
      </td>

      <td>
        <span className="badge bg-danger">
          {ingredient.stockQty} {ingredient.unit}
        </span>{" "}
        <small className="text-muted">
          / Min {ingredient.reorderLevel} {ingredient.unit}
        </small>
      </td>

      <td style={{ width: "130px" }}>
        <input
          type="number"
          className="form-control form-control-sm"
          min="1"
          value={packs}
          onChange={(e) => onPackChange(ingredient.id, e.target.value)}
        />
      </td>

      <td className="text-success fw-semibold">
        +{restockQty} {ingredient.unit}
      </td>

      <td className="fw-bold">KES {lineTotal.toFixed(2)}</td>

      <td className="text-end">
        <button
          className="btn btn-sm btn-success"
          onClick={() => onApprove(ingredient)}
        >
          Approve
        </button>
      </td>
    </tr>
  );
}

export default RestockRow;
