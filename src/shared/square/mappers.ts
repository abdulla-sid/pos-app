import type { Product, Variant } from "./type";

type SquareMoney = { amount?: number; currency?: string };
type SquareVariation = {
  id: string;
  item_variation_data: { name?: string; price_money?: SquareMoney };
};
type SquareCatalogObject = {
  type: string;
  id: string;
  item_data?: {
    name?: string;
    description?: string;
    variations?: SquareVariation[];
  };
};

export function mapCatalog(objects: SquareCatalogObject[]): Product[] {
  return objects
    .filter((o) => o.type === "ITEM" && o.item_data)
    .map((o) => ({
      id: o.id,
      name: o.item_data?.name ?? "(unnamed)",
      description: o.item_data?.description,
      variants: (o.item_data?.variations ?? []).map<Variant>((v) => ({
        id: v.id,
        name: v.item_variation_data?.name ?? "(default)",
        priceCents: v.item_variation_data?.price_money?.amount ?? 0,
        currency: v.item_variation_data?.price_money?.currency ?? "USD",
      })),
    }));
}
