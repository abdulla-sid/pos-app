import "server-only";
import { SQUARE_API_BASE, SQUARE_VERSION } from "./config";
import { mapCatalog } from "./mappers";
import type { Product } from "./type";

export async function listCatalog(accessToken: string): Promise<Product[]> {
  const objects: unknown[] = [];
  let cursor: string | undefined;
  do {
    const url = new URL(`${SQUARE_API_BASE}/v2/catalog/list`);
    url.searchParams.set("types", "ITEM");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Square-Version": SQUARE_VERSION,
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Square catalog list failed: ${res.status}`);
    const json = (await res.json()) as { objects?: unknown[]; cursor?: string };
    objects.push(...(json.objects ?? []));
    cursor = json.cursor;
  } while (cursor);
  return mapCatalog(objects as Parameters<typeof mapCatalog>[0]);
}
