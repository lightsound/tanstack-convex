import { type GenericCtx, createClient } from "@convex-dev/better-auth";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import { convex } from "@convex-dev/better-auth/plugins";
import { query } from "./_generated/server";

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
const authComponent = createClient<DataModel>(components.betterAuth);

const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex({ authConfig }),
    ],
  });
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx);
  },
});

export { authComponent, createAuth, getCurrentUser };
