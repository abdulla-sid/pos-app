import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import * as schema from "@/shared/db/schema";
import { SQUARE_API_BASE, SQUARE_VERSION } from "@/shared/square/config";
import { db } from "../db";

const clientId = process.env.SQUARE_CLIENT_ID;
const clientSecret = process.env.SQUARE_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  throw new Error(
    "SQUARE_CLIENT_ID and SQUARE_CLIENT_SECRET must be set in .env",
  );
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "square",
          clientId,
          clientSecret,
          authorizationUrl: `${SQUARE_API_BASE}/oauth2/authorize`,
          tokenUrl: `${SQUARE_API_BASE}/oauth2/token`,
          scopes: ["MERCHANT_PROFILE_READ", "ITEMS_READ"],
          getUserInfo: async (tokens) => {
            const res = await fetch(`${SQUARE_API_BASE}/v2/merchants/me`, {
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
                "Square-Version": SQUARE_VERSION,
              },
            });
            const { merchant } = (await res.json()) as {
              merchant: { id: string; business_name: string };
            };

            return {
              id: merchant.id,
              name: merchant.business_name,
              email: `${merchant.id}@square.local`,
              emailVerified: true,
            };
          },
        },
      ],
    }),
  ],
});
