"use client";
import { Button } from "antd";
import { useAuth } from "@/shared/hooks/useAuth";

export function SignInButton() {
  const { signIn } = useAuth();
  return (
    <Button type="primary" onClick={() => signIn()}>
      Sign In With Square
    </Button>
  );
}
