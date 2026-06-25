import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "@/components/primitives/ProductCard/ProductCard";
import type { Product } from "@/shared/square/type";

const latte: Product = {
  id: "test-latte",
  name: "Latte",
  description: "Espresso + steamed milk",
  variants: [
    { id: "v-small", name: "Small", priceCents: 400, currency: "USD" },
    { id: "v-large", name: "Large", priceCents: 500, currency: "USD" },
  ],
};

describe("ProductCard", () => {
  it("renders product name, formatted price, and an Add button per variant", () => {
    render(<ProductCard product={latte} onAdd={() => {}} />);

    expect(screen.getByText("Latte")).toBeInTheDocument();
    expect(screen.getByText("$4.00")).toBeInTheDocument();
    expect(screen.getByText("$5.00")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /add/i })).toHaveLength(2);
  });
});
