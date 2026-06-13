"use client";
import { authClient } from "@/shared/auth/auth-client";

export function useAuth() {
  const { data: session, isPending } = authClient.useSession();
  return {
    session,
    isPending,
    signIn: () =>
      authClient.signIn.oauth2({ providerId: "square", callbackURL: "/" }),
    signOut: () => authClient.signOut(),
  };
}
