import { databaseApi, defaultImg } from "../constants";

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
      await fetch(`${databaseApi}/ingredients/${row.ingredientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inKitchen: true }),
      });
      finalBom.push({ ingredientId: row.ingredientId, qty: row.qty });
    } else if (row.isNew && row.qty > 0) {
      const res = await fetch(`${databaseApi}/ingredients`, {
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
          inKitchen: true,
        }),
      });
      const savedIng = await res.json();
      newlyCreatedIngredients.push(savedIng);
      finalBom.push({ ingredientId: savedIng.id, qty: row.qty });
    }
  }

  const isEdit = Boolean(initialRecipe);
  const url = isEdit ? `${databaseApi}/recipes/${initialRecipe.id}` : `${databaseApi}/recipes`;

  const recipeRes = await fetch(url, {
    method: isEdit ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...(isEdit ? {} : { id: `rec-${Date.now()}` }),
      name: name.trim(),
      category,
      image: image.trim() || defaultImg,
      yieldServings: Number(yieldServings),
      sellingPriceBatch: Number(sellingPriceBatch),
      bom: finalBom,
    }),
  });

  const savedRecipe = await recipeRes.json();
  return { savedRecipe, newlyCreatedIngredients };
}
