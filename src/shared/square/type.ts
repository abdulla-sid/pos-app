export type Variant = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
};
export type Product = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  variants: Variant[];
};
