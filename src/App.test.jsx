import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import CategoryFilterBar from "./components/CategoryFilterBar";
import RecipeBomTable from "./components/RecipeBomTable";
import PosMenuCard from "./components/PosMenuCard";

describe("ReciTrak Core Components", () => {
  it("renders category pills and triggers onSelectCategory when clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <CategoryFilterBar
        categories={["All", "Cookies", "Cakes & Cheesecakes"]}
        selectedCategory="All"
        onSelectCategory={handleSelect}
      />
    );

    const cookiesPill = screen.getByRole("button", { name: "Cookies" });
    await user.click(cookiesPill);

    expect(handleSelect).toHaveBeenCalledWith("Cookies");
  });

  it("calculates ingredient line costs and gross profit accurately in RecipeBomTable", () => {
    const mockRecipe = {
      id: "rec-test",
      name: "Classic Butter Shortbread",
      yieldServings: 16,
      sellingPriceBatch: 1800,
      bom: [{ ingredientId: "ing-butter", qty: 250 }],
    };

    const mockIngredients = [
      {
        id: "ing-butter",
        name: "Daima Unsalted Butter",
        unit: "g",
        packSize: 500,
        currentPackPrice: 600,
      },
    ];

    render(
      <RecipeBomTable
        recipe={mockRecipe}
        ingredients={mockIngredients}
        batchCost={300}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText(/Classic Butter Shortbread/)).toBeInTheDocument();
    expect(screen.getByText("KES 300.00")).toBeInTheDocument();
    expect(screen.getByText(/Gross Profit: KES 1500.00/)).toBeInTheDocument();
  });

  it("disables the POS button when ingredients are out of stock", () => {
    const mockRecipe = {
      id: "rec-test",
      name: "Tiramisu",
      category: "Chilled Desserts",
      yieldServings: 8,
      sellingPriceBatch: 3200,
      image: "",
    };

    render(
      <PosMenuCard recipe={mockRecipe} inStock={false} onSell={vi.fn()} />
    );

    const sellBtn = screen.getByRole("button", { name: "Out of Stock" });
    expect(sellBtn).toBeDisabled();
  });
});
