import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  illustrations: defineTable({
    userId: v.id("users"),
    prompt: v.string(),
    imageBase64: v.string(),
    createdAt: v.number(),
    title: v.optional(v.string()),
  }).index("by_user", ["userId"]).index("by_created", ["createdAt"]),
});
