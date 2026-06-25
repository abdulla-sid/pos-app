"use client";
import { Col, Row } from "antd";
import { ProductCard } from "@/components/primitives/ProductCard/ProductCard";
import type { Product } from "@/shared/square/type";

type Props = {
  products: Product[];
  onAdd?: (args: { variantId: string }) => void;
};

export function ProductGrid({ products, onAdd = () => {} }: Props) {
  return (
    <Row gutter={[16, 16]}>
      {products.map((p) => (
        <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
          <ProductCard product={p} onAdd={onAdd} />
        </Col>
      ))}
    </Row>
  );
}
