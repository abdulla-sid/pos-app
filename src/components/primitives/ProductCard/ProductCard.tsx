"use client";

import { Button, Card, Typography } from "antd";
import type { Product } from "@/shared/square/type";

const { Text } = Typography;

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

type Props = {
  product: Product;
  onAdd: (args: { variantId: string }) => void;
};

export function ProductCard({ product, onAdd }: Props) {
  return (
    <Card title={product.name} style={{ height: "100%" }}>
      {product.description && (
        <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
          {product.description}
        </Text>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {product.variants.map((variant) => (
          <div
            key={variant.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <Text>{variant.name}</Text>

            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Text strong>{formatCents(variant.priceCents)}</Text>
              <Button
                type="primary"
                size="small"
                aria-label={`Add ${product.name} ${variant.name}`}
                onClick={() => onAdd({ variantId: variant.id })}
              >
                Add
              </Button>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
