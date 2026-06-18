import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "@/components/composites/common/Header/Header";
import { auth } from "@/shared/auth/auth";

export default async function HomePage() {
  const data = await auth.api.getSession({ headers: await headers() });
  if (!data) redirect("/login");
  return (
    <>
      <Header />
      <main style={{ padding: 24 }}>Signed in as {data.user.name}</main>
    </>
  );
}
