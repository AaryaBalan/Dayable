import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        const identity = ctx.auth.getUserIdentity()
        if (!identity) throw new Error('User is unauthorizrd')
        return await ctx.storage.generateUploadUrl();
    }
})

// create a post
export const createPost = mutation({
    args: {
        caption: v.optional(v.string()),
        storageId: v.id('_storage')
    },

    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)

        // generate image url
        const image = await ctx.storage.getUrl(args.storageId)
        if (!image) throw new Error('Image file is missing')

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
        if (posts.length === 0) return []

        // enchance the post info with userInfo, if the user is already liked or bookmarked
        const postsWithInfo = await Promise.all(
            posts.map(async (post) => {
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
                        image: author?.image,
                        clerkId: author?.clerkId,
                    },
                    isLiked: !!like,
                    isBookmarked: !!bookmark
                }
            })
        )

        return postsWithInfo
    }
})

//toggle like for a postr
export const toggleLike = mutation({
    args: {
        postId: v.id("posts")
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)
        if (!currentUser) return

        const post = await ctx.db.get(args.postId)
        if (!post) throw new Error('post not found')

        const existing = await ctx.db.query('likes')
            .withIndex('by_user_and_post', (q) => q.eq('userId', currentUser._id).eq('postId', args.postId))
            .first()

        if (existing) {
            await ctx.db.delete(existing._id)
            await ctx.db.patch(args.postId, { likes: post.likes - 1 })
            return false // like removed
        } else {
            await ctx.db.insert('likes', {
                userId: currentUser._id,
                postId: args.postId
            })
            await ctx.db.patch(args.postId, { likes: post.likes + 1 })

            // send notification if the liked post is not my post
            if (currentUser._id !== post.userId) {
                const existingNotification = await ctx.db.query('notifications')
                    .withIndex('by_sender_and_post_and_type', (q) =>
                        q.eq('senderId', currentUser._id)
                            .eq('postId', args.postId)
                            .eq('type', 'like')
                    )
                    .first()

                if (!existingNotification) {
                    await ctx.db.insert('notifications', {
                        receiverId: post.userId,
                        senderId: currentUser._id,
                        type: 'like',
                        postId: args.postId
                    })
                }
            }

            return true // liked the post
        }
    }
})

// delete a post 
export const deletePost = mutation({
    args: {
        post: v.id('posts')
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)
        if (!currentUser) throw new Error("User is not authenticated");

        const post = await ctx.db.get(args.post)
        if (!post) throw new Error("Post not found");

        // check if the post belongs to the current user
        if (post.userId !== currentUser._id) throw new Error("You are not authorized to delete this post");

        // delete the post
        await ctx.storage.delete(post.storageId)
        await ctx.db.delete(post._id)

        // update the count of posts for the user 
        await ctx.db.patch(currentUser._id,
            { posts: Math.max(0, (currentUser.posts || 1) - 1) }
        )

        //delete all like and comments related to the post  
        const likes = await ctx.db.query('likes')
            .withIndex('by_post', (q) => q.eq('postId', post._id))
            .collect()

        const comments = await ctx.db.query('comments')
            .withIndex('by_post', (q) => q.eq('postId', post._id))
            .collect()

        const bookmarks = await ctx.db.query('bookmarks')
            .withIndex('by_post', (q) => q.eq('postId', post._id))
            .collect()

        const notifications = await ctx.db.query('notifications')
            .withIndex('by_post', (q) => q.eq('postId', post._id))
            .collect()

        // delete likes
        await Promise.all(
            likes.map(async like => {
                await ctx.db.delete(like._id)
            })
        )

        // delete comments
        await Promise.all(
            comments.map(async comment => {
                await ctx.db.delete(comment._id)
            })
        )

        // delete bookmarks
        await Promise.all(
            bookmarks.map(async bookmark => {
                await ctx.db.delete(bookmark._id)
            })
        )

        // delete notifications
        await Promise.all(
            notifications.map(async notification => {
                await ctx.db.delete(notification._id)
            })
        )

        return true
    }
})

// get post by user
export const getPostsByUser = query({
    args: {
        userId: v.optional(v.id('users'))
    },
    handler: async (ctx, args) => {
        const user = args.userId ? await ctx.db.get(args.userId) : await getAuthenticatedUser(ctx)
        if (!user) throw new Error('User not found')

        const posts = await ctx.db.query('posts')
            .withIndex('by_user', (q) => q.eq('userId', args.userId || user._id))
            .order('desc')
            .collect()

        if (posts.length === 0) return []
        return posts
    }
})

// get post by postId
export const getPostById = query({
    args: {
        postId: v.id("posts")
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)
        if (!currentUser) throw new Error("User is not verified")

        const post = await ctx.db.get(args.postId)
        if (!post) throw new Error("No post found")

        // enchance the post info with userInfo, if the user is already liked or bookmarked
        const author = await ctx.db.get(post.userId)
        // check is the author already likes the post
        const like = await ctx.db.query('likes')
            .withIndex('by_user_and_post', (q) => q.eq('userId', currentUser._id).eq('postId', args.postId))
            .first()
        // check if the author already bookmarks the post
        const bookmark = await ctx.db.query('bookmarks')
            .withIndex('by_user_and_post', (q) => q.eq('userId', currentUser._id).eq('postId', post._id))
            .first()
        const postWithInfo = {
            post,
            author: {
                _id: author?._id,
                username: author?.username,
                image: author?.image,
                clerkId: author?.clerkId,
            },
            isLiked: !!like,
            isBookmarked: !!bookmark
        }

        return postWithInfo
    }
})