import { Spin } from "antd";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/composites/common/Header/Header";
import { CatalogSearch } from "@/containers/CatalogSearch/CatalogSearch";
import { auth } from "@/shared/auth/auth";
import { listCatalog } from "@/shared/square/client";

async function CatalogList({ accessToken }: { accessToken: string }) {
  const products = await listCatalog(accessToken);
  return <CatalogSearch initialProducts={products} />;
}

export default async function HomePage() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session) redirect("/login");

  const { accessToken } = await auth.api.getAccessToken({
    body: { providerId: "square", userId: session.user.id },
    headers: h,
  });

  return (
    <>
      <Header />
      <main style={{ padding: 24 }}>
        <Suspense fallback={<Spin size="large" />}>
          <CatalogList accessToken={accessToken} />
        </Suspense>
      </main>
    </>
  );
}
