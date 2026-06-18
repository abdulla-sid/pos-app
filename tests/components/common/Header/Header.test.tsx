import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Header } from "@/components/composites/common/Header/Header";

const useAuthMock = vi.hoisted(() => vi.fn());
vi.mock("@/shared/hooks/useAuth", () => ({ useAuth: useAuthMock }));

describe("Header", () => {
  it("shows the merchant name when signed in", () => {
    useAuthMock.mockReturnValue({
      session: { user: { name: "Acme Coffee" } },
      isPending: false,
      signOut: vi.fn(),
    });
    render(<Header />);
    expect(screen.getByText("Acme Coffee")).toBeInTheDocument();
  });

  it("falls back to the placeholder with no session", () => {
    useAuthMock.mockReturnValue({
      session: null,
      isPending: true,
      signOut: vi.fn(),
    });
    render(<Header />);
    expect(screen.getByText("…")).toBeInTheDocument();
  });
});
