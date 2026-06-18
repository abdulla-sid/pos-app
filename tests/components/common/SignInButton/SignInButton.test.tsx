import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SignInButton } from "@/components/composites/common/SignInButton/SignInButton";

vi.mock("@/shared/hooks/useAuth", () => ({
  useAuth: () => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
    session: null,
    isPending: false,
  }),
}));

describe("SignInButton", () => {
  it("renders the Square sign-in CTA", () => {
    render(<SignInButton />);
    expect(
      screen.getByRole("button", { name: /sign in with square/i }),
    ).toBeInTheDocument();
  });
});
