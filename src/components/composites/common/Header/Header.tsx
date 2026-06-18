"use client";

import { Button, Space, Typography } from "antd";
import { useAuth } from "@/shared/hooks/useAuth";

export function Header() {
  const { session, signOut } = useAuth();
  return (
    <Space
      style={{
        width: "100%",
        justifyContent: "space-between",
        padding: "12px 24px",
      }}
    >
      <Typography.Text>{session?.user.name ?? "…"}</Typography.Text>
      <Button onClick={() => signOut()}>Sign Out</Button>
    </Space>
  );
}
