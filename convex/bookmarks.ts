import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const toggleBookmark = mutation({
    args: {
        postId: v.id('posts')
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)
        if (!currentUser) throw new Error("User is not authenticated");

        const existingBookmark = await ctx.db.query('bookmarks')
            .withIndex('by_user_and_post', (q) => q.eq('userId', currentUser._id).eq('postId', args.postId))
            .first()

        if (existingBookmark) {
            await ctx.db.delete(existingBookmark._id)
            return false //bookmark removed
        } else {
            await ctx.db.insert('bookmarks', {
                userId: currentUser._id,
                postId: args.postId
            })
            return true //bookmark added
        }

    }
})

// get the bookmarks of the user
export const getBookmarks = query({
    handler: async (ctx) => {
        const currentUser = await getAuthenticatedUser(ctx)
        if (!currentUser) throw new Error("User is not authenticated");

        const bookmarks = await ctx.db.query('bookmarks')
            .withIndex('by_user', (q) => q.eq('userId', currentUser._id))
            .order('desc')
            .collect()

        const bookmarksWithInfo = await Promise.all(
            bookmarks.map(async bookmark => {
                const post = await ctx.db.get(bookmark.postId)
                if (!post) return null

                const author = await ctx.db.get(post.userId)
                if (!author) return null

                return {
                    post: {
                        ...post,
                        author
                    }
                }
            })
        )
        if (!bookmarksWithInfo) return []
        return bookmarksWithInfo
    }
})