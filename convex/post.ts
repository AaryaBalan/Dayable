import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const generateUploadUrl = mutation({
    handler: async(ctx) => {
        const identity = ctx.auth.getUserIdentity()
        if(!identity) throw new Error('User is unauthorizrd')
        return await ctx.storage.generateUploadUrl();
    }
})

export const createPost = mutation({
    args: {
        caption: v.optional(v.string()),
        storageId: v.id('_storage')
    },

    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)

        // generate image url
        const image = await ctx.storage.getUrl(args.storageId)
        if(!image) throw new Error('Image file is missing')

        // insert the post in to the database
        const post = await ctx.db.insert('posts', {
            userId: currentUser._id,
            image,
            storageId: args.storageId,
            caption: args.caption,
            likes: 0,
            comments: 0
        })

        // now update the count of the post by 1 for the respective user
        await ctx.db.patch(currentUser._id, {
            posts: currentUser.posts + 1
        })

        return post
    }
})

// get all feed
export const getAllFeed = query({
    handler: async (ctx) => {
        const currentUser = await getAuthenticatedUser(ctx)

        const posts = await ctx.db.query('posts').order('desc').collect()
        if(posts.length === 0) return []

        // enchance the post info with userInfo, if the user is already liked or bookmarked
        const postsWithInfo = await Promise.all(
            posts.map(async(post) => {
                const author = await ctx.db.get(post.userId)

                // check is the author already likes the post
                const like = await ctx.db.query('likes')
                    .withIndex('by_user_and_post', (q) => q.eq('userId', currentUser._id).eq('postId', post._id))
                    .first()

                // check if the author already bookmarks the post
                const bookmark = await ctx.db.query('bookmarks')
                    .withIndex('by_user_and_post', (q) => q.eq('userId', currentUser._id).eq('postId', post._id))
                    .first()

                return {
                    ...post,
                    author: {
                        _id: author?._id,
                        username: author?.username,
                        image: author?.image
                    },
                    isLiked: !!like,
                    isBookmarked: !!bookmark
                }
            })
        )

        return postsWithInfo
    }
})

export const toggleLike = mutation({
    args: {
        postId: v.id("posts")
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)
        if(!currentUser) return

        const post = await ctx.db.get(args.postId)
        if(!post) throw new Error('post not found')

        const existing = await ctx.db.query('likes')
            .withIndex('by_user_and_post', (q) => q.eq('userId', currentUser._id).eq('postId', args.postId))
            .first()
            
        if (existing) {
            await ctx.db.delete(existing._id)
            await ctx.db.patch(args.postId, {likes: post.likes - 1})
            return false // like removed
        } else {
            await ctx.db.insert('likes', {
                userId: currentUser._id,
                postId: args.postId
            })
            await ctx.db.patch(args.postId, {likes: post.likes + 1})

            // send notification if the liked post is not my post
            if (currentUser._id !== post.userId) {  
                await ctx.db.insert('notifications', {
                    receiverId: post.userId,
                    senderId: currentUser._id,
                    type: 'like',
                    postId: args.postId
                })
            }

            return true // liked the post
        }
    }
})