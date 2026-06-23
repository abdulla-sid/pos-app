import { describe, expect, it } from "vitest";
import fixture from "../../fixtures/catalog-list.json";
import { mapCatalog } from "@/shared/square/mappers";
import type { Variant, Product } from "@/shared/square/type";

describe("mapCatalog", () => {
  it("maps square ITEM objects to lean Product view models", () => {
    const products = mapCatalog((fixture as { objects: any[] }).objects ?? []);
    const latte = products.find((p: Product) => p.name === "Latte");
    expect(latte).toBeDefined();
    expect(latte?.variants).toHaveLength(2);
    expect(latte?.variants.map((v: Variant) => v.priceCents).sort()).toEqual([
      400, 500,
    ]);
    expect(latte?.variants[0]?.currency).toBe("USD");
  });
});
