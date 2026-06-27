"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { type ReactNode, useState } from "react";
import { theme } from "@/shared/theme/tokens";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </QueryClientProvider>
  );
}
