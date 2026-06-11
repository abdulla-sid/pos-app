import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "@/shared/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "square",
          clientId: process.env.SQUARE_CLIENT_ID!,
          clientSecret: process.env.SQUARE_CLIENT_SECRET!,
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
