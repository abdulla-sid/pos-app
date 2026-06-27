import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/auth/auth";
import { listCatalog } from "@/shared/square/client";

export async function GET(req: NextRequest) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { accessToken } = await auth.api.getAccessToken({
    body: { providerId: "square", userId: session.user.id },
    headers: h,
  });

  const q = req.nextUrl.searchParams.get("q")?.toLowerCase() ?? "";
  const products = await listCatalog(accessToken);
  const filtered = q
    ? products.filter((p) => p.name.toLowerCase().includes(q))
    : products;

  return NextResponse.json(filtered);
}
