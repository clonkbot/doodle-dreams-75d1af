import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("illustrations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const results = await ctx.db
      .query("illustrations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit ?? 10);
    return results;
  },
});

export const save = mutation({
  args: {
    prompt: v.string(),
    imageBase64: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("illustrations", {
      userId,
      prompt: args.prompt,
      imageBase64: args.imageBase64,
      title: args.title,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("illustrations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const illustration = await ctx.db.get(args.id);
    if (!illustration || illustration.userId !== userId) {
      throw new Error("Not found");
    }
    await ctx.db.delete(args.id);
  },
});

export const updateTitle = mutation({
  args: { id: v.id("illustrations"), title: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const illustration = await ctx.db.get(args.id);
    if (!illustration || illustration.userId !== userId) {
      throw new Error("Not found");
    }
    await ctx.db.patch(args.id, { title: args.title });
  },
});
