import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "@/components/composites/common/Header/Header";
import { auth } from "@/shared/auth/auth";
import { listCatalog } from "@/shared/square/client";

export default async function HomePage() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session) redirect("/login");

  const { accessToken } = await auth.api.getAccessToken({
    body: { providerId: "square", userId: session.user.id },
    headers: h,
  });

  const products = await listCatalog(accessToken);

  return (
    <>
      <Header />
      <main style={{ padding: 24 }}>
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.name} —{" "}
              {p.variants
                .map((v) => `$${(v.priceCents / 100).toFixed(2)}`)
                .join(" / ")}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
