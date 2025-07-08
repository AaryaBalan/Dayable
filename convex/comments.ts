import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const addComment = mutation({
    args: {
        postId: v.id('posts'),
        content: v.string()
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)
        if (!currentUser) return

        const post = await ctx.db.get(args.postId)
        if (!post) throw new Error("Post is not found")

        // add comment to the comment table
        const commentId = await ctx.db.insert('comments', {
            userId: currentUser?._id,
            postId: args.postId,
            content: args.content
        })

        // update the count of comments in the post table
        await ctx.db.patch(args.postId, { comments: post.comments + 1 })

        // if this is not my post send the notification
        if (currentUser._id !== post.userId) {
            await ctx.db.insert('notifications', {
                receiverId: post.userId,
                senderId: currentUser._id,
                type: 'comment',
                postId: post._id,
                commentId
            })
        }

        return commentId
    }
})

export const getComments = query({
    args: {
        postId: v.id('posts')
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)
        if (!currentUser) return

        const comments = await ctx.db.query('comments')
            .withIndex('by_post', (q) => q.eq('postId', args.postId))
            .collect()
            
        // if(comments.length === 0) return []

        const commentsWithInfo = await Promise.all(
            comments.map(async (comment) => {
                const user = await ctx.db.get(comment.userId)
                return {
                    ...comment,
                    user: {
                        _id: user?._id,
                        clerkId: user?.clerkId,
                        username: user?.username,
                        image: user?.image
                    }
                }
            })
        )    

        return commentsWithInfo
    }
})