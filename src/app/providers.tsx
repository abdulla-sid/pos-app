"use client";

import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { theme } from "@/shared/theme/tokens";

export function Providers({ children }: { children: ReactNode }) {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
