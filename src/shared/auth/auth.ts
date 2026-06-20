import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import * as schema from "@/shared/db/schema";
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
          authorizationUrl:
            "https://connect.squareupsandbox.com/oauth2/authorize",
          tokenUrl: "https://connect.squareupsandbox.com/oauth2/token",
          scopes: ["MERCHANT_PROFILE_READ", "ITEMS_READ"],
          getUserInfo: async (tokens) => {
            const res = await fetch(
              "https://connect.squareupsandbox.com/v2/merchants/me",
              {
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                  "Square-Version": "2025-01-23",
                },
              },
            );
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
