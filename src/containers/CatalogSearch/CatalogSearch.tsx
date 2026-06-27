"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Input } from "antd";
import { useEffect, useState } from "react";
import { ProductGrid } from "@/containers/ProductGrid/ProductGrid";
import type { Product } from "@/shared/square/type";

function useDebounce(value: string, ms: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

type Props = { initialProducts: Product[] };

export function CatalogSearch({ initialProducts }: Props) {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);

  const { data: searchResults } = useQuery<Product[]>({
    queryKey: ["catalog", debouncedQ],
    queryFn: async () => {
      const res = await fetch(
        `/api/catalog?q=${encodeURIComponent(debouncedQ)}`,
      );
      if (!res.ok) throw new Error(`catalog search failed: ${res.status}`);
      return res.json();
    },
    enabled: debouncedQ.length > 0,
    placeholderData: keepPreviousData,
  });

  const products = debouncedQ
    ? (searchResults ?? initialProducts)
    : initialProducts;

  return (
    <>
      <Input
        placeholder="Search products…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        allowClear
        style={{ marginBottom: 16, maxWidth: 400 }}
      />
      <ProductGrid products={products} />
    </>
  );
}
