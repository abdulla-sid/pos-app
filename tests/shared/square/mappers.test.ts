import { describe, expect, it } from "vitest";
import { mapCatalog } from "@/shared/square/mappers";
import type { Product, Variant } from "@/shared/square/type";
import fixture from "../../fixtures/catalog-list.json";

describe("mapCatalog", () => {
  it("maps square ITEM objects to lean Product view models", () => {
    const products = mapCatalog(
      (fixture as { objects: Parameters<typeof mapCatalog>[0] }).objects ?? [],
    );
    const latte = products.find((p: Product) => p.name === "Latte");
    expect(latte).toBeDefined();
    expect(latte?.variants).toHaveLength(2);
    expect(latte?.variants.map((v: Variant) => v.priceCents).sort()).toEqual([
      400, 500,
    ]);
    expect(latte?.variants[0]?.currency).toBe("USD");
  });
});
