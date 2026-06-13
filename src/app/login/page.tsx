import { SignInButton } from "@/components/composites/common/SignInButton/SignInButton";

export default function logInPage() {
  return (
    <main
      style={{ display: "grid", placeItems: "center", minHeight: "100dvh" }}
    >
      <SignInButton />
    </main>
  );
}
