import { API_URL, DEFAULT_IMAGE } from "../constants";

export async function saveRecipeWithIngredients({
  initialRecipe,
  name,
  category,
  image,
  yieldServings,
  sellingPriceBatch,
  bomList,
  defaultSupplierId,
}) {
  const newlyCreatedIngredients = [];
  const finalBom = [];

  for (const row of bomList) {
    if (!row.isNew && row.qty > 0) {
      finalBom.push({ ingredientId: row.ingredientId, qty: row.qty });
    } else if (row.isNew && row.qty > 0) {
      const res = await fetch(`${API_URL}/ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `ing-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: row.newName.trim(),
          supplierId: row.supplierId || defaultSupplierId || "sup-1",
          unit: row.unit,
          packSize: row.packSize || 1000,
          currentPackPrice: row.packPrice || 100,
          previousPackPrice: row.packPrice || 100,
          stockQty: 0,
          reorderLevel: row.packSize || 500,
        }),
      });
      const savedIng = await res.json();
      newlyCreatedIngredients.push(savedIng);
      finalBom.push({ ingredientId: savedIng.id, qty: row.qty });
    }
  }

  const isEdit = Boolean(initialRecipe);
  const url = isEdit ? `${API_URL}/recipes/${initialRecipe.id}` : `${API_URL}/recipes`;

  const recipeRes = await fetch(url, {
    method: isEdit ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...(isEdit ? {} : { id: `rec-${Date.now()}` }),
      name: name.trim(),
      category,
      image: image.trim() || DEFAULT_IMAGE,
      yieldServings: Number(yieldServings),
      sellingPriceBatch: Number(sellingPriceBatch),
      bom: finalBom,
    }),
  });

  const savedRecipe = await recipeRes.json();
  return { savedRecipe, newlyCreatedIngredients };
}
