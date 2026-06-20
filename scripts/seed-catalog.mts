import {mkdirSync, writeFileSync} from "node:fs";
import Database from "better-sqlite3";


const row = new Database("./dev.db")
    .prepare("select access_token from account where provider_id = 'square'")
    .get() as {access_token: string} | undefined;

const token = row?.access_token;
if(!token) throw new Error("No Square account token in dev.db, sign in as test1 first");

const BASE = "https://connect.squareupsandbox.com";
const SQUARE_VERSION = "2025-01-23";


const usd = (amount: number) => ({amount, currency: "USD"});
const variation = (id: string, itemId: string, name: string, cents: number) =>
({
    type: "ITEM_VARIATION",
    id,
    item_variation_data: {item_id: itemId, name, pricing_type: "FIXED_PRICING", price_money: usd(cents)},
});

const item = (id: string, name: string, description: string, variations: unknown[]) => ({
    type: "ITEM",
    id,
    item_data: {name, description, variations},
})

const objects = [
    item("#espresso", "Espresso", "Double shot", [variation("#espresso-regular", "#espresso", "Regular", 300)]),
    item("#latte", "Latte", "Espresso + steamed milk", [
      variation("#latte-small", "#latte", "Small", 400),
      variation("#latte-large", "#latte", "Large", 500),
    ]),
    item("#cappuccino", "Cappuccino", "Espresso + foam", [variation("#cappuccino-regular", "#cappuccino", "Regular", 450)]),
    item("#cold-brew", "Cold Brew", "Slow-steeped", [variation("#cold-brew-regular", "#cold-brew", "Regular", 425)]),
    item("#croissant", "Croissant", "Butter croissant", [variation("#croissant-regular", "#croissant", "Regular", 350)]),
    item("#bagel", "Bagel", "Fresh-baked", [
      variation("#bagel-plain", "#bagel", "Plain", 250),
      variation("#bagel-everything", "#bagel", "Everything", 300),
    ]),
  ];
  
  const res = await fetch(`${BASE}/v2/catalog/batch-upsert`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Square-Version": SQUARE_VERSION, "Content-Type": "application/json" },
    body: JSON.stringify({ idempotency_key: "pos-catalog-seed-v1", batches: [{ objects }] }),
  });
  const json = await res.json();
  if (!res.ok) { console.error("Seed failed:", JSON.stringify(json, null, 2)); process.exit(1); }
  
  const idMap: Record<string, string> = {};
  for (const m of json.id_mappings ?? []) idMap[m.client_object_id] = m.object_id;
  
  mkdirSync("src/shared/square", { recursive: true });
  writeFileSync("src/shared/square/seed-ids.json", `${JSON.stringify(idMap, null, 2)}\n`);
  console.log(`Seeded ${json.objects?.length ?? 0} objects; wrote ${Object.keys(idMap).length} ID mappings.`);