import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import type { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { CatalogSearch } from "@/containers/CatalogSearch/CatalogSearch";
import type { Product } from "@/shared/square/type";

// ── fixtures ──────────────────────────────────────────────────────────────────

const allProducts: Product[] = [
  {
    id: "p1",
    name: "Latte",
    description: "Espresso + steamed milk",
    variants: [{ id: "v1", name: "Small", priceCents: 400, currency: "USD" }],
  },
  {
    id: "p2",
    name: "Espresso",
    description: "Double shot",
    variants: [{ id: "v2", name: "Regular", priceCents: 300, currency: "USD" }],
  },
];

// ── MSW server (scoped to this file) ──────────────────────────────────────────

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── test helper ───────────────────────────────────────────────────────────────

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("CatalogSearch", () => {
  it("shows all initial products without any network fetch", () => {
    render(<CatalogSearch initialProducts={allProducts} />, { wrapper });

    expect(screen.getByText("Latte")).toBeInTheDocument();
    expect(screen.getByText("Espresso")).toBeInTheDocument();
  });

  it("queries the route handler when typed and shows filtered results", async () => {
    const user = userEvent.setup();

    server.use(
      http.get("/api/catalog", ({ request }) => {
        const q = new URL(request.url).searchParams.get("q") ?? "";
        const filtered = allProducts.filter((p) =>
          p.name.toLowerCase().includes(q.toLowerCase()),
        );
        return HttpResponse.json(filtered);
      }),
    );

    render(<CatalogSearch initialProducts={allProducts} />, { wrapper });

    // both visible initially
    expect(screen.getByText("Latte")).toBeInTheDocument();
    expect(screen.getByText("Espresso")).toBeInTheDocument();

    // type "latte" — debounce fires, query resolves, Espresso disappears
    await user.type(screen.getByRole("textbox"), "latte");
    await waitFor(() =>
      expect(screen.queryByText("Espresso")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Latte")).toBeInTheDocument();
  });
});
